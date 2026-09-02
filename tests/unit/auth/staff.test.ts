import { describe, expect, it } from "vitest";
import { canAccessAdmin, isStaffRole } from "../../../src/lib/auth/staff";

describe("staff authorization rules", () => {
  it.each(["MODERATOR", "ADMIN", "SUPER_ADMIN"]) ("accepts the %s staff role", (role) => {
    expect(isStaffRole(role)).toBe(true);
    expect(canAccessAdmin(role)).toBe(true);
  });

  it.each(["PUBLIC", "USER", "VERIFIER", "", null, undefined]) ("rejects non-staff role %s", (role) => {
    expect(isStaffRole(role)).toBe(false);
    expect(canAccessAdmin(role)).toBe(false);
  });
});
