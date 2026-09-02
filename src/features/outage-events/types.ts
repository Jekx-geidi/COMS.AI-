// Mirrors the outage_status / coverage_type enums in
// supabase/migrations/0002_enums.sql.
export const OUTAGE_STATUSES = [
  "NORMAL",
  "MONITORING",
  "POSSIBLE",
  "SCHEDULED",
  "CONFIRMED",
  "ONGOING",
  "RESTORING",
  "RESTORED",
  "CANCELLED",
  "COMPLETED",
  "UNKNOWN",
] as const;

export const COVERAGE_TYPES = [
  "FULL",
  "PARTIAL",
  "STREET",
  "SITIO",
  "LANDMARK_AREA",
  "POINT",
  "POLYGON",
  "UNKNOWN_EXTENT",
] as const;

export const EVENT_TYPES = ["SCHEDULED_SERVICE_INTERRUPTION", "UNPLANNED_INTERRUPTION"] as const;

export const EVENT_TYPE_LABELS: Record<(typeof EVENT_TYPES)[number], string> = {
  SCHEDULED_SERVICE_INTERRUPTION: "Scheduled interruption",
  UNPLANNED_INTERRUPTION: "Unplanned interruption",
};

export interface PendingSourceDocument {
  id: string;
  sourceName: string;
  rawText: string | null;
  sourceUrl: string | null;
  capturedAt: string;
  fileUrl: string | null;
  published: boolean;
}
