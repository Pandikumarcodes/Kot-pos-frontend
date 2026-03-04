// src/services/waiterApi/Table.api.ts
import api from "../apiClient";

export type TableStatus =
  | "available"
  | "occupied"
  | "billing"
  | "reserved"
  | "cleaning";

export interface Table {
  _id: string;
  tableNumber: number;
  capacity: number;
  status: TableStatus;
  currentOrderId?: string;
  waiterName?: string;
  orderAmount?: number;
  sessionStart?: string;
}

// ── Admin routes ─────────────────────────────────────────────

// GET /admin/tables
export const getTablesApi = () => api.get<{ tables: Table[] }>("/admin/tables");

// GET /admin/tables/:id
export const getTableByIdApi = (id: string) =>
  api.get<{ table: Table }>(`/admin/tables/${id}`);

// POST /admin/tables
export const createTableApi = (data: {
  tableNumber: number;
  capacity: number;
}) => api.post<{ message: string; table: Table }>("/admin/tables", data);

// PUT /admin/tables/:id
export const updateTableApi = (
  id: string,
  data: { capacity?: number; status?: TableStatus },
) => api.put<{ message: string; table: Table }>(`/admin/tables/${id}`, data);

// DELETE /admin/tables/:id
export const deleteTableApi = (id: string) =>
  api.delete<{ message: string }>(`/admin/tables/${id}`);

// ── Waiter routes ────────────────────────────────────────────

// POST /waiter/allocate/:tableId
export const allocateTableApi = (
  tableId: string,
  data: { name: string; phone: string },
) =>
  api.post<{ message: string; table: Table }>(
    `/waiter/allocate/${tableId}`,
    data,
  );

// PUT /waiter/free/:tableId
export const freeTableApi = (tableId: string) =>
  api.put<{ message: string; table: Table }>(`/waiter/free/${tableId}`);
