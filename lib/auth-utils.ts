import type { UserResponse } from "@/lib/auth-api";

const ADMIN_ROLES = new Set(["ROLE_ADMIN", "ROLE_SUPERADMIN"]);

export function isAdminUser(user: UserResponse | null | undefined): boolean {
  if (!user) {
    return false;
  }
  return user.roles.some((role) => ADMIN_ROLES.has(role));
}

export function isSuperAdminUser(user: UserResponse | null | undefined): boolean {
  return user?.roles.includes("ROLE_SUPERADMIN") ?? false;
}
