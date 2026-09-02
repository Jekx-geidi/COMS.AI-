"use client";

import { useEffect, useState } from "react";
import { usePreparednessChecklist } from "@/features/preparedness/hooks/use-preparedness-checklist";
import { ProfileSelector } from "@/features/preparedness/components/profile-selector";
import { PreparednessChecklist } from "@/features/preparedness/components/preparedness-checklist";
import { CountdownBanner } from "@/features/preparedness/components/countdown-banner";
import { PROFILE_CHECKLISTS } from "@/features/preparedness/data";
import { getDashboardSummary } from "@/features/dashboard/services/dashboard.service";
import type { DashboardEventSummary } from "@/features/dashboard/types";

export default function PreparednessPage() {
  const { profile, setProfile, checked, toggleItem, loaded } = usePreparednessChecklist();
  const [nextEvent, setNextEvent] = useState<DashboardEventSummary | null>(null);

  useEffect(() => {
    getDashboardSummary().then((summary) => {
      setNextEvent(summary.laterToday[0] ?? summary.tomorrow[0] ?? null);
    });
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <header>
        <h1 className="font-display text-lg font-semibold">Preparedness</h1>
        <p className="text-sm text-text-secondary">
          Practical steps before a verified interruption reaches you.
        </p>
      </header>

      {nextEvent?.startAt && (
        <CountdownBanner
          targetIso={nextEvent.startAt}
          label={`Next scheduled interruption — ${nextEvent.locationLabel}`}
        />
      )}

      <ProfileSelector value={profile} onChange={setProfile} />

      {loaded && (
        <PreparednessChecklist
          items={PROFILE_CHECKLISTS[profile]}
          checked={checked}
          onToggle={toggleItem}
        />
      )}

      <p className="text-xs text-text-secondary">
        COMS.AI does not provide unsafe electrical repair instructions.
      </p>
    </div>
  );
}
