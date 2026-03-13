import type {
  StaffUser,
  CreateUserPayload,
} from "../../../services/adminApi/Staff.api";
import type { ValidationErrors } from "../../../utils/validation";

export type { StaffUser, CreateUserPayload };

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
  filteredUsers: StaffUser[];
  // stats (derived in container)
  activeCount: number;
  lockedCount: number;
  rolesActive: number;
  // ui state
  loading: boolean;
  error: string | null;
  searchQuery: string;
  showModal: boolean;
  editingUser: StaffUser | null;
  formData: CreateUserPayload;
  formErrors: ValidationErrors;
  isAdmin: boolean;
  // actions
  onSearchChange: (q: string) => void;
  onOpenModal: (user?: StaffUser) => void;
  onCloseModal: () => void;
  onFieldChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onDelete: (user: StaffUser) => void;
  onRetry: () => void;
}
