// src/services/apiClient.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true, // ✅ sends cookies automatically
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request Interceptor ──────────────────────────────────────
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

// ── Response Interceptor ─────────────────────────────────────
api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // ✅ Only redirect on 401 — token expired/missing
      // Clear cookie and go to login
      window.location.href = "/login";
    }

    // ❌ REMOVED 403 redirect — was causing infinite loop
    // 403 = logged in but wrong role → let the page handle it gracefully
    // Never redirect on 403 — just reject the promise

    if (status === 500) {
      console.error("Server error:", error.response?.data?.error);
    }

    return Promise.reject(error);
  },
);

export default api;
