import axios from "axios";

const BASE =
  import.meta.env.VITE_API_URL || "https://kot-pos-backend.onrender.com";

// Plain axios — NOT the authenticated apiClient
const publicApi = axios.create({ baseURL: BASE });

export interface PublicMenuItem {
  _id: string;
  ItemName: string;
  price: number;
  category: string;
}

export interface QrMenuResponse {
  table: {
    _id: string;
    tableNumber: number;
    capacity: number;
    status: string;
  };
  restaurant: {
    name: string;
    address: string;
    phone: string;
  };
  menu: Record<string, PublicMenuItem[]>; // category → items
  categories: string[];
}

export interface PlaceOrderPayload {
  customerName?: string;
  customerPhone?: string;
  items: { itemId: string; quantity: number }[];
}

export interface PlaceOrderResponse {
  message: string;
  orderId: string;
  totalAmount: number;
}

export interface OrderStatusResponse {
  status: string;
  message: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  orderedAt: string;
}

// GET /public/menu/:tableId
export const getPublicMenuApi = (tableId: string) =>
  publicApi.get<QrMenuResponse>(`/public/menu/${tableId}`);

// POST /public/order/:tableId
export const placePublicOrderApi = (tableId: string, data: PlaceOrderPayload) =>
  publicApi.post<PlaceOrderResponse>(`/public/order/${tableId}`, data);

// GET /public/order/:orderId/status
export const getOrderStatusApi = (orderId: string) =>
  publicApi.get<OrderStatusResponse>(`/public/order/${orderId}/status`);
