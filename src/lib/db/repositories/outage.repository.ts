import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getMockAffectedAreas, type MockAffectedArea } from "@/lib/db/mock/outage-mock-data";
import type { CoverageType, OutageStatus } from "@/types/outage";

function hasSupabaseConfig() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

// Presentation-only radii — the DB has no notion of "how far a resident
// should be considered nearby," this is a UI heuristic (illustrative even in
// the mock data it replaces).
const RADII_METERS: Record<string, { confirmed: number; nearby: number }> = {
  FULL: { confirmed: 4000, nearby: 8000 },
  PARTIAL: { confirmed: 1200, nearby: 3000 },
  STREET: { confirmed: 400, nearby: 1200 },
  SITIO: { confirmed: 600, nearby: 1800 },
  LANDMARK_AREA: { confirmed: 800, nearby: 2200 },
  POINT: { confirmed: 300, nearby: 1000 },
  POLYGON: { confirmed: 2000, nearby: 5000 },
  UNKNOWN_EXTENT: { confirmed: 1000, nearby: 2500 },
};

interface VerifiedOutageRow {
  id: string;
  coverage_type: CoverageType;
  coverage_description: string | null;
  outage_events:
    | {
        id: string;
        event_type: string;
        status: OutageStatus;
        start_at: string | null;
        end_at: string | null;
        reason: string | null;
        verified_at: string | null;
        source_id: string;
        created_at: string;
        updated_at: string;
        sources: { name: string } | { name: string }[] | null;
      }
    | {
        id: string;
        event_type: string;
        status: OutageStatus;
        start_at: string | null;
        end_at: string | null;
        reason: string | null;
        verified_at: string | null;
        source_id: string;
        created_at: string;
        updated_at: string;
        sources: { name: string } | { name: string }[] | null;
      }[]
    | null;
  locations:
    | { name: string; latitude: number | null; longitude: number | null }
    | { name: string; latitude: number | null; longitude: number | null }[]
    | null;
}

function firstOf<T>(value: T | T[] | null): T | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

// Public read surface for every resident-facing feature (dashboard, map,
// Locate Me, My Places, Ask COMS AI). Only ever verified, non-superseded
// events (mirrors current_verified_outages, but queried against the base
// table so PostgREST can embed the sources/locations relations reliably).
//
// Fallback behavior is deliberately asymmetric:
//   - Supabase not configured at all -> return the illustrative mock data
//     (README: integrations run stubbed until configured).
//   - Supabase configured but the query fails -> return an EMPTY list, never
//     the mock. Silently showing fabricated "verified" outage data after a
//     real infrastructure failure would be actively misleading.
export async function getVerifiedAffectedAreas(): Promise<MockAffectedArea[]> {
  if (!hasSupabaseConfig()) return getMockAffectedAreas();

  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("outage_event_locations")
      .select(
        `id, coverage_type, coverage_description,
         outage_events!inner(id, event_type, status, start_at, end_at, reason, verified_at, source_id, created_at, updated_at, sources(name)),
         locations(name, latitude, longitude)`
      )
      .eq("outage_events.verified", true)
      .eq("outage_events.verification_state", "VERIFIED");

    if (error) throw error;

    const rows = (data ?? []) as unknown as VerifiedOutageRow[];

    return rows
      .map((row) => {
        const event = firstOf(row.outage_events);
        if (!event) return null;

        const location = firstOf(row.locations);
        const source = firstOf(event.sources);
        const radii = RADII_METERS[row.coverage_type] ?? RADII_METERS.UNKNOWN_EXTENT!;
        const label = location?.name || row.coverage_description || "Cebu";

        const area: MockAffectedArea = {
          label,
          municipality: location?.name ?? "",
          point: {
            lat: location?.latitude ?? 0,
            lng: location?.longitude ?? 0,
          },
          confirmedRadiusMeters: radii.confirmed,
          nearbyRadiusMeters: radii.nearby,
          sourceName: source?.name ?? "Verified source",
          event: {
            id: event.id,
            eventType: event.event_type,
            status: event.status,
            sourceId: event.source_id,
            startAt: event.start_at ?? undefined,
            endAt: event.end_at ?? undefined,
            reason: event.reason ?? undefined,
            verified: true,
            verificationState: "VERIFIED",
            locations: [
              {
                id: row.id,
                outageEventId: event.id,
                coverageType: row.coverage_type,
                coverageDescription: row.coverage_description ?? undefined,
              },
            ],
            createdAt: event.created_at,
            updatedAt: event.updated_at,
            verifiedAt: event.verified_at ?? undefined,
          },
        };
        return area;
      })
      .filter((area): area is MockAffectedArea => area !== null);
  } catch {
    return [];
  }
}
