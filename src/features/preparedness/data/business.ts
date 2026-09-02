import type { ChecklistItem } from "../types";

// Core Docs/AGENT.md #14 Business.
export const BUSINESS_CHECKLIST: ChecklistItem[] = [
  { id: "notify-staff", label: "Notify staff" },
  { id: "protect-equipment", label: "Protect equipment" },
  { id: "manual-contingency", label: "Prepare manual operations" },
  { id: "refrigeration-risk", label: "Review refrigeration risk" },
  { id: "alt-payment", label: "Prepare alternative payment process" },
  { id: "inform-customers", label: "Inform customers" },
];
