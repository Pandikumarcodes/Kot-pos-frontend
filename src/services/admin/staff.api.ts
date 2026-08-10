// src/api/userApi.ts
import api from "../apiClient";
import type { BaseListQuery, PaginationMeta } from "../../types/query";

export interface StaffUser {
  _id: string;
  username: string;
  role: string;
  status: string;
}

export interface CreateUserPayload {
  username: string;
  password: string;
  role: string;
  status: string;
}

export type StaffRole = "admin" | "waiter" | "chef" | "cashier" | "manager";
export type StaffStatus = "active" | "locked";
export type StaffSort = "name" | "createdAt";

export interface StaffQuery extends BaseListQuery {
  search?: string;
  role?: StaffRole;
  status?: StaffStatus;
  sort?: StaffSort;
}

export interface StaffResponse {
  users: StaffUser[];
  pagination?: PaginationMeta;
}

// GET /admin/users
export const getUsersApi = (query?: StaffQuery, signal?: AbortSignal) => {
  if (!query && !signal) return api.get<StaffResponse>("/admin/users");
  return api.get<StaffResponse>("/admin/users", {
    ...(query && { params: query }),
    ...(signal && { signal }),
  });
};

// POST /admin/create-user
export const createUserApi = (data: CreateUserPayload) =>
  api.post<{ message: string; user: StaffUser }>("/admin/create-user", data);

// PUT /admin/update-role/:userId
export const updateUserRoleApi = (userId: string, role: string) =>
  api.put<{ message: string; user: StaffUser }>(
    `/admin/update-role/${userId}`,
    { role },
  );

// DELETE /admin/deleteUser/:userId
export const deleteUserApi = (userId: string) =>
  api.delete<{ message: string }>(`/admin/deleteUser/${userId}`);
