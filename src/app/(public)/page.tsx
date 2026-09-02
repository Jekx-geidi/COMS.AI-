import { LiveStatusCard } from "@/features/dashboard/components/live-status-card";
import { EventSummaryList } from "@/features/dashboard/components/event-summary-list";
import { AskTeaser } from "@/features/assistant/components/ask-teaser";
import { LocateMeWidget } from "@/features/locate-me/components/locate-me-widget";
import { getDashboardSummary } from "@/features/dashboard/services/dashboard.service";

export default async function HomePage() {
  const summary = await getDashboardSummary();

  return (
    <div className="flex flex-col gap-7 md:gap-8">
      <LiveStatusCard
        activeCount={summary.activeCount}
        scheduledTodayCount={summary.scheduledTodayCount}
        lastVerifiedAt={summary.lastVerifiedAt}
      />

      <AskTeaser />

      <LocateMeWidget />

      <div className="grid min-w-0 gap-7 lg:grid-cols-2 lg:gap-x-6 lg:gap-y-8">
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

      <p className="border-t border-border-subtle pt-5 text-center text-[11px] leading-relaxed text-text-secondary">
        COMS.AI is an independent awareness and preparedness platform. It is not an
        electricity provider and does not guarantee outage or restoration times.
      </p>
    </div>
  );
}
