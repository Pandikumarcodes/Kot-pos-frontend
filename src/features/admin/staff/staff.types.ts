import type {
  StaffUser,
  CreateUserPayload,
  StaffQuery,
  StaffRole,
  StaffStatus,
} from "../../../services/admin/staff.api";
import type { PaginationMeta } from "../../../types/query";
import type { ValidationErrors } from "../../../utils/validation";

export type { StaffUser, CreateUserPayload, StaffQuery, StaffRole, StaffStatus };

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
  pagination: PaginationMeta;
  // stats (derived in container)
  activeCount: number;
  lockedCount: number;
  rolesActive: number;
  // ui state
  loading: boolean;
  error: string | null;
  searchQuery: string;
  roleFilter: StaffRole | "";
  statusFilter: StaffStatus | "";
  showModal: boolean;
  editingUser: StaffUser | null;
  formData: CreateUserPayload;
  formErrors: ValidationErrors;
  isAdmin: boolean;
  // actions
  onSearchChange: (q: string) => void;
  onRoleChange: (role: StaffRole | "") => void;
  onStatusChange: (status: StaffStatus | "") => void;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onOpenModal: (user?: StaffUser) => void;
  onCloseModal: () => void;
  onFieldChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onDelete: (user: StaffUser) => void;
  onRetry: () => void;
}
