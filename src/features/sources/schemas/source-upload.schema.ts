import { z } from "zod";
import { SOURCE_TYPES } from "../types";

export const sourceUploadSchema = z.object({
  sourceName: z.string().trim().min(1, "Source name is required.").max(120),
  sourceType: z.enum(SOURCE_TYPES),
  sourceUrl: z
    .string()
    .trim()
    .url("Enter a valid URL, or leave this blank.")
    .optional()
    .or(z.literal("")),
  rawText: z.string().trim().max(20000, "Advisory text is too long.").optional().or(z.literal("")),
});

export type SourceUploadInput = z.infer<typeof sourceUploadSchema>;
