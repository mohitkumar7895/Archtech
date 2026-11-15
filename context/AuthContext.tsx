"use client";

import React, { createContext, useContext, useState } from "react";

interface AdminUserSession {
  userId: string;
  name: string;
  email: string;
  roleId: string;
  roleName: string;
}

interface AuthContextType {
  user: AdminUserSession | null;
  setUser: (u: AdminUserSession | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
});

export function AuthProvider({
  children,
  initialUser = null,
}: {
  children: React.ReactNode;
  initialUser?: AdminUserSession | null;
}) {
  const [user, setUser] = useState<AdminUserSession | null>(initialUser);
  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
