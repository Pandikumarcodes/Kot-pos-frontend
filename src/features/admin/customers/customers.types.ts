import type { Customer, CustomerPagination, CustomerSortField } from "../../../services/admin/customer.api";

export type { Customer, CustomerPagination, CustomerSortField };

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
  pagination: CustomerPagination;
  // stats (derived, computed in container)
  totalOrders: number;
  avgOrderValue: number;
  // ui state
  loading: boolean;
  error: string | null;
  search: string;
  sortBy: CustomerSortField | "";
  sortOrder: "asc" | "desc";
  showModal: boolean;
  editingCustomer: Customer | null;
  formData: CreateCustomerPayload;
  isAdmin: boolean;
  // actions
  onSearchChange: (q: string) => void;
  onSortChange: (sort: string) => void;
  onSortOrderChange: () => void;
  onPageChange: (page: number) => void;
  onOpenModal: (customer?: Customer) => void;
  onCloseModal: () => void;
  onFormChange: (field: keyof CreateCustomerPayload, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onDelete: (customer: Customer) => void;
  onRetry: () => void;
}
