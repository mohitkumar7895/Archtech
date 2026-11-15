import { AuthPayload, getSessionUser } from "./auth";

export async function requireAdminAuth(): Promise<{
  authorized: boolean;
  user: AuthPayload | null;
  error?: string;
}> {
  const user = await getSessionUser();
  if (!user) {
    return { authorized: false, user: null, error: "Unauthorized access. Please log in to Admin Dashboard." };
  }
  return { authorized: true, user };
}

export function canManageUsers(user: AuthPayload | null): boolean {
  if (!user) return false;
  return user.roleId === "role-superadmin" || user.roleName.toLowerCase().includes("super");
}
