/**
 * Billing.tyes.ts  →  src/pages/cashier/billing/Billing.tyes.ts
 * ─────────────────────────────────────────────────────────────
 * Change: added  onPrintBill: (bill: Bill) => void  to BillingPresenterProps
 */

import type { Bill } from "../../../services/CashierApi/cashier.api";

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
  paymentMethod: "cash" | "card" | "upi";
  onPaymentMethodChange: (m: "cash" | "card" | "upi") => void;
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

  // ✅ Print
  onPrintBill: (bill: Bill) => void;
}
