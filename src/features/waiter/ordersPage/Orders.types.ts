export type OrderStatus =
  | "pending"
  | "preparing"
  | "ready"
  | "delivered"
  | "cancelled";

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
  orderType: string;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  createdBy: string;
  createdAt: string;
}

export interface OrdersQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  from?: string;
  to?: string;
  tableNumber?: string;
}

export interface OrdersPresenterProps {
  orders: Order[];
  total: number;
  page: number;
  totalPages: number;
  loading: boolean;
  refreshing: boolean;

  // filters
  search: string;
  status: string;
  from: string;
  to: string;
  tableNum: string;
  showFilters: boolean;
  activeFilterCount: number;

  selectedOrder: Order | null;

  onSearchChange: (v: string) => void;
  onStatusChange: (v: string) => void;
  onFromChange: (v: string) => void;
  onToChange: (v: string) => void;
  onTableNumChange: (v: string) => void;
  onToggleFilters: () => void;
  onClearFilters: () => void;
  onSelectOrder: (o: Order | null) => void;
  onPageChange: (p: number) => void;
  onRefresh: () => void;
}
