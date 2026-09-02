import { NextRequest, NextResponse } from "next/server";
import { getStaffAccess } from "@/lib/auth/require-staff";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { sourceUploadSchema } from "@/features/sources/schemas/source-upload.schema";
import type { SourceDocumentSummary } from "@/features/sources/types";

const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET_SOURCES || "source-documents";
const MAX_FILE_BYTES = 15 * 1024 * 1024;
const ALLOWED_FILE_TYPES = ["application/pdf", "image/png", "image/jpeg", "image/webp"];
const SIGNED_URL_TTL_SECONDS = 60 * 10;

// Raw evidence capture only (source_documents), per README #13 — original
// text/image is never rewritten. This does NOT publish anything to
// residents; ai_extractions/verification_reviews/outage_events are a later
// stage (see docs/product/roadmap.md).
export async function POST(req: NextRequest) {
  const access = await getStaffAccess();
  if (access.state !== "authorized") {
    return NextResponse.json({ error: "Staff access required." }, { status: 403 });
  }

  const formData = await req.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ error: "Invalid form submission." }, { status: 400 });
  }

  const parsed = sourceUploadSchema.safeParse({
    sourceName: formData.get("sourceName"),
    sourceType: formData.get("sourceType"),
    sourceUrl: formData.get("sourceUrl") ?? "",
    rawText: formData.get("rawText") ?? "",
  });

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input." }, { status: 400 });
  }

  const { sourceName, sourceType, sourceUrl, rawText } = parsed.data;
  const normalizedUrl = sourceUrl || null;
  const normalizedText = rawText || null;

  const fileEntry = formData.get("file");
  const file = fileEntry instanceof File && fileEntry.size > 0 ? fileEntry : null;

  if (!normalizedText && !file) {
    return NextResponse.json({ error: "Paste the advisory text, or attach a file." }, { status: 400 });
  }

  if (file) {
    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json({ error: "File is larger than 15MB." }, { status: 400 });
    }
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Only PDF, PNG, JPEG, or WEBP files are accepted." }, { status: 400 });
    }
  }

  const supabase = createSupabaseServerClient();

  // Find-or-create the source. RLS (`sources_staff_write`) allows any staff
  // account to write here directly — no service role needed for this part.
  let sourceLookup = supabase.from("sources").select("id").eq("name", sourceName).limit(1);
  sourceLookup = normalizedUrl
    ? sourceLookup.eq("source_url", normalizedUrl)
    : sourceLookup.is("source_url", null);
  const { data: existingSource, error: findError } = await sourceLookup.maybeSingle();

  if (findError) {
    return NextResponse.json({ error: "Could not look up the source." }, { status: 500 });
  }

  let sourceId = existingSource?.id as string | undefined;

  if (!sourceId) {
    const { data: createdSource, error: createSourceError } = await supabase
      .from("sources")
      .insert({
        name: sourceName,
        type: sourceType,
        source_url: normalizedUrl,
        official: sourceType === "UTILITY" || sourceType === "GRID_OPERATOR" || sourceType === "GOVERNMENT",
      })
      .select("id")
      .single();

    if (createSourceError || !createdSource) {
      return NextResponse.json({ error: "Could not create the source." }, { status: 500 });
    }
    sourceId = createdSource.id;
  }

  // File upload needs the service-role client: staff sign-in alone doesn't
  // grant storage.objects access without a bucket-level RLS policy, and
  // adding one is out of scope for this capture flow — the route itself is
  // the authorization boundary (already checked above).
  let imagePath: string | null = null;
  if (file) {
    const serviceClient = createSupabaseServiceClient();

    const { data: buckets, error: listBucketsError } = await serviceClient.storage.listBuckets();
    if (!listBucketsError && !buckets?.some((bucket) => bucket.name === STORAGE_BUCKET)) {
      await serviceClient.storage.createBucket(STORAGE_BUCKET, { public: false });
    }

    const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
    const objectPath = `${sourceId}/${Date.now()}-${crypto.randomUUID()}.${extension}`;
    const bytes = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await serviceClient.storage
      .from(STORAGE_BUCKET)
      .upload(objectPath, bytes, { contentType: file.type, upsert: false });

    if (uploadError) {
      return NextResponse.json({ error: "File upload failed." }, { status: 500 });
    }
    imagePath = objectPath;
  }

  const { data: document, error: insertError } = await supabase
    .from("source_documents")
    .insert({
      source_id: sourceId,
      source_url: normalizedUrl,
      raw_text: normalizedText,
      image_path: imagePath,
      created_by: access.staff.id,
    })
    .select("id, captured_at")
    .single();

  if (insertError || !document) {
    return NextResponse.json({ error: "Could not save the source document." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, documentId: document.id, capturedAt: document.captured_at });
}

export async function GET() {
  const access = await getStaffAccess();
  if (access.state !== "authorized") {
    return NextResponse.json({ error: "Staff access required." }, { status: 403 });
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("source_documents")
    .select("id, raw_text, image_path, source_url, captured_at, sources(name)")
    .order("captured_at", { ascending: false })
    .limit(20);

  if (error) {
    return NextResponse.json({ error: "Could not load source documents." }, { status: 500 });
  }

  const rows = data ?? [];
  const serviceClient = rows.some((row) => row.image_path) ? createSupabaseServiceClient() : null;

  const { data: linkedEvents } = await supabase
    .from("outage_events")
    .select("source_document_id")
    .not("source_document_id", "is", null);
  const publishedIds = new Set((linkedEvents ?? []).map((e) => e.source_document_id));

  const documents: SourceDocumentSummary[] = await Promise.all(
    rows.map(async (row) => {
      let fileUrl: string | null = null;
      if (row.image_path && serviceClient) {
        const { data: signed } = await serviceClient.storage
          .from(STORAGE_BUCKET)
          .createSignedUrl(row.image_path, SIGNED_URL_TTL_SECONDS);
        fileUrl = signed?.signedUrl ?? null;
      }

      const sourceRow = Array.isArray(row.sources) ? row.sources[0] : row.sources;

      return {
        id: row.id,
        sourceName: (sourceRow as { name: string } | null)?.name ?? "Unknown source",
        rawText: row.raw_text,
        sourceUrl: row.source_url,
        capturedAt: row.captured_at,
        fileUrl,
        published: publishedIds.has(row.id),
      };
    })
  );

  return NextResponse.json({ documents });
}
