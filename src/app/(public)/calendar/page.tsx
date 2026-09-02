"use client";

import { useEffect, useMemo, useState } from "react";
import { getCalendarEvents } from "@/features/calendar/services/calendar.service";
import { CalendarViewSwitcher } from "@/features/calendar/components/calendar-view-switcher";
import { TimelineEvent } from "@/features/calendar/components/timeline-event";
import { MonthGrid } from "@/features/calendar/components/month-grid";
import { filterEventsForView, type CalendarView } from "@/features/calendar/utils/filter-events";
import type { CalendarEvent } from "@/features/calendar/types";

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [view, setView] = useState<CalendarView>("TODAY");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  useEffect(() => {
    getCalendarEvents().then(setEvents);
  }, []);

  const visibleEvents = useMemo(() => {
    const base = filterEventsForView(events, view);
    if (view !== "MONTH" || selectedDay === null) return base;
    return events.filter((e) => new Date(e.startAt).getDate() === selectedDay);
  }, [events, view, selectedDay]);

  const sorted = [...visibleEvents].sort(
    (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
  );

  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="font-display text-lg font-semibold">Brownout Calendar</h1>
        <p className="text-sm text-text-secondary">Where answers &ldquo;where?&rdquo; — this answers &ldquo;when?&rdquo;</p>
      </header>

      <CalendarViewSwitcher
        value={view}
        onChange={(v) => {
          setView(v);
          setSelectedDay(null);
        }}
      />

      {view === "MONTH" && (
        <MonthGrid events={events} selectedDay={selectedDay} onSelectDay={setSelectedDay} />
      )}

      {sorted.length === 0 ? (
        <p className="rounded-panel border border-border-subtle bg-bg-1/60 px-4 py-6 text-center text-sm text-text-secondary">
          {view === "MONTH" && selectedDay === null
            ? "Select a day to view its schedule."
            : "No verified interruptions in this range."}
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {sorted.map((event) => (
            <TimelineEvent key={event.id} event={event} showDate={view === "7_DAYS"} />
          ))}
        </ul>
      )}
    </div>
  );
}
