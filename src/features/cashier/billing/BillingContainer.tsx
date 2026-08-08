import { useState, useEffect, useCallback } from "react";
import api from "../../../services/apiClient";
import {
  createTakeawayApi,
  sendTakeawayToKitchenApi,
  createBillApi,
  getBillsApi,
  markBillPaidApi,
  getPaymentErrorMessage,
} from "../../../services/cashier/cashier.api";
import type { Bill, PaymentMethod } from "../../../services/cashier/cashier.api";
import { useToast } from "../../../contexts/toastContext";
import { useNotifications } from "../../../hooks/useNotifications";
import { usePrint } from "../../../hooks/usePrint";
import { getCashierSettingsApi } from "../../../services/admin/settings.api";
import type { CashierSettings } from "../../../services/admin/settings.api";
import { BillingPresenter } from "./BillingPresenter";
import type { Tab, Step, MenuItem, OrderItem } from "./Billing.types";
import { useFilters, usePagination, useQueryState, useSearch, useSorting } from "../../../query";
import { getCashierBillsError, getCashierSettingsError, mapCashierBills } from "./billing.contracts";
import { useAppSelector } from "../../../state/hooks";
import { resolveCashierBranchId, resolveOperationalBranchId } from "../../../state/branchContext";

export default function BillingContainer() {
  const toast = useToast();
  const { printBill } = usePrint();
  const user = useAppSelector((state) => state.auth.user);
  const selectedBranchId = useAppSelector((state) => state.ui.selectedBranchId);
  const isGlobalAdmin = user?.role === "admin" && !user.branchId;
  const branchId = user?.role === "cashier"
    ? resolveCashierBranchId(user.branchId)
    : resolveOperationalBranchId(user?.branchId, selectedBranchId);

  // ── Settings (for print: businessName, taxRate, printReceipt, etc.) ──
  const [settings, setSettings] = useState<CashierSettings | null>(null);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [settingsRetryKey, setSettingsRetryKey] = useState(0);
  const [branchErrors, setBranchErrors] = useState({ settings: false, bills: false });

  useEffect(() => {
    setBills([]);
    setSelectedBill(null);
    setInvoiceBill(null);
    setSettings(null);
    setSettingsLoading(true);
    setSettingsError(null);
    setBranchErrors({ settings: false, bills: false });
  }, [branchId]);

  useEffect(() => {
    if (!branchId) {
      setSettings(null);
      setSettingsError(isGlobalAdmin ? "Select a branch to use billing" : null);
      setBranchErrors((current) => ({ ...current, settings: !isGlobalAdmin }));
      setSettingsLoading(false);
      return;
    }
    getCashierSettingsApi(branchId)
      .then(
        (res) => { setBranchErrors((current) => ({ ...current, settings: false })); setSettings(res.data.settings ?? null); setSettingsError(res.data.settings ? null : "Cashier settings are empty."); setSettingsLoading(false); },
        (error) => {
          const status = (error as { response?: { status?: number } })?.response?.status;
          setBranchErrors((current) => ({ ...current, settings: status === 403 }));
          setSettingsError(getCashierSettingsError(status));
          setSettingsLoading(false);
        },
      )
      .catch(() => {}); // silently fail — print still works without it
  }, [branchId, isGlobalAdmin, settingsRetryKey]);

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
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [paying, setPaying] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [showOrderPanel, setShowOrderPanel] = useState(false);

  // ── Bills state ───────────────────────────────────────────
  const [bills, setBills] = useState<Bill[]>([]);
  const [billsLoading, setBillsLoading] = useState(false);
  const [billsError, setBillsError] = useState<string | null>(null);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [invoiceBill, setInvoiceBill] = useState<Bill | null>(null);
  const [billsPagination, setBillsPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0, hasNext: false, hasPrev: false });
  const queryState = useQueryState({ initialState: { page: 1, pageSize: 20, sortBy: "billDate", sortOrder: "desc" } });
  const { updateQuery, updateFilters } = queryState;
  const search = useSearch(queryState.query.search ?? "");
  const pagination = usePagination({ page: queryState.query.page ?? 1, pageSize: queryState.query.pageSize ?? 20 });
  const sorting = useSorting({ sortBy: queryState.query.sortBy ?? "billDate", sortOrder: queryState.query.sortOrder ?? "desc" });
  const filters = useFilters(queryState.query.filters ?? {});

  useEffect(() => { updateQuery({ search: search.debouncedSearch || undefined, page: 1 }); }, [search.debouncedSearch, updateQuery]);
  useEffect(() => { updateQuery({ page: pagination.page, pageSize: pagination.pageSize }); }, [pagination.page, pagination.pageSize, updateQuery]);
  useEffect(() => { updateQuery({ sortBy: sorting.sortBy, sortOrder: sorting.sortOrder, page: 1 }); }, [sorting.sortBy, sorting.sortOrder, updateQuery]);
  useEffect(() => { updateFilters(filters.filters); }, [filters.filters, updateFilters]);

  void currentOrderId;

  // ── Socket: live bill updates ─────────────────────────────
  useNotifications({
    "billing:created": (bill: unknown) => {
      const b = bill as Bill;
      if (activeTab === "bills")
        setBills((prev) => prev.some((x) => x._id === b._id) ? prev : [b, ...prev]);
    },
  });

  // ── Fetch menu on mount ───────────────────────────────────
  useEffect(() => {
    let ignore = false;
    if (isGlobalAdmin && !branchId) {
      setMenuItems([]);
      setMenuLoading(false);
      return () => {
        ignore = true;
      };
    }
    api
      .get<{ menuItems: MenuItem[] }>("/admin/menuItems", {
        params: branchId ? { branchId } : undefined,
      })
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
  }, [branchId]);

  // ── Fetch bills independently of settings and the active tab ────────────
  const fetchBills = useCallback(async () => {
    if (isGlobalAdmin && !branchId) {
      setBills([]);
      setBillsError("Select a branch to view bills");
      setBillsLoading(false);
      return;
    }
    setBillsLoading(true);
    try {
      const status = filters.filters.status;
      const res = await getBillsApi({
        page: pagination.page,
        limit: pagination.pageSize,
        search: search.debouncedSearch || undefined,
        status: status === "paid" || status === "unpaid" ? status : undefined,
        sort: sorting.sortBy === "paymentStatus" ? "paymentStatus" : "billDate",
        order: sorting.sortOrder,
        branchId,
      });
      setBills(mapCashierBills(res.data));
      setBranchErrors((current) => ({ ...current, bills: false }));
      setBillsError(null);
      if (res.data.pagination) setBillsPagination(res.data.pagination);
    } catch (err) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      setBranchErrors((current) => ({ ...current, bills: status === 403 }));
      setBillsError(getCashierBillsError(status));
      if (status === 403) setBills([]);
    } finally {
      setBillsLoading(false);
    }
  }, [branchId, filters.filters, isGlobalAdmin, pagination.page, pagination.pageSize, search.debouncedSearch, sorting.sortBy, sorting.sortOrder]);

  useEffect(() => {
    void Promise.resolve().then(fetchBills);
  }, [fetchBills]);

  const handleTabChange = (nextTab: Tab) => {
    setActiveTab(nextTab);
  };

  const handleRetryBills = () => {
    setBillsError(null);
    void fetchBills();
  };

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
  const filteredBills = bills;

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
      }, branchId);
      const orderId = res.data.order._id;
      setCurrentOrderId(orderId);
      await sendTakeawayToKitchenApi(orderId, branchId);
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
    if (!paymentMethod) {
      toast.warning("Select a payment method first.");
      return;
    }
    try {
      setPaying(true);
      const res = await createBillApi({
        customerName: customerForm.name,
        customerPhone: customerForm.phone,
        items: orderItems.map((i) => ({ itemId: i.id, quantity: i.quantity })),
        paymentStatus: "paid",
        paymentMethod,
      }, branchId);

      // ✅ Auto-print if the admin enabled "Print Receipt by Default" in Settings
      if (settings?.printReceipt) {
        printBill(res.data.bill, settings);
      }

      setSuccessMsg(res.data.message || `Payment collected via ${paymentMethod.toUpperCase()}`);
      setTimeout(() => {
        setStep("customer");
        setCustomerForm({ name: "", phone: "" });
        setOrderItems([]);
        setKotSent(false);
        setCurrentOrderId(null);
        setSuccessMsg("");
        setPaymentMethod(null);
      }, 3000);
    } catch (err) {
      toast.error(getPaymentErrorMessage(err));
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
    if (!paymentMethod) {
      toast.warning("Select a payment method first.");
      return;
    }
    try {
      setPaying(true);
      const res = await markBillPaidApi(billId, paymentMethod, branchId);
      setBills(
        bills.map((b) =>
          b._id === billId ? { ...b, paymentStatus: "paid" } : b,
        ),
      );
      if (selectedBill?._id === billId)
        setSelectedBill({ ...selectedBill, paymentStatus: "paid" });
      toast.success(res.data.message);
      await fetchBills();
    } catch (err) {
      toast.error(getPaymentErrorMessage(err));
      if ((err as { response?: { status?: number } })?.response?.status === 409) {
        await fetchBills();
      }
    } finally {
      setPaying(false);
    }
  };

  // ✅ Reprint any past bill from the Bills tab
  const handlePrintBill = (bill: Bill) => {
    printBill(bill, settings ?? undefined);
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
      enabledPaymentMethods={settings?.paymentMethods ?? null}
      paying={paying}
      successMsg={successMsg}
      onCollectPayment={handleCollectPayment}
      onReset={handleReset}
      bills={bills}
      filteredBills={filteredBills}
      billsLoading={billsLoading}
      billsError={billsError}
       searchQuery={search.search}
       onSearchChange={search.onSearchChange}
      selectedBill={selectedBill}
      onSelectBill={setSelectedBill}
      invoiceBill={invoiceBill}
      onSetInvoiceBill={setInvoiceBill}
      onMarkPaid={handleMarkPaid}
       onRetryBills={handleRetryBills}
       paymentStatusFilter={String(filters.filters.status ?? "")}
       onPaymentStatusFilterChange={(value) => value ? filters.setFilter("status", value) : filters.clearFilter("status")}
       sortBy={sorting.sortBy ?? "billDate"}
       onSortByChange={(value) => sorting.setSort(value, sorting.sortOrder ?? "desc")}
       sortOrder={sorting.sortOrder ?? "desc"}
       onSortOrderChange={(value) => sorting.setSort(sorting.sortBy ?? "billDate", value)}
       pagination={{ page: billsPagination.page || pagination.page, pageSize: billsPagination.limit || pagination.pageSize, total: billsPagination.total }}
       onPageChange={pagination.setPage}
      onPrintBill={handlePrintBill}
      settingsLoading={settingsLoading}
      settingsError={settingsError || (!settingsLoading && !settings && !branchErrors.settings ? "Could not load cashier settings. Bills remain available." : null)}
      branchAssignmentError={!isGlobalAdmin && (branchErrors.settings || branchErrors.bills)}
      onRetrySettings={() => { setSettingsLoading(true); setSettingsRetryKey((key) => key + 1); }}
    />
  );
}
