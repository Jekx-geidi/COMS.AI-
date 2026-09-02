import { NextRequest, NextResponse } from "next/server";
import { getStaffAccess } from "@/lib/auth/require-staff";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { extractAdvisory, AdvisoryExtractionParseError } from "@/features/outage-events/services/extract-advisory";
import { AiNotConfiguredError } from "@/lib/ai/providers/provider.factory";

// "Pull New Data" — reads one captured source_documents row and returns a
// structured, AI-extracted + GIS-resolved draft. This never writes
// anything: it's a proposal for the admin to review, edit, and explicitly
// publish via POST /api/admin/outage-events, same as a fully manual entry.
export async function POST(req: NextRequest) {
  const access = await getStaffAccess();
  if (access.state !== "authorized") {
    return NextResponse.json({ error: "Staff access required." }, { status: 403 });
  }

  const json = await req.json().catch(() => null);
  const sourceDocumentId = typeof json?.sourceDocumentId === "string" ? json.sourceDocumentId : null;
  if (!sourceDocumentId) {
    return NextResponse.json({ error: "sourceDocumentId is required." }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  const { data: doc, error: docError } = await supabase
    .from("source_documents")
    .select("id, raw_text")
    .eq("id", sourceDocumentId)
    .maybeSingle();

  if (docError || !doc) {
    return NextResponse.json({ error: "Source document not found." }, { status: 404 });
  }

  if (!doc.raw_text || !doc.raw_text.trim()) {
    return NextResponse.json(
      { error: "This document has no advisory text to analyze — only a file was attached. Fill the form manually." },
      { status: 422 }
    );
  }

  try {
    const result = await extractAdvisory(doc.raw_text);
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof AiNotConfiguredError) {
      return NextResponse.json({ error: "AI is not configured on this server (AI_API_KEY / AI_MODEL)." }, { status: 503 });
    }
    if (err instanceof AdvisoryExtractionParseError) {
      return NextResponse.json({ error: "AI response could not be parsed. Try again, or fill the form manually." }, { status: 502 });
    }
    return NextResponse.json({ error: "AI extraction failed. Try again, or fill the form manually." }, { status: 502 });
  }
}
