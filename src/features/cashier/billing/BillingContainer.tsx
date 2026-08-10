import { useState, useEffect, useRef } from "react";
import api from "../../../services/apiClient";
import {
  createTakeawayApi,
  sendTakeawayToKitchenApi,
  createBillApi,
  getBillsApi,
  markBillPaidApi,
} from "../../../services/cashier/cashier.api";
import type {
  Bill,
  BillingQuery,
} from "../../../services/cashier/cashier.api";
import { useToast } from "../../../contexts/toastContext";
import { useNotifications } from "../../../hooks/useNotifications";
import { usePrint } from "../../../hooks/usePrint";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";
import {
  getReceiptSettingsApi,
  type ReceiptSettings,
} from "../../../services/settings.api";
import { BillingPresenter } from "./BillingPresenter";
import type { Tab, Step, MenuItem, OrderItem } from "./Billing.types";
import type { PaginationMeta } from "../../../types/query";

const DEFAULT_BILLS_QUERY: BillingQuery = { page: 1, limit: 20, search: "" };

const EMPTY_BILLS_PAGINATION: PaginationMeta = {
  page: 1,
  limit: 20,
  total: 0,
  pages: 0,
  hasNext: false,
  hasPrev: false,
};

export default function BillingContainer() {
  const toast = useToast();
  const { printBill } = usePrint();

  // ── Settings (for print: businessName, taxRate, printReceipt, etc.) ──
  const [settings, setSettings] = useState<Partial<ReceiptSettings>>({});

  useEffect(() => {
    getReceiptSettingsApi()
      .then((res) => setSettings(res.data.settings))
      .catch(() => {
        toast.warning(
          "Receipt settings could not be loaded. Billing will use receipt defaults.",
        );
      });
  }, [toast]);

  // ── Tab / Step ────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<Tab>("takeaway");
  const [step, setStep] = useState<Step>("customer");

  // ── Takeaway state ────────────────────────────────────────
  const [customerForm, setCustomerForm] = useState({ name: "", phone: "" });
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [menuLoading, setMenuLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [kotSent, setKotSent] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "upi">(
    "cash",
  );
  const [paying, setPaying] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [showOrderPanel, setShowOrderPanel] = useState(false);

  // ── Bills state ───────────────────────────────────────────
  const [bills, setBills] = useState<Bill[]>([]);
  const [billsQuery, setBillsQuery] = useState<BillingQuery>(DEFAULT_BILLS_QUERY);
  const [billsPagination, setBillsPagination] = useState<PaginationMeta>(
    EMPTY_BILLS_PAGINATION,
  );
  const [billsLoading, setBillsLoading] = useState(false);
  const [billsError, setBillsError] = useState<string | null>(null);
  const [billsRefreshKey, setBillsRefreshKey] = useState(0);
  const activeBillsRequest = useRef<AbortController | null>(null);
  const debouncedBillsSearch = useDebouncedValue(billsQuery.search ?? "");
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [invoiceBill, setInvoiceBill] = useState<Bill | null>(null);

  void currentOrderId;

  // ── Socket: live bill updates ─────────────────────────────
  useNotifications({
    "billing:created": () => {
      if (activeTab === "bills") {
        activeBillsRequest.current?.abort();
        setBillsLoading(true);
        setBillsError(null);
        setBillsRefreshKey((value) => value + 1);
      }
    },
  });

  // ── Fetch menu on mount ───────────────────────────────────
  useEffect(() => {
    let ignore = false;
    api
      .get<{ menuItems: MenuItem[] }>("/admin/menuItems")
      .then((res) => {
        if (!ignore) {
          setMenuItems(res.data.menuItems.filter((i) => i.available));
        }
      })
      .catch(() => {
        /* silently fail */
      })
      .finally(() => {
        if (!ignore) setMenuLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  // ── Fetch bills when switching to bills tab ───────────────
  useEffect(() => {
    if (activeTab !== "bills") return;
    if ((billsQuery.search ?? "").trim() !== debouncedBillsSearch.trim()) {
      activeBillsRequest.current?.abort();
      return;
    }

    const controller = new AbortController();
    activeBillsRequest.current?.abort();
    activeBillsRequest.current = controller;
    let redirectingToFirstPage = false;
    const requestQuery: BillingQuery = {
      page: billsQuery.page ?? 1,
      limit: billsQuery.limit ?? 20,
      search: debouncedBillsSearch.trim() || undefined,
      status: billsQuery.status,
      sort: billsQuery.sort,
      order: billsQuery.order,
    };

    void getBillsApi(requestQuery, controller.signal)
      .then(({ data }) => {
        if (controller.signal.aborted) return;
        if (!data.pagination) {
          throw new Error("Paginated bills response did not include metadata");
        }
        setBills(data.myBills);
        setBillsPagination(data.pagination);
        setSelectedBill((previous) =>
          previous
            ? data.myBills.find((bill) => bill._id === previous._id) ?? null
            : null,
        );
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        const apiError = err as {
          response?: { status?: number; data?: { error?: string } };
        };
        const isKnownEmpty =
          apiError.response?.status === 404 &&
          apiError.response?.data?.error === "No Bills found";

        if (isKnownEmpty && (requestQuery.page ?? 1) > 1) {
          redirectingToFirstPage = true;
          setBillsQuery((previous) => ({ ...previous, page: 1 }));
          return;
        }
        if (isKnownEmpty) {
          setBills([]);
          setSelectedBill(null);
          setBillsPagination({
            page: requestQuery.page ?? 1,
            limit: requestQuery.limit ?? 20,
            total: 0,
            pages: 0,
            hasNext: false,
            hasPrev: false,
          });
          return;
        }
        setBillsError(
          apiError.response?.data?.error || "Failed to load bills",
        );
      })
      .finally(() => {
        if (!controller.signal.aborted && !redirectingToFirstPage) {
          setBillsLoading(false);
        }
      });

    return () => controller.abort();
  }, [
    activeTab,
    billsQuery.limit,
    billsQuery.order,
    billsQuery.page,
    billsQuery.search,
    billsQuery.sort,
    billsQuery.status,
    billsRefreshKey,
    debouncedBillsSearch,
  ]);

  const refreshBills = () => {
    activeBillsRequest.current?.abort();
    setBillsLoading(true);
    setBillsError(null);
    setBillsRefreshKey((value) => value + 1);
  };

  const updateBillsQueryAndResetPage = (updates: Partial<BillingQuery>) => {
    activeBillsRequest.current?.abort();
    setBillsLoading(true);
    setBillsError(null);
    setBillsQuery((previous) => ({ ...previous, ...updates, page: 1 }));
  };

  const handleBillsPageChange = (page: number) => {
    if (page < 1 || page === billsQuery.page) return;
    activeBillsRequest.current?.abort();
    setBillsLoading(true);
    setBillsError(null);
    setBillsQuery((previous) => ({ ...previous, page }));
  };

  const handleTabChange = (nextTab: Tab) => {
    setActiveTab(nextTab);
    if (nextTab === "bills") {
      setBillsLoading(true);
      setBillsError(null);
    }
  };

  const handleRetryBills = refreshBills;

  // ── Derived ───────────────────────────────────────────────
  const categories = [
    "All",
    ...Array.from(new Set(menuItems.map((i) => i.category))),
  ];
  const filteredMenu =
    selectedCategory === "All"
      ? menuItems
      : menuItems.filter((i) => i.category === selectedCategory);
  const total = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // ── Handlers ─────────────────────────────────────────────
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

  // ✅ Auto-prints receipt after payment if settings.printReceipt is true
  const handleCollectPayment = async () => {
    try {
      setPaying(true);
      const res = await createBillApi({
        customerName: customerForm.name,
        customerPhone: customerForm.phone,
        items: orderItems.map((i) => ({ itemId: i.id, quantity: i.quantity })),
        paymentStatus: "paid",
        paymentMethod,
      });

      // ✅ Auto-print if the admin enabled "Print Receipt by Default" in Settings
      if (settings.printReceipt) {
        printBill(res.data.bill, settings);
      }

      if (activeTab === "bills") refreshBills();

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
      const { data } = await markBillPaidApi(billId, paymentMethod);
      if (selectedBill?._id === billId) setSelectedBill(data.bill);
      refreshBills();
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } } };
      toast.error(e?.response?.data?.error || "Failed");
    }
  };

  // ✅ Reprint any past bill from the Bills tab
  const handlePrintBill = (bill: Bill) => {
    printBill(bill, settings);
  };

  const handleCustomerNext = () => {
    if (customerForm.name && customerForm.phone) setStep("order");
    else toast.warning("Fill in name and phone!");
  };

  return (
    <BillingPresenter
      activeTab={activeTab}
      onTabChange={handleTabChange}
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
      pagination={billsPagination}
      billsLoading={billsLoading}
      billsError={billsError}
      searchQuery={billsQuery.search ?? ""}
      onSearchChange={(search) => updateBillsQueryAndResetPage({ search })}
      statusFilter={billsQuery.status ?? ""}
      onStatusFilterChange={(status) =>
        updateBillsQueryAndResetPage({ status: status || undefined })
      }
      onPageChange={handleBillsPageChange}
      onLimitChange={(limit) => updateBillsQueryAndResetPage({ limit })}
      selectedBill={selectedBill}
      onSelectBill={setSelectedBill}
      invoiceBill={invoiceBill}
      onSetInvoiceBill={setInvoiceBill}
      onMarkPaid={handleMarkPaid}
      onRetryBills={handleRetryBills}
      onPrintBill={handlePrintBill}
    />
  );
}
