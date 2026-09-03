import type { ChecklistItem } from "../types";

// Core Docs/AGENT.md #14 Remote Worker.
export const REMOTE_WORKER_CHECKLIST: ChecklistItem[] = [
  { id: "save-work", section: "DO_FIRST", label: "Save work", detail: "Sync active files before power or internet drops." },
  { id: "backup-internet", section: "BEFORE", label: "Prepare backup internet", detail: "Check hotspot signal, data, and charging." },
  { id: "charge-devices", section: "DO_FIRST", label: "Charge devices", detail: "Prioritize laptop, phone, and batteries." },
  { id: "move-calls", section: "BEFORE", label: "Move important calls", detail: "Reschedule or relocate meetings that overlap the outage." },
  { id: "alt-location", section: "DURING", label: "Consider another location", detail: "Use a practical workspace outside the affected area if needed." },
];
