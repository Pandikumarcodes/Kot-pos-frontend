import type {
  MenuItem,
  CreateMenuPayload,
  MenuQuery,
  MenuSort,
} from "../../../services/admin/menu.api";
import type { PaginationMeta } from "../../../types/query";
import type { ValidationErrors } from "../../../utils/validation";

export type { MenuItem, CreateMenuPayload, MenuQuery, MenuSort };

export const CATEGORIES = [
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

export interface MenuPresenterProps {
  // data
  menuItems: MenuItem[];
  pagination: PaginationMeta;
  // ui state
  loading: boolean;
  error: string | null;
  selectedCategory: string;
  searchQuery: string;
  showModal: boolean;
  editingItem: MenuItem | null;
  formData: CreateMenuPayload;
  formErrors: ValidationErrors;
  isAdmin: boolean;
  // actions
  onCategoryChange: (cat: string) => void;
  onSearchChange: (q: string) => void;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onOpenModal: (item?: MenuItem) => void;
  onCloseModal: () => void;
  onFieldChange: (field: string, value: string | number | boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onDelete: (item: MenuItem) => void;
  onToggle: (item: MenuItem) => void;
  onRetry: () => void;
}
