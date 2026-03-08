import axios from "axios";

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

// ── Response Interceptor — Auto Refresh ─────────────────────
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

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

    // ✅ If 401 and not already retrying and not on auth page
    if (status === 401 && !originalRequest._retry && !isAuthPage) {
      if (isRefreshing) {
        // ✅ Queue requests while refreshing
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // ✅ Try to refresh access token
        await api.post("/auth/refresh");
        processQueue(null);
        return api(originalRequest); // retry original request
      } catch (refreshError) {
        // ✅ Refresh failed — logout
        processQueue(refreshError);
        window.location.href = "/login";
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
