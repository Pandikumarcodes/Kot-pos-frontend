import api from "../apiClient";

export type OrderStatus =
  | "pending"
  | "preparing"
  | "ready"
  | "delivered"
  | "cancelled";

export interface OrderItemDetail {
  itemId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  orderType: "dine-in" | "takeaway";
  tableNumber?: number;
  tableId?: string;
  customerName: string;
  customerPhone?: string;
  createdBy: string;
  items: OrderItemDetail[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  totalPages: number;
}

export interface OrdersQuery {
  search?: string;
  status?: string;
  from?: string;
  to?: string;
  tableNumber?: string;
  page?: number;
  limit?: number;
}

export const getOrdersApi = (params: OrdersQuery = {}) =>
  api.get<OrdersResponse>("/waiter/orders", { params });
