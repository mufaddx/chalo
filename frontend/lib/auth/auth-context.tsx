"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { ApiError, storeToken } from "@/lib/api/client";
import { fetchCurrentUser, login as apiLogin, logout as apiLogout, register as apiRegister } from "@/lib/api/auth";
import type { ApiUser } from "@/lib/api/types";

interface AuthContextValue {
  user: ApiUser | null;
  /** null = still checking localStorage/API on first load */
  status: "loading" | "authenticated" | "guest";
  login: (email: string, password: string, remember?: boolean) => Promise<ApiUser>;
  register: (name: string, email: string, password: string, passwordConfirmation: string, phone?: string) => Promise<ApiUser>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [status, setStatus] = useState<AuthContextValue["status"]>("loading");

  useEffect(() => {
    const token = typeof window !== "undefined" ? window.localStorage.getItem("voyagr_auth_token") : null;
    if (!token) {
      setStatus("guest");
      return;
    }
    fetchCurrentUser()
      .then((u) => {
        setUser(u);
        setStatus("authenticated");
      })
      .catch(() => {
        // Token invalid/expired, or backend unreachable — fall back to guest
        // rather than blocking the UI on a dead session.
        storeToken(null);
        setStatus("guest");
      });
  }, []);

  const login = useCallback(async (email: string, password: string, remember = false) => {
    const res = await apiLogin(email, password, remember);
    storeToken(res.token);
    setUser(res.user);
    setStatus("authenticated");
    return res.user;
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string, passwordConfirmation: string, phone?: string) => {
      const res = await apiRegister(name, email, password, passwordConfirmation, phone);
      storeToken(res.token);
      setUser(res.user);
      setStatus("authenticated");
      return res.user;
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch (err) {
      // Backend unreachable or token already invalid — still clear locally,
      // being logged out is the safe default either way.
      if (!(err instanceof ApiError)) throw err;
    } finally {
      storeToken(null);
      setUser(null);
      setStatus("guest");
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, status, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
