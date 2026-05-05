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
  "/api/login",
  "/api/auth/login",
  "/api/pin",
  "/api/auth/pin",
  "/api/register",
  "/api/auth/register",
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

const ENABLE_REFRESH_TOKEN = false;

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}[] = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
}

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (!ENABLE_REFRESH_TOKEN) {
        await authStorage.clearTokens();
        apiEvents.emit("unauthorized");
        return Promise.reject(normaliseError(error));
      }

      if (isRefreshing) {
        // Queue the request until the token refresh finishes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${token}`,
          };
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await authStorage.getRefreshToken();
        if (!refreshToken) {
          throw new Error("Missing refresh token");
        }
        const { data } = await axios.post<{ accessToken: string }>(
          `${BASE_URL}/auth/refresh`,
          { refreshToken },
        );

        const newToken = data.accessToken;
        await authStorage.setTokens(newToken, refreshToken);
        processQueue(null, newToken);

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newToken}`,
        };
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Clear tokens and redirect to login
        await authStorage.clearTokens();
        // Emit an event so the app shell can navigate to login
        // (avoids circular dependency with navigation)
        apiEvents.emit("unauthorized");
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
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
