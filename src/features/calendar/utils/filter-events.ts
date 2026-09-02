import type { CalendarEvent } from "../types";

export type CalendarView = "TODAY" | "TOMORROW" | "7_DAYS" | "MONTH";

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function filterEventsForView(events: CalendarEvent[], view: CalendarView): CalendarEvent[] {
  const now = new Date();

  if (view === "TODAY") {
    return events.filter((e) => isSameDay(new Date(e.startAt), now));
  }
  if (view === "TOMORROW") {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return events.filter((e) => isSameDay(new Date(e.startAt), tomorrow));
  }
  if (view === "7_DAYS") {
    const weekOut = new Date(now);
    weekOut.setDate(weekOut.getDate() + 7);
    return events.filter((e) => new Date(e.startAt) <= weekOut);
  }
  return events;
}
