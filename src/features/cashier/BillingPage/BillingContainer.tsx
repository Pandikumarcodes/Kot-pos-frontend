import { useState, useEffect } from "react";
import api from "../../../services/apiClient";
import {
  createTakeawayApi,
  sendTakeawayToKitchenApi,
  createBillApi,
  getBillsApi,
  markBillPaidApi,
} from "../../../services/CashierApi/cashier.api";
import type { Bill } from "../../../services/CashierApi/cashier.api";
import { useToast } from "../../../Context/ToastContext";
import { useNotifications } from "../../../hooks/useNotifications";
import { BillingPresenter } from "./BillingPresenter";
import type { Tab, Step, MenuItem, OrderItem } from "./Billing.tyes";

export default function BillingContainer() {
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<Tab>("takeaway");
  const [step, setStep] = useState<Step>("customer");
  const [customerForm, setCustomerForm] = useState({ name: "", phone: "" });
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [menuLoading, setMenuLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [kotSent, setKotSent] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "upi">(
    "cash",
  );
  const [paying, setPaying] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [showOrderPanel, setShowOrderPanel] = useState(false);

  const [bills, setBills] = useState<Bill[]>([]);
  const [billsLoading, setBillsLoading] = useState(false);
  const [billsError, setBillsError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [invoiceBill, setInvoiceBill] = useState<Bill | null>(null);

  // suppress unused warning — kept for potential socket use
  void currentOrderId;

  useNotifications({
    "billing:created": (bill: unknown) => {
      const b = bill as Bill;
      if (activeTab === "bills")
        setBills((prev) =>
          prev.some((x) => x._id === b._id) ? prev : [b, ...prev],
        );
    },
  });

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setMenuLoading(true);
        const res = await api.get<{ menuItems: MenuItem[] }>(
          "/admin/menuItems",
        );
        setMenuItems(res.data.menuItems.filter((i) => i.available));
      } catch {
        /* silently fail */
      } finally {
        setMenuLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const fetchBills = async () => {
    try {
      setBillsLoading(true);
      setBillsError(null);
      const res = await getBillsApi();
      setBills(res.data.myBills);
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } } };
      const msg = e?.response?.data?.error || "Failed to load bills";
      if (msg !== "No Bills found") setBillsError(msg);
      else setBills([]);
    } finally {
      setBillsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "bills") fetchBills();
  }, [activeTab]);

  // Derived
  const categories = [
    "All",
    ...Array.from(new Set(menuItems.map((i) => i.category))),
  ];
  const filteredMenu =
    selectedCategory === "All"
      ? menuItems
      : menuItems.filter((i) => i.category === selectedCategory);
  const total = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const filteredBills = bills.filter(
    (b) =>
      b.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.billNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerPhone?.includes(searchQuery),
  );

  const handleAddItem = (item: MenuItem) => {
    const existing = orderItems.find((oi) => oi.id === item._id);
    if (existing)
      setOrderItems(
        orderItems.map((oi) =>
          oi.id === item._id ? { ...oi, quantity: oi.quantity + 1 } : oi,
        ),
      );
    else
      setOrderItems([
        ...orderItems,
        { id: item._id, name: item.ItemName, price: item.price, quantity: 1 },
      ]);
  };

  const handleUpdateQty = (id: string, qty: number) => {
    if (qty <= 0) setOrderItems(orderItems.filter((i) => i.id !== id));
    else
      setOrderItems(
        orderItems.map((i) => (i.id === id ? { ...i, quantity: qty } : i)),
      );
  };

  const handleSendKOT = async () => {
    if (orderItems.length === 0) {
      toast.warning("Add items first!");
      return;
    }
    try {
      setSending(true);
      const res = await createTakeawayApi({
        customerName: customerForm.name,
        customerPhone: customerForm.phone,
        items: orderItems.map((i) => ({ itemId: i.id, quantity: i.quantity })),
      });
      const orderId = res.data.order._id;
      setCurrentOrderId(orderId);
      await sendTakeawayToKitchenApi(orderId);
      setKotSent(true);
      setStep("payment");
      toast.info("🍳 KOT sent!");
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } } };
      toast.error(e?.response?.data?.error || "Failed");
    } finally {
      setSending(false);
    }
  };

  const handleCollectPayment = async () => {
    try {
      setPaying(true);
      await createBillApi({
        customerName: customerForm.name,
        customerPhone: customerForm.phone,
        items: orderItems.map((i) => ({ itemId: i.id, quantity: i.quantity })),
        paymentStatus: "paid",
        paymentMethod,
      });
      setSuccessMsg(
        `Payment collected! ₹${total.toFixed(2)} via ${paymentMethod.toUpperCase()}`,
      );
      setTimeout(() => {
        setStep("customer");
        setCustomerForm({ name: "", phone: "" });
        setOrderItems([]);
        setKotSent(false);
        setCurrentOrderId(null);
        setSuccessMsg("");
        setPaymentMethod("cash");
      }, 3000);
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } } };
      toast.error(e?.response?.data?.error || "Failed");
    } finally {
      setPaying(false);
    }
  };

  const handleReset = () => {
    setStep("customer");
    setCustomerForm({ name: "", phone: "" });
    setOrderItems([]);
    setKotSent(false);
    setCurrentOrderId(null);
    setSuccessMsg("");
  };

  const handleMarkPaid = async (billId: string) => {
    try {
      await markBillPaidApi(billId);
      setBills(
        bills.map((b) =>
          b._id === billId ? { ...b, paymentStatus: "paid" } : b,
        ),
      );
      if (selectedBill?._id === billId)
        setSelectedBill({ ...selectedBill, paymentStatus: "paid" });
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } } };
      toast.error(e?.response?.data?.error || "Failed");
    }
  };

  const handleCustomerNext = () => {
    if (customerForm.name && customerForm.phone) setStep("order");
    else toast.warning("Fill in name and phone!");
  };

  return (
    <BillingPresenter
      activeTab={activeTab}
      onTabChange={setActiveTab}
      step={step}
      customerForm={customerForm}
      onCustomerChange={(f, v) => setCustomerForm((p) => ({ ...p, [f]: v }))}
      onCustomerNext={handleCustomerNext}
      menuItems={menuItems}
      menuLoading={menuLoading}
      categories={categories}
      selectedCategory={selectedCategory}
      onCategoryChange={setSelectedCategory}
      filteredMenu={filteredMenu}
      orderItems={orderItems}
      total={total}
      onAddItem={handleAddItem}
      onUpdateQty={handleUpdateQty}
      showOrderPanel={showOrderPanel}
      onToggleOrderPanel={setShowOrderPanel}
      sending={sending}
      onSendKOT={handleSendKOT}
      kotSent={kotSent}
      paymentMethod={paymentMethod}
      onPaymentMethodChange={setPaymentMethod}
      paying={paying}
      successMsg={successMsg}
      onCollectPayment={handleCollectPayment}
      onReset={handleReset}
      bills={bills}
      filteredBills={filteredBills}
      billsLoading={billsLoading}
      billsError={billsError}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      selectedBill={selectedBill}
      onSelectBill={setSelectedBill}
      invoiceBill={invoiceBill}
      onSetInvoiceBill={setInvoiceBill}
      onMarkPaid={handleMarkPaid}
      onRetryBills={fetchBills}
    />
  );
}
