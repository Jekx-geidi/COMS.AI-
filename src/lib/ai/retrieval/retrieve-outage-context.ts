import { getVerifiedAffectedAreas } from "@/lib/db/repositories/outage.repository";
import type { MockAffectedArea } from "@/lib/db/mock/outage-mock-data";

export type { MockAffectedArea };

// Retrieval step of the mandatory pipeline (Core Docs/AGENT.md #2:
// intent -> location -> time -> retrieve verified events -> ... -> answer).
// Runs server-side, before any LLM call — the model never sees a question
// without first checking this against the real verified-outage read surface.
export async function retrieveOutageContextForQuestion(question: string): Promise<MockAffectedArea | null> {
  const q = question.toLowerCase();
  const areas = await getVerifiedAffectedAreas();

  return (
    areas.find((area) => q.includes(area.label.split(",")[0]!.toLowerCase())) ?? null
  );
}
