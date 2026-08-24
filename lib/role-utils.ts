import type { Permission, Role } from "@/types/role";

export function hasAdminRole(roles: Pick<Role, "name">[]): boolean {
  return roles.some((role) => role.name === "admin");
}

export function hasModeratorOrAdminRole(roles: Pick<Role, "name">[]): boolean {
  return roles.some(
    (role) => role.name === "moderator" || role.name === "admin"
  );
}

export function mergePermissionsFromRoles(roles: Role[]): Permission[] {
  const permissions: Permission[] = [];

  for (const role of roles) {
    for (const [key, value] of Object.entries(role.permissions)) {
      if (value && !permissions.includes(key as Permission)) {
        permissions.push(key as Permission);
      }
    }
  }

  return permissions;
}

export function isOnboardOnlyRole(roleNames: string[]): boolean {
  return (
    roleNames.includes("onboard") &&
    !roleNames.includes("user") &&
    !roleNames.includes("admin") &&
    !roleNames.includes("moderator")
  );
}
