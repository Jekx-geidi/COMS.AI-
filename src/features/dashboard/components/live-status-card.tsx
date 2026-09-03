import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  CalendarClock,
  LocateFixed,
  Map as MapIcon,
  Radio,
  ShieldCheck,
} from "lucide-react";
import { formatRelativeVerified } from "@/lib/dates/format-outage-time";

interface LiveStatusCardProps {
  activeCount: number;
  scheduledTodayCount: number;
  lastVerifiedAt: string;
}

export function LiveStatusCard({
  activeCount,
  scheduledTodayCount,
  lastVerifiedAt,
}: LiveStatusCardProps) {
  const cards = [
    {
      label: "Active Now",
      value: String(activeCount).padStart(2, "0"),
      detail: "Verified interruptions",
      tone: "text-status-critical",
      bg: "bg-status-critical/10",
      icon: Activity,
    },
    {
      label: "Scheduled Today",
      value: String(scheduledTodayCount).padStart(2, "0"),
      detail: "Published advisories",
      tone: "text-status-scheduled",
      bg: "bg-status-scheduled/10",
      icon: CalendarClock,
    },
    {
      label: "System State",
      value: activeCount > 0 ? "Watch" : "Stable",
      detail: "Live monitoring",
      tone: activeCount > 0 ? "text-status-monitor" : "text-status-stable",
      bg: activeCount > 0 ? "bg-status-monitor/10" : "bg-status-stable/10",
      icon: Radio,
    },
    {
      label: "Last Verified",
      value: formatRelativeVerified(lastVerifiedAt).replace("Verified ", ""),
      detail: "Source freshness",
      tone: "text-brand-cyan",
      bg: "bg-brand-cyan/10",
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase text-brand-cyan">
            <Radio className="h-3.5 w-3.5" aria-hidden="true" />
            COMS.AI live operations
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold leading-tight md:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Real-time overview of Cebu power interruptions and source freshness.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            href="#locate-me"
            className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-control bg-brand-cyan px-4 text-sm font-bold text-text-on-accent shadow-cyan transition-all hover:bg-brand-cyan-light active:scale-[0.98]"
          >
            <LocateFixed className="h-4 w-4" aria-hidden="true" />
            Locate Me
            <ArrowUpRight
              className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
          <Link
            href="/map"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-control bg-bg-2/70 px-4 text-sm font-semibold text-text-primary transition-colors hover:bg-brand-blue/45 hover:text-brand-cyan"
          >
            <MapIcon className="h-4 w-4" aria-hidden="true" />
            Live Map
          </Link>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-panel bg-bg-1/95 p-4 shadow-[0_14px_34px_rgba(0,0,0,0.16)] transition-transform hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-text-secondary">{card.label}</p>
                  <p className={`mt-2 font-mono text-2xl font-semibold leading-none ${card.tone}`}>
                    {card.value}
                  </p>
                </div>
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${card.bg} ${card.tone}`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
              </div>
              <p className="mt-3 text-xs text-text-secondary">{card.detail}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
