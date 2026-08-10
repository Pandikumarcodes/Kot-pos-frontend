import api from "../apiClient";
import type { BaseListQuery, PaginationMeta } from "../../types/query";

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

export interface CreateCustomerPayload {
  name: string;
  phone: string;
  email?: string;
  address?: string;
}

export type CustomersSort = "name" | "createdAt";

export interface CustomersQuery extends BaseListQuery {
  search?: string;
  sort?: CustomersSort;
}

export interface CustomersResponse {
  customers: Customer[];
  pagination?: PaginationMeta;
}

// GET /admin/customers
export const getCustomersApi = (
  query?: CustomersQuery,
  signal?: AbortSignal,
) => {
  if (!query && !signal) return api.get<CustomersResponse>("/admin/customers");
  return api.get<CustomersResponse>("/admin/customers", {
    params: query,
    signal,
  });
};

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
