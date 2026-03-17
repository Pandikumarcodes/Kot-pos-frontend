import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  getPublicMenuApi,
  placePublicOrderApi,
  getOrderStatusApi,
} from "../../services/qrMenuApi.api";
import type {
  PublicMenuItem,
  QrMenuResponse,
} from "../../services/qrMenuApi.api";
import type { Step, CartItem } from "./QrMenu.types";
import { QrMenuPresenter } from "./QrMenuPresenter";

export default function QrMenuContainer() {
  const { tableId } = useParams<{ tableId: string }>();

  // ── Page state ────────────────────────────────────────────
  const [menuData, setMenuData] = useState<QrMenuResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("menu");
  const [activeCategory, setActiveCategory] = useState<string>("");

  // ── Cart ──────────────────────────────────────────────────
  const [cart, setCart] = useState<CartItem[]>([]);

  // ── Checkout ──────────────────────────────────────────────
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [placing, setPlacing] = useState(false);
  const [orderError, setOrderError] = useState("");

  // ── Confirmed ────────────────────────────────────────────
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderStatus, setOrderStatus] = useState("pending");
  const [statusMessage, setStatusMessage] = useState("");

  // ── Fetch menu on mount ───────────────────────────────────
  useEffect(() => {
    if (!tableId) return;
    getPublicMenuApi(tableId)
      .then(({ data }) => {
        setMenuData(data);
        setActiveCategory(data.categories[0] ?? "");
      })
      .catch(() => setError("Menu unavailable. Please ask a waiter."))
      .finally(() => setLoading(false));
  }, [tableId]);

  // ── Poll order status every 10s after placing ─────────────
  const pollStatus = useCallback(async () => {
    if (!orderId) return;
    try {
      const { data } = await getOrderStatusApi(orderId);
      setOrderStatus(data.status);
      setStatusMessage(data.message);
    } catch {
      /* silent */
    }
  }, [orderId]);

  useEffect(() => {
    if (step !== "confirmed" || !orderId) return;
    pollStatus();
    const id = setInterval(pollStatus, 10_000);
    return () => clearInterval(id);
  }, [step, orderId, pollStatus]);

  // ── Cart helpers ──────────────────────────────────────────
  const getQty = (itemId: string) =>
    cart.find((c) => c.itemId === itemId)?.quantity ?? 0;

  const handleAddItem = (item: PublicMenuItem) => {
    setCart((prev) => {
      const ex = prev.find((c) => c.itemId === item._id);
      if (ex)
        return prev.map((c) =>
          c.itemId === item._id ? { ...c, quantity: c.quantity + 1 } : c,
        );
      return [
        ...prev,
        {
          itemId: item._id,
          name: item.ItemName,
          price: item.price,
          quantity: 1,
        },
      ];
    });
  };

  const handleRemoveItem = (itemId: string) => {
    setCart((prev) => {
      const ex = prev.find((c) => c.itemId === itemId);
      if (!ex) return prev;
      if (ex.quantity === 1) return prev.filter((c) => c.itemId !== itemId);
      return prev.map((c) =>
        c.itemId === itemId ? { ...c, quantity: c.quantity - 1 } : c,
      );
    });
  };

  const cartTotal = cart.reduce((s, c) => s + c.price * c.quantity, 0);
  const cartCount = cart.reduce((s, c) => s + c.quantity, 0);

  // ── Place order ───────────────────────────────────────────
  const handlePlaceOrder = async () => {
    if (!tableId || cart.length === 0) return;
    setOrderError("");
    try {
      setPlacing(true);
      const { data } = await placePublicOrderApi(tableId, {
        customerName: customerName.trim() || undefined,
        customerPhone: customerPhone.trim() || undefined,
        items: cart.map((c) => ({ itemId: c.itemId, quantity: c.quantity })),
      });
      setOrderId(data.orderId);
      setCart([]);
      setStep("confirmed");
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } } };
      setOrderError(
        e?.response?.data?.error || "Failed to place order. Try again.",
      );
    } finally {
      setPlacing(false);
    }
  };

  // ── Navigation helpers ────────────────────────────────────
  const handleProceedToCheckout = () => setStep("checkout");

  const handleBackToMenu = () => setStep("menu");

  const handleOrderMore = () => {
    setStep("menu");
    setOrderId(null);
    setOrderStatus("pending");
    setStatusMessage("");
  };

  return (
    <QrMenuPresenter
      // Page-level
      loading={loading}
      error={error}
      step={step}
      menuData={menuData}
      // Menu screen
      activeCategory={activeCategory}
      onCategoryChange={setActiveCategory}
      cart={cart}
      cartCount={cartCount}
      cartTotal={cartTotal}
      getQty={getQty}
      onAddItem={handleAddItem}
      onRemoveItem={handleRemoveItem}
      onProceedToCheckout={handleProceedToCheckout}
      // Checkout screen
      customerName={customerName}
      customerPhone={customerPhone}
      onCustomerNameChange={setCustomerName}
      onCustomerPhoneChange={setCustomerPhone}
      placing={placing}
      orderError={orderError}
      onPlaceOrder={handlePlaceOrder}
      onBackToMenu={handleBackToMenu}
      // Confirmed screen
      orderId={orderId}
      orderStatus={orderStatus}
      statusMessage={statusMessage}
      onOrderMore={handleOrderMore}
    />
  );
}
