import { StatusChip } from "@/components/ui/status-chip";
import { formatDate, formatTime } from "@/lib/dates/format-outage-time";
import type { CalendarEvent } from "../types";

// UIS.md #32 operations-timeline row: "09:00 ───── Scheduled — Talamban".
export function TimelineEvent({ event, showDate }: { event: CalendarEvent; showDate?: boolean }) {
  return (
    <li className="flex items-center gap-3 rounded-panel border border-border-subtle bg-bg-1 px-4 py-3">
      <span className="w-16 shrink-0 font-mono text-sm text-brand-cyan">
        {formatTime(event.startAt)}
      </span>
      <span className="h-px flex-1 bg-border-subtle" aria-hidden="true" />
      <div className="flex shrink-0 items-center gap-2">
        <StatusChip status={event.status} />
        <span className="text-sm font-medium">{event.locationLabel}</span>
        {showDate && (
          <span className="font-mono text-xs text-text-secondary">{formatDate(event.startAt)}</span>
        )}
      </div>
    </li>
  );
}
