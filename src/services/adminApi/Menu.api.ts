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
export const getMenuItemsApi = () =>
  api.get<{ menuItems: MenuItem[] }>("/admin/menuItems");

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
