import { getAffectedAreas } from "@/features/locate-me/services/locate-me.service";
import type { MapEventSummary } from "../types";

// TODO(Stage 7): replace with a bounding-box viewport query against
// outage_event_locations (Core Docs/DATABASE-STRUCTURE.md #13/#20), once a
// real map provider + PostGIS are wired up. Reuses the same verified-outage
// read surface as Locate Me so the two features never disagree.
export async function getMapEvents(): Promise<MapEventSummary[]> {
  const areas = await getAffectedAreas();
  return areas.map((area) => ({
    id: area.event.id,
    locationLabel: area.label,
    point: area.point,
    status: area.event.status,
    coverageType: area.event.locations[0]?.coverageType ?? "UNKNOWN_EXTENT",
    coverageDescription: area.event.locations[0]?.coverageDescription,
    startAt: area.event.startAt,
    endAt: area.event.endAt,
    reason: area.event.reason,
    sourceName: area.sourceName,
    verifiedAt: area.event.verifiedAt,
  }));
}
