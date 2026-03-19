import {
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import type { OrdersPresenterProps, Order } from "./Order.types";

const STATUSES = [
  { value: "all", label: "All", color: "text-kot-text", bg: "bg-kot-light" },
  {
    value: "pending",
    label: "Pending",
    color: "text-yellow-700",
    bg: "bg-yellow-50",
  },
  {
    value: "preparing",
    label: "Preparing",
    color: "text-blue-700",
    bg: "bg-blue-50",
  },
  {
    value: "ready",
    label: "Ready",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
  },
  {
    value: "delivered",
    label: "Delivered",
    color: "text-kot-darker",
    bg: "bg-kot-stats",
  },
  {
    value: "cancelled",
    label: "Cancelled",
    color: "text-red-700",
    bg: "bg-red-50",
  },
];

const statusStyle = (s: string) =>
  STATUSES.find((x) => x.value === s) ?? STATUSES[0];

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

const Pulse = ({ className }: { className: string }) => (
  <div className={`bg-kot-chart rounded animate-pulse ${className}`} />
);

function SkeletonRow() {
  return (
    <tr className="border-b border-kot-chart">
      <td className="px-4 py-3">
        <Pulse className="h-4 w-24" />
      </td>
      <td className="px-4 py-3 hidden sm:table-cell">
        <Pulse className="h-4 w-28" />
      </td>
      <td className="px-4 py-3 hidden md:table-cell">
        <Pulse className="h-4 w-14" />
      </td>
      <td className="px-4 py-3">
        <Pulse className="h-5 w-20 rounded-full" />
      </td>
      <td className="px-4 py-3 hidden lg:table-cell">
        <Pulse className="h-4 w-16" />
      </td>
      <td className="px-4 py-3 hidden xl:table-cell">
        <Pulse className="h-4 w-20" />
      </td>
    </tr>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-kot-white rounded-xl shadow-kot p-4">
      <div className="flex justify-between mb-2">
        <Pulse className="h-4 w-24" />
        <Pulse className="h-5 w-20 rounded-full" />
      </div>
      <Pulse className="h-4 w-36 mb-1.5" />
      <Pulse className="h-3 w-28 mb-3" />
      <div className="flex justify-between">
        <Pulse className="h-3 w-24" />
        <Pulse className="h-4 w-16" />
      </div>
    </div>
  );
}

function OrderDetailPanel({
  order,
  onClose,
}: {
  order: Order;
  onClose: () => void;
}) {
  const st = statusStyle(order.status);
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed bottom-0 sm:bottom-auto sm:top-0 sm:right-0 sm:h-full left-0 right-0 sm:left-auto sm:w-96 bg-kot-white z-50 flex flex-col rounded-t-3xl sm:rounded-none shadow-kot-lg max-h-[85vh] sm:max-h-none">
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-kot-chart" />
        </div>
        <div className="flex items-center justify-between px-5 py-4 border-b border-kot-chart flex-shrink-0">
          <div>
            <h2 className="font-bold text-kot-darker">Order Detail</h2>
            <p className="text-xs text-kot-text mt-0.5">
              {formatDate(order.createdAt)} · {formatTime(order.createdAt)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-kot-text hover:text-kot-darker hover:bg-kot-light rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="bg-kot-light rounded-xl p-3.5">
            <p className="text-xs font-semibold text-kot-text uppercase tracking-wide mb-2">
              Customer
            </p>
            <p className="font-bold text-kot-darker">{order.customerName}</p>
            {order.customerPhone && (
              <p className="text-sm text-kot-text mt-0.5">
                {order.customerPhone}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              {
                label: "Type",
                value: <span className="capitalize">{order.orderType}</span>,
              },
              {
                label: "Table",
                value: order.tableNumber ? `#${order.tableNumber}` : "—",
              },
              {
                label: "Status",
                value: (
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${st.bg} ${st.color}`}
                  >
                    {st.label}
                  </span>
                ),
              },
              {
                label: "By",
                value: (
                  <span className="truncate block">{order.createdBy}</span>
                ),
              },
            ].map(({ label, value }) => (
              <div key={label} className="bg-kot-light rounded-xl p-3">
                <p className="text-xs text-kot-text">{label}</p>
                <p className="font-semibold text-sm text-kot-darker mt-0.5">
                  {value}
                </p>
              </div>
            ))}
          </div>
          <div>
            <p className="text-xs font-semibold text-kot-text uppercase tracking-wide mb-2">
              Items ({order.items.length})
            </p>
            <div className="space-y-1.5">
              {order.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-kot-light rounded-lg px-3 py-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-kot-dark text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                      {item.quantity}
                    </span>
                    <span className="text-sm text-kot-darker truncate">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-kot-dark flex-shrink-0 ml-2">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between p-3.5 bg-kot-dark rounded-xl">
            <span className="font-semibold text-white">Total Amount</span>
            <span className="text-xl font-bold text-white">
              ₹{order.totalAmount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export function OrdersPresenter({
  orders,
  total,
  page,
  totalPages,
  loading,
  refreshing,
  search,
  status,
  from,
  to,
  tableNum,
  showFilters,
  activeFilterCount,
  selectedOrder,
  onSearchChange,
  onStatusChange,
  onFromChange,
  onToChange,
  onTableNumChange,
  onToggleFilters,
  onClearFilters,
  onSelectOrder,
  onPageChange,
  onRefresh,
}: OrdersPresenterProps) {
  return (
    <div className="min-h-screen bg-kot-primary">
      <div className="p-3 sm:p-4 md:p-6 max-w-[2400px] mx-auto space-y-3 sm:space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg sm:text-2xl font-bold text-kot-darker">
              Orders
            </h1>
            <p className="text-xs sm:text-sm text-kot-text mt-0.5">
              {loading
                ? "Loading..."
                : `${total.toLocaleString()} orders found`}
            </p>
          </div>
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 border-kot-chart text-kot-dark bg-kot-white hover:bg-kot-light text-sm disabled:opacity-50"
          >
            <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        {/* Search + Filter bar */}
        <div className="bg-kot-white rounded-2xl shadow-kot p-3 sm:p-4 space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-kot-text"
                size={15}
              />
              <input
                type="text"
                placeholder="Search customer, phone, table..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border-2 border-kot-chart rounded-xl bg-kot-primary text-kot-darker text-sm focus:outline-none focus:border-kot-dark placeholder:text-kot-text/50"
              />
              {search && (
                <button
                  onClick={() => onSearchChange("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-kot-text hover:text-kot-darker"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <button
              onClick={onToggleFilters}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 text-sm font-medium transition-all flex-shrink-0 ${showFilters || activeFilterCount > 0 ? "border-kot-dark bg-kot-dark text-white" : "border-kot-chart text-kot-text hover:border-kot-dark hover:text-kot-darker"}`}
            >
              <Filter size={15} />
              <span className="hidden xs:inline">Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-white text-kot-dark text-[10px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Status pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {STATUSES.map((s) => (
              <button
                key={s.value}
                onClick={() => onStatusChange(s.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all border-2 ${status === s.value ? "border-kot-dark bg-kot-dark text-white" : `border-transparent ${s.bg} ${s.color} hover:border-kot-chart`}`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Expanded filters */}
          {showFilters && (
            <div className="pt-2 border-t border-kot-chart space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-kot-darker mb-1">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={from}
                    onChange={(e) => onFromChange(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-kot-chart rounded-lg text-sm focus:outline-none focus:border-kot-dark bg-kot-primary text-kot-darker"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-kot-darker mb-1">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={to}
                    onChange={(e) => onToChange(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-kot-chart rounded-lg text-sm focus:outline-none focus:border-kot-dark bg-kot-primary text-kot-darker"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-kot-darker mb-1">
                    Table Number
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 5"
                    value={tableNum}
                    onChange={(e) => onTableNumChange(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-kot-chart rounded-lg text-sm focus:outline-none focus:border-kot-dark bg-kot-primary text-kot-darker placeholder:text-kot-text/50"
                  />
                </div>
              </div>
              {activeFilterCount > 0 && (
                <button
                  onClick={onClearFilters}
                  className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1"
                >
                  <X size={12} /> Clear all filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Orders list */}
        {loading ? (
          <>
            <div className="hidden sm:block bg-kot-white rounded-xl shadow-kot border border-kot-chart overflow-hidden">
              <table className="w-full">
                <thead className="bg-kot-light border-b border-kot-chart">
                  <tr>
                    {[
                      "Time",
                      "Customer",
                      "Table",
                      "Status",
                      "Items",
                      "Amount",
                    ].map((h, i) => (
                      <th
                        key={h}
                        className={`px-4 py-3 text-left text-xs font-semibold text-kot-text uppercase ${i === 2 ? "hidden md:table-cell" : i === 4 ? "hidden lg:table-cell" : i === 5 ? "hidden xl:table-cell" : ""}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...Array(8)].map((_, i) => (
                    <SkeletonRow key={i} />
                  ))}
                </tbody>
              </table>
            </div>
            <div className="sm:hidden space-y-2">
              {[...Array(5)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </>
        ) : orders.length === 0 ? (
          <div className="bg-kot-white rounded-2xl shadow-kot p-12 text-center">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-base font-bold text-kot-darker">
              No orders found
            </p>
            <p className="text-sm text-kot-text mt-1">
              {search || activeFilterCount > 0
                ? "Try adjusting your search or filters"
                : "Orders will appear here once placed"}
            </p>
            {(search || activeFilterCount > 0) && (
              <button
                onClick={onClearFilters}
                className="mt-4 px-4 py-2 bg-kot-dark text-white text-sm font-semibold rounded-lg hover:bg-kot-darker"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block bg-kot-white rounded-xl shadow-kot border border-kot-chart overflow-hidden">
              <table className="w-full">
                <thead className="bg-kot-light border-b border-kot-chart">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-kot-text uppercase">
                      Time
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-kot-text uppercase">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-kot-text uppercase hidden md:table-cell">
                      Table
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-kot-text uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-kot-text uppercase hidden lg:table-cell">
                      Items
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-kot-text uppercase hidden xl:table-cell">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-kot-chart">
                  {orders.map((order) => {
                    const st = statusStyle(order.status);
                    return (
                      <tr
                        key={order._id}
                        onClick={() => onSelectOrder(order)}
                        className="hover:bg-kot-primary transition-colors cursor-pointer"
                      >
                        <td className="px-4 py-3">
                          <p className="text-xs font-medium text-kot-darker">
                            {formatDate(order.createdAt)}
                          </p>
                          <p className="text-[10px] text-kot-text">
                            {formatTime(order.createdAt)}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-semibold text-kot-darker truncate max-w-[140px]">
                            {order.customerName}
                          </p>
                          {order.customerPhone && (
                            <p className="text-xs text-kot-text">
                              {order.customerPhone}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className="text-sm text-kot-darker">
                            {order.tableNumber
                              ? `Table ${order.tableNumber}`
                              : order.orderType === "takeaway"
                                ? "🥡 Takeaway"
                                : "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${st.bg} ${st.color}`}
                          >
                            {st.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <p className="text-xs text-kot-text">
                            {order.items.length} item
                            {order.items.length !== 1 ? "s" : ""}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-right hidden xl:table-cell">
                          <span className="font-bold text-kot-darker text-sm">
                            ₹{order.totalAmount.toLocaleString()}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden space-y-2">
              {orders.map((order) => {
                const st = statusStyle(order.status);
                return (
                  <div
                    key={order._id}
                    onClick={() => onSelectOrder(order)}
                    className="bg-kot-white rounded-xl shadow-kot p-3.5 cursor-pointer hover:shadow-kot-lg transition-all"
                  >
                    <div className="flex items-start justify-between mb-1.5">
                      <div>
                        <p className="font-semibold text-sm text-kot-darker">
                          {order.customerName}
                        </p>
                        {order.customerPhone && (
                          <p className="text-xs text-kot-text">
                            {order.customerPhone}
                          </p>
                        )}
                      </div>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ml-2 ${st.bg} ${st.color}`}
                      >
                        {st.label}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-kot-text">
                      <div className="flex items-center gap-2">
                        <span>
                          {order.tableNumber
                            ? `Table ${order.tableNumber}`
                            : "Takeaway"}
                        </span>
                        <span>·</span>
                        <span>
                          {order.items.length} item
                          {order.items.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-kot-darker">
                          ₹{order.totalAmount.toLocaleString()}
                        </span>
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between bg-kot-white rounded-2xl shadow-kot px-4 py-3">
                <p className="text-xs sm:text-sm text-kot-text">
                  Page{" "}
                  <span className="font-semibold text-kot-darker">{page}</span>{" "}
                  of{" "}
                  <span className="font-semibold text-kot-darker">
                    {totalPages}
                  </span>
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => onPageChange(page - 1)}
                    disabled={page <= 1}
                    className="p-2 rounded-lg border-2 border-kot-chart text-kot-darker disabled:opacity-40 hover:bg-kot-light transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <div className="hidden sm:flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pg =
                        totalPages <= 5
                          ? i + 1
                          : page <= 3
                            ? i + 1
                            : page >= totalPages - 2
                              ? totalPages - 4 + i
                              : page - 2 + i;
                      return (
                        <button
                          key={pg}
                          onClick={() => onPageChange(pg)}
                          className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${pg === page ? "bg-kot-dark text-white" : "border-2 border-kot-chart text-kot-darker hover:bg-kot-light"}`}
                        >
                          {pg}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => onPageChange(page + 1)}
                    disabled={page >= totalPages}
                    className="p-2 rounded-lg border-2 border-kot-chart text-kot-darker disabled:opacity-40 hover:bg-kot-light transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {selectedOrder && (
        <OrderDetailPanel
          order={selectedOrder}
          onClose={() => onSelectOrder(null)}
        />
      )}
    </div>
  );
}
