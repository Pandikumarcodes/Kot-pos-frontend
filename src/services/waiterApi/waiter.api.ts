// src/services/waiterApi/waiter.api.ts
import api from "../apiClient";

// ── Types ────────────────────────────────────────────────────

export type OrderStatus =
  | "pending"
  | "sent_to_kitchen"
  | "served"
  | "cancelled";

export interface OrderItem {
  itemId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  tableId: string;
  tableNumber: number;
  customerName: string;
  createdBy: { _id: string; username: string };
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
}

export interface CreateOrderPayload {
  tableId: string;
  tableNumber?: number;
  customerName?: string;
  items: {
    itemId: string; // ✅ must match backend field name
    quantity: number;
  }[];
}

// ── API calls ────────────────────────────────────────────────

// POST /waiter/orders — create new order
export const createOrderApi = (data: CreateOrderPayload) =>
  api.post<{ message: string; order: Order }>("/waiter/orders", data);

// GET /waiter/orders — get all orders
export const getOrdersApi = () =>
  api.get<{ myOrders: Order[] }>("/waiter/orders");

// GET /waiter/orders/:orderId — get single order
export const getOrderByIdApi = (orderId: string) =>
  api.get<{ order: Order }>(`/waiter/orders/${orderId}`);

// PUT /waiter/orders/:orderId/send — send to kitchen
export const sendToKitchenApi = (orderId: string) =>
  api.put<{ message: string; order: Order }>(`/waiter/orders/${orderId}/send`);

// PUT /waiter/orders/:orderId/served — mark as served
export const markServedApi = (orderId: string) =>
  api.put<{ message: string; order: Order }>(
    `/waiter/orders/${orderId}/served`,
  );

// PUT /waiter/orders/:orderId/cancel — cancel order
export const cancelOrderApi = (orderId: string) =>
  api.put<{ message: string; order: Order }>(
    `/waiter/orders/${orderId}/cancel`,
  );
