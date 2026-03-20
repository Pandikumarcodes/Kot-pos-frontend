// src/services/waiterApi/waiter.api.ts
import api from "../apiClient";
export type {
  Order,
  OrdersQuery,
} from "../../features/waiter/ordersPage/Order.types";
import type {
  Order,
  OrdersQuery,
} from "../../features/waiter/ordersPage/Order.types";

export interface MenuItem {
  _id: string;
  ItemName: string;
  price: number;
  category: string;
  description?: string;
  image?: string;
  available: boolean;
}

export interface TableOrderItem {
  _id: string;
  itemId: string;
  name: string;
  quantity: number;
  price: number;
  orderId: string;
  round: number;
  status: string;
}

export interface TableOrdersResponse {
  orders: Order[];
  allItems: TableOrderItem[];
  grandTotal: number;
}

export interface CreateOrderPayload {
  tableId: string;
  tableNumber?: number;
  customerName?: string;
  items: { itemId: string; quantity: number }[];
}

// ── Menu ─────────────────────────────────────────────────────
export const getMenuApi = (params?: { category?: string; search?: string }) =>
  api.get<{ menuItems: MenuItem[] }>("/waiter/menu", { params });

// ── Orders ───────────────────────────────────────────────────
export const createOrderApi = (data: CreateOrderPayload) =>
  api.post<{ message: string; order: Order }>("/waiter/orders", data);

export const getOrdersApi = (query?: OrdersQuery) =>
  api.get<{ myOrders: Order[] }>("/waiter/orders", { params: query });

export const getTableOrdersApi = (tableId: string) =>
  api.get<TableOrdersResponse>(`/waiter/orders/table/${tableId}`);

export const getOrderByIdApi = (orderId: string) =>
  api.get<{ order: Order }>(`/waiter/orders/${orderId}`);

export const sendToKitchenApi = (orderId: string) =>
  api.put<{ message: string; order: Order }>(`/waiter/orders/${orderId}/send`);

export const markServedApi = (orderId: string) =>
  api.put<{ message: string; order: Order }>(
    `/waiter/orders/${orderId}/served`,
  );

export const cancelOrderApi = (orderId: string) =>
  api.put<{ message: string; order: Order }>(
    `/waiter/orders/${orderId}/cancel`,
  );

// Send all rounds to cashier as a pending bill
export const sendToCashierApi = (
  tableId: string,
  data: { customerName: string; customerPhone: string; tableNumber?: number },
) =>
  api.post<{ message: string; bill: object }>(
    `/waiter/orders/table/${tableId}/send-to-cashier`,
    data,
  );
