import type {
  MenuItem,
  TableOrderItem,
} from "../../../services/waiterApi/waiter.api";

export type { MenuItem, TableOrderItem };

export interface WaiterCartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export type WaiterOrderView = "history" | "menu";

export interface WaiterOrderPresenterProps {
  // info
  customerName: string;
  tableNumber?: number;
  roundCount: number;

  // view
  view: WaiterOrderView;
  onSwitchToMenu: () => void;
  onSwitchToHistory: () => void;
  onBack: () => void;

  // history
  historyLoading: boolean;
  allItems: TableOrderItem[];
  grandTotal: number;

  // menu
  menuLoading: boolean;
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  filteredMenu: MenuItem[];
  search: string;
  onSearchChange: (v: string) => void;

  // cart
  orderItems: WaiterCartItem[];
  cartTotal: number;
  onAddItem: (item: MenuItem) => void;
  onUpdateQty: (id: string, qty: number) => void;
  showOrderPanel: boolean;
  onToggleOrderPanel: (v: boolean) => void;

  // actions
  sendingKot: boolean;
  onSendKot: () => void;
  sendingToCashier: boolean;
  onSendToCashier: () => void;
}
