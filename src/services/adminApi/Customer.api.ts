// src/services/adminApi/Customer.api.ts
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

export interface CreateCustomerPayload {
  name: string;
  phone: string;
  email?: string;
  address?: string;
}

// GET /admin/customers
export const getCustomersApi = () =>
  api.get<{ customers: Customer[] }>("/admin/customers");

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
