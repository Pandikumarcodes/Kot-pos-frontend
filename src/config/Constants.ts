// ─────────────────────────────────────────────
// All fixed values used across the app.
// Change here → updates everywhere.
// ─────────────────────────────────────────────

// App info
export const APP_NAME = "KOT POS";
export const APP_VERSION = "1.0.0";

// Order statuses
export const ORDER_STATUS = {
  PENDING: "pending",
  SENT_TO_KITCHEN: "sent_to_kitchen",
  SERVED: "served",
  CANCELLED: "cancelled",
} as const;

// Table statuses
export const TABLE_STATUS = {
  AVAILABLE: "available",
  OCCUPIED: "occupied",
  BILLING: "billing",
  RESERVED: "reserved",
  CLEANING: "cleaning",
} as const;

// Payment methods
export const PAYMENT_METHODS = {
  CASH: "cash",
  CARD: "card",
  UPI: "upi",
} as const;

// Payment statuses
export const PAYMENT_STATUS = {
  PAID: "paid",
  PENDING: "pending",
  DUE: "due",
} as const;

// User roles
export const USER_ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  WAITER: "waiter",
  CHEF: "chef",
  CASHIER: "cashier",
} as const;

// Menu categories — must match backend model enum exactly
export const MENU_CATEGORIES = [
  { key: "starter", label: "Starter" },
  { key: "main_course", label: "Main Course" },
  { key: "dessert", label: "Dessert" },
  { key: "beverage", label: "Beverage" },
  { key: "snacks", label: "Snacks" },
  { key: "side_dish", label: "Side Dish" },
  { key: "bread", label: "Bread" },
  { key: "rice", label: "Rice" },
  { key: "combo", label: "Combo" },
  { key: "special", label: "Special" },
] as const;

// Tax rate (GST)
export const TAX_RATE = 0.05; // 5%

// Currency
export const CURRENCY_SYMBOL = "₹";
