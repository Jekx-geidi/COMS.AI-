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
    <section className="min-w-0">
      <div className="mb-3 flex items-center gap-3">
        <h2 className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.14em] text-text-secondary">{title}</h2>
        <span className="h-px flex-1 bg-gradient-to-r from-border-subtle to-transparent" />
      </div>
      {items.length === 0 ? (
        <p className="rounded-panel border border-border-subtle bg-bg-1/60 px-4 py-3 text-sm text-text-secondary">
          {emptyLabel}
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="group flex items-center justify-between gap-3 rounded-panel border border-border-subtle bg-bg-1/80 px-4 py-4 shadow-[0_12px_30px_rgba(0,0,0,0.08)] transition-all hover:-translate-y-0.5 hover:border-brand-cyan/35 hover:bg-bg-1 md:px-5"
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
