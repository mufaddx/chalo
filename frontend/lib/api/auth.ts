import { api } from "./client";
import type { ApiUser, AuthResponse } from "./types";

export function login(email: string, password: string, remember = false) {
  return api.post<AuthResponse>("/auth/login", { email, password, remember }, { skipAuth: true });
}

export function register(name: string, email: string, password: string, passwordConfirmation: string, phone?: string) {
  return api.post<AuthResponse>(
    "/auth/register",
    { name, email, password, password_confirmation: passwordConfirmation, phone },
    { skipAuth: true }
  );
}

export function fetchCurrentUser() {
  return api.get<ApiUser>("/auth/me");
}

export function logout() {
  return api.post<{ message: string }>("/auth/logout");
}
