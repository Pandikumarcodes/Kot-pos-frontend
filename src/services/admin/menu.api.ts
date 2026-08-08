// src/api/menuApi.ts
import api from "../apiClient";

// ── Types matching MongoDB schema exactly ──
export interface MenuItem {
  _id: string; // ✅ MongoDB _id
  ItemName: string;
  category: string;
  price: number;
  available: boolean;
}

export type MenuSortField = "name" | "price" | "category";

export interface MenuQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  availability?: boolean;
  sort?: MenuSortField;
  order?: "asc" | "desc";
}

export interface MenuPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface CreateMenuPayload {
  ItemName: string;
  category: string;
  price: number;
  available: boolean;
}

export interface UpdateMenuPayload {
  price?: number;
  available?: boolean;
}

// GET /admin/menuItems
export const getMenuItemsApi = (query: MenuQuery = {}) =>
  api.get<{ menuItems: MenuItem[]; pagination?: MenuPagination }>(
    "/admin/menuItems",
    { params: query },
  );

// POST /admin/menu
export const createMenuItemApi = (data: CreateMenuPayload) =>
  api.post<{ message: string; menuItem: MenuItem }>("/admin/menu", data);

// PUT /admin/menu-item/:ItemId
export const updateMenuItemApi = (ItemId: string, data: UpdateMenuPayload) =>
  api.put<{ message: string; menuItem: MenuItem }>(
    `/admin/menu-item/${ItemId}`,
    data,
  );

// DELETE /admin/delete/:ItemId
export const deleteMenuItemApi = (ItemId: string) =>
  api.delete<{ message: string }>(`/admin/delete/${ItemId}`);
