import axios from "axios";
import { globalToast } from "../services/globalToast";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || "https://kot-pos-backend.onrender.com",
  withCredentials: true,
});

// ── Request Interceptor ──────────────────────────────────────
api.interceptors.request.use(
  (config) => config,
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
      // Read how long to wait from backend (in seconds)
      const retryAfter: number =
        error.response?.data?.retryAfter ||
        parseInt(error.response?.headers?.["retry-after"] || "10", 10);

      // Show toast once with countdown — suppress duplicates
      if (!rateLimitToastShown) {
        rateLimitToastShown = true;

        const msg =
          error.response?.data?.error ||
          "Too many requests. Please wait before refreshing.";

        // Show initial warning
        globalToast.warning(`⏳ ${msg} Retrying in ${retryAfter}s...`);

        // Auto-retry all queued requests after the window resets
        if (rateLimitRetryTimer) clearTimeout(rateLimitRetryTimer);
        rateLimitRetryTimer = setTimeout(() => {
          rateLimitToastShown = false;
          rateLimitRetryTimer = null;
          globalToast.info("✅ Rate limit cleared. Retrying...");
          flushRateLimitQueue();
        }, retryAfter * 1000);
      }

      // Queue this request to be auto-retried after the window resets
      // Returns a Promise that resolves when the retry completes
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
      status === 401 &&
      !originalRequest._retry &&
      !isAuthPage &&
      !skipRefresh
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
