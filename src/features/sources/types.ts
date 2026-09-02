// Mirrors the `source_type` enum in supabase/migrations/0002_enums.sql.
export const SOURCE_TYPES = [
  "UTILITY",
  "GRID_OPERATOR",
  "GOVERNMENT",
  "LGU",
  "SOCIAL_MEDIA",
  "WEBSITE",
  "MANUAL",
  "OTHER",
] as const;

export type SourceType = (typeof SOURCE_TYPES)[number];

export const SOURCE_TYPE_LABELS: Record<SourceType, string> = {
  UTILITY: "Utility (VECO)",
  GRID_OPERATOR: "Grid operator",
  GOVERNMENT: "Government",
  LGU: "LGU",
  SOCIAL_MEDIA: "Social media",
  WEBSITE: "Website",
  MANUAL: "Manual",
  OTHER: "Other",
};

export interface SourceDocumentSummary {
  id: string;
  sourceName: string;
  rawText: string | null;
  sourceUrl: string | null;
  capturedAt: string;
  fileUrl: string | null;
  // Whether an outage_events row already references this document
  // (source_document_id). Populated by GET /api/admin/sources for the
  // advisory-inbox publish flow; the plain upload page ignores it.
  published: boolean;
}
