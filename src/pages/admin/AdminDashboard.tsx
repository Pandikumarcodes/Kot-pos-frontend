import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getDashboardSummaryApi,
  getTopItemsApi,
  getDashboardTablesApi,
  getHourlySalesApi,
  getPaymentMethodsApi,
} from "../../services/adminApi/Admindashboard.api";

interface Summary {
  totalRevenue: number;
  totalOrders: number;
  totalBills: number;
  avgOrderValue: number;
  dineInCount: number;
  takeawayCount: number;
}
interface TopItem {
  name: string;
  quantity: number;
  revenue: number;
}
interface Table {
  _id: string;
  tableNumber: number;
  status: "available" | "occupied" | "billing" | "reserved";
  capacity: number;
}
interface HourlyData {
  hour: string;
  orders: number;
  revenue: number;
}
interface PaymentMethod {
  method: string;
  count: number;
  amount: number;
  percentage: number;
}

const getTableStyle = (status: string) => {
  switch (status) {
    case "available":
      return {
        badge: "bg-kot-stats text-kot-darker",
        border: "border-l-kot-dark",
      };
    case "occupied":
      return {
        badge: "bg-yellow-100 text-yellow-800",
        border: "border-l-yellow-400",
      };
    case "billing":
      return { badge: "bg-red-100 text-red-800", border: "border-l-red-400" };
    case "reserved":
      return {
        badge: "bg-blue-100 text-blue-800",
        border: "border-l-blue-400",
      };
    default:
      return {
        badge: "bg-kot-light text-kot-text",
        border: "border-l-kot-chart",
      };
  }
};

const PAYMENT_COLORS: Record<string, string> = {
  cash: "bg-green-500",
  card: "bg-blue-500",
  upi: "bg-purple-500",
  other: "bg-gray-400",
};
type RangeType = "today" | "week" | "month";
type ViewType = "overview" | "tables" | "analytics";

const Pulse = ({ className }: { className: string }) => (
  <div className={`bg-kot-chart rounded animate-pulse ${className}`} />
);

function SkeletonStatCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-kot-white rounded-2xl p-4 sm:p-5 shadow-kot">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <Pulse className="h-3 w-20" />
            <Pulse className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl" />
          </div>
          <Pulse className="h-7 w-24 mb-1" />
          <Pulse className="h-3 w-28" />
        </div>
      ))}
    </div>
  );
}

