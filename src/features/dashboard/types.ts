import type { OutageStatus } from "@/types/outage";

export interface DashboardEventSummary {
  id: string;
  locationLabel: string;
  status: OutageStatus;
  startAt?: string;
  endAt?: string;
  coverageDescription?: string;
}

export interface DashboardSummary {
  activeCount: number;
  scheduledTodayCount: number;
  lastVerifiedAt: string;
  happeningNow: DashboardEventSummary[];
  laterToday: DashboardEventSummary[];
  tomorrow: DashboardEventSummary[];
  recentlyChanged: DashboardEventSummary[];
  recentlyRestored: DashboardEventSummary[];
}
