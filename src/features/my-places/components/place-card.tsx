"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff, Trash2 } from "lucide-react";
import { StatusChip } from "@/components/ui/status-chip";
import { formatTimeRange } from "@/lib/dates/format-outage-time";
import { matchPlaceStatus } from "../utils/match-place-status";
import type { UserPlace } from "../types";
import type { OutageEvent } from "@/types/outage";

// "Monitored node" card — Core Docs/UIS.md #33.
export function PlaceCard({
  place,
  onRemove,
  onToggleAlerts,
}: {
  place: UserPlace;
  onRemove: (id: string) => void;
  onToggleAlerts: (id: string) => void;
}) {
  const [event, setEvent] = useState<OutageEvent | null>(null);

  useEffect(() => {
    let cancelled = false;
    matchPlaceStatus(place.addressText).then((result) => {
      if (!cancelled) setEvent(result);
    });
    return () => {
      cancelled = true;
    };
  }, [place.addressText]);

  const displayLabel = place.label === "Custom" ? place.customLabel || "Custom" : place.label;

  return (
    <li className="rounded-panel border-l-2 border-brand-cyan/60 border border-border-subtle bg-bg-1 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
            {displayLabel}
          </p>
          <p className="truncate text-sm font-medium">{place.addressText}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            onClick={() => onToggleAlerts(place.id)}
            aria-label={place.notificationEnabled ? "Disable alerts" : "Enable alerts"}
            className="rounded-control p-1.5 text-text-secondary hover:bg-bg-2 hover:text-text-primary"
          >
            {place.notificationEnabled ? (
              <Bell className="h-4 w-4" aria-hidden="true" />
            ) : (
              <BellOff className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
          <button
            onClick={() => onRemove(place.id)}
            aria-label="Remove place"
            className="rounded-control p-1.5 text-text-secondary hover:bg-status-critical/10 hover:text-status-critical"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        {event ? (
          <>
            <StatusChip status={event.status} />
            {formatTimeRange(event.startAt, event.endAt) && (
              <span className="font-mono text-xs text-text-secondary">
                {formatTimeRange(event.startAt, event.endAt)}
              </span>
            )}
          </>
        ) : (
          <span className="text-xs text-text-secondary">
            No currently verified interruption found for this place.
          </span>
        )}
      </div>

      <p className="mt-2 text-[11px] text-text-secondary">
        {place.notificationEnabled ? "Alerts on" : "Alerts off"}
      </p>
    </li>
  );
}
