export type ReportType =
  | "POWER_OUT"
  | "POWER_RESTORED"
  | "FLICKERING"
  | "LOW_VOLTAGE"
  | "INTERMITTENT";

export interface CommunityCluster {
  id: string;
  clusterType: ReportType;
  reportCount: number;
  firstReportedAt?: string;
  lastReportedAt?: string;
  linkedOutageEventId?: string;
  status: string;
  locationLabel?: string;
}
