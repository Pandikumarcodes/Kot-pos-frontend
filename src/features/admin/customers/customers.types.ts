import type {
  Customer,
  CustomersQuery,
  CustomersSort,
} from "../../../services/admin/customer.api";
import type { PaginationMeta } from "../../../types/query";

export type { Customer, CustomersQuery, CustomersSort };

export interface CreateCustomerPayload {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  gender?: "male" | "female" | "other" | "";
}

export interface CustomerPresenterProps {
  // data
  customers: Customer[];
  pagination: PaginationMeta;
  // stats (derived, computed in container)
  totalOrders: number;
  avgOrderValue: number;
  // ui state
  loading: boolean;
  error: string | null;
  searchQuery: string;
  showModal: boolean;
  editingCustomer: Customer | null;
  formData: CreateCustomerPayload;
  isAdmin: boolean;
  // actions
  onSearchChange: (q: string) => void;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onOpenModal: (customer?: Customer) => void;
  onCloseModal: () => void;
  onFormChange: (field: keyof CreateCustomerPayload, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onDelete: (customer: Customer) => void;
  onRetry: () => void;
}
