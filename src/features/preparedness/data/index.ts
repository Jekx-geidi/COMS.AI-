import type { ChecklistItem, PreparednessProfile } from "../types";
import { HOUSEHOLD_CHECKLIST } from "./household";
import { STUDENT_CHECKLIST } from "./student";
import { REMOTE_WORKER_CHECKLIST } from "./remote-worker";
import { BUSINESS_CHECKLIST } from "./business";

export const PROFILE_CHECKLISTS: Record<PreparednessProfile, ChecklistItem[]> = {
  HOUSEHOLD: HOUSEHOLD_CHECKLIST,
  STUDENT: STUDENT_CHECKLIST,
  REMOTE_WORKER: REMOTE_WORKER_CHECKLIST,
  BUSINESS: BUSINESS_CHECKLIST,
};

export const PROFILE_LABELS: Record<PreparednessProfile, string> = {
  HOUSEHOLD: "Household",
  STUDENT: "Student",
  REMOTE_WORKER: "Remote Worker",
  BUSINESS: "Business",
};
