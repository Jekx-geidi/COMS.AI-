import type { OutageEvent } from "./outage";

export type LocationMatchType =
  | "MATCH_CONFIRMED"
  | "MATCH_PARTIAL_AREA"
  | "MATCH_NEARBY"
  | "NO_VERIFIED_MATCH"
  | "DATA_STALE";

export interface LocateMeResult {
  matchType: LocationMatchType;
  detectedLocationLabel: string;
  event?: OutageEvent;
  distanceMeters?: number;
  uncertaintyMessage?: string;
  sourceName?: string;
  lastVerifiedAt?: string;
}
