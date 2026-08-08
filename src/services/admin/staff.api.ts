// src/api/userApi.ts
import api from "../apiClient";

export interface StaffUser {
  _id: string;
  username: string;
  role: string;
  status: string;
}

export type StaffSortField = "name" | "createdAt";
export type StaffStatus = "active" | "locked" | "accepted";

export interface StaffQuery {
  branchId?: string;
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: StaffStatus;
  sort?: StaffSortField;
  order?: "asc" | "desc";
}

export interface StaffPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface CreateUserPayload {
  username: string;
  password: string;
  role: string;
  status: string;
}

// GET /admin/users
export const getUsersApi = (query: StaffQuery = {}) =>
  api.get<{ users: StaffUser[]; pagination?: StaffPagination }>(
    "/admin/users",
    { params: query },
  );

// POST /admin/create-user
export const createUserApi = (data: CreateUserPayload, branchId?: string) =>
  api.post<{ message: string; user: StaffUser }>("/admin/create-user", data, {
    params: branchId ? { branchId } : undefined,
  });

// PUT /admin/update-role/:userId
export const updateUserRoleApi = (userId: string, role: string) =>
  api.put<{ message: string; user: StaffUser }>(
    `/admin/update-role/${userId}`,
    { role },
  );

// DELETE /admin/deleteUser/:userId
export const deleteUserApi = (userId: string) =>
  api.delete<{ message: string }>(`/admin/deleteUser/${userId}`);
