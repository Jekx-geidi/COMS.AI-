import { z } from "zod";
import { COVERAGE_TYPES, EVENT_TYPES, OUTAGE_STATUSES } from "../types";
import { CEBU_MUNICIPALITIES } from "@/config/cebu-municipalities";

export const publishEventSchema = z.object({
  sourceDocumentId: z.string().uuid(),
  eventType: z.enum(EVENT_TYPES),
  status: z.enum(OUTAGE_STATUSES),
  municipality: z.enum(CEBU_MUNICIPALITIES),
  coverageType: z.enum(COVERAGE_TYPES),
  coverageDescription: z.string().trim().max(500).optional(),
  startAt: z.string().trim().optional(),
  endAt: z.string().trim().optional(),
  reason: z.string().trim().max(500).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  notes: z.string().trim().max(1000).optional(),
});

export type PublishEventInput = z.infer<typeof publishEventSchema>;
