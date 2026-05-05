/**
 * services/auth.ts
 * Authentication service for the POS app.
 * Handles login, logout, PIN auth, and session management.
 */

import { api } from "./api";
import { authStorage } from "./authStorage";
import { User } from "../types/user";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LoginCredentials {
  identifier: string;
  password: string;
  storeId?: string;
}

export interface PinCredentials {
  userId: string;
  pin: string; // 4–6 digit PIN for quick cashier switch
}

export interface AuthSession {
  user: User;
  token: string;
}

// ─── Login / logout ───────────────────────────────────────────────────────────

export async function login(
  credentials: LoginCredentials,
): Promise<AuthSession> {
  try {
    const { data } = await api.post<AuthSession>(
      "/api/auth/login",
      credentials,
    );
    console.log(data, "ini");
    await authStorage.setTokens(data.access_token, data.access_token);

    return data;
  } catch (error) {
    console.log(error, "error nihh");
    // throw error;
  }
}

export async function loginWithPin(
  credentials: PinCredentials,
): Promise<AuthSession> {
  const { data } = await api.post<AuthSession>("/api/auth/pin", credentials);
  await authStorage.setTokens(data.token, data.token);
  return data;
}

export async function logout(): Promise<void> {
  try {
    await api.post("/api/auth/logout");
  } finally {
    await authStorage.clearTokens();
  }
}

export async function getCurrentUser(): Promise<User> {
  const { data } = await api.get<User>("/api/auth/me");
  return data;
}

export const authService = {
  login,
  loginWithPin,
  logout,
  getCurrentUser,
};

export default authService;
