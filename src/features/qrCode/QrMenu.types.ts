// src/pages/qr/QrMenu.types.ts
import type {
  QrMenuResponse,
  PublicMenuItem,
} from "../../services/qrMenuApi.api";

export type { QrMenuResponse, PublicMenuItem };

export type Step = "menu" | "checkout" | "confirmed";

export interface CartItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
}

// ── Category display labels ───────────────────────────────────
export const CAT_LABELS: Record<string, string> = {
  starter: "Starters",
  main_course: "Main Course",
  bread: "Breads",
  rice: "Rice",
  beverage: "Beverages",
  snacks: "Snacks",
  side_dish: "Sides",
  dessert: "Desserts",
  combo: "Combos",
  special: "Specials",
};

export const catLabel = (key: string) => CAT_LABELS[key] ?? key;

export const STATUS_CONFIG: Record<string, { color: string; bg: string }> = {
  pending: { color: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200" },
  preparing: { color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
  ready: { color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
  served: { color: "text-gray-700", bg: "bg-gray-50 border-gray-200" },
  cancelled: { color: "text-red-700", bg: "bg-red-50 border-red-200" },
};

// ── Presenter Props ───────────────────────────────────────────
export interface QrMenuPresenterProps {
  // Page-level
  loading: boolean;
  error: string | null;
  step: Step;
  menuData: QrMenuResponse | null;

  // Menu screen
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  getQty: (itemId: string) => number;
  onAddItem: (item: PublicMenuItem) => void;
  onRemoveItem: (itemId: string) => void;
  onProceedToCheckout: () => void;

  // Checkout screen
  customerName: string;
  customerPhone: string;
  onCustomerNameChange: (v: string) => void;
  onCustomerPhoneChange: (v: string) => void;
  placing: boolean;
  orderError: string;
  onPlaceOrder: () => void;
  onBackToMenu: () => void;

  // Confirmed screen
  orderId: string | null;
  orderStatus: string;
  statusMessage: string;
  onOrderMore: () => void;
}
