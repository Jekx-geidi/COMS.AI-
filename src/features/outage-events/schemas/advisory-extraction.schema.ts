import { z } from "zod";
import { OUTAGE_STATUSES } from "../types";

// What the AI is allowed to return. Deliberately narrow: dates/times/areas
// are free text the model transcribes from the source, never invents — see
// advisory-extraction.system.ts. coverage is the model's best read of
// "portion of X" vs "all of X" language, not a geometric claim.
export const advisoryExtractionSchema = z.object({
  status: z.enum(OUTAGE_STATUSES),
  effectiveDate: z.string().nullable(),
  startTime: z.string().nullable(),
  endTime: z.string().nullable(),
  areas: z.array(z.string()),
  coverage: z.enum(["FULL", "PARTIAL", "UNKNOWN_EXTENT"]),
  reason: z.string().nullable(),
  confidence: z.number().min(0).max(100),
});

export type AdvisoryExtraction = z.infer<typeof advisoryExtractionSchema>;

export interface ResolvedArea {
  mentionedAs: string;
  resolvedType: "municipality" | "barangay" | "unresolved";
  municipality: string | null;
  barangayName: string | null;
  point: { lat: number; lng: number } | null;
}

export interface AdvisoryExtractionResult {
  extraction: AdvisoryExtraction;
  resolvedAreas: ResolvedArea[];
}
