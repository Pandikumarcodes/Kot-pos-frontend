// src/services/chefApi/chef.api.ts
import api from "../apiClient";

// ── Types ─────────────────────────────────────────────────────
export type KotStatus =
  | "pending"
  | "preparing"
  | "ready"
  | "served"
  | "cancelled";
export type OrderType = "dine-in" | "takeaway";

export interface KotItem {
  itemId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Kot {
  _id: string;
  orderType: OrderType;
  tableNumber?: number;
  tableId?: string;
  customerName?: string;
  customerPhone?: string;
  createdBy: string;
  items: KotItem[];
  totalAmount: number;
  status: KotStatus;
  createdAt: string;
  updatedAt: string;
}

// ── API Calls ─────────────────────────────────────────────────

// GET /chef/kot — all pending orders
export const getKotOrdersApi = () => api.get<{ KotOrders: Kot[] }>("/chef/kot");

// GET /chef/kot/:orderId
export const getKotByIdApi = (orderId: string) =>
  api.get<{ order: Kot }>(`/chef/kot/${orderId}`);

// PUT /chef/kot/:orderId/start — mark preparing
export const startKotApi = (orderId: string) =>
  api.put<{ message: string; order: Kot }>(`/chef/kot/${orderId}/start`);

// PUT /chef/kot/:orderId/ready — mark ready
export const markKotReadyApi = (orderId: string) =>
  api.put<{ message: string; order: Kot }>(`/chef/kot/${orderId}/ready`);

// PUT /chef/kot/:orderId/cancel — cancel
export const cancelKotApi = (orderId: string) =>
  api.put<{ message: string; order: Kot }>(`/chef/kot/${orderId}/cancel`);
