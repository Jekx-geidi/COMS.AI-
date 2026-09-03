import type { ChecklistItem } from "../types";

// Core Docs/AGENT.md #14 Business.
export const BUSINESS_CHECKLIST: ChecklistItem[] = [
  { id: "notify-staff", section: "DO_FIRST", label: "Notify staff", detail: "Share the outage window and work plan early." },
  { id: "protect-equipment", section: "BEFORE", label: "Protect equipment", detail: "Safely shut down sensitive powered equipment when appropriate." },
  { id: "manual-contingency", section: "BEFORE", label: "Prepare manual operations", detail: "Keep order, payment, and receipt fallbacks ready." },
  { id: "refrigeration-risk", section: "BEFORE", label: "Review refrigeration risk", detail: "Plan around temperature-sensitive inventory." },
  { id: "alt-payment", section: "DURING", label: "Prepare alternative payment process", detail: "Use cash or offline records if digital payments fail." },
  { id: "inform-customers", section: "DURING", label: "Inform customers", detail: "Share schedule changes without inventing restoration promises." },
];
