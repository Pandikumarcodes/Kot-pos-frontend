import api from "../apiClient";

export interface Customer {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  totalOrders: number;
  totalSpent: number;
  lastVisit: string;
  createdAt: string;
}

export type CustomerSortField = "name" | "createdAt";

export interface CustomerQuery {
  page?: number;
  limit?: number;
  search?: string;
  sort?: CustomerSortField;
  order?: "asc" | "desc";
}

export interface CustomerPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface CreateCustomerPayload {
  name: string;
  phone: string;
  email?: string;
  address?: string;
}

// GET /admin/customers
export const getCustomersApi = (query: CustomerQuery = {}) =>
  api.get<{ customers: Customer[]; pagination?: CustomerPagination }>(
    "/admin/customers",
    { params: query },
  );

// GET /admin/customers/:id
export const getCustomerByIdApi = (id: string) =>
  api.get<{ customer: Customer }>(`/admin/customers/${id}`);

// POST /admin/customers
export const createCustomerApi = (data: CreateCustomerPayload) =>
  api.post<{ message: string; customer: Customer }>("/admin/customers", data);

// PUT /admin/customers/:id
export const updateCustomerApi = (
  id: string,
  data: Partial<CreateCustomerPayload>,
) =>
  api.put<{ message: string; customer: Customer }>(
    `/admin/customers/${id}`,
    data,
  );

// DELETE /admin/customers/:id
export const deleteCustomerApi = (id: string) =>
  api.delete<{ message: string }>(`/admin/customers/${id}`);
