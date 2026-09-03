import { LiveStatusCard } from "@/features/dashboard/components/live-status-card";
import { EventSummaryList } from "@/features/dashboard/components/event-summary-list";
import { AskTeaser } from "@/features/assistant/components/ask-teaser";
import { LocateMeWidget } from "@/features/locate-me/components/locate-me-widget";
import { DashboardMapPreview } from "@/features/dashboard/components/dashboard-map-preview";
import { getDashboardSummary } from "@/features/dashboard/services/dashboard.service";

export default async function HomePage() {
  const summary = await getDashboardSummary();

  return (
    <div className="flex flex-col gap-5 md:gap-6">
      <LiveStatusCard
        activeCount={summary.activeCount}
        scheduledTodayCount={summary.scheduledTodayCount}
        lastVerifiedAt={summary.lastVerifiedAt}
      />

      <DashboardMapPreview />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <div className="flex min-w-0 flex-col gap-5">
          <AskTeaser />
          <LocateMeWidget />
        </div>

        <div className="grid min-w-0 gap-5 lg:grid-cols-2 xl:grid-cols-1">
          <EventSummaryList
            title="Happening Now"
            items={summary.happeningNow}
            emptyLabel="No currently verified interruption in progress."
          />

          <EventSummaryList
            title="Later Today"
            items={summary.laterToday}
            emptyLabel="No further scheduled interruptions today."
          />

          <EventSummaryList
            title="Tomorrow"
            items={summary.tomorrow}
            emptyLabel="No scheduled interruptions for tomorrow yet."
          />

          <EventSummaryList
            title="Recently Changed"
            items={summary.recentlyChanged}
            emptyLabel="No recent changes."
          />

          <EventSummaryList
            title="Recently Restored"
            items={summary.recentlyRestored}
            emptyLabel="No recent restorations."
          />
        </div>
      </div>

      <p className="pt-2 text-center text-[11px] leading-relaxed text-text-secondary">
        COMS.AI is an independent awareness and preparedness platform. It is not an
        electricity provider and does not guarantee outage or restoration times.
      </p>
    </div>
  );
}
