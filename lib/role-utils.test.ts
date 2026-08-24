import { describe, expect, it } from "vitest";
import {
  hasAdminRole,
  hasModeratorOrAdminRole,
  isOnboardOnlyRole,
  mergePermissionsFromRoles,
} from "@/lib/role-utils";
import type { Role } from "@/types/role";

function mockRole(
  name: Role["name"],
  permissions: Partial<Record<string, boolean>> = {}
): Role {
  return {
    id: name,
    name,
    description: "",
    permissions: permissions as Role["permissions"],
    created_at: "",
    updated_at: "",
  };
}

describe("hasAdminRole", () => {
  it("returns true when admin role present", () => {
    expect(hasAdminRole([{ name: "admin" }])).toBe(true);
  });

  it("returns false for non-admin roles", () => {
    expect(hasAdminRole([{ name: "user" }, { name: "moderator" }])).toBe(
      false
    );
  });
});

describe("hasModeratorOrAdminRole", () => {
  it("returns true for moderator", () => {
    expect(hasModeratorOrAdminRole([{ name: "moderator" }])).toBe(true);
  });

  it("returns true for admin", () => {
    expect(hasModeratorOrAdminRole([{ name: "admin" }])).toBe(true);
  });

  it("returns false for regular user", () => {
    expect(hasModeratorOrAdminRole([{ name: "user" }])).toBe(false);
  });
});

describe("mergePermissionsFromRoles", () => {
  it("merges unique permissions from multiple roles", () => {
    const roles = [
      mockRole("user", { view_offers: true, view_files: true }),
      mockRole("moderator", { view_offers: true, manage_users: true }),
    ];

    const permissions = mergePermissionsFromRoles(roles);
    expect(permissions).toContain("view_offers");
    expect(permissions).toContain("view_files");
    expect(permissions).toContain("manage_users");
    expect(permissions.filter((p) => p === "view_offers")).toHaveLength(1);
  });

  it("ignores disabled permissions", () => {
    const roles = [mockRole("user", { view_offers: false })];
    expect(mergePermissionsFromRoles(roles)).toEqual([]);
  });
});

describe("isOnboardOnlyRole", () => {
  it("returns true for onboard-only users", () => {
    expect(isOnboardOnlyRole(["onboard"])).toBe(true);
  });

  it("returns false when user role is also assigned", () => {
    expect(isOnboardOnlyRole(["onboard", "user"])).toBe(false);
  });

  it("returns false for admin", () => {
    expect(isOnboardOnlyRole(["onboard", "admin"])).toBe(false);
  });
});
