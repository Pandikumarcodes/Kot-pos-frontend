import type { BaseListQuery, PaginationMeta } from "../../../types/query";

export type OrderStatus =
  | "pending"
  | "sent_to_kitchen"
  | "served"
  | "cancelled";

export type OrderStatusFilter = OrderStatus | "all";
export type OrdersSort = "createdAt" | "status";

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  customerName: string;
  customerPhone?: string;
  tableNumber?: number;
  orderType?: string;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  createdBy: string;
  createdAt: string;
}

export interface OrdersQuery extends BaseListQuery {
  status?: OrderStatus;
  sort?: OrdersSort;
}

export interface OrdersResponse {
  myOrders: Order[];
  pagination?: PaginationMeta;
}

export interface OrdersPresenterProps {
  orders: Order[];
  pagination: PaginationMeta;
  loading: boolean;
  refreshing: boolean;
  error: string | null;

  // supported server filter
  status: OrderStatusFilter;
  showFilters: boolean;
  activeFilterCount: number;

  selectedOrder: Order | null;

  onStatusChange: (v: OrderStatusFilter) => void;
  onToggleFilters: () => void;
  onClearFilters: () => void;
  onSelectOrder: (o: Order | null) => void;
  onPageChange: (p: number) => void;
  onRefresh: () => void;
  onRetry: () => void;
}
