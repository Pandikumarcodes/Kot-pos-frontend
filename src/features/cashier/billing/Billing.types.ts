/**
 * Billing.types.ts  →  src/pages/cashier/billing/Billing.types.ts
 * ─────────────────────────────────────────────────────────────
 * Change: added  onPrintBill: (bill: Bill) => void  to BillingPresenterProps
 */

import type { Bill, PaymentMethod } from "../../../services/cashier/cashier.api";
import type { CashierSettings } from "../../../services/admin/settings.api";

export interface MenuItem {
  _id: string;
  ItemName: string;
  price: number;
  category: string;
  available: boolean;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export type Tab = "takeaway" | "bills";
export type Step = "customer" | "order" | "payment";

export interface BillingPresenterProps {
  // Tab
  activeTab: Tab;
  onTabChange: (t: Tab) => void;

  // Step
  step: Step;

  // Customer form
  customerForm: { name: string; phone: string };
  onCustomerChange: (field: "name" | "phone", value: string) => void;
  onCustomerNext: () => void;

  // Menu
  menuItems: MenuItem[];
  menuLoading: boolean;
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  filteredMenu: MenuItem[];

  // Order
  orderItems: OrderItem[];
  total: number;
  onAddItem: (item: MenuItem) => void;
  onUpdateQty: (id: string, qty: number) => void;
  showOrderPanel: boolean;
  onToggleOrderPanel: (show: boolean) => void;

  // KOT
  sending: boolean;
  onSendKOT: () => void;
  kotSent: boolean;

  // Payment
  paymentMethod: PaymentMethod | null;
  onPaymentMethodChange: (m: PaymentMethod) => void;
  enabledPaymentMethods: CashierSettings["paymentMethods"] | null;
  paying: boolean;
  successMsg: string;
  onCollectPayment: () => void;
  onReset: () => void;

  // Bills tab
  bills: Bill[];
  filteredBills: Bill[];
  billsLoading: boolean;
  billsError: string | null;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedBill: Bill | null;
  onSelectBill: (bill: Bill | null) => void;
  invoiceBill: Bill | null;
  onSetInvoiceBill: (bill: Bill | null) => void;
  onMarkPaid: (billId: string) => void;
  onRetryBills: () => void;
  paymentStatusFilter: string;
  onPaymentStatusFilterChange: (value: string) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
  sortOrder: "asc" | "desc";
  onSortOrderChange: (value: "asc" | "desc") => void;
  pagination: { page: number; pageSize: number; total: number };
  onPageChange: (page: number) => void;

  // ✅ Print
  onPrintBill: (bill: Bill) => void;

  settingsLoading: boolean;
  settingsError: string | null;
  branchAssignmentError: boolean;
  onRetrySettings: () => void;
}
