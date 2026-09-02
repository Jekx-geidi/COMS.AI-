import { StatusChip } from "@/components/ui/status-chip";
import { formatRelativeVerified } from "@/lib/dates/format-outage-time";
import type { ChatMessage as ChatMessageType } from "../types";

// UIS.md #29/#31 — user bubble right/blue, AI bubble navy with a cyan left
// rule and an evidence footer (never bury the source).
export function ChatMessage({ message }: { message: ChatMessageType }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-panel bg-brand-blue px-4 py-2.5 text-sm">
          {message.text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="max-w-[90%] rounded-panel border-l-2 border-brand-cyan bg-bg-1 px-4 py-3 text-sm">
        <p>{message.text}</p>

        {message.evidence?.event && (
          <div className="mt-2 flex items-center gap-2">
            <StatusChip status={message.evidence.event.status} />
          </div>
        )}

        {(message.evidence?.sourceName || message.evidence?.lastVerifiedAt) && (
          <div className="mt-3 flex items-center justify-between border-t border-border-subtle pt-2 text-xs text-text-secondary">
            <span>{message.evidence?.sourceName ?? "No source"}</span>
            {message.evidence?.lastVerifiedAt && (
              <span>Verified {formatRelativeVerified(message.evidence.lastVerifiedAt)}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
