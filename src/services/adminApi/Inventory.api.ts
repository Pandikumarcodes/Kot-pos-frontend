import api from "../apiClient";

// ── Types ─────────────────────────────────────────────────────
export type InventoryUnit =
  | "kg"
  | "g"
  | "l"
  | "ml"
  | "pcs"
  | "dozen"
  | "box"
  | "packet";
export type InventoryCategory =
  | "raw_material"
  | "beverage"
  | "packaging"
  | "dairy"
  | "produce"
  | "other";

export interface InventoryItem {
  _id: string;
  branchId: string;
  menuItemId?: { _id: string; ItemName: string; available: boolean } | null;
  name: string;
  unit: InventoryUnit;
  currentStock: number;
  lowStockThreshold: number;
  category: InventoryCategory;
  costPerUnit: number;
  supplier: string;
  isActive: boolean;
  isLowStock: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StockLog {
  _id: string;
  inventoryId: string;
  type: "restock" | "kot_deduct" | "adjustment" | "return";
  quantity: number;
  stockBefore: number;
  stockAfter: number;
  note: string;
  doneBy: { _id: string; username: string; role: string };
  createdAt: string;
}

export interface CreateInventoryPayload {
  name: string;
  unit?: InventoryUnit;
  currentStock?: number;
  lowStockThreshold?: number;
  category?: InventoryCategory;
  costPerUnit?: number;
  supplier?: string;
  menuItemId?: string;
}

export interface InventoryQuery {
  lowStock?: boolean;
  category?: InventoryCategory;
  search?: string;
}

// ── API calls ─────────────────────────────────────────────────

// GET /admin/inventory
export const getInventoryApi = (query: InventoryQuery = {}) =>
  api.get<{ items: InventoryItem[]; lowStockCount: number }>(
    "/admin/inventory",
    { params: query },
  );

// POST /admin/inventory
export const createInventoryApi = (data: CreateInventoryPayload) =>
  api.post<{ message: string; item: InventoryItem }>("/admin/inventory", data);

// PUT /admin/inventory/:id
export const updateInventoryApi = (
  id: string,
  data: Partial<CreateInventoryPayload>,
) =>
  api.put<{ message: string; item: InventoryItem }>(
    `/admin/inventory/${id}`,
    data,
  );

// POST /admin/inventory/:id/restock
export const restockApi = (id: string, quantity: number, note?: string) =>
  api.post<{ message: string; item: InventoryItem }>(
    `/admin/inventory/${id}/restock`,
    { quantity, note },
  );

// POST /admin/inventory/:id/adjust
export const adjustStockApi = (id: string, quantity: number, note?: string) =>
  api.post<{ message: string; item: InventoryItem }>(
    `/admin/inventory/${id}/adjust`,
    { quantity, note },
  );

// GET /admin/inventory/:id/logs
export const getStockLogsApi = (id: string) =>
  api.get<{ logs: StockLog[] }>(`/admin/inventory/${id}/logs`);

// DELETE /admin/inventory/:id
export const deleteInventoryApi = (id: string) =>
  api.delete<{ message: string }>(`/admin/inventory/${id}`);
