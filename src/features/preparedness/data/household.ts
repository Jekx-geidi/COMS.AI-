import type { ChecklistItem } from "../types";

// Core Docs/AGENT.md #14 Household.
export const HOUSEHOLD_CHECKLIST: ChecklistItem[] = [
  { id: "charge-devices", section: "DO_FIRST", label: "Charge phones and power banks", detail: "Keep shared communication devices available." },
  { id: "emergency-lighting", section: "DO_FIRST", label: "Prepare emergency lighting", detail: "Place lights where family members can reach them." },
  { id: "protect-electronics", section: "BEFORE", label: "Protect important electronics", detail: "Shut down and unplug sensitive devices when appropriate." },
  { id: "refrigeration", section: "DURING", label: "Prepare for refrigeration limitations", detail: "Minimize opening cold storage during the interruption." },
  { id: "communication", section: "DURING", label: "Keep communication devices ready", detail: "Use battery carefully for important updates." },
];
