import { z } from "zod";

export const assistantRequestSchema = z.object({
  question: z.string().trim().min(1).max(500),
});

export type AssistantRequest = z.infer<typeof assistantRequestSchema>;
