import type { OutageStatus } from "@/types/outage";

export interface CalendarEvent {
  id: string;
  locationLabel: string;
  status: OutageStatus;
  startAt: string;
  endAt?: string;
  coverageDescription?: string;
  sourceName?: string;
}
