// src/pages/admin/inventory/Inventory.types.ts
import type {
  InventoryItem,
  StockLog,
  CreateInventoryPayload,
  InventoryUnit,
  InventoryCategory,
} from "../../../services/adminApi/Inventory.api";

export type {
  InventoryItem,
  StockLog,
  CreateInventoryPayload,
  InventoryUnit,
  InventoryCategory,
};

// ── Constants ─────────────────────────────────────────────────
export const UNITS: InventoryUnit[] = [
  "kg",
  "g",
  "l",
  "ml",
  "pcs",
  "dozen",
  "box",
  "packet",
];

export const CATEGORIES: { value: InventoryCategory; label: string }[] = [
  { value: "raw_material", label: "Raw Material" },
  { value: "dairy", label: "Dairy" },
  { value: "produce", label: "Produce" },
  { value: "beverage", label: "Beverage" },
  { value: "packaging", label: "Packaging" },
  { value: "other", label: "Other" },
];

export const LOG_TYPE_CONFIG = {
  restock: { label: "Restock", color: "text-emerald-700", bg: "bg-emerald-50" },
  kot_deduct: { label: "KOT", color: "text-red-700", bg: "bg-red-50" },
  adjustment: { label: "Adjustment", color: "text-blue-700", bg: "bg-blue-50" },
  return: { label: "Return", color: "text-purple-700", bg: "bg-purple-50" },
} as const;

export const EMPTY_FORM: CreateInventoryPayload = {
  name: "",
  unit: "pcs",
  currentStock: 0,
  lowStockThreshold: 10,
  category: "other",
  costPerUnit: 0,
  supplier: "",
  menuItemId: "",
};

// ── Presenter Props ───────────────────────────────────────────
export interface InventoryPresenterProps {
  // List state
  items: InventoryItem[];
  loading: boolean;
  lowStockCount: number;

  // Filters
  search: string;
  filterLow: boolean;
  filterCat: InventoryCategory | "";
  onSearchChange: (v: string) => void;
  onFilterLowToggle: () => void;
  onFilterCatChange: (v: InventoryCategory | "") => void;
  onRefresh: () => void;

  // Create / Edit modal
  showModal: boolean;
  editingItem: InventoryItem | null;
  formData: CreateInventoryPayload;
  saving: boolean;
  onOpenCreate: () => void;
  onOpenEdit: (item: InventoryItem) => void;
  onCloseModal: () => void;
  onFormChange: <K extends keyof CreateInventoryPayload>(
    key: K,
    value: CreateInventoryPayload[K],
  ) => void;
  onSave: (e: React.FormEvent) => void;

  // Restock modal
  restockItem: InventoryItem | null;
  restockQty: string;
  restockNote: string;
  restocking: boolean;
  onOpenRestock: (item: InventoryItem) => void;
  onCloseRestock: () => void;
  onRestockQtyChange: (v: string) => void;
  onRestockNoteChange: (v: string) => void;
  onRestock: (e: React.FormEvent) => void;

  // Adjust modal
  adjustItem: InventoryItem | null;
  adjustQty: string;
  adjustNote: string;
  adjusting: boolean;
  onOpenAdjust: (item: InventoryItem) => void;
  onCloseAdjust: () => void;
  onAdjustQtyChange: (v: string) => void;
  onAdjustNoteChange: (v: string) => void;
  onAdjust: (e: React.FormEvent) => void;

  // Logs panel
  logsItem: InventoryItem | null;
  logs: StockLog[];
  logsLoading: boolean;
  onOpenLogs: (item: InventoryItem) => void;
  onCloseLogs: () => void;

  // Delete
  onDelete: (item: InventoryItem) => void;
}
