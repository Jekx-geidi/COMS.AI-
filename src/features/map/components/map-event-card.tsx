import { StatusChip } from "@/components/ui/status-chip";
import { formatDate, formatTimeRange, formatRelativeVerified } from "@/lib/dates/format-outage-time";
import type { MapEventSummary } from "../types";

// Pin detail card fields — Core Docs/UF.md #8 / UIS.md #22-26.
export function MapEventCard({ event }: { event: MapEventSummary }) {
  return (
    <li className="rounded-panel border border-border-subtle bg-bg-1 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium">{event.locationLabel}</p>
          {event.coverageDescription && (
            <p className="text-xs text-text-secondary">{event.coverageDescription}</p>
          )}
        </div>
        <StatusChip status={event.status} />
      </div>

      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-secondary">
        {formatDate(event.startAt) && <span>{formatDate(event.startAt)}</span>}
        {formatTimeRange(event.startAt, event.endAt) && (
          <span className="font-mono">{formatTimeRange(event.startAt, event.endAt)}</span>
        )}
        <span>Coverage: {event.coverageType.replace("_", " ").toLowerCase()}</span>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-border-subtle pt-2 text-xs text-text-secondary">
        <span>{event.sourceName}</span>
        {event.verifiedAt && <span>Verified {formatRelativeVerified(event.verifiedAt)}</span>}
      </div>
    </li>
  );
}
