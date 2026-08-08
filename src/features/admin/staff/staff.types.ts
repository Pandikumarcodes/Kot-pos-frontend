import type {
  StaffUser,
  CreateUserPayload,
  StaffPagination,
} from "../../../services/admin/staff.api";
import type { ValidationErrors } from "../../../utils/validation";

export type { StaffUser, CreateUserPayload, StaffPagination };

export const ALLOWED_ROLES = [
  "admin",
  "chef",
  "waiter",
  "cashier",
  "manager",
] as const;
export const ROLE_EMOJI: Record<string, string> = {
  admin: "⚙️",
  chef: "👨‍🍳",
  waiter: "🍽️",
  cashier: "💳",
  manager: "📋",
};

export interface StaffPresenterProps {
  // data
  users: StaffUser[];
  pagination: StaffPagination;
  // stats (derived in container)
  activeCount: number;
  lockedCount: number;
  rolesActive: number;
  // ui state
  loading: boolean;
  error: string | null;
  search: string;
  roleFilter: string;
  statusFilter: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  showModal: boolean;
  editingUser: StaffUser | null;
  formData: CreateUserPayload;
  formErrors: ValidationErrors;
  saving: boolean;
  isAdmin: boolean;
  // actions
  onSearchChange: (q: string) => void;
  onRoleChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onSortOrderChange: () => void;
  onPageChange: (page: number) => void;
  onOpenModal: (user?: StaffUser) => void;
  onCloseModal: () => void;
  onFieldChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onDelete: (user: StaffUser) => void;
  onRetry: () => void;
}
