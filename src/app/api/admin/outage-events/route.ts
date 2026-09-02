import { NextRequest, NextResponse } from "next/server";
import { getStaffAccess } from "@/lib/auth/require-staff";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { publishEventSchema } from "@/features/outage-events/schemas/publish-event.schema";
import { APP_TIMEZONE } from "@/lib/dates/timezone";

// Turns one captured source_documents row into a real, published
// outage_events row — the missing half of the pipeline: /admin/sources only
// captures raw evidence, nothing before this route ever writes to the table
// residents' pages actually read (see src/lib/db/repositories/outage.repository.ts).
// Every write here is staff-attributed and versioned per README #13 /
// CLAUDE.md #10 (never silently mutate meaning — this is a first version).
export async function POST(req: NextRequest) {
  const access = await getStaffAccess();
  if (access.state !== "authorized") {
    return NextResponse.json({ error: "Staff access required." }, { status: 403 });
  }

  const json = await req.json().catch(() => null);
  const parsed = publishEventSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input." }, { status: 400 });
  }

  const {
    sourceDocumentId,
    eventType,
    status,
    municipality,
    coverageType,
    coverageDescription,
    startAt,
    endAt,
    reason,
    latitude,
    longitude,
    notes,
  } = parsed.data;

  const supabase = createSupabaseServerClient();

  const { data: doc, error: docError } = await supabase
    .from("source_documents")
    .select("id, source_id")
    .eq("id", sourceDocumentId)
    .maybeSingle();

  if (docError || !doc) {
    return NextResponse.json({ error: "Source document not found." }, { status: 404 });
  }

  // datetime-local inputs arrive as "YYYY-MM-DDTHH:mm" with no offset —
  // they're always entered in Asia/Manila (NFR-151), a fixed +08:00 with no
  // DST, so appending the offset is exact, not a heuristic.
  const toUtcIso = (localValue: string | undefined): string | null => {
    if (!localValue) return null;
    const parsed = new Date(`${localValue}:00+08:00`);
    return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
  };

  const startAtIso = toUtcIso(startAt);
  const endAtIso = toUtcIso(endAt);

  const normalizedName = municipality.trim().toLowerCase();
  const { data: existingLocation, error: locFindError } = await supabase
    .from("locations")
    .select("id, latitude, longitude")
    .eq("normalized_name", normalizedName)
    .maybeSingle();

  if (locFindError) {
    return NextResponse.json({ error: "Could not look up the location." }, { status: 500 });
  }

  let locationId = existingLocation?.id as string | undefined;

  if (!locationId) {
    const { data: createdLocation, error: locCreateError } = await supabase
      .from("locations")
      .insert({
        name: municipality,
        normalized_name: normalizedName,
        city_municipality: municipality,
        latitude: latitude ?? null,
        longitude: longitude ?? null,
      })
      .select("id")
      .single();

    if (locCreateError || !createdLocation) {
      return NextResponse.json({ error: "Could not create the location." }, { status: 500 });
    }
    locationId = createdLocation.id;
  } else if (latitude != null && longitude != null && existingLocation?.latitude == null) {
    await supabase.from("locations").update({ latitude, longitude }).eq("id", locationId);
  }

  const nowIso = new Date().toISOString();

  const { data: event, error: eventError } = await supabase
    .from("outage_events")
    .insert({
      event_type: eventType,
      status,
      verification_state: "VERIFIED",
      source_id: doc.source_id,
      source_document_id: sourceDocumentId,
      start_at: startAtIso,
      end_at: endAtIso,
      reason: reason || null,
      verified: true,
      verified_by: access.staff.id,
      verified_at: nowIso,
      created_by: access.staff.id,
    })
    .select("id")
    .single();

  if (eventError || !event) {
    return NextResponse.json({ error: "Could not create the outage event." }, { status: 500 });
  }

  const { error: locLinkError } = await supabase.from("outage_event_locations").insert({
    outage_event_id: event.id,
    location_id: locationId,
    coverage_type: coverageType,
    coverage_description: coverageDescription || null,
  });

  if (locLinkError) {
    return NextResponse.json({ error: "Could not link the location to the event." }, { status: 500 });
  }

  const { data: version, error: versionError } = await supabase
    .from("outage_event_versions")
    .insert({
      outage_event_id: event.id,
      version_number: 1,
      status,
      start_at: startAtIso,
      end_at: endAtIso,
      reason: reason || null,
      locations_snapshot: [{ municipality, coverageType, coverageDescription: coverageDescription || null }],
      payload: { eventType, status, municipality, coverageType, coverageDescription, startAt, endAt, reason, timezone: APP_TIMEZONE },
      change_type: "PUBLISHED",
      verification_state: "VERIFIED",
      changed_by: access.staff.id,
      verified_by: access.staff.id,
      verified_at: nowIso,
    })
    .select("id")
    .single();

  if (!versionError && version) {
    await supabase.from("outage_events").update({ current_version_id: version.id }).eq("id", event.id);
  }

  await supabase.from("verification_reviews").insert({
    outage_event_id: event.id,
    reviewer_id: access.staff.id,
    decision: "APPROVED",
    notes: notes || null,
  });

  return NextResponse.json({ ok: true, eventId: event.id });
}
