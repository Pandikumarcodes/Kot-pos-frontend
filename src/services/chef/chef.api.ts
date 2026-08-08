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

export type KitchenSortField = "createdAt" | "status";
export type KitchenSortOrder = "asc" | "desc";

export interface KitchenQuery {
  branchId?: string;
  page?: number;
  limit?: number;
  status?: Exclude<KotStatus, "served" | "cancelled">;
  sort?: KitchenSortField;
  order?: KitchenSortOrder;
}

export interface KitchenPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// ── API Calls ─────────────────────────────────────────────────

// GET /chef/kot — active kitchen orders with optional server-side query controls
export const getKotOrdersApi = (query: KitchenQuery = {}) =>
  api.get<{ KotOrders: Kot[]; pagination?: KitchenPagination }>("/chef/kot", {
    params: query,
  });

// GET /chef/kot/:orderId
export const getKotByIdApi = (orderId: string, branchId?: string) =>
  api.get<{ order: Kot }>(`/chef/kot/${orderId}`, {
    params: branchId ? { branchId } : undefined,
  });

// PUT /chef/kot/:orderId/start — mark preparing
export const startKotApi = (orderId: string, branchId?: string) =>
  api.put<{ message: string; order: Kot }>(`/chef/kot/${orderId}/start`, undefined, {
    params: branchId ? { branchId } : undefined,
  });

// PUT /chef/kot/:orderId/ready — mark ready
export const markKotReadyApi = (orderId: string, branchId?: string) =>
  api.put<{ message: string; order: Kot }>(`/chef/kot/${orderId}/ready`, undefined, {
    params: branchId ? { branchId } : undefined,
  });

export const serveKotApi = (orderId: string, branchId?: string) =>
  api.put<{ message: string; order: Kot }>(`/chef/kot/${orderId}/served`, undefined, {
    params: branchId ? { branchId } : undefined,
  });

// PUT /chef/kot/:orderId/cancel — cancel
export const cancelKotApi = (orderId: string, branchId?: string) =>
  api.put<{ message: string; order: Kot }>(`/chef/kot/${orderId}/cancel`, undefined, {
    params: branchId ? { branchId } : undefined,
  });
