import type { ReportType } from "@/types/community";

export interface MyCommunityReport {
  id: string;
  deviceId: string;
  reportType: ReportType;
  locationText: string;
  note?: string;
  createdAt: string;
}
