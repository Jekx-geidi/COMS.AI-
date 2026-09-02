import type { AiProvider } from "./provider";
import { OpenRouterProvider } from "./openrouter.provider";

export class AiNotConfiguredError extends Error {
  constructor() {
    super("AI provider not configured — set AI_API_KEY and AI_MODEL in .env.local");
    this.name = "AiNotConfiguredError";
  }
}

export function getAiProvider(): AiProvider {
  const apiKey = process.env.AI_API_KEY;
  const model = process.env.AI_MODEL;

  if (!apiKey || !model) {
    throw new AiNotConfiguredError();
  }

  switch (process.env.AI_PROVIDER) {
    case "openrouter":
    default:
      return new OpenRouterProvider(apiKey, model);
  }
}
