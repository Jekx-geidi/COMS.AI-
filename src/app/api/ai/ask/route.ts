import { NextRequest, NextResponse } from "next/server";
import { assistantRequestSchema } from "@/features/assistant/schemas/assistant-request.schema";
import { retrieveOutageContextForQuestion } from "@/lib/ai/retrieval/retrieve-outage-context";
import { OUTAGE_ASSISTANT_SYSTEM_PROMPT } from "@/lib/ai/prompts/outage-assistant.system";
import { getAiProvider, AiNotConfiguredError } from "@/lib/ai/providers/provider.factory";
import { formatFullDateTime, formatRelativeVerified } from "@/lib/dates/format-outage-time";

// Mandatory pipeline (AGENT.md #2): retrieve verified context FIRST; only
// call the LLM once we know what evidence (if any) it's allowed to talk
// about. If nothing was retrieved, we never call the model at all — a
// deterministic, safe fallback goes out instead (UFR-063/068).
export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = assistantRequestSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { question } = parsed.data;
  const context = await retrieveOutageContextForQuestion(question);

  if (!context) {
    return NextResponse.json({
      reply:
        "I couldn't match a specific area in your question against currently verified records. Try naming a barangay or city.",
      evidence: null,
    });
  }

  // Pre-format every timestamp into Asia/Manila local time (NFR-151) — the
  // model must never do its own timezone math on a raw UTC ISO string.
  const evidencePayload = {
    location: context.label,
    status: context.event.status,
    start_at_manila_time: formatFullDateTime(context.event.startAt) ?? null,
    end_at_manila_time: formatFullDateTime(context.event.endAt) ?? null,
    coverage_type: context.event.locations[0]?.coverageType ?? null,
    coverage_description: context.event.locations[0]?.coverageDescription ?? null,
    source_name: context.sourceName,
    last_verified: context.event.verifiedAt ? formatRelativeVerified(context.event.verifiedAt) : null,
  };

  try {
    const provider = getAiProvider();
    const reply = await provider.complete([
      { role: "system", content: OUTAGE_ASSISTANT_SYSTEM_PROMPT },
      {
        role: "user",
        content: `User question: ${question}\n\nVERIFIED DATA (JSON):\n${JSON.stringify(evidencePayload)}`,
      },
    ]);

    return NextResponse.json({
      reply: reply || "I found matching data but couldn't generate a response — please try again.",
      evidence: {
        event: context.event,
        sourceName: context.sourceName,
        lastVerifiedAt: context.event.verifiedAt,
      },
    });
  } catch (err) {
    if (err instanceof AiNotConfiguredError) {
      return NextResponse.json({ error: "AI is not configured on this server." }, { status: 503 });
    }
    return NextResponse.json({ error: "AI request failed." }, { status: 502 });
  }
}
