import type { Bill } from "../../../services/CashierApi/cashier.api";
export type { Bill };

export type Tab = "takeaway" | "bills";
export type Step = "customer" | "order" | "payment";

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

export interface BillingPresenterProps {
  // tab
  activeTab: Tab;
  onTabChange: (t: Tab) => void;

  // takeaway — step
  step: Step;

  // takeaway — customer
  customerForm: { name: string; phone: string };
  onCustomerChange: (field: "name" | "phone", value: string) => void;
  onCustomerNext: () => void;

  // takeaway — order
  menuItems: MenuItem[];
  menuLoading: boolean;
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  filteredMenu: MenuItem[];
  orderItems: OrderItem[];
  total: number;
  onAddItem: (item: MenuItem) => void;
  onUpdateQty: (id: string, qty: number) => void;
  showOrderPanel: boolean;
  onToggleOrderPanel: (v: boolean) => void;
  sending: boolean;
  onSendKOT: () => void;

  // takeaway — payment
  kotSent: boolean;
  paymentMethod: "cash" | "card" | "upi";
  onPaymentMethodChange: (m: "cash" | "card" | "upi") => void;
  paying: boolean;
  successMsg: string;
  onCollectPayment: () => void;
  onReset: () => void;

  // bills
  bills: Bill[];
  filteredBills: Bill[];
  billsLoading: boolean;
  billsError: string | null;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedBill: Bill | null;
  onSelectBill: (b: Bill | null) => void;
  invoiceBill: Bill | null;
  onSetInvoiceBill: (b: Bill | null) => void;
  onMarkPaid: (billId: string) => void;
  onRetryBills: () => void;
}
