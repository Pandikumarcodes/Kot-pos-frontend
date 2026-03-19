import api from "../apiClient";

export interface Branch {
  _id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  gstin: string;
  isActive: boolean;
  adminUser?: { _id: string; username: string; role: string };
  createdAt: string;
}

export interface BranchSummary {
  totalOrders: number;
  activeOrders: number;
  staffCount: number;
}

export interface CreateBranchPayload {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  gstin?: string;
}

// GET  /admin/branches
export const getBranchesApi = () =>
  api.get<{ branches: Branch[] }>("/admin/branches");

// POST /admin/branches
export const createBranchApi = (data: CreateBranchPayload) =>
  api.post<{ message: string; branch: Branch }>("/admin/branches", data);

// PUT  /admin/branches/:id
export const updateBranchApi = (
  id: string,
  data: Partial<CreateBranchPayload & { isActive: boolean }>,
) =>
  api.put<{ message: string; branch: Branch }>(`/admin/branches/${id}`, data);

// DELETE /admin/branches/:id  (soft-deactivate)
export const deactivateBranchApi = (id: string) =>
  api.delete<{ message: string; branch: Branch }>(`/admin/branches/${id}`);

// POST /admin/branches/:id/assign-staff
export const assignStaffToBranchApi = (branchId: string, userId: string) =>
  api.post<{ message: string }>(`/admin/branches/${branchId}/assign-staff`, {
    userId,
  });

// GET  /admin/branches/:id/staff
export const getBranchStaffApi = (branchId: string) =>
  api.get<{
    users: Array<{
      _id: string;
      username: string;
      role: string;
      status: string;
    }>;
  }>(`/admin/branches/${branchId}/staff`);

// GET  /admin/branches/:id/summary
export const getBranchSummaryApi = (branchId: string) =>
  api.get<BranchSummary>(`/admin/branches/${branchId}/summary`);
