import Link from "next/link";
import { Activity, ArrowUpRight, LocateFixed, Map as MapIcon, Radio } from "lucide-react";
import { formatRelativeVerified } from "@/lib/dates/format-outage-time";

interface LiveStatusCardProps {
  activeCount: number;
  scheduledTodayCount: number;
  lastVerifiedAt: string;
}

// Homepage hero — Core Docs/UXS.md #6. First screen must feel operational,
// not promotional: status, counts, freshness, then the two primary actions.
export function LiveStatusCard({
  activeCount,
  scheduledTodayCount,
  lastVerifiedAt,
}: LiveStatusCardProps) {
  return (
    <section className="relative overflow-hidden rounded-panel border border-border-strong bg-bg-1 p-5 shadow-[0_20px_70px_rgba(0,0,0,0.2)] md:p-8">
      <div className="pointer-events-none absolute -right-24 -top-32 h-72 w-72 rounded-full bg-brand-cyan/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(109,228,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(109,228,255,0.035)_1px,transparent_1px)] [background-size:28px_28px]" />

      <div className="relative flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.15em] text-text-secondary md:text-xs">
        <span className="inline-flex items-center gap-2"><Radio className="h-3.5 w-3.5 text-brand-cyan" aria-hidden="true" /> Live power status</span>
        <span className="rounded-full border border-border-subtle bg-bg-0/30 px-2.5 py-1">{formatRelativeVerified(lastVerifiedAt)}</span>
      </div>

      <div className="relative mt-6">
        <div className="flex items-center gap-2 text-status-monitor">
          <Activity className="h-4 w-4" aria-hidden="true" />
          <span className="text-xs font-semibold uppercase tracking-[0.14em]">System monitoring</span>
        </div>
        <h1 className="mt-2 max-w-xl font-display text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
          Cebu power status,
          <span className="block text-brand-cyan-light">clear at a glance.</span>
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary md:text-base">
          Check verified interruptions, schedules, and local impact before you make your next move.
        </p>
      </div>

      <div className="relative mt-6 grid grid-cols-2 gap-3 md:max-w-md">
        <div className="rounded-control border border-status-critical/20 bg-status-critical/[0.06] px-4 py-3">
          <span className="font-mono text-3xl font-semibold text-status-critical">{String(activeCount).padStart(2, "0")}</span>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-text-secondary">Active now</p>
        </div>
        <div className="rounded-control border border-status-scheduled/20 bg-status-scheduled/[0.06] px-4 py-3">
          <span className="font-mono text-3xl font-semibold text-status-scheduled">
            {String(scheduledTodayCount).padStart(2, "0")}
          </span>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-text-secondary">Scheduled today</p>
        </div>
      </div>

      <div className="relative mt-6 flex flex-col gap-3 sm:flex-row md:max-w-2xl">
        <Link
          href="#locate-me"
          className="group flex min-h-12 flex-1 items-center justify-center gap-2 rounded-control bg-brand-cyan px-4 py-3 text-sm font-bold text-text-on-accent shadow-cyan transition-all hover:bg-brand-cyan-light active:scale-[0.98]"
        >
          <LocateFixed className="h-4 w-4" aria-hidden="true" />
          LOCATE ME
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
        <Link
          href="/map"
          className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-control border border-brand-cyan/40 bg-bg-2/80 px-4 py-3 text-sm font-semibold text-text-primary transition-colors hover:border-brand-cyan hover:bg-brand-blue/50"
        >
          <MapIcon className="h-4 w-4" aria-hidden="true" />
          LIVE MAP
        </Link>
      </div>
    </section>
  );
}
