import api from "./apiClient";
import type { AuthUser } from "../Store/Slices/authSlice";

interface LoginPayload {
  email: string;
  password: string;
}

interface AuthResponse {
  user: AuthUser; // { id, name, email, role }
  message: string;
}

// POST /auth/login
export const loginApi = (data: LoginPayload) =>
  api.post<AuthResponse>("/auth/login", data);

// GET /auth/me — validate existing cookie on app boot
export const getMeApi = () => api.get<AuthResponse>("/auth/me");

// POST /auth/logout
export const logoutApi = () => api.post("/auth/logout");
