//WaiterorderContainer
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useToast } from "../../../Context/ToastContext";
import {
  getMenuApi,
  createOrderApi,
  sendToKitchenApi,
  getTableOrdersApi,
  sendToCashierApi,
} from "../../../services/waiterApi/waiter.api";
import type {
  MenuItem,
  TableOrderItem,
} from "../../../services/waiterApi/waiter.api";
import type { WaiterCartItem, WaiterOrderView } from "./waiterOrderTypes";
import { WaiterOrderPresenter } from "./WaiterOrderPresenter";

export default function WaiterOrderContainer() {
  const { tableId } = useParams<{ tableId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const state = location.state as {
    customerName?: string;
    customerPhone?: string;
    tableNumber?: number;
  } | null;
  const customerName = state?.customerName || "Walk-in";
  const customerPhone = state?.customerPhone || "";
  const tableNumber = state?.tableNumber;

  // ── View ──────────────────────────────────────────────────────
  const [view, setView] = useState<WaiterOrderView>("history");

  // ── History state ─────────────────────────────────────────────
  const [allItems, setAllItems] = useState<TableOrderItem[]>([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [roundCount, setRoundCount] = useState(0);

  // ── Menu state ────────────────────────────────────────────────
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [orderItems, setOrderItems] = useState<WaiterCartItem[]>([]);
  const [showOrderPanel, setShowOrderPanel] = useState(false);

  // ── Action state ──────────────────────────────────────────────
  const [sendingKot, setSendingKot] = useState(false);
  const [sendingToCashier, setSendingToCashier] = useState(false);

  // ── Fetch existing orders for this table ──────────────────────
  const fetchTableOrders = async () => {
    if (!tableId) return;
    try {
      setHistoryLoading(true);
      const { data } = await getTableOrdersApi(tableId);
      setAllItems(data.allItems ?? []);
      setGrandTotal(data.grandTotal ?? 0);
      setRoundCount(data.orders?.length ?? 0);
    } catch {
      setAllItems([]);
      setGrandTotal(0);
      setRoundCount(0);
    } finally {
      setHistoryLoading(false);
    }
  };

  // ── Fetch menu when switching to menu view ────────────────────
  const fetchMenu = async () => {
    if (menuItems.length > 0) return;
    try {
      setMenuLoading(true);
      const { data } = await getMenuApi();
      setMenuItems(data.menuItems.filter((i) => i.available));
    } catch (err) {
      console.error("Menu fetch error:", err);
      toast.error("Failed to load menu");
    } finally {
      setMenuLoading(false);
    }
  };

  useEffect(() => {
    fetchTableOrders();
  }, [tableId]);
  useEffect(() => {
    if (view === "menu") fetchMenu();
  }, [view]);

  // ── Derived ───────────────────────────────────────────────────
  const categories = [
    "All",
    ...Array.from(new Set(menuItems.map((i) => i.category).filter(Boolean))),
  ];

  const filteredMenu = menuItems.filter((item) => {
    const matchCat =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchSearch = item.ItemName.toLowerCase().includes(
      search.toLowerCase(),
    );
    return matchCat && matchSearch;
  });

  const cartTotal = orderItems.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0,
  );

  // ── Cart handlers ─────────────────────────────────────────────
  const handleAddItem = (item: MenuItem) => {
    setOrderItems((prev) => {
      const existing = prev.find((oi) => oi.id === item._id);
      if (existing)
        return prev.map((oi) =>
          oi.id === item._id ? { ...oi, quantity: oi.quantity + 1 } : oi,
        );
      return [
        ...prev,
        { id: item._id, name: item.ItemName, price: item.price, quantity: 1 },
      ];
    });
  };

  const handleUpdateQty = (id: string, qty: number) => {
    if (qty <= 0) setOrderItems((prev) => prev.filter((i) => i.id !== id));
    else
      setOrderItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i)),
      );
  };

  // ── Send new round KOT ────────────────────────────────────────
  const handleSendKot = async () => {
    if (!orderItems.length) {
      toast.warning("Add at least one item!");
      return;
    }
    if (!tableId) {
      toast.error("Table not found");
      return;
    }
    try {
      setSendingKot(true);
      const orderRes = await createOrderApi({
        tableId,
        tableNumber,
        customerName,
        items: orderItems.map((i) => ({ itemId: i.id, quantity: i.quantity })),
      });
      await sendToKitchenApi(orderRes.data.order._id);
      toast.success(`Round ${roundCount + 1} sent to kitchen! 🍳`);
      setOrderItems([]);
      setView("history");
      await fetchTableOrders();
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } } };
      toast.error(e?.response?.data?.error || "Failed to send KOT");
    } finally {
      setSendingKot(false);
    }
  };

  // ── Send to cashier ───────────────────────────────────────────
  const handleSendToCashier = async () => {
    if (!allItems.length) {
      toast.warning("No items ordered yet!");
      return;
    }
    if (!tableId) {
      toast.error("Table not found");
      return;
    }
    try {
      setSendingToCashier(true);
      await sendToCashierApi(tableId, {
        customerName,
        customerPhone,
        tableNumber,
      });
      toast.success("Sent to cashier! 🧾");
      navigate("/waiter/tables");
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } } };
      toast.error(e?.response?.data?.error || "Failed to send to cashier");
    } finally {
      setSendingToCashier(false);
    }
  };

  return (
    <WaiterOrderPresenter
      customerName={customerName}
      tableNumber={tableNumber}
      roundCount={roundCount}
      view={view}
      onSwitchToMenu={() => setView("menu")}
      onSwitchToHistory={() => {
        setView("history");
        setOrderItems([]);
      }}
      onBack={() => navigate("/waiter/tables")}
      historyLoading={historyLoading}
      allItems={allItems}
      grandTotal={grandTotal}
      menuLoading={menuLoading}
      categories={categories}
      selectedCategory={selectedCategory}
      onCategoryChange={setSelectedCategory}
      filteredMenu={filteredMenu}
      search={search}
      onSearchChange={setSearch}
      orderItems={orderItems}
      cartTotal={cartTotal}
      onAddItem={handleAddItem}
      onUpdateQty={handleUpdateQty}
      showOrderPanel={showOrderPanel}
      onToggleOrderPanel={setShowOrderPanel}
      sendingKot={sendingKot}
      onSendKot={handleSendKot}
      sendingToCashier={sendingToCashier}
      onSendToCashier={handleSendToCashier}
    />
  );
}
