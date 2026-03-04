import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // your Express backend
  withCredentials: true, // sends cookies automatically
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request Interceptor ──────────────────────────────────────
// Runs before every request — good place to attach tokens later
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response Interceptor ─────────────────────────────────────
api.interceptors.response.use(
  (response) => response, // just pass through success

  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // Cookie expired or invalid → force back to login
      window.location.href = "/login";
    }

    if (status === 403) {
      // Logged in but not allowed → go to unauthorized
      window.location.href = "/unauthorized";
    }

    if (status === 500) {
      console.error("Server error:", error.response?.data?.error);
    }

    return Promise.reject(error);
  },
);

export default api;
