import { createSupabaseServerClient } from "@/lib/supabase/server";
import { APP_TIMEZONE } from "@/lib/dates/timezone";
import type { DashboardEventSummary, DashboardSummary } from "../types";

function hasSupabaseConfig() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

function manilaDateKey(iso: string | null | undefined): string | null {
  if (!iso) return null;
  // en-CA renders as YYYY-MM-DD, a stable sortable/comparable calendar key.
  return new Intl.DateTimeFormat("en-CA", { timeZone: APP_TIMEZONE }).format(new Date(iso));
}

function firstOf<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

const MOCK_SUMMARY: DashboardSummary = {
  activeCount: 3,
  scheduledTodayCount: 8,
  lastVerifiedAt: new Date().toISOString(),
  happeningNow: [
    {
      id: "mock-1",
      locationLabel: "Part of Mandaue City",
      status: "ONGOING",
      startAt: new Date().toISOString(),
      coverageDescription: "Portion of Mandaue — feeder maintenance",
    },
  ],
  laterToday: [
    {
      id: "mock-2",
      locationLabel: "Lahug, Cebu City",
      status: "SCHEDULED",
      startAt: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
      endAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
      coverageDescription: "Portion of Lahug",
    },
  ],
  tomorrow: [
    {
      id: "mock-3",
      locationLabel: "Talamban, Cebu City",
      status: "SCHEDULED",
      startAt: new Date(Date.now() + 27 * 60 * 60 * 1000).toISOString(),
      endAt: new Date(Date.now() + 30 * 60 * 60 * 1000).toISOString(),
      coverageDescription: "Portion of Talamban",
    },
  ],
  recentlyChanged: [
    {
      id: "mock-4",
      locationLabel: "Banilad, Cebu City",
      status: "SCHEDULED",
      coverageDescription: "Start time moved 1:00 PM → 2:00 PM",
    },
  ],
  recentlyRestored: [
    {
      id: "mock-5",
      locationLabel: "Guadalupe, Cebu City",
      status: "RESTORED",
    },
  ],
};

const EMPTY_SUMMARY: DashboardSummary = {
  activeCount: 0,
  scheduledTodayCount: 0,
  lastVerifiedAt: new Date().toISOString(),
  happeningNow: [],
  laterToday: [],
  tomorrow: [],
  recentlyChanged: [],
  recentlyRestored: [],
};

interface OutageEventRow {
  id: string;
  status: string;
  start_at: string | null;
  end_at: string | null;
  verified_at: string | null;
  outage_event_locations:
    | {
        coverage_description: string | null;
        locations: { name: string } | { name: string }[] | null;
      }
    | {
        coverage_description: string | null;
        locations: { name: string } | { name: string }[] | null;
      }[]
    | null;
}

function toSummary(row: OutageEventRow): DashboardEventSummary {
  const loc = firstOf(row.outage_event_locations);
  const locationName = loc ? firstOf(loc.locations)?.name : null;
  return {
    id: row.id,
    locationLabel: locationName || loc?.coverage_description || "Cebu",
    status: row.status as DashboardEventSummary["status"],
    startAt: row.start_at ?? undefined,
    endAt: row.end_at ?? undefined,
    coverageDescription: loc?.coverage_description ?? undefined,
  };
}

// See src/lib/db/repositories/outage.repository.ts for the same fallback
// policy this mirrors: not configured -> illustrative mock; configured but
// the query fails -> an honest empty state, never fabricated data.
export async function getDashboardSummary(): Promise<DashboardSummary> {
  if (!hasSupabaseConfig()) return MOCK_SUMMARY;

  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("outage_events")
      .select(
        "id, status, start_at, end_at, verified_at, outage_event_locations(coverage_description, locations(name))"
      )
      .eq("verified", true)
      .eq("verification_state", "VERIFIED")
      .order("start_at", { ascending: true });

    if (error) throw error;

    const rows = (data ?? []) as unknown as OutageEventRow[];
    const todayKey = manilaDateKey(new Date().toISOString());
    const tomorrowKey = manilaDateKey(new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString());
    const inactiveStatuses = new Set(["RESTORED", "CANCELLED", "COMPLETED"]);

    const happeningNow = rows.filter((r) => r.status === "ONGOING" || r.status === "RESTORING");
    const laterToday = rows.filter(
      (r) => manilaDateKey(r.start_at) === todayKey && !inactiveStatuses.has(r.status) && r.status !== "ONGOING" && r.status !== "RESTORING"
    );
    const tomorrow = rows.filter((r) => manilaDateKey(r.start_at) === tomorrowKey);
    const recentlyRestored = rows
      .filter((r) => r.status === "RESTORED")
      .sort((a, b) => (b.verified_at ?? "").localeCompare(a.verified_at ?? ""))
      .slice(0, 5);

    const lastVerifiedAt = rows.reduce<string | null>((latest, row) => {
      if (!row.verified_at) return latest;
      if (!latest || row.verified_at > latest) return row.verified_at;
      return latest;
    }, null);

    return {
      activeCount: rows.filter((r) => r.status === "ONGOING").length,
      scheduledTodayCount: laterToday.length,
      lastVerifiedAt: lastVerifiedAt ?? new Date().toISOString(),
      happeningNow: happeningNow.map(toSummary),
      laterToday: laterToday.map(toSummary),
      tomorrow: tomorrow.map(toSummary),
      // Change history needs a version diff (outage_event_versions), not yet
      // wired up here — an empty list renders the existing "No recent
      // changes." empty state rather than showing anything misleading.
      recentlyChanged: [],
      recentlyRestored: recentlyRestored.map(toSummary),
    };
  } catch {
    return EMPTY_SUMMARY;
  }
}
