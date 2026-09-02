// Canonical outage domain types. Mirrors Core Docs/DS.md #2-3.
// Do not redefine these shapes in individual features (COMS-AI-FILE-BRANCHING-TREE.md #38).

export type OutageStatus =
  | "NORMAL"
  | "MONITORING"
  | "POSSIBLE"
  | "SCHEDULED"
  | "CONFIRMED"
  | "ONGOING"
  | "RESTORING"
  | "RESTORED"
  | "CANCELLED"
  | "COMPLETED"
  | "UNKNOWN";

export type CoverageType =
  | "FULL"
  | "PARTIAL"
  | "STREET"
  | "SITIO"
  | "LANDMARK_AREA"
  | "POINT"
  | "POLYGON"
  | "UNKNOWN_EXTENT";

export type VerificationState =
  | "DRAFT"
  | "REVIEW_REQUIRED"
  | "VERIFIED"
  | "REJECTED"
  | "SUPERSEDED";

export interface OutageEventLocation {
  id: string;
  outageEventId: string;
  locationId?: string;
  coverageType: CoverageType;
  coverageDescription?: string;
  confidence?: number;
  point?: { lat: number; lng: number };
}

export interface OutageEvent {
  id: string;
  eventCode?: string;
  eventType: string;
  status: OutageStatus;
  sourceId: string;
  sourceDocumentId?: string;
  effectiveDate?: string;
  startAt?: string;
  endAt?: string;
  reason?: string;
  verified: boolean;
  verificationState: VerificationState;
  confidence?: number;
  locations: OutageEventLocation[];
  currentVersionId?: string;
  createdAt: string;
  updatedAt: string;
  verifiedAt?: string;
}

export interface SourceRef {
  name: string;
  sourceUrl?: string;
}

export interface Freshness {
  verifiedAt?: string;
  stale: boolean;
}
