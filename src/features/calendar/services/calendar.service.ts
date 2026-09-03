import { getAffectedAreas } from "@/features/locate-me/services/locate-me.service";
import type { CalendarEvent } from "../types";

export async function getCalendarEvents(): Promise<CalendarEvent[]> {
  const areas = await getAffectedAreas();

  return areas
    .filter((area) => area.event.startAt)
    .map((area) => ({
      id: area.event.locations[0]?.id ?? area.event.id,
      locationLabel: area.label,
      status: area.event.status,
      startAt: area.event.startAt!,
      endAt: area.event.endAt,
      coverageDescription: area.event.locations[0]?.coverageDescription,
      sourceName: area.sourceName,
    }));
}
