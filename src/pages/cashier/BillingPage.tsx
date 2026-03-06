// src/pages/cashier/BillingPage.tsx
import { useState, useEffect } from "react";
import {
  ShoppingBag,
  Receipt,
  X,
  Search,
  CheckCircle,
  Clock,
} from "lucide-react";
import api from "../../services/apiClient";
import {
  createTakeawayApi,
  sendTakeawayToKitchenApi,
  createBillApi,
  getBillsApi,
  markBillPaidApi,
} from "../../services/CashierApi/cashier.api";
import type { Bill } from "../../services/CashierApi/cashier.api";

// ── Types ─────────────────────────────────────────────────────
interface MenuItem {
  _id: string;
  ItemName: string;
  price: number;
  category: string;
  available: boolean;
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

type Tab = "takeaway" | "bills";
type Step = "customer" | "order" | "payment";

export default function BillingPage() {
  // const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("takeaway");

  // ── Takeaway State ─────────────────────────────────────────
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

  // ── Bills State ────────────────────────────────────────────
  const [bills, setBills] = useState<Bill[]>([]);
  const [billsLoading, setBillsLoading] = useState(false);
  const [billsError, setBillsError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  console.log(currentOrderId);
  // ── Fetch menu ─────────────────────────────────────────────
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setMenuLoading(true);
        const res = await api.get<{ menuItems: MenuItem[] }>(
          "/admin/menuItems",
        );
        setMenuItems(res.data.menuItems.filter((i) => i.available));
      } catch {
        // silently fail
      } finally {
        setMenuLoading(false);
      }
    };
    fetchMenu();
  }, []);

  // ── Fetch bills ────────────────────────────────────────────
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

  // ── Menu helpers ───────────────────────────────────────────
  const categories = [
    "All",
    ...Array.from(new Set(menuItems.map((i) => i.category))),
  ];
  const filteredMenu =
    selectedCategory === "All"
      ? menuItems
      : menuItems.filter((i) => i.category === selectedCategory);

  const handleAddItem = (item: MenuItem) => {
    const existing = orderItems.find((oi) => oi.id === item._id);
    if (existing) {
      setOrderItems(
        orderItems.map((oi) =>
          oi.id === item._id ? { ...oi, quantity: oi.quantity + 1 } : oi,
        ),
      );
    } else {
      setOrderItems([
        ...orderItems,
        { id: item._id, name: item.ItemName, price: item.price, quantity: 1 },
      ]);
    }
  };

  const handleUpdateQty = (id: string, qty: number) => {
    if (qty <= 0) setOrderItems(orderItems.filter((i) => i.id !== id));
    else
      setOrderItems(
        orderItems.map((i) => (i.id === id ? { ...i, quantity: qty } : i)),
      );
  };

  const total = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // ── Send KOT ───────────────────────────────────────────────
  const handleSendKOT = async () => {
    if (orderItems.length === 0) {
      alert("Add items first!");
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
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } } };
      alert(e?.response?.data?.error || "Failed to send KOT");
    } finally {
      setSending(false);
    }
  };

  // ── Collect Payment ────────────────────────────────────────
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
      // Reset after 3 seconds
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
      alert(e?.response?.data?.error || "Failed to process payment");
    } finally {
      setPaying(false);
    }
  };

  // ── Reset takeaway ─────────────────────────────────────────
  const handleReset = () => {
    setStep("customer");
    setCustomerForm({ name: "", phone: "" });
    setOrderItems([]);
    setKotSent(false);
    setCurrentOrderId(null);
    setSuccessMsg("");
  };

  // ── Mark bill paid ─────────────────────────────────────────
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
      alert(e?.response?.data?.error || "Failed to mark as paid");
    }
  };

  const filteredBills = bills.filter(
    (b) =>
      b.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.billNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerPhone?.includes(searchQuery),
  );

  const inputClass =
    "w-full px-3 py-2.5 border-2 border-kot-chart rounded-lg focus:outline-none focus:border-kot-dark bg-kot-white text-kot-darker placeholder:text-kot-text/50 text-sm";

  return (
    <div className="min-h-screen bg-kot-primary">
      <div className="max-w-[1400px] mx-auto p-4 md:p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-kot-darker">Billing</h1>
            <p className="text-sm text-kot-text mt-0.5">
              Takeaway orders & bill management
            </p>
          </div>
          {/* Tabs */}
          <div className="bg-kot-white rounded-2xl p-1.5 flex gap-1 shadow-kot">
            <button
              onClick={() => setActiveTab("takeaway")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === "takeaway"
                  ? "bg-kot-dark text-white"
                  : "text-kot-text hover:bg-kot-light"
              }`}
            >
              <ShoppingBag size={16} /> Takeaway
            </button>
            <button
              onClick={() => setActiveTab("bills")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === "bills"
                  ? "bg-kot-dark text-white"
                  : "text-kot-text hover:bg-kot-light"
              }`}
            >
              <Receipt size={16} /> Bills
            </button>
          </div>
        </div>

        {/* ── TAKEAWAY TAB ──────────────────────────────────── */}
        {activeTab === "takeaway" && (
          <div>
            {/* Success message */}
            {successMsg && (
              <div className="mb-4 px-5 py-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
                <CheckCircle
                  className="text-emerald-500 flex-shrink-0"
                  size={20}
                />
                <p className="text-emerald-700 font-semibold">{successMsg}</p>
              </div>
            )}

            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-6">
              {(["customer", "order", "payment"] as Step[]).map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      step === s
                        ? "bg-kot-dark text-white"
                        : ["customer", "order", "payment"].indexOf(step) > i
                          ? "bg-kot-stats text-kot-darker"
                          : "bg-kot-white text-kot-text border-2 border-kot-chart"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span
                    className={`text-sm font-medium capitalize hidden sm:block ${step === s ? "text-kot-darker" : "text-kot-text"}`}
                  >
                    {s}
                  </span>
                  {i < 2 && <div className="w-8 h-0.5 bg-kot-chart mx-1" />}
                </div>
              ))}
            </div>

            {/* STEP 1: Customer Details */}
            {step === "customer" && (
              <div className="max-w-md">
                <div className="bg-kot-white rounded-2xl shadow-kot p-6 space-y-4">
                  <h2 className="text-lg font-bold text-kot-darker">
                    Customer Details
                  </h2>
                  <div>
                    <label className="block text-sm font-semibold text-kot-darker mb-1">
                      Customer Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerForm.name}
                      onChange={(e) =>
                        setCustomerForm({
                          ...customerForm,
                          name: e.target.value,
                        })
                      }
                      className={inputClass}
                      placeholder="e.g. Rahul Kumar"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-kot-darker mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerForm.phone}
                      onChange={(e) =>
                        setCustomerForm({
                          ...customerForm,
                          phone: e.target.value,
                        })
                      }
                      className={inputClass}
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (customerForm.name && customerForm.phone)
                        setStep("order");
                      else alert("Fill in name and phone!");
                    }}
                    className="w-full py-3 bg-kot-dark hover:bg-kot-darker text-white font-bold rounded-xl transition-colors"
                  >
                    Continue to Order →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Order Items */}
            {step === "order" && (
              <div className="flex gap-4 h-[calc(100vh-280px)]">
                {/* Menu */}
                <div className="flex-1 flex flex-col bg-kot-white rounded-2xl shadow-kot overflow-hidden">
                  {/* Category tabs */}
                  <div className="p-3 border-b border-kot-chart flex gap-1 overflow-x-auto">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                          selectedCategory === cat
                            ? "bg-kot-dark text-white"
                            : "text-kot-text hover:bg-kot-light"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  {/* Items */}
                  <div className="flex-1 overflow-y-auto p-3">
                    {menuLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="w-8 h-8 border-4 border-kot-dark border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {filteredMenu.map((item) => {
                          const inOrder = orderItems.find(
                            (oi) => oi.id === item._id,
                          );
                          return (
                            <button
                              key={item._id}
                              onClick={() => handleAddItem(item)}
                              className="bg-kot-light rounded-xl p-3 text-left border border-kot-chart hover:border-kot-dark transition-all hover:shadow-kot"
                            >
                              <div className="flex items-start justify-between mb-1">
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-kot-white text-kot-dark font-medium capitalize">
                                  {item.category}
                                </span>
                                {inOrder && (
                                  <span className="w-5 h-5 rounded-full bg-kot-dark text-white text-xs flex items-center justify-center font-bold">
                                    {inOrder.quantity}
                                  </span>
                                )}
                              </div>
                              <p className="font-semibold text-kot-darker text-sm mt-2 leading-tight">
                                {item.ItemName}
                              </p>
                              <p className="text-kot-dark font-bold text-sm mt-1">
                                ₹{item.price}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Panel */}
                <div className="w-72 bg-kot-white rounded-2xl shadow-kot flex flex-col">
                  <div className="p-4 border-b border-kot-chart bg-kot-light rounded-t-2xl">
                    <h3 className="font-bold text-kot-darker">Order</h3>
                    <p className="text-xs text-kot-text mt-0.5">
                      {customerForm.name} · {customerForm.phone}
                    </p>
                  </div>
                  <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {orderItems.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-kot-text gap-2">
                        <p className="text-3xl">🥡</p>
                        <p className="text-sm">Tap items to add</p>
                      </div>
                    ) : (
                      orderItems.map((item) => (
                        <div
                          key={item.id}
                          className="bg-kot-light rounded-lg p-3 border border-kot-chart"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-semibold text-kot-darker flex-1 truncate">
                              {item.name}
                            </p>
                            <button
                              onClick={() => handleUpdateQty(item.id, 0)}
                              className="text-red-400 hover:text-red-600 ml-1 text-xs"
                            >
                              ✕
                            </button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  handleUpdateQty(item.id, item.quantity - 1)
                                }
                                className="w-6 h-6 rounded-full bg-kot-white border border-kot-chart flex items-center justify-center text-sm font-bold hover:bg-kot-stats"
                              >
                                −
                              </button>
                              <span className="text-sm font-bold text-kot-darker w-4 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleUpdateQty(item.id, item.quantity + 1)
                                }
                                className="w-6 h-6 rounded-full bg-kot-white border border-kot-chart flex items-center justify-center text-sm font-bold hover:bg-kot-stats"
                              >
                                +
                              </button>
                            </div>
                            <p className="text-sm font-bold text-kot-dark">
                              ₹{item.price * item.quantity}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  {orderItems.length > 0 && (
                    <div className="p-4 border-t border-kot-chart space-y-3">
                      <div className="flex justify-between">
                        <span className="font-semibold text-kot-darker">
                          Total
                        </span>
                        <span className="text-lg font-bold text-kot-darker">
                          ₹{total.toFixed(2)}
                        </span>
                      </div>
                      <button
                        onClick={() => setStep("customer")}
                        className="w-full py-2 border-2 border-kot-chart text-kot-text rounded-lg text-sm hover:bg-kot-light"
                      >
                        ← Back
                      </button>
                      <button
                        onClick={handleSendKOT}
                        disabled={sending}
                        className="w-full py-2.5 bg-kot-dark hover:bg-kot-darker text-white font-bold rounded-xl transition-colors disabled:opacity-60"
                      >
                        {sending ? "Sending..." : "Send to Kitchen 🍳"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 3: Payment */}
            {step === "payment" && (
              <div className="max-w-md">
                <div className="bg-kot-white rounded-2xl shadow-kot p-6 space-y-5">
                  {/* KOT Status */}
                  <div
                    className={`flex items-center gap-3 p-4 rounded-xl ${kotSent ? "bg-emerald-50 border border-emerald-200" : "bg-yellow-50 border border-yellow-200"}`}
                  >
                    {kotSent ? (
                      <CheckCircle className="text-emerald-500" size={20} />
                    ) : (
                      <Clock className="text-yellow-500" size={20} />
                    )}
                    <div>
                      <p
                        className={`font-semibold text-sm ${kotSent ? "text-emerald-700" : "text-yellow-700"}`}
                      >
                        {kotSent
                          ? "KOT sent to kitchen ✅"
                          : "Sending to kitchen..."}
                      </p>
                      <p className="text-xs text-kot-text mt-0.5">
                        {customerForm.name} · {customerForm.phone}
                      </p>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div>
                    <h3 className="font-bold text-kot-darker mb-3">
                      Order Summary
                    </h3>
                    <div className="space-y-2">
                      {orderItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-kot-text">
                            {item.name} × {item.quantity}
                          </span>
                          <span className="font-semibold text-kot-darker">
                            ₹{item.price * item.quantity}
                          </span>
                        </div>
                      ))}
                      <div className="flex justify-between font-bold text-base pt-2 border-t border-kot-chart">
                        <span className="text-kot-darker">Total</span>
                        <span className="text-kot-darker">
                          ₹{total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <h3 className="font-bold text-kot-darker mb-3">
                      Payment Method
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      {(["cash", "card", "upi"] as const).map((method) => (
                        <button
                          key={method}
                          onClick={() => setPaymentMethod(method)}
                          className={`py-3 rounded-xl text-sm font-bold capitalize transition-all border-2 ${
                            paymentMethod === method
                              ? "bg-kot-dark text-white border-kot-dark"
                              : "bg-kot-white text-kot-darker border-kot-chart hover:border-kot-dark"
                          }`}
                        >
                          {method === "cash"
                            ? "💵"
                            : method === "card"
                              ? "💳"
                              : "📱"}{" "}
                          {method.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleReset}
                      className="flex-1 py-2.5 border-2 border-kot-chart text-kot-darker font-semibold rounded-xl hover:bg-kot-light"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCollectPayment}
                      disabled={paying || !kotSent}
                      className="flex-2 flex-1 py-2.5 bg-kot-dark hover:bg-kot-darker text-white font-bold rounded-xl disabled:opacity-60 transition-colors"
                    >
                      {paying
                        ? "Processing..."
                        : `Collect ₹${total.toFixed(2)}`}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── BILLS TAB ─────────────────────────────────────── */}
        {activeTab === "bills" && (
          <div className="flex gap-4">
            {/* Bills list */}
            <div className="flex-1 space-y-4">
              {/* Search */}
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-kot-text"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search by name, phone or bill number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border-2 border-kot-chart rounded-xl bg-kot-white text-kot-darker text-sm focus:outline-none focus:border-kot-dark placeholder:text-kot-text/50"
                />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    label: "Total Bills",
                    value: bills.length,
                    color: "bg-kot-stats",
                  },
                  {
                    label: "Paid",
                    value: bills.filter((b) => b.paymentStatus === "paid")
                      .length,
                    color: "bg-emerald-50",
                  },
                  {
                    label: "Pending",
                    value: bills.filter((b) => b.paymentStatus !== "paid")
                      .length,
                    color: "bg-yellow-50",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className={`${s.color} rounded-2xl p-4 shadow-kot`}
                  >
                    <p className="text-xs text-kot-text font-medium">
                      {s.label}
                    </p>
                    <p className="text-2xl font-bold text-kot-darker mt-1">
                      {s.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Bills */}
              {billsLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-10 h-10 border-4 border-kot-dark border-t-transparent rounded-full animate-spin" />
                </div>
              ) : billsError ? (
                <div className="bg-kot-white rounded-2xl p-8 text-center shadow-kot">
                  <p className="text-red-500 font-medium">{billsError}</p>
                  <button
                    onClick={fetchBills}
                    className="mt-3 px-4 py-2 bg-kot-dark text-white rounded-lg text-sm"
                  >
                    Retry
                  </button>
                </div>
              ) : filteredBills.length === 0 ? (
                <div className="bg-kot-white rounded-2xl p-12 text-center shadow-kot">
                  <p className="text-2xl mb-2">🧾</p>
                  <p className="font-semibold text-kot-darker">
                    No bills found
                  </p>
                  <p className="text-sm text-kot-text mt-1">
                    Bills will appear after takeaway payments
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredBills.map((bill) => (
                    <button
                      key={bill._id}
                      onClick={() => setSelectedBill(bill)}
                      className={`w-full text-left bg-kot-white rounded-2xl p-4 shadow-kot hover:shadow-kot-lg transition-all border-2 ${
                        selectedBill?._id === bill._id
                          ? "border-kot-dark"
                          : "border-transparent"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-kot-darker">
                            {bill.customerName}
                          </p>
                          <p className="text-xs text-kot-text mt-0.5">
                            {bill.billNumber} · {bill.customerPhone}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-kot-darker">
                            ₹{bill.totalAmount.toLocaleString()}
                          </p>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                              bill.paymentStatus === "paid"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {bill.paymentStatus}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Bill Detail Panel */}
            {selectedBill && (
              <div className="w-80 bg-kot-white rounded-2xl shadow-kot flex flex-col flex-shrink-0 h-fit sticky top-4">
                <div className="flex items-center justify-between p-4 border-b border-kot-chart">
                  <h3 className="font-bold text-kot-darker">Bill Detail</h3>
                  <button
                    onClick={() => setSelectedBill(null)}
                    className="text-kot-text hover:text-kot-darker"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <p className="text-xs text-kot-text font-medium">
                      BILL NUMBER
                    </p>
                    <p className="font-bold text-kot-darker">
                      {selectedBill.billNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-kot-text font-medium">
                      CUSTOMER
                    </p>
                    <p className="font-semibold text-kot-darker">
                      {selectedBill.customerName}
                    </p>
                    <p className="text-sm text-kot-text">
                      {selectedBill.customerPhone}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-kot-text font-medium mb-2">
                      ITEMS
                    </p>
                    <div className="space-y-1.5">
                      {selectedBill.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-kot-text">
                            {item.name} × {item.quantity}
                          </span>
                          <span className="font-semibold text-kot-darker">
                            ₹{item.total || item.price * item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between font-bold pt-3 border-t border-kot-chart">
                    <span className="text-kot-darker">Total</span>
                    <span className="text-kot-darker">
                      ₹{selectedBill.totalAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-kot-text">Payment</span>
                    <span
                      className={`text-sm px-3 py-1 rounded-full font-semibold ${
                        selectedBill.paymentStatus === "paid"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {selectedBill.paymentStatus}
                    </span>
                  </div>
                  {selectedBill.paymentStatus !== "paid" && (
                    <button
                      onClick={() => handleMarkPaid(selectedBill._id)}
                      className="w-full py-2.5 bg-kot-dark hover:bg-kot-darker text-white font-bold rounded-xl transition-colors"
                    >
                      Mark as Paid ✓
                    </button>
                  )}
                  <p className="text-xs text-kot-text text-center">
                    {new Date(selectedBill.createdAt).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
