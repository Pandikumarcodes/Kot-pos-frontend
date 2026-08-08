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
  currentCustomer?: {
    name: string;
    phone: string;
  };
  currentOrderId?: string;
  waiterName?: string;
  orderAmount?: number;
  sessionStart?: string;
}

// ── Table reads — accessible by waiter role ──────────────────

// GET /admin/tables — waiter role is allowed by adminTablerouter
export const getTablesApi = (branchId?: string) =>
  api.get<{ tables: Table[] }>("/admin/tables", {
    params: branchId ? { branchId } : undefined,
  });

// GET /admin/tables/:id
export const getTableByIdApi = (id: string, branchId?: string) =>
  api.get<{ table: Table }>(`/admin/tables/${id}`, {
    params: branchId ? { branchId } : undefined,
  });

// ── Admin-only table writes ───────────────────────────────────

// POST /admin/tables
export const createTableApi = (data: {
  tableNumber: number;
  capacity: number;
}, branchId?: string) =>
  api.post<{ message: string; table: Table }>("/admin/tables", data, {
    params: branchId ? { branchId } : undefined,
  });

// PUT /admin/tables/:id
export const updateTableApi = (
  id: string,
  data: { capacity?: number; status?: TableStatus },
  branchId?: string,
) => api.put<{ message: string; table: Table }>(`/admin/tables/${id}`, data, {
  params: branchId ? { branchId } : undefined,
});

// DELETE /admin/tables/:id
export const deleteTableApi = (id: string, branchId?: string) =>
  api.delete<{ message: string }>(`/admin/tables/${id}`, {
    params: branchId ? { branchId } : undefined,
  });

// ── Waiter actions ───────────────────────────────────────────

// POST /waiter/allocate/:tableId
export const allocateTableApi = (
  tableId: string,
  data: { name: string; phone: string },
  branchId?: string,
) =>
  api.post<{ message: string; table: Table }>(
    `/waiter/allocate/${tableId}`,
    data,
    { params: branchId ? { branchId } : undefined },
  );

// PUT /waiter/free/:tableId
export const freeTableApi = (tableId: string, branchId?: string) =>
  api.put<{ message: string; table: Table }>(`/waiter/free/${tableId}`, undefined, {
    params: branchId ? { branchId } : undefined,
  });
