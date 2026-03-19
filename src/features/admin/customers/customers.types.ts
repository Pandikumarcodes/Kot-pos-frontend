import type { Customer } from "../../../services/adminApi/Customer.api";

export type { Customer };

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
  filteredCustomers: Customer[];
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
  onOpenModal: (customer?: Customer) => void;
  onCloseModal: () => void;
  onFormChange: (field: keyof CreateCustomerPayload, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onDelete: (customer: Customer) => void;
  onRetry: () => void;
}
