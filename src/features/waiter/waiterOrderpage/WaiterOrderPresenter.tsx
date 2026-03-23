// WaiterOrderPresenter - mobile fixes
import { Search, X, Plus, ChevronUp } from "lucide-react";
import type { WaiterOrderPresenterProps } from "./waiterOrderTypes";

const Pulse = ({ className }: { className: string }) => (
  <div className={`bg-kot-chart rounded animate-pulse ${className}`} />
);

const inputClass =
  "w-full px-3 py-2.5 border-2 border-kot-chart rounded-lg focus:outline-none focus:border-kot-dark bg-kot-white text-kot-darker placeholder:text-kot-text/50 text-sm";

const statusColor = (status: string) => {
  if (status === "sent_to_kitchen") return "bg-blue-100 text-blue-700";
  if (status === "served") return "bg-emerald-100 text-emerald-700";
  if (status === "pending") return "bg-yellow-100 text-yellow-700";
  return "bg-kot-light text-kot-text";
};

export function WaiterOrderPresenter({
  customerName,
  tableNumber,
  roundCount,
  view,
  onSwitchToMenu,
  onSwitchToHistory,
  onBack,
  historyLoading,
  allItems,
  grandTotal,
  menuLoading,
  categories,
  selectedCategory,
  onCategoryChange,
  filteredMenu,
  search,
  onSearchChange,
  orderItems,
  cartTotal,
  onAddItem,
  onUpdateQty,
  showOrderPanel,
  onToggleOrderPanel,
  sendingKot,
  onSendKot,
  sendingToCashier,
  onSendToCashier,
}: WaiterOrderPresenterProps) {
  return (
    <div className="min-h-screen bg-kot-primary">
      <div className="max-w-[2400px] mx-auto p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4">
        {/* ── Header ── */}
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-base sm:text-2xl font-bold text-kot-darker truncate">
              {view === "history" ? "Table Order" : `Round ${roundCount + 1}`}
            </h1>
            <p className="text-xs sm:text-sm text-kot-text mt-0.5 truncate">
              {customerName}
              {tableNumber ? ` · Table ${tableNumber}` : ""}
              {roundCount > 0 && view === "history"
                ? ` · ${roundCount} round${roundCount > 1 ? "s" : ""}`
                : ""}
            </p>
          </div>
          <button
            onClick={view === "menu" ? onSwitchToHistory : onBack}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 border-kot-chart text-kot-dark bg-kot-white hover:bg-kot-light text-xs sm:text-sm"
          >
            {view === "menu" ? "← Back" : "← Tables"}
          </button>
        </div>

        {/* ── HISTORY VIEW ── */}
        {view === "history" && (
          <div className="space-y-3">
            {historyLoading ? (
              <div className="bg-kot-white rounded-2xl p-6 space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <Pulse className="h-4 w-32" />
                    <Pulse className="h-4 w-16" />
                  </div>
                ))}
              </div>
            ) : allItems.length === 0 ? (
              <div className="bg-kot-white rounded-2xl shadow-kot p-10 text-center">
                <p className="text-3xl mb-2">🍽️</p>
                <p className="font-semibold text-kot-darker">
                  No items ordered yet
                </p>
                <p className="text-xs text-kot-text mt-1">
                  Tap "Start Order" to take the first round
                </p>
              </div>
            ) : (
              <div className="bg-kot-white rounded-2xl shadow-kot overflow-hidden">
                <div className="p-3 sm:p-4 border-b border-kot-chart flex items-center justify-between">
                  <h2 className="font-bold text-kot-darker text-sm sm:text-base">
                    Order Summary
                  </h2>
                  <span className="text-xs text-kot-text">
                    {roundCount} round{roundCount > 1 ? "s" : ""}
                  </span>
                </div>

                {Array.from({ length: roundCount }, (_, i) => {
                  const roundItems = allItems.filter(
                    (item) => item.round === i + 1,
                  );
                  if (!roundItems.length) return null;
                  const roundTotal = roundItems.reduce(
                    (s, it) => s + it.price * it.quantity,
                    0,
                  );
                  return (
                    <div
                      key={i}
                      className="border-b border-kot-chart last:border-0"
                    >
                      <div className="px-3 sm:px-4 py-2 bg-kot-light flex items-center justify-between">
                        <span className="text-xs font-semibold text-kot-darker">
                          Round {i + 1}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${statusColor(roundItems[0]?.status)}`}
                        >
                          {roundItems[0]?.status?.replace("_", " ")}
                        </span>
                      </div>
                      {roundItems.map((item, j) => (
                        <div
                          key={j}
                          className="flex items-center justify-between px-3 sm:px-4 py-2"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-5 h-5 rounded-full bg-kot-dark text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                              {item.quantity}
                            </span>
                            <span className="text-sm text-kot-darker truncate">
                              {item.name}
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-kot-darker flex-shrink-0 ml-2">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                      <div className="flex justify-end px-3 sm:px-4 py-1.5 text-xs text-kot-text">
                        Round total: ₹{roundTotal.toFixed(2)}
                      </div>
                    </div>
                  );
                })}

                <div className="flex items-center justify-between px-3 sm:px-4 py-3 bg-kot-dark rounded-b-2xl">
                  <span className="font-semibold text-white text-sm">
                    Grand Total
                  </span>
                  <span className="text-lg font-bold text-white">
                    ₹{grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={onSwitchToMenu}
                className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-kot-dark text-kot-dark font-bold rounded-xl hover:bg-kot-light transition-colors text-sm"
              >
                <Plus size={16} />
                {allItems.length === 0 ? "Start Order" : "Add More Items"}
              </button>
              {allItems.length > 0 && (
                <button
                  onClick={onSendToCashier}
                  disabled={sendingToCashier}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-kot-dark hover:bg-kot-darker text-white font-bold rounded-xl transition-colors disabled:opacity-60 text-sm"
                >
                  {sendingToCashier ? "Sending..." : "Send to Cashier 🧾"}
                </button>
              )}
            </div>

            {allItems.length > 0 && (
              <p className="text-xs text-kot-text text-center px-4">
                💡 Use "Add More Items" for each new round. "Send to Cashier"
                when customer is done eating.
              </p>
            )}
          </div>
        )}

        {/* ── MENU VIEW ── */}
        {view === "menu" && (
          <div className="relative">
            {/* Mobile floating cart button */}
            {orderItems.length > 0 && (
              <button
                onClick={() => onToggleOrderPanel(true)}
                className="fixed bottom-4 right-4 z-40 sm:hidden flex items-center gap-2 px-4 py-3 bg-kot-dark text-white rounded-2xl shadow-lg font-bold text-sm"
              >
                <ChevronUp size={16} />
                {orderItems.length} items · ₹{cartTotal.toFixed(0)}
              </button>
            )}

            <div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4"
              style={{ height: "calc(100vh - 200px)" }}
            >
              {/* ── Menu panel ── */}
              <div className="flex-1 flex flex-col bg-kot-white rounded-2xl shadow-kot overflow-hidden min-h-0">
                {/* Search + category tabs */}
                <div className="p-2 sm:p-3 border-b border-kot-chart space-y-2 flex-shrink-0">
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-kot-text"
                      size={14}
                    />
                    <input
                      type="text"
                      placeholder="Search menu..."
                      value={search}
                      onChange={(e) => onSearchChange(e.target.value)}
                      className={`${inputClass} pl-8`}
                    />
                    {search && (
                      <button
                        onClick={() => onSearchChange("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-kot-text"
                      >
                        <X size={13} />
                      </button>
                    )}
                  </div>
                  <div className="flex gap-1 overflow-x-auto pb-0.5 scrollbar-none">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => onCategoryChange(cat)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex-shrink-0 transition-colors ${
                          selectedCategory === cat
                            ? "bg-kot-dark text-white"
                            : "text-kot-text hover:bg-kot-light"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Menu grid */}
                <div className="flex-1 overflow-y-auto p-2 sm:p-3">
                  {menuLoading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                      {Array.from({ length: 9 }).map((_, i) => (
                        <div
                          key={i}
                          className="bg-kot-light rounded-xl p-3 animate-pulse"
                        >
                          <Pulse className="h-3 w-16 mb-2" />
                          <Pulse className="h-4 w-full mb-1" />
                          <Pulse className="h-4 w-12" />
                        </div>
                      ))}
                    </div>
                  ) : filteredMenu.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-kot-text gap-2 py-12">
                      <p className="text-3xl">🍽️</p>
                      <p className="text-sm font-medium">No items found</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
                      {filteredMenu.map((item) => {
                        const inOrder = orderItems.find(
                          (oi) => oi.id === item._id,
                        );
                        return (
                          <button
                            key={item._id}
                            onClick={() => onAddItem(item)}
                            className="bg-kot-light rounded-xl p-2.5 sm:p-3 text-left border border-kot-chart hover:border-kot-dark transition-all hover:shadow-kot active:scale-95"
                          >
                            <div className="flex items-start justify-between mb-1">
                              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-kot-white text-kot-dark font-medium capitalize">
                                {item.category}
                              </span>
                              {inOrder && (
                                <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-kot-dark text-white text-[9px] flex items-center justify-center font-bold flex-shrink-0">
                                  {inOrder.quantity}
                                </span>
                              )}
                            </div>
                            <p className="font-semibold text-kot-darker text-xs sm:text-sm mt-1.5 leading-tight line-clamp-2">
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

              {/* ── Cart panel — bottom sheet on mobile, sidebar on desktop ── */}
              <>
                {showOrderPanel && (
                  <div
                    className="fixed inset-0 bg-black/40 z-40 sm:hidden"
                    onClick={() => onToggleOrderPanel(false)}
                  />
                )}
                <div
                  className={`
                  sm:w-64 lg:w-72 bg-kot-white rounded-2xl shadow-kot flex flex-col flex-shrink-0
                  fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl max-h-[85vh]
                  sm:static sm:z-auto sm:rounded-2xl sm:max-h-none
                  transition-transform duration-300
                  ${showOrderPanel ? "translate-y-0" : "translate-y-full sm:translate-y-0"}
                `}
                >
                  {/* Drag handle on mobile */}
                  <div className="flex justify-center pt-2.5 pb-1 sm:hidden">
                    <div className="w-8 h-1 rounded-full bg-kot-chart" />
                  </div>

                  {/* Panel header */}
                  <div className="p-3 sm:p-4 border-b border-kot-chart bg-kot-light rounded-t-3xl sm:rounded-t-2xl flex items-center justify-between flex-shrink-0">
                    <div>
                      <h3 className="font-bold text-kot-darker text-sm sm:text-base">
                        Round {roundCount + 1}
                      </h3>
                      <p className="text-xs text-kot-text mt-0.5 truncate max-w-[200px]">
                        {customerName}
                        {tableNumber ? ` · Table ${tableNumber}` : ""}
                      </p>
                    </div>
                    <button
                      onClick={() => onToggleOrderPanel(false)}
                      className="sm:hidden p-1.5 text-kot-text hover:text-kot-darker rounded-lg hover:bg-kot-white transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Items */}
                  <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-2">
                    {orderItems.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-kot-text gap-2 py-8">
                        <p className="text-3xl">🍽️</p>
                        <p className="text-sm">Tap items to add</p>
                      </div>
                    ) : (
                      orderItems.map((item) => (
                        <div
                          key={item.id}
                          className="bg-kot-light rounded-lg p-2.5 border border-kot-chart"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs sm:text-sm font-semibold text-kot-darker flex-1 truncate pr-2">
                              {item.name}
                            </p>
                            <button
                              onClick={() => onUpdateQty(item.id, 0)}
                              className="text-red-400 hover:text-red-600 text-xs flex-shrink-0"
                            >
                              ✕
                            </button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
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

                  {/* Footer */}
                  {orderItems.length > 0 && (
                    <div className="p-3 sm:p-4 border-t border-kot-chart space-y-2 flex-shrink-0">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-kot-darker text-sm">
                          Round Total
                        </span>
                        <span className="text-base font-bold text-kot-darker">
                          ₹{cartTotal.toFixed(2)}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          onToggleOrderPanel(false);
                          onSendKot();
                        }}
                        disabled={sendingKot}
                        className="w-full py-2.5 bg-kot-dark hover:bg-kot-darker text-white font-bold rounded-xl transition-colors disabled:opacity-60 text-sm"
                      >
                        {sendingKot
                          ? "Sending..."
                          : `Send Round ${roundCount + 1} to Kitchen 🍳`}
                      </button>
                    </div>
                  )}
                </div>
              </>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
