import { useState, useEffect, useCallback } from "react";
import {
  TrendingUp,
  ShoppingBag,
  Receipt,
  Users,
  RefreshCw,
} from "lucide-react";
import {
  getSummaryApi,
  getTopItemsApi,
  getPaymentsApi,
  getHourlyApi,
} from "../../services/adminApi/Reports.api";
import type {
  DateRange,
  SummaryStats,
  TopItem,
  PaymentStat,
  HourlyStat,
} from "../../services/adminApi/Reports.api";

const Pulse = ({ className }: { className: string }) => (
  <div className={`bg-kot-chart rounded animate-pulse ${className}`} />
);

const PAYMENT_COLORS: Record<string, string> = {
  cash: "bg-emerald-500",
  card: "bg-blue-500",
  upi: "bg-purple-500",
};

export default function ReportsPage() {
  const [range, setRange] = useState<DateRange>("today");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [summary, setSummary] = useState<SummaryStats | null>(null);
  const [topItems, setTopItems] = useState<TopItem[]>([]);
  const [payments, setPayments] = useState<PaymentStat[]>([]);
  const [hourly, setHourly] = useState<HourlyStat[]>([]);

  const fetchAll = useCallback(
    async (showRefresh = false) => {
      try {
        if (showRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }
        const f = range === "custom" ? from : undefined;
        const t = range === "custom" ? to : undefined;
        const [sRes, tRes, pRes, hRes] = await Promise.all([
          getSummaryApi(range, f, t),
          getTopItemsApi(range, f, t),
          getPaymentsApi(range, f, t),
          getHourlyApi(range, f, t),
        ]);
        setSummary(sRes.data);
        setTopItems(tRes.data.topItems);
        setPayments(pRes.data.payments);
        setHourly(hRes.data.hourly);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [range, from, to],
  );

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const maxRevenue = Math.max(...hourly.map((h) => h.revenue), 1);

  return (
    <div className="min-h-screen bg-kot-primary">
      <div className="p-3 sm:p-4 md:p-6 max-w-[2400px] mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg sm:text-2xl font-bold text-kot-darker">
              Reports & Analytics
            </h1>
            <p className="text-xs sm:text-sm text-kot-text mt-0.5">
              View your business performance
            </p>
          </div>
          <button
            onClick={() => fetchAll(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 border-kot-chart text-kot-dark bg-kot-white hover:bg-kot-light text-sm disabled:opacity-50"
          >
            <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />{" "}
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        {/* Date Range Filter */}
        <div className="bg-kot-white rounded-2xl p-3 sm:p-4 shadow-kot">
          <div className="flex flex-wrap gap-1.5 mb-3">
            {(["today", "week", "month", "custom"] as DateRange[]).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium capitalize transition-all ${range === r ? "bg-kot-dark text-white" : "bg-kot-light text-kot-text hover:bg-kot-stats"}`}
              >
                {r === "week"
                  ? "This Week"
                  : r === "month"
                    ? "This Month"
                    : r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
          {range === "custom" && (
            <div className="flex flex-wrap gap-2 items-end">
              <div>
                <label className="block text-xs font-semibold text-kot-darker mb-1">
                  From
                </label>
                <input
                  type="date"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="px-3 py-2 border-2 border-kot-chart rounded-lg text-sm focus:outline-none focus:border-kot-dark"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-kot-darker mb-1">
                  To
                </label>
                <input
                  type="date"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="px-3 py-2 border-2 border-kot-chart rounded-lg text-sm focus:outline-none focus:border-kot-dark"
                />
              </div>
              <button
                onClick={() => from && to && fetchAll()}
                className="px-4 py-2 bg-kot-dark text-white text-sm font-semibold rounded-lg hover:bg-kot-darker"
              >
                Apply
              </button>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          {[
            {
              label: "Total Revenue",
              value: `₹${(summary?.totalRevenue || 0).toLocaleString()}`,
              icon: TrendingUp,
              color: "text-emerald-600",
              bg: "bg-emerald-50",
            },
            {
              label: "Total Orders",
              value: summary?.totalOrders || 0,
              icon: ShoppingBag,
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              label: "Total Bills",
              value: summary?.totalBills || 0,
              icon: Receipt,
              color: "text-purple-600",
              bg: "bg-purple-50",
            },
            {
              label: "Avg Order",
              value: `₹${(summary?.avgOrderValue || 0).toLocaleString()}`,
              icon: Users,
              color: "text-orange-600",
              bg: "bg-orange-50",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-kot-white rounded-2xl p-3 sm:p-4 shadow-kot"
            >
              {loading ? (
                <>
                  <Pulse className="w-10 h-10 rounded-xl mb-3" />
                  <Pulse className="h-7 w-20 mb-1" />
                  <Pulse className="h-3 w-24" />
                </>
              ) : (
                <>
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${s.bg} flex items-center justify-center mb-2 sm:mb-3`}
                  >
                    <s.icon size={18} className={s.color} />
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-kot-darker">
                    {s.value}
                  </p>
                  <p className="text-xs text-kot-text mt-0.5">{s.label}</p>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Dine-in vs Takeaway */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {[
            {
              emoji: "🪑",
              label: "Dine-in Orders",
              value: summary?.dineInCount || 0,
              bg: "bg-kot-stats",
            },
            {
              emoji: "🥡",
              label: "Takeaway Orders",
              value: summary?.takeawayCount || 0,
              bg: "bg-orange-50",
            },
          ].map((s) => (
            <div
              key={s.label}
              className={`${s.bg} rounded-2xl p-3 sm:p-4 shadow-kot flex items-center gap-3`}
            >
              {loading ? (
                <>
                  <Pulse className="w-12 h-12 rounded-xl" />
                  <div>
                    <Pulse className="h-7 w-8 mb-1" />
                    <Pulse className="h-3 w-20" />
                  </div>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/60 flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
                    {s.emoji}
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-bold text-kot-darker">
                      {s.value}
                    </p>
                    <p className="text-xs text-kot-text">{s.label}</p>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Top Items + Payments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          {/* Top Items */}
          <div className="bg-kot-white rounded-2xl p-4 sm:p-5 shadow-kot">
            <h2 className="text-base sm:text-lg font-bold text-kot-darker mb-3 sm:mb-4">
              🏆 Top Selling Items
            </h2>
            {loading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 bg-kot-light rounded-xl"
                  >
                    <Pulse className="w-8 h-8 rounded-full" />
                    <div className="flex-1">
                      <Pulse className="h-4 w-32 mb-1" />
                      <Pulse className="h-3 w-16" />
                    </div>
                    <Pulse className="h-4 w-14" />
                  </div>
                ))}
              </div>
            ) : topItems.length === 0 ? (
              <p className="text-center text-kot-text py-8 text-sm">
                No data for this period
              </p>
            ) : (
              <div className="space-y-2">
                {topItems.map((item, i) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-kot-light rounded-xl"
                  >
                    <span
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs text-white flex-shrink-0 ${i === 0 ? "bg-yellow-500" : i === 1 ? "bg-gray-400" : i === 2 ? "bg-orange-500" : "bg-kot-dark"}`}
                    >
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-kot-darker text-xs sm:text-sm truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-kot-text">
                        {item.quantity} orders
                      </p>
                    </div>
                    <p className="font-bold text-kot-dark text-xs sm:text-sm flex-shrink-0">
                      ₹{item.revenue.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payment Methods */}
          <div className="bg-kot-white rounded-2xl p-4 sm:p-5 shadow-kot">
            <h2 className="text-base sm:text-lg font-bold text-kot-darker mb-3 sm:mb-4">
              💳 Payment Methods
            </h2>
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1.5">
                      <Pulse className="h-4 w-16" />
                      <Pulse className="h-4 w-20" />
                    </div>
                    <Pulse className="h-2.5 w-full rounded-full" />
                  </div>
                ))}
              </div>
            ) : payments.length === 0 ? (
              <p className="text-center text-kot-text py-8 text-sm">
                No data for this period
              </p>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {payments.map((p) => (
                  <div key={p.method}>
                    <div className="flex justify-between items-center mb-1">
                      <div>
                        <p className="font-semibold text-sm text-kot-darker capitalize">
                          {p.method}
                        </p>
                        <p className="text-xs text-kot-text">
                          {p.count} transactions
                        </p>
                      </div>
                      <p className="font-bold text-kot-dark text-sm">
                        ₹{p.amount.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2.5 bg-kot-light rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${PAYMENT_COLORS[p.method.toLowerCase()] || "bg-kot-dark"}`}
                          style={{ width: `${p.percentage}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-kot-text w-7 text-right">
                        {p.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sales by Hour */}
        <div className="bg-kot-white rounded-2xl p-4 sm:p-5 shadow-kot">
          <h2 className="text-base sm:text-lg font-bold text-kot-darker mb-3 sm:mb-4">
            ⏰ Sales by Hour
          </h2>
          {loading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Pulse className="h-4 w-16" />
                  <Pulse className="h-4 w-8" />
                  <Pulse className="h-4 w-16" />
                  <Pulse className="h-2 flex-1 rounded-full" />
                </div>
              ))}
            </div>
          ) : hourly.length === 0 ? (
            <p className="text-center text-kot-text py-8 text-sm">
              No data for this period
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[340px]">
                <thead>
                  <tr className="border-b border-kot-chart">
                    <th className="text-left py-2 px-2 sm:px-3 text-xs font-semibold text-kot-text uppercase">
                      Time
                    </th>
                    <th className="text-right py-2 px-2 sm:px-3 text-xs font-semibold text-kot-text uppercase">
                      Orders
                    </th>
                    <th className="text-right py-2 px-2 sm:px-3 text-xs font-semibold text-kot-text uppercase">
                      Revenue
                    </th>
                    <th className="py-2 px-2 sm:px-3 w-24 sm:w-40"></th>
                  </tr>
                </thead>
                <tbody>
                  {hourly.map((h) => (
                    <tr
                      key={h.hour}
                      className="border-b border-kot-chart hover:bg-kot-primary transition-colors"
                    >
                      <td className="py-2.5 px-2 sm:px-3 font-medium text-sm text-kot-darker">
                        {h.hour}
                      </td>
                      <td className="py-2.5 px-2 sm:px-3 text-right text-sm text-kot-text">
                        {h.orders}
                      </td>
                      <td className="py-2.5 px-2 sm:px-3 text-right font-bold text-sm text-kot-dark">
                        ₹{h.revenue.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-2 sm:px-3">
                        <div className="h-2 bg-kot-light rounded-full overflow-hidden">
                          <div
                            className="h-full bg-kot-dark rounded-full"
                            style={{
                              width: `${(h.revenue / maxRevenue) * 100}%`,
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
