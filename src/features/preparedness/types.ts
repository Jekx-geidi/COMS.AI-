export type PreparednessProfile =
  | "STUDENT"
  | "OFFICE_WORKER"
  | "REMOTE_WORKER"
  | "HOUSEHOLD"
  | "BUSINESS"
  | "TOURIST"
  | "SENIOR_CAREGIVER"
  | "COMMUTER_DRIVER"
  | "CUSTOM";

export type ChecklistSectionKey = "DO_FIRST" | "BEFORE" | "DURING" | "AFTER";

export interface ChecklistItem {
  id: string;
  label: string;
  detail: string;
  section: ChecklistSectionKey;
}

export interface PreparednessProfileOption {
  id: PreparednessProfile;
  label: string;
  shortLabel: string;
  description: string;
}
