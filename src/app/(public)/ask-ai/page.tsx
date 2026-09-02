"use client";

import { useAssistant } from "@/features/assistant/hooks/use-assistant";
import { ChatMessage } from "@/features/assistant/components/chat-message";
import { AssistantInput } from "@/features/assistant/components/assistant-input";
import { SUGGESTED_PROMPTS } from "@/features/assistant/services/assistant.service";

export default function AskAiPage() {
  const { messages, sending, sendMessage } = useAssistant();

  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="font-display text-lg font-semibold">COMS AI</h1>
        <p className="text-xs text-status-stable">● Grounded in verified outage data</p>
      </header>

      {messages.length === 0 && (
        <div className="rounded-panel border border-border-subtle bg-bg-1 px-5 py-10 text-center">
          <p className="mb-4 font-display text-sm font-semibold uppercase tracking-wide text-brand-cyan">
            Ask about power in Cebu
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => sendMessage(prompt)}
                className="rounded-full border border-border-subtle bg-bg-2 px-3 py-1.5 text-xs text-text-secondary hover:text-text-primary"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {sending && (
          <p className="font-mono text-xs text-text-secondary">Checking verified data…</p>
        )}
      </div>

      <div className="sticky bottom-20 md:bottom-4">
        <AssistantInput onSend={sendMessage} disabled={sending} />
      </div>
    </div>
  );
}
