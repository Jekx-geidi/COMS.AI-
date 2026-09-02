import type { CoverageType, OutageStatus } from "@/types/outage";

export interface MapEventSummary {
  id: string;
  locationLabel: string;
  point: { lat: number; lng: number };
  status: OutageStatus;
  coverageType: CoverageType;
  coverageDescription?: string;
  startAt?: string;
  endAt?: string;
  reason?: string;
  sourceName: string;
  verifiedAt?: string;
  isCommunity?: boolean;
}
