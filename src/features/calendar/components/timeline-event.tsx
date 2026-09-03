import { Clock3, MapPin } from "lucide-react";
import { StatusChip } from "@/components/ui/status-chip";
import { formatDate, formatTime, formatTimeRange } from "@/lib/dates/format-outage-time";
import type { CalendarEvent } from "../types";

function durationLabel(startAt: string, endAt?: string): string {
  if (!endAt) return "Duration not yet specified";
  const diffMinutes = Math.max(0, Math.round((new Date(endAt).getTime() - new Date(startAt).getTime()) / 60000));
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h`;
  return `${minutes}m`;
}

export function TimelineEvent({ event, showDate }: { event: CalendarEvent; showDate?: boolean }) {
  return (
    <li className="rounded-panel border border-border-subtle bg-bg-1 px-4 py-3">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-cyan" aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-text-primary">{event.locationLabel}</p>
              {event.coverageDescription && (
                <p className="mt-0.5 text-xs text-text-secondary">{event.coverageDescription}</p>
              )}
            </div>
          </div>
        </div>
        <StatusChip status={event.status} />
      </div>

      <div className="mt-3 grid gap-2 text-xs text-text-secondary sm:grid-cols-3">
        <span className="inline-flex items-center gap-2">
          <Clock3 className="h-3.5 w-3.5 text-brand-cyan" aria-hidden="true" />
          <span className="font-mono text-text-primary">{formatTimeRange(event.startAt, event.endAt) ?? formatTime(event.startAt)}</span>
        </span>
        <span>Duration: {durationLabel(event.startAt, event.endAt)}</span>
        <span>{showDate ? formatDate(event.startAt) : event.sourceName ?? "Verified schedule"}</span>
      </div>
    </li>
  );
}
