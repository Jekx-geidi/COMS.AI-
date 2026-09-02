import type { OutageEvent } from "@/types/outage";

export interface ChatEvidence {
  event?: OutageEvent;
  sourceName?: string;
  lastVerifiedAt?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  evidence?: ChatEvidence;
}
