// Staff roles are intentionally separate from public residents. A valid
// Supabase session alone never grants access to the admin surface.
export const STAFF_ROLES = ["MODERATOR", "ADMIN", "SUPER_ADMIN"] as const;

export type StaffRole = (typeof STAFF_ROLES)[number];

export interface StaffProfile {
  id: string;
  displayName: string | null;
  role: StaffRole;
}

export function isStaffRole(value: unknown): value is StaffRole {
  return typeof value === "string" && STAFF_ROLES.includes(value as StaffRole);
}

export function canAccessAdmin(value: unknown): boolean {
  return isStaffRole(value);
}
