"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Bot, ChevronRight, PencilLine } from "lucide-react";
import { usePreparednessChecklist } from "@/features/preparedness/hooks/use-preparedness-checklist";
import { ProfileSelector } from "@/features/preparedness/components/profile-selector";
import { PreparednessChecklist } from "@/features/preparedness/components/preparedness-checklist";
import { CountdownBanner } from "@/features/preparedness/components/countdown-banner";
import { PROFILE_CHECKLISTS, PROFILE_LABELS } from "@/features/preparedness/data";
import { getAffectedAreas } from "@/features/locate-me/services/locate-me.service";
import { formatDate, formatTimeRange } from "@/lib/dates/format-outage-time";

interface NextPreparednessEvent {
  startAt?: string;
  endAt?: string;
  status: string;
  locationLabel: string;
}

export default function PreparednessPage() {
  const {
    profile,
    draftProfile,
    setDraftProfile,
    buildChecklist,
    changeProfile,
    resetChecklist,
    checked,
    toggleItem,
    loaded,
  } = usePreparednessChecklist();
  const [nextEvent, setNextEvent] = useState<NextPreparednessEvent | null>(null);
  const [customContext, setCustomContext] = useState("");

  useEffect(() => {
    getAffectedAreas().then((areas) => {
      const now = Date.now();
      const activeOrNextArea = areas
        .filter((area) => {
          const start = area.event.startAt ? new Date(area.event.startAt).getTime() : 0;
          const end = area.event.endAt ? new Date(area.event.endAt).getTime() : Number.POSITIVE_INFINITY;
          return area.event.status === "ONGOING" || area.event.status === "RESTORING" || end >= now || start >= now;
        })
        .sort((a, b) => {
          const aStart = a.event.startAt ? new Date(a.event.startAt).getTime() : Number.POSITIVE_INFINITY;
          const bStart = b.event.startAt ? new Date(b.event.startAt).getTime() : Number.POSITIVE_INFINITY;
          return aStart - bStart;
        })[0];

      setNextEvent(
        activeOrNextArea
          ? {
              startAt: activeOrNextArea.event.startAt,
              endAt: activeOrNextArea.event.endAt,
              status: activeOrNextArea.event.status,
              locationLabel: activeOrNextArea.label,
            }
          : null
      );
    });
  }, []);

  const items = useMemo(() => (profile ? PROFILE_CHECKLISTS[profile] : []), [profile]);
  const completedCount = useMemo(() => items.filter((item) => checked[item.id]).length, [checked, items]);

  function downloadChecklist() {
    if (!profile) return;
    const lines = [
      "COMS.AI Preparedness Checklist",
      `Profile: ${PROFILE_LABELS[profile]}`,
      nextEvent
        ? `Outage context: ${nextEvent.status} - ${nextEvent.locationLabel} ${formatDate(nextEvent.startAt) ?? ""} ${formatTimeRange(nextEvent.startAt, nextEvent.endAt) ?? ""}`.trim()
        : "Outage context: No currently verified interruption selected.",
      customContext ? `Custom note: ${customContext}` : "",
      "",
      ...items.map((item) => `${checked[item.id] ? "[x]" : "[ ]"} ${item.label} - ${item.detail}`),
      "",
      "COMS.AI does not provide unsafe electrical repair instructions.",
    ].filter(Boolean);
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `coms-ai-${PROFILE_LABELS[profile].toLowerCase().replace(/\s+/g, "-")}-preparedness.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col gap-5">
      <header>
        <h1 className="font-display text-lg font-semibold">Preparedness</h1>
        <p className="text-sm text-text-secondary">
          Tell COMS.AI your situation first, then get a practical outage checklist you can save.
        </p>
      </header>

      {nextEvent?.startAt && (
        <CountdownBanner
          targetIso={nextEvent.startAt}
          label={`${nextEvent.status === "ONGOING" ? "Outage active" : "Next verified interruption"} - ${nextEvent.locationLabel}`}
        />
      )}

      {loaded && !profile && (
        <section className="rounded-panel border border-border-subtle bg-bg-1/95 p-4 md:p-5">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-cyan">Question first</p>
            <h2 className="font-display text-xl font-semibold">Who are you preparing as today?</h2>
            <p className="max-w-2xl text-sm text-text-secondary">
              Choose the situation that best matches you. COMS.AI will build a checklist around your devices,
              schedule, location, and practical needs.
            </p>
          </div>

          <div className="mt-4">
            <ProfileSelector value={draftProfile} onChange={setDraftProfile} />
          </div>

          {draftProfile === "CUSTOM" && (
            <label className="mt-4 block">
              <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                What are you trying to protect or continue?
              </span>
              <textarea
                value={customContext}
                onChange={(event) => setCustomContext(event.target.value)}
                rows={3}
                maxLength={180}
                placeholder="Example: I manage a small computer shop, or I am visiting Cebu for a conference."
                className="mt-2 w-full rounded-control border border-border-subtle bg-bg-2 px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/70 focus:outline-none"
              />
            </label>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => buildChecklist()}
              className="inline-flex items-center gap-2 rounded-control bg-brand-cyan px-4 py-2.5 text-sm font-semibold text-text-on-accent transition-opacity hover:opacity-90"
            >
              Build my checklist
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => buildChecklist("HOUSEHOLD")}
              className="rounded-control border border-border-subtle px-4 py-2.5 text-sm font-semibold text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary"
            >
              Skip for now
            </button>
          </div>
        </section>
      )}

      {loaded && profile && (
        <>
          <section className="rounded-panel border border-border-subtle bg-bg-1/95 p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-cyan">
                  Welcome back
                </p>
                <h2 className="font-display text-base font-semibold">
                  Preparing as: {PROFILE_LABELS[profile]}
                </h2>
                <p className="mt-1 text-sm text-text-secondary">
                  {completedCount} of {items.length} tasks complete.
                </p>
              </div>
              <button
                type="button"
                onClick={changeProfile}
                className="inline-flex items-center gap-2 rounded-control border border-border-subtle px-3 py-2 text-xs font-semibold text-text-secondary transition-colors hover:border-brand-cyan hover:text-brand-cyan"
              >
                <PencilLine className="h-3.5 w-3.5" aria-hidden="true" />
                Change profile
              </button>
            </div>
          </section>

          <PreparednessChecklist
            profile={profile}
            items={items}
            checked={checked}
            onToggle={toggleItem}
            onReset={resetChecklist}
            onDownload={downloadChecklist}
          />

          <div className="flex flex-col gap-3 rounded-panel border border-border-subtle bg-bg-1/75 p-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-control bg-brand-cyan/10 text-brand-cyan">
                <Bot className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold">Need help prioritizing?</p>
                <p className="text-xs text-text-secondary">
                  Ask COMS what to do first using verified outage context and this checklist.
                </p>
              </div>
            </div>
            <Link
              href="/ask-ai"
              className="inline-flex items-center justify-center rounded-control bg-bg-2 px-4 py-2 text-sm font-semibold text-text-primary transition-colors hover:text-brand-cyan"
            >
              Ask COMS
            </Link>
          </div>
        </>
      )}

      <p className="text-xs text-text-secondary">
        COMS.AI does not provide unsafe electrical repair instructions.
      </p>
    </div>
  );
}
