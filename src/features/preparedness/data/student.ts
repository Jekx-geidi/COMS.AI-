import type { ChecklistItem } from "../types";

// Core Docs/AGENT.md #14 Student.
export const STUDENT_CHECKLIST: ChecklistItem[] = [
  { id: "charge-laptop", section: "DO_FIRST", label: "Charge laptop", detail: "Keep your main study device ready." },
  { id: "download-files", section: "DO_FIRST", label: "Download required files", detail: "Save class materials for offline use." },
  { id: "save-assignments", section: "BEFORE", label: "Save assignments", detail: "Keep drafts and instructions available locally." },
  { id: "mobile-hotspot", section: "BEFORE", label: "Prepare mobile hotspot", detail: "Check mobile data before the outage window." },
  { id: "notify-instructor", section: "DURING", label: "Notify instructor if necessary", detail: "Send a short update while battery and signal remain available." },
];
