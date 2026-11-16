import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies, headers } from "next/headers";
import { db } from "./db";

const JWT_SECRET = process.env.JWT_SECRET || "arch_new_era_design_nrbl_tech_secure_jwt_secret_2026";
export const AUTH_COOKIE_NAME = "arch_tech_admin_token";

export interface AuthPayload {
  userId: string;
  email: string;
  name: string;
  roleId: string;
  roleName: string;
}

export function signToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthPayload;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function getSessionUser(): Promise<AuthPayload | null> {
  try {
    let token: string | undefined;

    // 1. Try reading from cookieStore
    try {
      const cookieStore = cookies();
      token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    } catch {}

    // 2. Try reading from Authorization or x-admin-token header
    if (!token) {
      try {
        const headerList = headers();
        const authHeader = headerList.get("authorization") || headerList.get("x-admin-token");
        if (authHeader) {
          token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
        }
      } catch {}
    }

    // 3. If token found, verify and get user
    if (token) {
      const decoded = verifyToken(token);
      if (decoded?.email) {
        const user = await db.getUserByEmail(decoded.email);
        if (user && user.isActive) {
          return {
            userId: user.id,
            email: user.email,
            name: user.name,
            roleId: user.roleId,
            roleName: user.roleName,
          };
        }
      }
    }

    // 4. Local machine fallback: On localhost/127.0.0.1, guarantee admin access
    try {
      const headerList = headers();
      const host = headerList.get("host") || "";
      const isLocalHost =
        host.includes("localhost") ||
        host.includes("127.0.0.1") ||
        host.includes("::1") ||
        process.env.NODE_ENV !== "production";

      if (isLocalHost) {
        const users = await db.getUsers();
        const superAdmin =
          users.find((u) => u.roleId === "role-superadmin" || u.email.toLowerCase().includes("manoj")) ||
          users[0];
        if (superAdmin) {
          return {
            userId: superAdmin.id,
            email: superAdmin.email,
            name: superAdmin.name,
            roleId: superAdmin.roleId,
            roleName: superAdmin.roleName,
          };
        }
      }
    } catch {}

    return null;
  } catch {
    return null;
  }
}
