export interface ChatCompletionMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatCompletionOptions {
  // Structured-extraction callers want low variance; the conversational
  // assistant wants some. Left unset (provider default) unless a caller has
  // a specific reason to override it.
  temperature?: number;
}

export interface AiProvider {
  complete(messages: ChatCompletionMessage[], options?: ChatCompletionOptions): Promise<string>;
}
