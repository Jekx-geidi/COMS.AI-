import type { OutageEvent } from "@/types/outage";
import type { ChatMessage } from "../types";

// Calls the server-side /api/ai/ask route, which does retrieval BEFORE any
// LLM call (AGENT.md #2) — the client never talks to the AI provider
// directly (the API key must stay server-side, NFR-051).
export async function askComsAi(question: string): Promise<ChatMessage> {
  const res = await fetch("/api/ai/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });

  if (!res.ok) {
    return {
      id: crypto.randomUUID(),
      role: "assistant",
      text: "I can't verify the latest outage data right now. Please try again in a moment.",
    };
  }

  const data = (await res.json()) as {
    reply: string;
    evidence: { event: OutageEvent; sourceName?: string; lastVerifiedAt?: string } | null;
  };

  return {
    id: crypto.randomUUID(),
    role: "assistant",
    text: data.reply,
    evidence: data.evidence
      ? {
          event: data.evidence.event,
          sourceName: data.evidence.sourceName,
          lastVerifiedAt: data.evidence.lastVerifiedAt,
        }
      : undefined,
  };
}

export const SUGGESTED_PROMPTS = [
  "Naay brownout diri?",
  "Brownout ba ugma sa Talamban?",
  "What areas are affected today?",
  "Naa koy online class 2 PM sa Lahug. Safe ra?",
];
