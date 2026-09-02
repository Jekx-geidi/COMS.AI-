import { getAiProvider } from "@/lib/ai/providers/provider.factory";
import { ADVISORY_EXTRACTION_SYSTEM_PROMPT } from "@/lib/ai/prompts/advisory-extraction.system";
import { advisoryExtractionSchema, type AdvisoryExtraction } from "../schemas/advisory-extraction.schema";
import { resolveLocationNames } from "@/lib/geo/resolve-location-names";
import type { AdvisoryExtractionResult } from "../schemas/advisory-extraction.schema";

export class AdvisoryExtractionParseError extends Error {
  constructor(raw: string) {
    super(`AI extraction response was not valid JSON matching the expected shape: ${raw.slice(0, 300)}`);
    this.name = "AdvisoryExtractionParseError";
  }
}

// Reasoning-capable models sometimes wrap the JSON in commentary despite
// instructions not to ("Here's the extraction:\n{...}\nLet me know if..."),
// or fence it in markdown. Strip fences first, then fall back to the outer
// {...} span — more forgiving than JSON.parse on the raw string, still
// fails loudly (via the caller's schema check) on genuinely malformed output.
function extractJsonPayload(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenced?.[1]) return fenced[1].trim();

  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    return text.slice(start, end + 1).trim();
  }
  return text.trim();
}

function tryParse(response: string): AdvisoryExtraction | null {
  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(extractJsonPayload(response));
  } catch {
    return null;
  }

  const parsed = advisoryExtractionSchema.safeParse(parsedJson);
  return parsed.success ? parsed.data : null;
}

async function runExtraction(rawText: string): Promise<AdvisoryExtraction> {
  const provider = getAiProvider();
  const messages = [
    { role: "system" as const, content: ADVISORY_EXTRACTION_SYSTEM_PROMPT },
    { role: "user" as const, content: rawText },
  ];

  // Low temperature (determinism matters far more than variety here), plus
  // one retry — smaller/free models occasionally drift from the strict-JSON
  // instruction on a single sample; a second attempt is cheap insurance
  // against throwing away a perfectly good extraction over a fluke.
  let lastResponse = "";
  for (let attempt = 0; attempt < 2; attempt++) {
    lastResponse = await provider.complete(messages, { temperature: 0.1 });
    const result = tryParse(lastResponse);
    if (result) return result;
  }

  throw new AdvisoryExtractionParseError(lastResponse);
}

// The one entry point the API route calls: AI says what was mentioned,
// resolve-location-names says where those things actually are. Never let
// the model's own guess about coordinates through — it never returns any.
export async function extractAdvisory(rawText: string): Promise<AdvisoryExtractionResult> {
  const extraction = await runExtraction(rawText);
  const resolvedAreas = await resolveLocationNames(extraction.areas);
  return { extraction, resolvedAreas };
}
