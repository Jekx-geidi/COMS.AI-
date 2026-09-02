import type { CalendarEvent } from "../types";

function at(dayOffset: number, hour: number, minute = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

// TODO(Stage 9): replace with a query against `current_verified_outages`
// filtered by the selected date range (Core Docs/DATABASE-STRUCTURE.md #20).
export async function getCalendarEvents(): Promise<CalendarEvent[]> {
  return [
    { id: "cal-1", locationLabel: "Talamban", status: "SCHEDULED", startAt: at(0, 9, 0), endAt: at(0, 12, 0) },
    { id: "cal-2", locationLabel: "Lahug", status: "SCHEDULED", startAt: at(0, 13, 0), endAt: at(0, 16, 0) },
    { id: "cal-3", locationLabel: "Mandaue", status: "RESTORING", startAt: at(0, 16, 30) },
    { id: "cal-4", locationLabel: "Banilad", status: "SCHEDULED", startAt: at(1, 8, 0), endAt: at(1, 11, 0) },
    { id: "cal-5", locationLabel: "Guadalupe", status: "POSSIBLE", startAt: at(1, 14, 0) },
    { id: "cal-6", locationLabel: "Mabolo", status: "SCHEDULED", startAt: at(3, 9, 0), endAt: at(3, 13, 0) },
    { id: "cal-7", locationLabel: "Basak, Mandaue", status: "SCHEDULED", startAt: at(4, 7, 0), endAt: at(4, 10, 0) },
    { id: "cal-8", locationLabel: "Talamban", status: "CANCELLED", startAt: at(5, 9, 0) },
  ];
}
