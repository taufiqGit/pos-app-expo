/**
 * services/api.ts
 * Base Axios HTTP client for the POS app.
 * Handles auth token injection, token refresh, and normalised error responses.
 */

import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { authStorage } from "./authStorage";
import { apiEvents } from "./apiEvents";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
  details?: Record<string, unknown>;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "https://api.my-pos.com/v1";
const TIMEOUT_MS = 15_000;

// ─── Axios instance ───────────────────────────────────────────────────────────

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT_MS,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ─── Request interceptor — inject auth token ──────────────────────────────────

const AUTH_FREE_PATHS = [
  "/api/auth/login",
  "/api/auth/login-mobile",
  "/api/auth/register",
  "/api/auth/refresh",
];

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const url = config.url ?? "";
    const isAuthFree = AUTH_FREE_PATHS.some((path) => url.includes(path));
    if (isAuthFree) {
      return config;
    }

    const token = await authStorage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response interceptor — refresh token on 401 ─────────────────────────────

export interface RefreshResult {
  accessToken: string;
  refreshToken: string;
}

/**
 * POST /api/auth/refresh
 * Backend membaca refresh token dari cookie `refresh_token` (bukan body) dan
 * mengirim refresh token baru lewat header `Set-Cookie`, jadi kita harus:
 * 1. Kirim token tersimpan sebagai header Cookie secara manual.
 * 2. Parse `Set-Cookie` dari response untuk mendapat refresh token baru.
 */
export async function performRefresh(): Promise<RefreshResult> {
  const storedRefreshToken = await authStorage.getRefreshToken();
  if (!storedRefreshToken) {
    throw new Error("Missing refresh token");
  }

  const response = await axios.post(
    `${BASE_URL}/api/auth/refresh`,
    {},
    {
      headers: { Cookie: `refresh_token=${storedRefreshToken}` },
      withCredentials: true,
      timeout: TIMEOUT_MS,
    },
  );

  const payload = response.data?.data ?? {};
  const accessToken: string | undefined = payload.access_token;
  if (!accessToken) {
    throw new Error("Refresh failed: access token missing");
  }

  const setCookie: string | string[] = response.headers?.["set-cookie"] ?? [];
  const cookieHeader = Array.isArray(setCookie) ? setCookie.join("; ") : setCookie;
  const matched = /(?:^|;\s*)refresh_token=([^;]+)/.exec(cookieHeader)?.[1];
  const refreshToken = matched
    ? (() => {
        try {
          return decodeURIComponent(matched);
        } catch {
          return matched;
        }
      })()
    : storedRefreshToken;

  await authStorage.setTokens(accessToken, refreshToken);
  return { accessToken, refreshToken };
}

let refreshPromise: Promise<RefreshResult> | null = null;

/**
 * Refresh token sekali saja (dedup) walau dipanggil paralel dari banyak request.
 */
export function refreshTokens(): Promise<RefreshResult> {
  if (!refreshPromise) {
    refreshPromise = performRefresh().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !AUTH_FREE_PATHS.some((path) => (originalRequest.url ?? "").includes(path))
    ) {
      originalRequest._retry = true;

      try {
        const { accessToken } = await refreshTokens();
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${accessToken}`,
        };
        return apiClient(originalRequest);
      } catch {
        // Refresh gagal — bersihkan sesi dan biarkan app shell redirect ke login
        await authStorage.clearTokens();
        apiEvents.emit("unauthorized");
        return Promise.reject(normaliseError(error));
      }
    }

    return Promise.reject(normaliseError(error));
  },
);

// ─── Error normaliser ─────────────────────────────────────────────────────────

function normaliseError(error: AxiosError): ApiError {
  if (error.response) {
    const body = error.response.data as Record<string, unknown>;
    return {
      statusCode: error.response.status,
      code: (body?.code as string) ?? "API_ERROR",
      message: (body?.message as string) ?? error.message,
      details: (body?.details as Record<string, unknown>) ?? undefined,
    };
  }

  if (error.request) {
    return {
      statusCode: 0,
      code: "NETWORK_ERROR",
      message: "No response from server. Check your connection.",
    };
  }

  return {
    statusCode: 0,
    code: "REQUEST_ERROR",
    message: error.message,
  };
}

// ─── Typed convenience wrappers ───────────────────────────────────────────────

export const api = {
  get<T>(url: string, config?: AxiosRequestConfig) {
    return apiClient.get<ApiResponse<T>>(url, config).then((r) => r.data);
  },
  post<T>(url: string, body?: unknown, config?: AxiosRequestConfig) {
    return apiClient
      .post<ApiResponse<T>>(url, body, config)
      .then((r) => r.data);
  },
  put<T>(url: string, body?: unknown, config?: AxiosRequestConfig) {
    return apiClient.put<ApiResponse<T>>(url, body, config).then((r) => r.data);
  },
  patch<T>(url: string, body?: unknown, config?: AxiosRequestConfig) {
    return apiClient
      .patch<ApiResponse<T>>(url, body, config)
      .then((r) => r.data);
  },
  delete<T>(url: string, config?: AxiosRequestConfig) {
    return apiClient.delete<ApiResponse<T>>(url, config).then((r) => r.data);
  },
};

export default apiClient;
