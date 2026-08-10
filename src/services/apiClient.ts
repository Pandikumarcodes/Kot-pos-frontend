import axios from "axios";
import { globalToast } from "../services/globalToast";

const BASE =
  import.meta.env.VITE_API_URL || "https://kot-pos-backend.onrender.com";

const api = axios.create({
  baseURL: `${BASE}/api/v1`,
  withCredentials: true,
});

// Only routes that actually install the backend branchScope middleware belong
// here. Global administration routes such as /admin/branches are deliberately
// excluded.
const OPERATIONAL_BRANCH_ROUTE_PREFIXES = [
  "/admin/customers",
  "/admin/menu",
  "/admin/menuItems",
  "/admin/menu-item",
  "/admin/delete",
  "/admin/reports",
  "/admin/settings",
  "/admin/inventory",
  "/admin/tables",
  "/admin/users",
  "/admin/create-user",
  "/admin/update-role",
  "/admin/deleteUser",
  "/cashier",
  "/chef",
  "/waiter",
  "/ai",
] as const;

export function isOperationalBranchRequest(url?: string): boolean {
  if (!url) return false;

  const pathname = new URL(url, "http://localhost").pathname.replace(
    /^\/api\/v1/,
    "",
  );

  return OPERATIONAL_BRANCH_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

// ── Request Interceptor ──────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response Interceptor ─────────────────────────────────────
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

// ── 429 deduplication ────────────────────────────────────────
let rateLimitToastShown = false;
let rateLimitRetryTimer: ReturnType<typeof setTimeout> | null = null;

// Queue of requests blocked by rate limit — auto-retried after window resets
const rateLimitQueue: Array<() => void> = [];

function flushRateLimitQueue() {
  const pending = rateLimitQueue.splice(0);
  pending.forEach((retry) => retry());
}

const processQueue = (error: unknown) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(null);
  });
  failedQueue = [];
};

interface RefreshDecision {
  status?: number;
  url?: string;
  isRetry: boolean;
  isAuthPage: boolean;
  skipRefresh: boolean;
}

export function shouldAttemptTokenRefresh({
  status,
  url,
  isRetry,
  isAuthPage,
  skipRefresh,
}: RefreshDecision): boolean {
  const requestPath = url?.split("?")[0].replace(/\/+$/, "");
  const isRefreshRequest = requestPath?.endsWith("/auth/refresh") ?? false;

  return (
    status === 401 &&
    !isRetry &&
    !isAuthPage &&
    !skipRefresh &&
    !isRefreshRequest
  );
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const currentPath = window.location.pathname;

    const isAuthPage =
      currentPath === "/login" ||
      currentPath === "/signin" ||
      currentPath === "/signup";

    // ── 429 — Too Many Requests ───────────────────────────────
    if (status === 429) {
      const retryAfter: number =
        error.response?.data?.retryAfter ||
        parseInt(error.response?.headers?.["retry-after"] || "10", 10);

      if (!rateLimitToastShown) {
        rateLimitToastShown = true;

        const msg =
          error.response?.data?.error ||
          "Too many requests. Please wait before refreshing.";

        globalToast.warning(`⏳ ${msg} Retrying in ${retryAfter}s...`);

        if (rateLimitRetryTimer) clearTimeout(rateLimitRetryTimer);
        rateLimitRetryTimer = setTimeout(() => {
          rateLimitToastShown = false;
          rateLimitRetryTimer = null;
          globalToast.info("✅ Rate limit cleared. Retrying...");
          flushRateLimitQueue();
        }, retryAfter * 1000);
      }

      return new Promise((resolve, reject) => {
        rateLimitQueue.push(async () => {
          try {
            const retried = await api(originalRequest);
            resolve(retried);
          } catch (retryError) {
            reject(retryError);
          }
        });
      });
    }

    const skipRefresh = originalRequest.headers?.["x-skip-refresh"];

    // ── 401 — Auto token refresh ──────────────────────────────
    if (
      shouldAttemptTokenRefresh({
        status,
        url: originalRequest.url,
        isRetry: Boolean(originalRequest._retry),
        isAuthPage,
        skipRefresh: Boolean(skipRefresh),
      })
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post("/auth/refresh");
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        if (!isAuthPage) window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (status === 500) {
      console.error("Server error:", error.response?.data?.error);
    }

    return Promise.reject(error);
  },
);

export default api;
