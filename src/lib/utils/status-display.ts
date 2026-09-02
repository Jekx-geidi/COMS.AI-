import type { OutageStatus } from "@/types/outage";
import type { ReportType } from "@/types/community";

// Centralized status -> label/color mapping (NFR-181: no duplicated status
// business rules across components). Colors reference the design tokens in
// globals.css / tailwind.config.ts, never raw hex, per UIS.md #52.

export type StatusTone =
  | "critical"
  | "scheduled"
  | "monitor"
  | "restoring"
  | "stable"
  | "community"
  | "unknown";

export interface StatusDisplay {
  label: string;
  tone: StatusTone;
}

const OUTAGE_STATUS_DISPLAY: Record<OutageStatus, StatusDisplay> = {
  NORMAL: { label: "Normal", tone: "stable" },
  MONITORING: { label: "Monitoring", tone: "monitor" },
  POSSIBLE: { label: "Possible", tone: "monitor" },
  SCHEDULED: { label: "Scheduled", tone: "scheduled" },
  CONFIRMED: { label: "Confirmed", tone: "critical" },
  ONGOING: { label: "Ongoing", tone: "critical" },
  RESTORING: { label: "Restoring", tone: "restoring" },
  RESTORED: { label: "Restored", tone: "stable" },
  CANCELLED: { label: "Cancelled", tone: "unknown" },
  COMPLETED: { label: "Completed", tone: "stable" },
  UNKNOWN: { label: "Unknown", tone: "unknown" },
};

export function getOutageStatusDisplay(status: OutageStatus): StatusDisplay {
  return OUTAGE_STATUS_DISPLAY[status];
}

export function getCommunityReportLabel(type: ReportType): string {
  switch (type) {
    case "POWER_OUT":
      return "Power Out";
    case "POWER_RESTORED":
      return "Power Restored";
    case "FLICKERING":
      return "Flickering";
    case "LOW_VOLTAGE":
      return "Low Voltage";
    case "INTERMITTENT":
      return "Intermittent";
  }
}

// Raw hex equivalents of the design tokens (globals.css) for contexts that
// can't use Tailwind classes — canvas/Leaflet markers. Keep in sync with
// globals.css --status-* values; do not hardcode these colors elsewhere.
export const TONE_HEX: Record<StatusTone, string> = {
  critical: "#e53935",
  scheduled: "#ffb020",
  monitor: "#ffd95a",
  restoring: "#39d9d0",
  stable: "#2dd881",
  community: "#9b72ff",
  unknown: "#7c8ba1",
};

export const TONE_CLASSES: Record<StatusTone, { dot: string; text: string; border: string }> = {
  critical: {
    dot: "bg-status-critical",
    text: "text-status-critical",
    border: "border-status-critical/40",
  },
  scheduled: {
    dot: "bg-status-scheduled",
    text: "text-status-scheduled",
    border: "border-status-scheduled/40",
  },
  monitor: {
    dot: "bg-status-monitor",
    text: "text-status-monitor",
    border: "border-status-monitor/40",
  },
  restoring: {
    dot: "bg-status-restoring",
    text: "text-status-restoring",
    border: "border-status-restoring/40",
  },
  stable: {
    dot: "bg-status-stable",
    text: "text-status-stable",
    border: "border-status-stable/40",
  },
  community: {
    dot: "bg-status-community",
    text: "text-status-community",
    border: "border-status-community/40",
  },
  unknown: {
    dot: "bg-status-unknown",
    text: "text-status-unknown",
    border: "border-status-unknown/40",
  },
};
