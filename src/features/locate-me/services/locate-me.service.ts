import type { MockAffectedArea } from "@/lib/db/mock/outage-mock-data";

export type { MockAffectedArea };

// Client-safe accessor for the real verified-outage read surface. Every
// resident feature that needs "what's currently verified" (Locate Me, the
// Map, My Places, Ask COMS AI) goes through this one fetch so they never
// disagree — the actual query + mock/error fallback logic lives server-side
// in src/lib/db/repositories/outage.repository.ts (client components can't
// import it directly: it uses next/headers).
export async function getAffectedAreas(): Promise<MockAffectedArea[]> {
  const res = await fetch("/api/outages", { cache: "no-store" });
  if (!res.ok) return [];
  const json = await res.json();
  return json.areas ?? [];
}
