// src/services/adminApi/Order.api.ts
import api from "../apiClient";
import type { PaginationMeta } from "../../hooks/usePagination";

export type OrderStatus =
  | "pending"
  | "preparing"
  | "ready"
  | "served"
  | "cancelled"
  | "all";

export interface OrderItemDetail {
  itemId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  orderType: "dine-in" | "takeaway";
  tableNumber?: number;
  tableId?: string;
  customerName: string;
  customerPhone?: string;
  createdBy: string;
  items: OrderItemDetail[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface OrdersQuery {
  search?: string;
  status?: string;
  from?: string;
  to?: string;
  tableNumber?: string;
  page?: number;
  limit?: number;
}

export interface OrdersResponse {
  data: Order[];
  pagination: PaginationMeta;
}

export const getOrdersApi = (params: OrdersQuery = {}) =>
  api.get<OrdersResponse>("/waiter/orders", { params });
