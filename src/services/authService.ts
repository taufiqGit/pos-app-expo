/**
 * services/auth.ts
 * Authentication service for the POS app.
 * Handles login, logout, PIN auth, and session management.
 */

import { User, UserAccess } from "../types/user";
import { api } from "./api";
import { authStorage } from "./authStorage";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LoginCredentials {
  identifier: string;
  password: string;
  device_name?: string;
}

/** Sesuai models.AuthResponseMobile di backend (endpoint /api/auth/login-mobile) */
export interface AuthSession {
  user: User;
  access_token: string;
  expire_time: string;
  refresh_token: string;
  refresh_expires_at: string;
}

// ─── Login / logout ───────────────────────────────────────────────────────────

export async function login(
  credentials: LoginCredentials,
): Promise<AuthSession> {
  // Endpoint khusus mobile: refresh token dikirim di response body,
  // bukan lewat HttpOnly cookie seperti versi backoffice.
  const { data } = await api.post<AuthSession>(
    "/api/auth/login-mobile",
    credentials,
  );
  await authStorage.setTokens(data.access_token, data.refresh_token);

  return data;
}

export async function logout(): Promise<void> {
  const refreshToken = await authStorage.getRefreshToken();
  try {
    // Backend membaca refresh token dari cookie untuk revoke di server
    await api.post("/api/auth/logout", undefined, {
      headers: refreshToken ? { Cookie: `refresh_token=${refreshToken}` } : {},
      withCredentials: true,
    });
  } finally {
    await authStorage.clearTokens();
  }
}

/**
 * GET /api/auth/access (protected)
 * Mengembalikan current user beserta daftar permissions-nya.
 */
export async function getUserAccess(): Promise<UserAccess> {
  const { data } = await api.get<UserAccess>("/api/auth/access");
  return data;
}

export const authService = {
  login,
  logout,
  getUserAccess,
};

export default authService;
