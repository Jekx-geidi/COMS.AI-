"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getCalendarEvents } from "@/features/calendar/services/calendar.service";
import { TimelineEvent } from "@/features/calendar/components/timeline-event";
import { MonthGrid } from "@/features/calendar/components/month-grid";
import type { CalendarEvent } from "@/features/calendar/types";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function toDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function eventDateKey(iso: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(iso));
}

function displayDate(dateKey: string): string {
  const [year = new Date().getFullYear(), month = 1, day = 1] = dateKey.split("-").map(Number);
  return new Intl.DateTimeFormat("en-PH", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

function statusSummary(events: CalendarEvent[]): string {
  if (events.some((event) => event.status === "ONGOING")) return "Blackout now";
  if (events.some((event) => event.status === "POSSIBLE")) return "Rotational / possible";
  if (events.some((event) => event.status === "SCHEDULED")) return "Scheduled";
  if (events.some((event) => event.status === "RESTORING")) return "Restoring";
  if (events.some((event) => event.status === "RESTORED")) return "Restored";
  return "No verified outage";
}

export default function CalendarPage() {
  const today = useMemo(() => new Date(), []);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [visibleYear, setVisibleYear] = useState(today.getFullYear());
  const [visibleMonth, setVisibleMonth] = useState(today.getMonth());
  const [selectedDateKey, setSelectedDateKey] = useState(toDateKey(today.getFullYear(), today.getMonth(), today.getDate()));

  useEffect(() => {
    getCalendarEvents().then(setEvents);
  }, []);

  const yearOptions = useMemo(() => {
    const eventYears = events.map((event) => Number(eventDateKey(event.startAt).slice(0, 4)));
    const years = new Set([today.getFullYear() - 1, today.getFullYear(), today.getFullYear() + 1, ...eventYears]);
    return [...years].sort((a, b) => a - b);
  }, [events, today]);

  const selectedEvents = useMemo(
    () =>
      events
        .filter((event) => eventDateKey(event.startAt) === selectedDateKey)
        .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()),
    [events, selectedDateKey]
  );

  function moveMonth(direction: -1 | 1) {
    const next = new Date(visibleYear, visibleMonth + direction, 1);
    setVisibleYear(next.getFullYear());
    setVisibleMonth(next.getMonth());
    setSelectedDateKey(toDateKey(next.getFullYear(), next.getMonth(), 1));
  }

  function updateYear(year: number) {
    setVisibleYear(year);
    setSelectedDateKey(toDateKey(year, visibleMonth, 1));
  }

  function updateMonth(month: number) {
    setVisibleMonth(month);
    setSelectedDateKey(toDateKey(visibleYear, month, 1));
  }

  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="font-display text-lg font-semibold">Brownout Calendar</h1>
        <p className="text-sm text-text-secondary">
          Pick a year, month, and day to see which barangays or cities have verified interruptions.
        </p>
      </header>

      <section className="rounded-panel border border-border-subtle bg-bg-1 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-cyan">Calendar table</p>
            <h2 className="mt-1 font-display text-base font-semibold">
              {MONTHS[visibleMonth]} {visibleYear}
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => moveMonth(-1)}
              aria-label="Previous month"
              className="inline-flex h-9 w-9 items-center justify-center rounded-control border border-border-subtle text-text-secondary transition-colors hover:border-brand-cyan hover:text-brand-cyan"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <select
              value={visibleMonth}
              onChange={(event) => updateMonth(Number(event.target.value))}
              aria-label="Select month"
              className="h-9 rounded-control border border-border-subtle bg-bg-2 px-3 text-sm text-text-primary"
            >
              {MONTHS.map((month, index) => (
                <option key={month} value={index}>
                  {month}
                </option>
              ))}
            </select>
            <select
              value={visibleYear}
              onChange={(event) => updateYear(Number(event.target.value))}
              aria-label="Select year"
              className="h-9 rounded-control border border-border-subtle bg-bg-2 px-3 text-sm text-text-primary"
            >
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => moveMonth(1)}
              aria-label="Next month"
              className="inline-flex h-9 w-9 items-center justify-center rounded-control border border-border-subtle text-text-secondary transition-colors hover:border-brand-cyan hover:text-brand-cyan"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="mt-4">
          <MonthGrid
            events={events}
            visibleYear={visibleYear}
            visibleMonth={visibleMonth}
            selectedDateKey={selectedDateKey}
            onSelectDate={setSelectedDateKey}
          />
        </div>
      </section>

      <section className="rounded-panel border border-border-subtle bg-bg-1/80 p-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">Selected day</p>
            <h2 className="mt-1 font-display text-base font-semibold">{displayDate(selectedDateKey)}</h2>
          </div>
          <span className="inline-flex w-fit rounded-full bg-bg-2 px-3 py-1.5 text-xs font-semibold text-brand-cyan">
            {statusSummary(selectedEvents)}
          </span>
        </div>

        {selectedEvents.length === 0 ? (
          <p className="mt-4 rounded-control border border-border-subtle bg-bg-2/45 px-4 py-6 text-center text-sm text-text-secondary">
            No verified brownout, rotational, or scheduled interruption is listed for this day.
          </p>
        ) : (
          <ul className="mt-4 flex flex-col gap-2">
            {selectedEvents.map((event) => (
              <TimelineEvent key={event.id} event={event} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
