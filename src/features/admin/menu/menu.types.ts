import type {
  MenuItem,
  CreateMenuPayload,
  MenuPagination,
} from "../../../services/admin/menu.api";
import type { ValidationErrors } from "../../../utils/validation";

export type { MenuItem, CreateMenuPayload };

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
  pagination: MenuPagination;
  // ui state
  loading: boolean;
  error: string | null;
  search: string;
  filterCat: string;
  filterAvailability: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  activeFilters: Array<{ key: string; label: string; value: string }>;
  showModal: boolean;
  editingItem: MenuItem | null;
  formData: CreateMenuPayload;
  formErrors: ValidationErrors;
  isAdmin: boolean;
  // actions
  onSearchChange: (q: string) => void;
  onFilterCatChange: (value: string) => void;
  onFilterAvailabilityChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onSortOrderChange: (value: "asc" | "desc") => void;
  onRemoveFilter: (key: string) => void;
  onClearFilters: () => void;
  onPageChange: (page: number) => void;
  onOpenModal: (item?: MenuItem) => void;
  onCloseModal: () => void;
  onFieldChange: (field: string, value: string | number | boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onDelete: (item: MenuItem) => void;
  onToggle: (item: MenuItem) => void;
  onRetry: () => void;
}