function SkeletonTopItems() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="flex items-center gap-3 sm:gap-4">
          <Pulse className="w-7 h-7 rounded-full flex-shrink-0" />
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <Pulse className="h-3.5 w-32" />
              <Pulse className="h-3.5 w-16" />
            </div>
            <Pulse className="h-1.5 w-full rounded-full" />
          </div>
          <Pulse className="h-4 w-16 flex-shrink-0" />
        </div>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [selectedView, setSelectedView] = useState<ViewType>("overview");
  const [range, setRange] = useState<RangeType>("today");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [summary, setSummary] = useState<Summary | null>(null);
  const [topItems, setTopItems] = useState<TopItem[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [hourly, setHourly] = useState<HourlyData[]>([]);
  const [payments, setPayments] = useState<PaymentMethod[]>([]);

  const fetchData = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      try {
        const [summaryRes, topItemsRes, tablesRes, hourlyRes, paymentsRes] =
          await Promise.all([
            getDashboardSummaryApi(range),
            getTopItemsApi(range),
            getDashboardTablesApi(),
            getHourlySalesApi(range),
            getPaymentMethodsApi(range),
          ]);
        setSummary(summaryRes.data);
        setTopItems(topItemsRes.data.topItems || []);
        setTables(tablesRes.data.tables || []);
        setHourly(hourlyRes.data.hourly || []);
        setPayments(paymentsRes.data.payments || []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [range],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const availableTables = tables.filter((t) => t.status === "available").length;
  const occupiedTables = tables.filter((t) => t.status === "occupied").length;
  const billingTables = tables.filter((t) => t.status === "billing").length;
  const maxRevenue = Math.max(...hourly.map((h) => h.revenue), 1);

  return (
    <div className="min-h-screen bg-kot-primary">
      <main className="p-3 sm:p-4 lg:p-6 xl:p-8 max-w-[2400px] mx-auto space-y-4 sm:space-y-5 lg:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-kot-darker">
              Admin Dashboard
            </h1>
            <p className="text-[10px] sm:text-sm text-kot-text mt-0.5">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex bg-kot-white rounded-xl border-2 border-kot-chart overflow-hidden">
              {(["today", "week", "month"] as RangeType[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium capitalize transition-all ${range === r ? "bg-kot-dark text-white" : "text-kot-text hover:bg-kot-light"}`}
                >
                  {r}
                </button>
              ))}
            </div>
            <button
              onClick={() => fetchData(true)}
              disabled={refreshing}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium border-2 border-kot-chart text-kot-dark bg-kot-white hover:bg-kot-light transition-all disabled:opacity-50"
            >
              <svg
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${refreshing ? "animate-spin" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span className="hidden sm:inline">
                {refreshing ? "Refreshing..." : "Refresh"}
              </span>
            </button>
            <button
              onClick={() => navigate("/waiter/tables")}
              className="px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium text-white bg-kot-dark hover:bg-kot-darker transition-all"
            >
              + <span className="hidden sm:inline">New </span>Order
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        {loading ? (
          <SkeletonStatCards />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 lg:gap-4">
            {[
              {
                label: "Total Revenue",
                value: `₹${(summary?.totalRevenue || 0).toLocaleString("en-IN")}`,
                sub: `${summary?.totalBills || 0} bills paid`,
                icon: "💰",
                color: "bg-kot-stats",
              },
              {
                label: "Total Orders",
                value: summary?.totalOrders || 0,
                sub: `${summary?.dineInCount || 0} dine-in · ${summary?.takeawayCount || 0} takeaway`,
                icon: "📋",
                color: "bg-blue-50",
              },
              {
                label: "Avg Order Value",
                value: `₹${(summary?.avgOrderValue || 0).toLocaleString("en-IN")}`,
                sub: "per bill",
                icon: "📊",
                color: "bg-purple-50",
              },
              {
                label: "Tables",
                value: `${occupiedTables + billingTables}/${tables.length}`,
                sub: `${availableTables} available · ${billingTables} billing`,
                icon: "🪑",
                color: "bg-orange-50",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-kot-white rounded-2xl p-3.5 sm:p-5 shadow-kot"
              >
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <p className="text-[9px] sm:text-xs font-medium uppercase tracking-wide text-kot-text">
                    {s.label}
                  </p>
                  <span
                    className={`w-7 h-7 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-sm sm:text-lg ${s.color}`}
                  >
                    {s.icon}
                  </span>
                </div>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold mb-0.5 sm:mb-1 text-kot-darker">
                  {s.value}
                </p>
                <p className="text-[10px] sm:text-xs text-kot-text">{s.sub}</p>
              </div>
            ))}
          </div>
        )}

        {/* View Toggle */}
        <div className="bg-kot-white rounded-2xl p-1 sm:p-2 flex gap-1 shadow-kot w-fit overflow-x-auto">
          {(["overview", "tables", "analytics"] as ViewType[]).map((view) => (
            <button
              key={view}
              onClick={() => setSelectedView(view)}
              className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm lg:text-base font-medium capitalize transition-all duration-200 whitespace-nowrap ${selectedView === view ? "bg-kot-dark text-white" : "text-kot-text hover:bg-kot-light hover:text-kot-darker"}`}
            >
              {view}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {selectedView === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {/* Top Items */}
            <div className="lg:col-span-2 bg-kot-white rounded-2xl p-4 sm:p-6 shadow-kot">
              <div className="flex justify-between items-center mb-4 sm:mb-5">
                <h2 className="text-sm sm:text-base font-bold text-kot-darker">
                  Top Selling Items
                </h2>
                <span className="text-[10px] sm:text-xs text-kot-text capitalize">
                  {range}
                </span>
              </div>
              {loading ? (
                <SkeletonTopItems />
              ) : topItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 sm:py-12 text-kot-text">
                  <span className="text-3xl sm:text-4xl mb-3">🍽️</span>
                  <p className="font-medium text-sm sm:text-base">
                    No orders yet
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5 sm:space-y-3">
                  {topItems.slice(0, 6).map((item, index) => (
                    <div
                      key={item.name}
                      className="flex items-center gap-2 sm:gap-4"
                    >
                      <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold bg-kot-light text-kot-dark flex-shrink-0">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between mb-1">
                          <p className="text-xs sm:text-sm font-medium text-kot-darker truncate">
                            {item.name}
                          </p>
                          <p className="text-[10px] sm:text-xs text-kot-text ml-2 flex-shrink-0">
                            {item.quantity} orders
                          </p>
                        </div>
                        <div className="h-1 sm:h-1.5 bg-kot-light rounded-full">
                          <div
                            className="h-1 sm:h-1.5 bg-kot-dark rounded-full transition-all"
                            style={{
                              width: `${(item.quantity / (topItems[0]?.quantity || 1)) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-kot-darker flex-shrink-0">
                        ₹{item.revenue.toLocaleString("en-IN")}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right panel */}
            <div className="space-y-4 sm:space-y-5">
              {/* Payment Methods */}
              <div className="bg-kot-white rounded-2xl p-4 sm:p-6 shadow-kot">
                <h2 className="text-sm sm:text-base font-bold mb-3 sm:mb-4 text-kot-darker">
                  Payment Methods
                </h2>
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i}>
                        <div className="flex justify-between mb-1">
                          <Pulse className="h-3 w-16" />
                          <Pulse className="h-3 w-24" />
                        </div>
                        <Pulse className="h-2 w-full rounded-full" />
                      </div>
                    ))}
                  </div>
                ) : payments.length === 0 ? (
                  <p className="text-xs sm:text-sm text-kot-text text-center py-4">
                    No payments yet
                  </p>
                ) : (
                  <div className="space-y-2.5 sm:space-y-3">
                    {payments.map((p) => (
                      <div key={p.method}>
                        <div className="flex justify-between text-[10px] sm:text-xs mb-1">
                          <span className="font-medium text-kot-darker capitalize">
                            {p.method}
                          </span>
                          <span className="text-kot-text">
                            {p.percentage}% · ₹
                            {p.amount.toLocaleString("en-IN")}
                          </span>
                        </div>
                        <div className="h-1.5 sm:h-2 bg-kot-light rounded-full">
                          <div
                            className={`h-1.5 sm:h-2 rounded-full ${PAYMENT_COLORS[p.method] || "bg-kot-dark"}`}
                            style={{ width: `${p.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-kot-white rounded-2xl p-4 sm:p-6 shadow-kot">
                <h2 className="text-sm sm:text-base font-bold mb-3 sm:mb-4 text-kot-darker">
                  Quick Actions
                </h2>
                <div className="space-y-2">
                  {[
                    {
                      label: "New Order",
                      primary: true,
                      path: "/waiter/tables",
                    },
                    {
                      label: "Manage Menu",
                      primary: false,
                      path: "/admin/menu",
                    },
                    {
                      label: "View Reports",
                      primary: false,
                      path: "/admin/reports",
                    },
                    {
                      label: "Staff Management",
                      primary: false,
                      path: "/admin/staff",
                    },
                  ].map((action) => (
                    <button
                      key={action.label}
                      onClick={() => navigate(action.path)}
                      className={`w-full py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${action.primary ? "bg-kot-dark hover:bg-kot-darker text-white" : "bg-kot-primary hover:bg-kot-light text-kot-dark border-2 border-kot-chart"}`}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TABLES ── */}
        {selectedView === "tables" && (
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-2">
                {[
                  {
                    label: "Available",
                    count: availableTables,
                    color: "bg-kot-stats text-kot-darker",
                  },
                  {
                    label: "Occupied",
                    count: occupiedTables,
                    color: "bg-yellow-100 text-yellow-800",
                  },
                  {
                    label: "Billing",
                    count: billingTables,
                    color: "bg-red-100 text-red-800",
                  },
                ].map((s) => (
                  <span
                    key={s.label}
                    className={`text-[10px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full ${s.color}`}
                  >
                    {s.label}: {s.count}
                  </span>
                ))}
              </div>
              <button
                onClick={() => navigate("/admin/tables")}
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium text-white bg-kot-dark hover:bg-kot-darker transition-all"
              >
                Manage Tables
              </button>
            </div>
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-2 sm:gap-3 lg:gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div
                    key={i}
                    className="bg-kot-white rounded-2xl p-3 sm:p-4 border-l-4 border-kot-chart shadow-kot"
                  >
                    <Pulse className="h-5 w-8 mb-1.5" />
                    <Pulse className="h-5 w-14 rounded-full mb-1.5" />
                    <Pulse className="h-3 w-16" />
                  </div>
                ))}
              </div>
            ) : tables.length === 0 ? (
              <div className="bg-kot-white rounded-2xl p-10 sm:p-12 text-center shadow-kot">
                <span className="text-3xl sm:text-4xl mb-3 block">🪑</span>
                <p className="font-medium text-kot-darker text-sm sm:text-base">
                  No tables found
                </p>
                <button
                  onClick={() => navigate("/admin/tables")}
                  className="mt-3 text-xs sm:text-sm text-kot-dark underline"
                >
                  Add tables
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-2 sm:gap-3 lg:gap-4">
                {tables.map((table) => {
                  const ts = getTableStyle(table.status);
                  return (
                    <div
                      key={table._id}
                      className={`bg-kot-white rounded-2xl p-3 sm:p-4 border-l-4 shadow-kot ${ts.border}`}
                    >
                      <div className="flex justify-between items-start mb-1.5 sm:mb-2">
                        <p className="text-base sm:text-lg font-bold text-kot-darker">
                          T{table.tableNumber}
                        </p>
                        <span
                          className={`text-[9px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-medium capitalize ${ts.badge}`}
                        >
                          {table.status}
                        </span>
                      </div>
                      <p className="text-[10px] sm:text-xs text-kot-text">
                        Cap: {table.capacity}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── ANALYTICS ── */}
        {selectedView === "analytics" && (
          <div className="space-y-4 sm:space-y-5 lg:space-y-6">
            {/* Hourly Chart */}
            <div className="bg-kot-white rounded-2xl p-4 sm:p-6 shadow-kot">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-sm sm:text-base font-bold text-kot-darker">
                  Hourly Sales
                </h2>
                <span className="text-[10px] sm:text-xs text-kot-text capitalize">
                  {range}
                </span>
              </div>
              {loading ? (
                <div className="flex items-end gap-2 h-32 sm:h-48">
                  <div className="flex gap-1.5 sm:gap-2 w-full">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                      <Pulse
                        key={i}
                        className={`flex-1 rounded-t-lg`}
                        style={{ height: `${20 + Math.random() * 60}%` }}
                      />
                    ))}
                  </div>
                </div>
              ) : hourly.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 sm:py-12 text-kot-text">
                  <span className="text-3xl sm:text-4xl mb-3">📊</span>
                  <p className="font-medium text-sm sm:text-base">
                    No sales data yet
                  </p>
                </div>
              ) : (
                <div className="flex items-end gap-1 sm:gap-2 h-32 sm:h-48 overflow-x-auto pb-2">
                  {hourly.map((h) => (
                    <div
                      key={h.hour}
                      className="flex flex-col items-center gap-0.5 sm:gap-1 flex-shrink-0"
                      style={{ minWidth: "36px" }}
                    >
                      <p className="text-[8px] sm:text-xs font-medium text-kot-darker">
                        ₹
                        {h.revenue >= 1000
                          ? `${(h.revenue / 1000).toFixed(1)}k`
                          : h.revenue}
                      </p>
                      <div
                        className="w-7 sm:w-10 bg-kot-dark rounded-t-lg transition-all hover:bg-kot-darker"
                        style={{
                          height: `${Math.max((h.revenue / maxRevenue) * 120, 4)}px`,
                        }}
                        title={`${h.hour}: ₹${h.revenue} (${h.orders} orders)`}
                      />
                      <p className="text-[8px] sm:text-xs text-kot-text">
                        {h.hour}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {/* Order Types */}
              <div className="bg-kot-white rounded-2xl p-4 sm:p-6 shadow-kot">
                <h3 className="text-xs sm:text-sm font-bold text-kot-darker mb-3 sm:mb-4">
                  Order Types
                </h3>
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2].map((i) => (
                      <div key={i}>
                        <Pulse className="h-3 w-full mb-1" />
                        <Pulse className="h-2 w-full rounded-full" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2.5 sm:space-y-3">
                    {[
                      {
                        label: "Dine-in",
                        count: summary?.dineInCount || 0,
                        color: "bg-kot-dark",
                      },
                      {
                        label: "Takeaway",
                        count: summary?.takeawayCount || 0,
                        color: "bg-blue-400",
                      },
                    ].map((s) => (
                      <div key={s.label}>
                        <div className="flex justify-between text-[10px] sm:text-xs mb-1">
                          <span className="text-kot-text">{s.label}</span>
                          <span className="font-semibold text-kot-darker">
                            {s.count}
                          </span>
                        </div>
                        <div className="h-1.5 sm:h-2 bg-kot-light rounded-full">
                          <div
                            className={`h-1.5 sm:h-2 ${s.color} rounded-full`}
                            style={{
                              width: `${(s.count / Math.max(summary?.totalOrders || 1, 1)) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Revenue Summary */}
              <div className="bg-kot-white rounded-2xl p-4 sm:p-6 shadow-kot">
                <h3 className="text-xs sm:text-sm font-bold text-kot-darker mb-3 sm:mb-4">
                  Revenue Summary
                </h3>
                {loading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex justify-between py-1 border-b border-kot-light"
                      >
                        <Pulse className="h-3 w-20" />
                        <Pulse className="h-3 w-16" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-1.5 sm:space-y-2">
                    {[
                      {
                        label: "Total Revenue",
                        value: `₹${(summary?.totalRevenue || 0).toLocaleString("en-IN")}`,
                      },
                      { label: "Total Bills", value: summary?.totalBills || 0 },
                      {
                        label: "Avg Bill Value",
                        value: `₹${(summary?.avgOrderValue || 0).toLocaleString("en-IN")}`,
                      },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className="flex justify-between py-1 border-b border-kot-light last:border-0"
                      >
                        <span className="text-[10px] sm:text-xs text-kot-text">
                          {s.label}
                        </span>
                        <span className="text-[10px] sm:text-xs font-bold text-kot-darker">
                          {s.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Table Summary */}
              <div className="bg-kot-white rounded-2xl p-4 sm:p-6 shadow-kot">
                <h3 className="text-xs sm:text-sm font-bold text-kot-darker mb-3 sm:mb-4">
                  Table Summary
                </h3>
                {loading ? (
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="flex justify-between py-1 border-b border-kot-light"
                      >
                        <Pulse className="h-3 w-20" />
                        <Pulse className="h-3 w-8" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-1.5 sm:space-y-2">
                    {[
                      { label: "Total Tables", value: tables.length },
                      { label: "Available", value: availableTables },
                      { label: "Occupied", value: occupiedTables },
                      { label: "Billing", value: billingTables },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className="flex justify-between py-1 border-b border-kot-light last:border-0"
                      >
                        <span className="text-[10px] sm:text-xs text-kot-text">
                          {s.label}
                        </span>
                        <span className="text-[10px] sm:text-xs font-bold text-kot-darker">
                          {s.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
