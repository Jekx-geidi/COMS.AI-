import { getAffectedAreas } from "@/features/locate-me/services/locate-me.service";
import type { OutageEvent } from "@/types/outage";

// TODO(Stage 4/11): replace with a real query against
// user_place_outage_matches (Core Docs/DATABASE-STRUCTURE.md #20). Matches by
// substring against the verified affected-area labels — never claim
// NORMAL/safe just because nothing matched (CLAUDE.md #11).
export async function matchPlaceStatus(addressText: string): Promise<OutageEvent | null> {
  const areas = await getAffectedAreas();
  const needle = addressText.trim().toLowerCase();
  if (!needle) return null;

  const match = areas.find((area) => area.label.toLowerCase().includes(needle) || needle.includes(area.label.split(",")[0]!.toLowerCase()));
  return match?.event ?? null;
}
