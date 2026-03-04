// src/api/userApi.ts
import api from "../apiClient";

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

// GET /admin/users
export const getUsersApi = () =>
  api.get<{ users: StaffUser[] }>("/admin/users");

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
