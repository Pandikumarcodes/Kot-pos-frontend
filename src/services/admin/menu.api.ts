// src/api/menuApi.ts
import api from "../apiClient";
import type { BaseListQuery, PaginationMeta } from "../../types/query";

// ── Types matching MongoDB schema exactly ──
export interface MenuItem {
  _id: string; // ✅ MongoDB _id
  ItemName: string;
  category: string;
  price: number;
  available: boolean;
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

export type MenuSort = "name" | "price" | "category";

export interface MenuQuery extends BaseListQuery {
  search?: string;
  category?: string;
  availability?: boolean;
  sort?: MenuSort;
}

export interface MenuResponse {
  menuItems: MenuItem[];
  pagination?: PaginationMeta;
}

// GET /admin/menuItems
export const getMenuItemsApi = (query?: MenuQuery, signal?: AbortSignal) => {
  if (!query && !signal) return api.get<MenuResponse>("/admin/menuItems");
  return api.get<MenuResponse>("/admin/menuItems", {
    params: query,
    signal,
  });
};

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
