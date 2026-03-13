import {
  ShoppingBag,
  Receipt,
  X,
  Search,
  CheckCircle,
  Clock,
  ChevronDown,
} from "lucide-react";
import type { BillingPresenterProps, Step } from "./Billing.tyes";
import GstInvoice from "./GstInvoice";

const Pulse = ({ className }: { className: string }) => (
  <div className={`bg-kot-chart rounded animate-pulse ${className}`} />
);

function SkeletonBillRow() {
  return (
    <div className="bg-kot-white rounded-2xl p-4 shadow-kot">
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <Pulse className="h-4 w-32" />
          <Pulse className="h-3 w-40" />
        </div>
        <div className="text-right space-y-1.5">
          <Pulse className="h-4 w-16" />
          <Pulse className="h-5 w-12 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function SkeletonBillStats() {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-2xl p-3 sm:p-4 shadow-kot bg-kot-white">
          <Pulse className="h-3 w-16 mb-2" />
          <Pulse className="h-7 w-8" />
        </div>
      ))}
    </div>
  );
}

const inputClass =
  "w-full px-3 py-2.5 border-2 border-kot-chart rounded-lg focus:outline-none focus:border-kot-dark bg-kot-white text-kot-darker placeholder:text-kot-text/50 text-sm";

export function BillingPresenter({
  activeTab,
  onTabChange,
  step,
  customerForm,
  onCustomerChange,
  onCustomerNext,
  // menuItems,
  menuLoading,
  categories,
  selectedCategory,
  onCategoryChange,
  filteredMenu,
  orderItems,
  total,
  onAddItem,
  onUpdateQty,
  showOrderPanel,
  onToggleOrderPanel,
  sending,
  onSendKOT,
  kotSent,
  paymentMethod,
  onPaymentMethodChange,
  paying,
  successMsg,
  onCollectPayment,
  onReset,
  bills,
  filteredBills,
  billsLoading,
  billsError,
  searchQuery,
  onSearchChange,
  selectedBill,
  onSelectBill,
  invoiceBill,
  onSetInvoiceBill,
  onMarkPaid,
  onRetryBills,
}: BillingPresenterProps) {
  return (
    <div className="min-h-screen bg-kot-primary">
      <div className="max-w-[2400px] mx-auto p-3 sm:p-4 lg:p-6 xl:p-8 space-y-3 sm:space-y-4 lg:space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-kot-darker">
              Billing
            </h1>
            <p className="text-xs sm:text-sm text-kot-text mt-0.5">
              Takeaway orders & bill management
            </p>
          </div>
          <div className="bg-kot-white rounded-2xl p-1 sm:p-1.5 flex gap-1 shadow-kot w-fit">
            <button
              onClick={() => onTabChange("takeaway")}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${activeTab === "takeaway" ? "bg-kot-dark text-white" : "text-kot-text hover:bg-kot-light"}`}
            >
              <ShoppingBag size={14} /> Takeaway
            </button>
            <button
              onClick={() => onTabChange("bills")}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${activeTab === "bills" ? "bg-kot-dark text-white" : "text-kot-text hover:bg-kot-light"}`}
            >
              <Receipt size={14} /> Bills
            </button>
          </div>
        </div>

        {/* ── TAKEAWAY ── */}
        {activeTab === "takeaway" && (
          <div>
            {successMsg && (
              <div className="mb-4 px-4 sm:px-5 py-3 sm:py-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
                <CheckCircle
                  className="text-emerald-500 flex-shrink-0"
                  size={18}
                />
                <p className="text-emerald-700 font-semibold text-sm sm:text-base">
                  {successMsg}
                </p>
              </div>
            )}

            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              {(["customer", "order", "payment"] as Step[]).map((s, i) => (
                <div key={s} className="flex items-center gap-1.5 sm:gap-2">
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all ${step === s ? "bg-kot-dark text-white" : ["customer", "order", "payment"].indexOf(step) > i ? "bg-kot-stats text-kot-darker" : "bg-kot-white text-kot-text border-2 border-kot-chart"}`}
                  >
                    {i + 1}
                  </div>
                  <span
                    className={`text-xs sm:text-sm font-medium capitalize hidden sm:block ${step === s ? "text-kot-darker" : "text-kot-text"}`}
                  >
                    {s}
                  </span>
                  {i < 2 && (
                    <div className="w-5 sm:w-8 h-0.5 bg-kot-chart mx-0.5 sm:mx-1" />
                  )}
                </div>
              ))}
            </div>

            {/* STEP 1: Customer */}
            {step === "customer" && (
              <div className="max-w-md">
                <div className="bg-kot-white rounded-2xl shadow-kot p-4 sm:p-6 space-y-4">
                  <h2 className="text-base sm:text-lg font-bold text-kot-darker">
                    Customer Details
                  </h2>
                  <div>
                    <label className="block text-sm font-semibold text-kot-darker mb-1">
                      Customer Name *
                    </label>
                    <input
                      type="text"
                      value={customerForm.name}
                      onChange={(e) => onCustomerChange("name", e.target.value)}
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
                      value={customerForm.phone}
                      onChange={(e) =>
                        onCustomerChange("phone", e.target.value)
                      }
                      className={inputClass}
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                  <button
                    onClick={onCustomerNext}
                    className="w-full py-3 bg-kot-dark hover:bg-kot-darker text-white font-bold rounded-xl transition-colors"
                  >
                    Continue to Order →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Order */}
            {step === "order" && (
              <div className="relative">
                {orderItems.length > 0 && (
                  <button
                    onClick={() => onToggleOrderPanel(true)}
                    className="fixed bottom-4 right-4 z-40 sm:hidden flex items-center gap-2 px-4 py-3 bg-kot-dark text-white rounded-2xl shadow-lg font-bold text-sm"
                  >
                    🛒 {orderItems.length} items · ₹{total.toFixed(0)}
                    <ChevronDown size={16} className="rotate-180" />
                  </button>
                )}

                <div
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4"
                  style={{ height: "calc(100vh - 260px)" }}
                >
                  {/* Menu */}
                  <div className="flex-1 flex flex-col bg-kot-white rounded-2xl shadow-kot overflow-hidden min-h-0">
                    <div className="p-2 sm:p-3 border-b border-kot-chart flex gap-1 overflow-x-auto flex-shrink-0">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => onCategoryChange(cat)}
                          className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === cat ? "bg-kot-dark text-white" : "text-kot-text hover:bg-kot-light"}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 sm:p-3">
                      {menuLoading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3">
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                            <div
                              key={i}
                              className="bg-kot-light rounded-xl p-3 animate-pulse"
                            >
                              <Pulse className="h-4 w-20 mb-2" />
                              <Pulse className="h-3 w-16 mb-1" />
                              <Pulse className="h-4 w-12" />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3">
                          {filteredMenu.map((item) => {
                            const inOrder = orderItems.find(
                              (oi) => oi.id === item._id,
                            );
                            return (
                              <button
                                key={item._id}
                                onClick={() => onAddItem(item)}
                                className="bg-kot-light rounded-xl p-2.5 sm:p-3 text-left border border-kot-chart hover:border-kot-dark transition-all hover:shadow-kot"
                              >
                                <div className="flex items-start justify-between mb-1">
                                  <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full bg-kot-white text-kot-dark font-medium capitalize">
                                    {item.category}
                                  </span>
                                  {inOrder && (
                                    <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-kot-dark text-white text-[9px] sm:text-xs flex items-center justify-center font-bold">
                                      {inOrder.quantity}
                                    </span>
                                  )}
                                </div>
                                <p className="font-semibold text-kot-darker text-xs sm:text-sm mt-1.5 leading-tight">
                                  {item.ItemName}
                                </p>
                                <p className="text-kot-dark font-bold text-xs sm:text-sm mt-0.5">
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
                  <div
                    className={`sm:w-64 lg:w-72 xl:w-80 bg-kot-white rounded-2xl shadow-kot flex flex-col flex-shrink-0 fixed inset-0 z-50 sm:static sm:z-auto transition-transform duration-300 ${showOrderPanel ? "translate-y-0" : "translate-y-full sm:translate-y-0"}`}
                  >
                    <div className="p-3 sm:p-4 border-b border-kot-chart bg-kot-light rounded-t-2xl flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-kot-darker text-sm sm:text-base">
                          Order
                        </h3>
                        <p className="text-xs text-kot-text mt-0.5">
                          {customerForm.name} · {customerForm.phone}
                        </p>
                      </div>
                      <button
                        onClick={() => onToggleOrderPanel(false)}
                        className="sm:hidden p-1 text-kot-text hover:text-kot-darker"
                      >
                        <X size={18} />
                      </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-2">
                      {orderItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-kot-text gap-2 py-8">
                          <p className="text-3xl">🥡</p>
                          <p className="text-sm">Tap items to add</p>
                        </div>
                      ) : (
                        orderItems.map((item) => (
                          <div
                            key={item.id}
                            className="bg-kot-light rounded-lg p-2.5 sm:p-3 border border-kot-chart"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-xs sm:text-sm font-semibold text-kot-darker flex-1 truncate">
                                {item.name}
                              </p>
                              <button
                                onClick={() => onUpdateQty(item.id, 0)}
                                className="text-red-400 hover:text-red-600 ml-1 text-xs"
                              >
                                ✕
                              </button>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5 sm:gap-2">
                                <button
                                  onClick={() =>
                                    onUpdateQty(item.id, item.quantity - 1)
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
                                    onUpdateQty(item.id, item.quantity + 1)
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
                      <div className="p-3 sm:p-4 border-t border-kot-chart space-y-2 sm:space-y-3">
                        <div className="flex justify-between">
                          <span className="font-semibold text-kot-darker text-sm">
                            Total
                          </span>
                          <span className="text-base sm:text-lg font-bold text-kot-darker">
                            ₹{total.toFixed(2)}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            onToggleOrderPanel(false);
                            onReset();
                          }}
                          className="w-full py-2 border-2 border-kot-chart text-kot-text rounded-lg text-xs sm:text-sm hover:bg-kot-light"
                        >
                          ← Back
                        </button>
                        <button
                          onClick={() => {
                            onToggleOrderPanel(false);
                            onSendKOT();
                          }}
                          disabled={sending}
                          className="w-full py-2.5 bg-kot-dark hover:bg-kot-darker text-white font-bold rounded-xl transition-colors disabled:opacity-60 text-sm"
                        >
                          {sending ? "Sending..." : "Send to Kitchen 🍳"}
                        </button>
                      </div>
                    )}
                  </div>
                  {showOrderPanel && (
                    <div
                      className="fixed inset-0 bg-black/40 z-40 sm:hidden"
                      onClick={() => onToggleOrderPanel(false)}
                    />
                  )}
                </div>
              </div>
            )}

            {/* STEP 3: Payment */}
            {step === "payment" && (
              <div className="max-w-md">
                <div className="bg-kot-white rounded-2xl shadow-kot p-4 sm:p-6 space-y-4 sm:space-y-5">
                  <div
                    className={`flex items-center gap-3 p-3 sm:p-4 rounded-xl ${kotSent ? "bg-emerald-50 border border-emerald-200" : "bg-yellow-50 border border-yellow-200"}`}
                  >
                    {kotSent ? (
                      <CheckCircle
                        className="text-emerald-500 flex-shrink-0"
                        size={18}
                      />
                    ) : (
                      <Clock
                        className="text-yellow-500 flex-shrink-0"
                        size={18}
                      />
                    )}
                    <div>
                      <p
                        className={`font-semibold text-xs sm:text-sm ${kotSent ? "text-emerald-700" : "text-yellow-700"}`}
                      >
                        {kotSent
                          ? "KOT sent ✅ — Waiting for ready notification..."
                          : "Sending to kitchen..."}
                      </p>
                      <p className="text-[10px] sm:text-xs text-kot-text mt-0.5">
                        {customerForm.name} · {customerForm.phone}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-kot-darker mb-2 sm:mb-3 text-sm sm:text-base">
                      Order Summary
                    </h3>
                    <div className="space-y-1.5 sm:space-y-2">
                      {orderItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between text-xs sm:text-sm"
                        >
                          <span className="text-kot-text">
                            {item.name} × {item.quantity}
                          </span>
                          <span className="font-semibold text-kot-darker">
                            ₹{item.price * item.quantity}
                          </span>
                        </div>
                      ))}
                      <div className="flex justify-between font-bold text-sm sm:text-base pt-2 border-t border-kot-chart">
                        <span className="text-kot-darker">Total</span>
                        <span className="text-kot-darker">
                          ₹{total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-kot-darker mb-2 sm:mb-3 text-sm sm:text-base">
                      Payment Method
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      {(["cash", "card", "upi"] as const).map((method) => (
                        <button
                          key={method}
                          onClick={() => onPaymentMethodChange(method)}
                          className={`py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold capitalize transition-all border-2 ${paymentMethod === method ? "bg-kot-dark text-white border-kot-dark" : "bg-kot-white text-kot-darker border-kot-chart hover:border-kot-dark"}`}
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
                  <div className="flex gap-2 sm:gap-3">
                    <button
                      onClick={onReset}
                      className="flex-1 py-2.5 border-2 border-kot-chart text-kot-darker font-semibold rounded-xl hover:bg-kot-light text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={onCollectPayment}
                      disabled={paying || !kotSent}
                      className="flex-1 py-2.5 bg-kot-dark hover:bg-kot-darker text-white font-bold rounded-xl disabled:opacity-60 transition-colors text-sm"
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

        {/* ── BILLS TAB ── */}
        {activeTab === "bills" && (
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
            <div className="flex-1 space-y-3 sm:space-y-4 min-w-0">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-kot-text"
                  size={15}
                />
                <input
                  type="text"
                  placeholder="Search by name, phone or bill number..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border-2 border-kot-chart rounded-xl bg-kot-white text-kot-darker text-sm focus:outline-none focus:border-kot-dark placeholder:text-kot-text/50"
                />
              </div>

              {billsLoading ? (
                <SkeletonBillStats />
              ) : (
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
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
                      className={`${s.color} rounded-2xl p-3 sm:p-4 shadow-kot`}
                    >
                      <p className="text-[10px] sm:text-xs text-kot-text font-medium">
                        {s.label}
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-kot-darker mt-0.5 sm:mt-1">
                        {s.value}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {billsLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <SkeletonBillRow key={i} />
                  ))}
                </div>
              ) : billsError ? (
                <div className="bg-kot-white rounded-2xl p-8 text-center shadow-kot">
                  <p className="text-red-500 font-medium text-sm">
                    {billsError}
                  </p>
                  <button
                    onClick={onRetryBills}
                    className="mt-3 px-4 py-2 bg-kot-dark text-white rounded-lg text-sm"
                  >
                    Retry
                  </button>
                </div>
              ) : filteredBills.length === 0 ? (
                <div className="bg-kot-white rounded-2xl p-10 sm:p-12 text-center shadow-kot">
                  <p className="text-2xl mb-2">🧾</p>
                  <p className="font-semibold text-kot-darker text-sm sm:text-base">
                    No bills found
                  </p>
                  <p className="text-xs sm:text-sm text-kot-text mt-1">
                    Bills will appear after takeaway payments
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredBills.map((bill) => (
                    <button
                      key={bill._id}
                      onClick={() => onSelectBill(bill)}
                      className={`w-full text-left bg-kot-white rounded-2xl p-3 sm:p-4 shadow-kot hover:shadow-kot-lg transition-all border-2 ${selectedBill?._id === bill._id ? "border-kot-dark" : "border-transparent"}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-bold text-kot-darker text-sm sm:text-base truncate">
                            {bill.customerName}
                          </p>
                          <p className="text-[10px] sm:text-xs text-kot-text mt-0.5 truncate">
                            {bill.billNumber} · {bill.customerPhone}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-kot-darker text-sm sm:text-base">
                            ₹{bill.totalAmount.toLocaleString()}
                          </p>
                          <span
                            className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-semibold ${bill.paymentStatus === "paid" ? "bg-emerald-100 text-emerald-700" : "bg-yellow-100 text-yellow-700"}`}
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

            {/* Bill Detail */}
            {selectedBill && (
              <>
                <div
                  className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                  onClick={() => onSelectBill(null)}
                />
                <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl max-h-[85vh] overflow-y-auto lg:static lg:z-auto lg:rounded-2xl lg:max-h-none lg:overflow-visible lg:w-80 xl:w-96 bg-kot-white shadow-kot flex-shrink-0">
                  <div className="flex items-center justify-between p-4 border-b border-kot-chart sticky top-0 bg-kot-white rounded-t-3xl lg:rounded-t-2xl z-10">
                    <h3 className="font-bold text-kot-darker">Bill Detail</h3>
                    <button
                      onClick={() => onSelectBill(null)}
                      className="text-kot-text hover:text-kot-darker p-1"
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
                              ₹{item.total ?? item.price * item.quantity}
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
                        className={`text-sm px-3 py-1 rounded-full font-semibold ${selectedBill.paymentStatus === "paid" ? "bg-emerald-100 text-emerald-700" : "bg-yellow-100 text-yellow-700"}`}
                      >
                        {selectedBill.paymentStatus}
                      </span>
                    </div>
                    {selectedBill.paymentStatus !== "paid" && (
                      <button
                        onClick={() => onMarkPaid(selectedBill._id)}
                        className="w-full py-2.5 bg-kot-dark hover:bg-kot-darker text-white font-bold rounded-xl transition-colors"
                      >
                        Mark as Paid ✓
                      </button>
                    )}
                    <button
                      onClick={() => onSetInvoiceBill(selectedBill)}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      🧾 View / Print GST Invoice
                    </button>
                    <p className="text-xs text-kot-text text-center">
                      {new Date(selectedBill.createdAt).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {invoiceBill && (
        <GstInvoice bill={invoiceBill} onClose={() => onSetInvoiceBill(null)} />
      )}
    </div>
  );
}
