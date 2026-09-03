import { StatusChip } from "@/components/ui/status-chip";
import { formatTimeRange } from "@/lib/dates/format-outage-time";
import type { DashboardEventSummary } from "../types";
import { ArrowUpRight } from "lucide-react";

interface EventSummaryListProps {
  title: string;
  items: DashboardEventSummary[];
  emptyLabel: string;
}

export function EventSummaryList({ title, items, emptyLabel }: EventSummaryListProps) {
  return (
    <section className="min-w-0 rounded-panel bg-bg-1/95 p-4 shadow-[0_14px_34px_rgba(0,0,0,0.14)]">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold">{title}</h2>
        <span className="rounded-full bg-bg-2/70 px-2 py-0.5 font-mono text-[11px] text-text-secondary">
          {items.length}
        </span>
      </div>
      {items.length === 0 ? (
        <p className="rounded-control bg-bg-2/45 px-3 py-3 text-sm text-text-secondary">
          {emptyLabel}
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="group flex items-center justify-between gap-3 rounded-control bg-bg-2/45 px-3 py-3 transition-all hover:-translate-y-0.5 hover:bg-bg-2/75"
            >
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 truncate text-sm font-semibold">
                  {item.locationLabel}
                  <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-text-secondary opacity-0 transition-all group-hover:text-brand-cyan group-hover:opacity-100" aria-hidden="true" />
                </p>
                {item.coverageDescription && (
                  <p className="truncate text-xs text-text-secondary">
                    {item.coverageDescription}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <StatusChip status={item.status} />
                {formatTimeRange(item.startAt, item.endAt) && (
                  <span className="font-mono text-xs text-text-secondary">
                    {formatTimeRange(item.startAt, item.endAt)}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
