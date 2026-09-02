import type { AiProvider, ChatCompletionMessage, ChatCompletionOptions } from "./provider";

// AI provider code stays isolated from core business logic (CLAUDE.md #6 /
// COMS-AI-FILE-BRANCHING-TREE.md #34). Never called from the client — the
// API key must only ever live server-side (NFR-051).
export class OpenRouterProvider implements AiProvider {
  constructor(
    private readonly apiKey: string,
    private readonly model: string
  ) {}

  async complete(messages: ChatCompletionMessage[], options?: ChatCompletionOptions): Promise<string> {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
        "X-Title": "COMS.AI",
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        temperature: options?.temperature ?? 0.3,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`OpenRouter request failed (${res.status}): ${body}`);
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };

    return data.choices?.[0]?.message?.content?.trim() ?? "";
  }
}
