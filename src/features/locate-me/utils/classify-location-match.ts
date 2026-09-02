import { distanceMeters } from "@/lib/geo/distance";
import { isWithinCebuBounds } from "@/config/map";
import type { LocateMeResult } from "@/types/locate";
import { getAffectedAreas } from "../services/locate-me.service";

const STALE_THRESHOLD_MS = 4 * 60 * 60 * 1000; // NFR-111: freshness threshold is configurable.

// Mirrors the classification rules in Core Docs/DATABASE-STRUCTURE.md #21 and
// PLAN-FLOW-REQUIREMENTS.md Stage 8, evaluated against the real verified-
// outage read surface (src/app/api/outages).
export async function classifyLocationMatch(coords: { lat: number; lng: number }): Promise<LocateMeResult> {
  if (!isWithinCebuBounds(coords)) {
    return {
      matchType: "NO_VERIFIED_MATCH",
      detectedLocationLabel: "your detected location",
      uncertaintyMessage:
        "COMS.AI only covers Cebu. Your detected location appears to be outside Cebu, so no verified coverage can be checked here.",
    };
  }

  const areas = await getAffectedAreas();

  let nearest: (typeof areas)[number] | undefined;
  let nearestDistance = Infinity;

  for (const area of areas) {
    const d = distanceMeters(coords, area.point);
    if (d < nearestDistance) {
      nearestDistance = d;
      nearest = area;
    }
  }

  if (!nearest) {
    return {
      matchType: "NO_VERIFIED_MATCH",
      detectedLocationLabel: "your detected location",
    };
  }

  const verifiedAt = nearest.event.verifiedAt;
  const isStale =
    !!verifiedAt && Date.now() - new Date(verifiedAt).getTime() > STALE_THRESHOLD_MS;

  if (nearestDistance <= nearest.confirmedRadiusMeters) {
    const coverageType = nearest.event.locations[0]?.coverageType;
    return {
      matchType: isStale
        ? "DATA_STALE"
        : coverageType === "FULL"
          ? "MATCH_CONFIRMED"
          : "MATCH_PARTIAL_AREA",
      detectedLocationLabel: nearest.label,
      event: nearest.event,
      distanceMeters: nearestDistance,
      sourceName: nearest.sourceName,
      lastVerifiedAt: verifiedAt,
      uncertaintyMessage:
        coverageType === "PARTIAL"
          ? `${nearest.event.locations[0]?.coverageDescription ?? "Part of this area"} is included in the advisory. The available source does not confirm your exact point is affected.`
          : undefined,
    };
  }

  if (nearestDistance <= nearest.nearbyRadiusMeters) {
    return {
      matchType: "MATCH_NEARBY",
      detectedLocationLabel: nearest.label,
      event: nearest.event,
      distanceMeters: nearestDistance,
      sourceName: nearest.sourceName,
      lastVerifiedAt: verifiedAt,
      uncertaintyMessage:
        "A verified interruption is mapped near your location, but your detected point is not inside the confirmed affected area.",
    };
  }

  return {
    matchType: "NO_VERIFIED_MATCH",
    detectedLocationLabel: "your detected location",
  };
}
