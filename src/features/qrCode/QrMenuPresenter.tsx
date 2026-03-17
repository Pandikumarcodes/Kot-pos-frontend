import {
  ShoppingCart,
  Plus,
  Minus,
  X,
  CheckCircle,
  Clock,
  ChefHat,
  Loader2,
} from "lucide-react";
import type { QrMenuPresenterProps, PublicMenuItem } from "./QrMenu.types";
import { catLabel, STATUS_CONFIG } from "./QrMenu.types";

// ── Status icon map ───────────────────────────────────────────
function StatusIcon({ status }: { status: string }) {
  if (status === "preparing") return <ChefHat size={20} />;
  if (status === "ready" || status === "served")
    return <CheckCircle size={20} />;
  if (status === "cancelled") return <X size={20} />;
  return <Clock size={20} />;
}

// ─────────────────────────────────────────────────────────────
export function QrMenuPresenter({
  loading,
  error,
  step,
  menuData,
  activeCategory,
  onCategoryChange,
  cart,
  cartCount,
  cartTotal,
  getQty,
  onAddItem,
  onRemoveItem,
  onProceedToCheckout,
  customerName,
  customerPhone,
  onCustomerNameChange,
  onCustomerPhoneChange,
  placing,
  orderError,
  onPlaceOrder,
  onBackToMenu,
  orderId,
  orderStatus,
  statusMessage,
  onOrderMore,
}: QrMenuPresenterProps) {
  // ── Loading ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-emerald-600" size={36} />
        <p className="text-gray-500 text-sm">Loading menu...</p>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────
  if (error || !menuData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <p className="text-4xl mb-3">😕</p>
        <p className="font-semibold text-gray-800">
          {error ?? "Something went wrong"}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Please ask a staff member for assistance.
        </p>
      </div>
    );
  }

  // ── Confirmed screen ─────────────────────────────────────
  if (step === "confirmed") {
    const sc = STATUS_CONFIG[orderStatus] ?? STATUS_CONFIG.pending;
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-lg p-6 space-y-5">
          <div className="text-center">
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-widest">
              {menuData.restaurant.name}
            </p>
            <p className="text-lg font-bold text-gray-800 mt-1">
              Table {menuData.table.tableNumber}
            </p>
          </div>

          <div
            className={`flex items-center gap-3 p-4 rounded-2xl border ${sc.bg}`}
          >
            <span className={sc.color}>
              <StatusIcon status={orderStatus} />
            </span>
            <div>
              <p className={`font-semibold text-sm ${sc.color} capitalize`}>
                {orderStatus}
              </p>
              <p className="text-xs text-gray-600 mt-0.5">{statusMessage}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-400">Order Reference</p>
            <p className="font-mono text-sm font-bold text-gray-700 mt-0.5">
              #{orderId?.slice(-8).toUpperCase()}
            </p>
          </div>

          <p className="text-xs text-gray-400 text-center">
            Status updates automatically every 10 seconds
          </p>

          {(orderStatus === "served" || orderStatus === "cancelled") && (
            <button
              onClick={onOrderMore}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-2xl text-sm transition-colors"
            >
              Order More Items
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── Checkout screen ──────────────────────────────────────
  if (step === "checkout") {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
          <button
            onClick={onBackToMenu}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X size={20} />
          </button>
          <div>
            <p className="font-bold text-gray-800">
              {menuData.restaurant.name}
            </p>
            <p className="text-xs text-gray-500">
              Table {menuData.table.tableNumber} · Review Order
            </p>
          </div>
        </div>

        <div className="max-w-sm mx-auto p-4 space-y-4">
          {/* Order summary */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-50">
              <h2 className="font-bold text-gray-800">Your Order</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {cart.map((item) => (
                <div
                  key={item.itemId}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      ₹{item.price} × {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onRemoveItem(item.itemId)}
                      className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center"
                    >
                      <Minus size={12} className="text-gray-600" />
                    </button>
                    <span className="w-6 text-center text-sm font-bold text-gray-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        onAddItem({
                          _id: item.itemId,
                          ItemName: item.name,
                          price: item.price,
                          category: "",
                        })
                      }
                      className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center"
                    >
                      <Plus size={12} className="text-emerald-700" />
                    </button>
                  </div>
                  <p className="w-16 text-right text-sm font-bold text-gray-800">
                    ₹{(item.price * item.quantity).toFixed(0)}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center px-4 py-3 bg-gray-50">
              <span className="font-bold text-gray-800">Total</span>
              <span className="text-lg font-bold text-emerald-700">
                ₹{cartTotal.toFixed(0)}
              </span>
            </div>
          </div>

          {/* Customer details */}
          <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
            <h2 className="font-bold text-gray-800">
              Your Details{" "}
              <span className="text-gray-400 font-normal text-sm">
                (optional)
              </span>
            </h2>
            <input
              type="text"
              placeholder="Your name"
              value={customerName}
              onChange={(e) => onCustomerNameChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 bg-gray-50"
            />
            <input
              type="tel"
              placeholder="Phone number"
              value={customerPhone}
              onChange={(e) => onCustomerPhoneChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 bg-gray-50"
            />
          </div>

          {orderError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-red-700 text-sm">{orderError}</p>
            </div>
          )}

          <button
            onClick={onPlaceOrder}
            disabled={placing || cart.length === 0}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl disabled:opacity-60 transition-colors text-base"
          >
            {placing ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={18} className="animate-spin" /> Placing order...
              </span>
            ) : (
              `Place Order · ₹${cartTotal.toFixed(0)}`
            )}
          </button>
        </div>
      </div>
    );
  }

  // ── Menu screen (default) ────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-10">
        <p className="font-bold text-gray-800 text-base">
          {menuData.restaurant.name}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">
          Table {menuData.table.tableNumber} · Scan &amp; Order
        </p>
      </div>

      {/* Category tabs */}
      <div className="bg-white border-b border-gray-100 sticky top-[65px] z-10 overflow-x-auto">
        <div className="flex gap-1 px-3 py-2 min-w-max">
          {menuData.categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {catLabel(cat)}
            </button>
          ))}
        </div>
      </div>

      {/* Items */}
      <div className="max-w-sm mx-auto p-4 space-y-3">
        <h2 className="font-bold text-gray-700 text-sm uppercase tracking-wide">
          {catLabel(activeCategory)}
        </h2>
        {(menuData.menu[activeCategory] ?? []).map((item: PublicMenuItem) => {
          const qty = getQty(item._id);
          return (
            <div
              key={item._id}
              className="bg-white rounded-2xl shadow-sm p-4 flex items-center justify-between gap-3"
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm">
                  {item.ItemName}
                </p>
                <p className="text-emerald-700 font-bold text-base mt-0.5">
                  ₹{item.price}
                </p>
              </div>
              {qty === 0 ? (
                <button
                  onClick={() => onAddItem(item)}
                  className="flex items-center gap-1 px-3 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold rounded-xl text-sm hover:bg-emerald-100 transition-colors"
                >
                  <Plus size={14} /> Add
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onRemoveItem(item._id)}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                  >
                    <Minus size={14} className="text-gray-600" />
                  </button>
                  <span className="w-6 text-center font-bold text-gray-800 text-sm">
                    {qty}
                  </span>
                  <button
                    onClick={() => onAddItem(item)}
                    className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center"
                  >
                    <Plus size={14} className="text-white" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Cart FAB */}
      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 z-20">
          <button
            onClick={onProceedToCheckout}
            className="w-full max-w-sm mx-auto flex items-center justify-between bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl px-5 py-4 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ShoppingCart size={18} />
              <span className="bg-white/20 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                {cartCount}
              </span>
              View Order
            </span>
            <span>₹{cartTotal.toFixed(0)} →</span>
          </button>
        </div>
      )}
    </div>
  );
}
