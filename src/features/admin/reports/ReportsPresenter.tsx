import "./ChartsConfig";
import { RefreshCw } from "lucide-react";
import {
  Card,
  Button,
  Pulse,
  PageHeader,
  StatCard,
} from "../../../UiComponents/Index";
import { RevenueTrendChart } from "../../../charts/RevenueTrendChart";
import { OrdersByHourChart } from "../../../charts/Ordersbyhourchart";
import { PaymentBreakdownChart } from "../../../charts/Paymentbreakdownchart";
import { TopItemsChart } from "../../../charts/TopItemsChart";
import type { ReportsPresenterProps, DateRange } from "./reports.types";

const RANGES: { key: DateRange; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "week", label: "Week" },
  { key: "month", label: "Month" },
  { key: "custom", label: "Custom" },
];

export function ReportsPresenter({
  summary,
  topItems,
  payments,
  hourly,
  loading,
  refreshing,
  range,
  from,
  to,
  onRangeChange,
  onFromChange,
  onToChange,
  onRefresh,
  onApplyCustom,
}: ReportsPresenterProps) {
  return (
    <div className="min-h-screen bg-kot-primary">
      <main className="p-3 sm:p-4 lg:p-6 max-w-[2400px] mx-auto space-y-4">
        {/* ── Header ── */}
        <PageHeader
          title="Reports"
          sub="Sales analytics"
          actions={
            <Button
              variant="secondary"
              size="sm"
              onClick={onRefresh}
              className="flex items-center gap-1.5"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading || refreshing ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">
                {refreshing ? "Refreshing…" : "Refresh"}
              </span>
            </Button>
          }
        />

        {/* ── Range picker — scrollable on mobile ── */}
        <div className="overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0 scrollbar-none">
          <div className="flex gap-1.5 w-max sm:w-auto">
            {RANGES.map((r) => (
              <button
                key={r.key}
                onClick={() => onRangeChange(r.key)}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                  range === r.key
                    ? "bg-kot-dark text-white"
                    : "bg-kot-white text-kot-text hover:bg-kot-light border border-kot-chart"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Custom date picker ── */}
        {range === "custom" && (
          <Card className="p-3 sm:p-4">
            <div className="flex flex-wrap items-end gap-3">
              {(["from", "to"] as const).map((key) => (
                <div key={key} className="flex-1 min-w-[120px]">
                  <label className="block text-xs font-semibold text-kot-darker mb-1 capitalize">
                    {key}
                  </label>
                  <input
                    type="date"
                    value={key === "from" ? from : to}
                    onChange={(e) =>
                      key === "from"
                        ? onFromChange(e.target.value)
                        : onToChange(e.target.value)
                    }
                    className="w-full px-3 py-2 border-2 border-kot-chart rounded-lg text-sm focus:outline-none focus:border-kot-dark bg-kot-white text-kot-darker"
                  />
                </div>
              ))}
              <Button
                size="sm"
                onClick={onApplyCustom}
                className="flex-shrink-0"
              >
                Apply
              </Button>
            </div>
          </Card>
        )}

        {/* ── KPI cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          <StatCard
            label="Revenue"
            value={`₹${(summary?.totalRevenue ?? 0).toLocaleString("en-IN")}`}
            bg="bg-kot-stats"
            loading={loading}
          />
          <StatCard
            label="Orders"
            value={summary?.totalOrders ?? 0}
            bg="bg-blue-50"
            loading={loading}
          />
          <StatCard
            label="Bills"
            value={summary?.totalBills ?? 0}
            bg="bg-purple-50"
            loading={loading}
          />
          <StatCard
            label="Avg Value"
            value={`₹${(summary?.avgOrderValue ?? 0).toLocaleString("en-IN")}`}
            bg="bg-orange-50"
            loading={loading}
          />
        </div>

        {/* ── Dine-in vs Takeaway ── */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {[
            {
              label: "Dine-in",
              value: summary?.dineInCount ?? 0,
              emoji: "🪑",
              bg: "bg-kot-stats",
            },
            {
              label: "Takeaway",
              value: summary?.takeawayCount ?? 0,
              emoji: "🥡",
              bg: "bg-orange-50",
            },
          ].map((s) => (
            <div
              key={s.label}
              className={`${s.bg} rounded-2xl p-3 sm:p-4 shadow-kot flex items-center gap-3 sm:gap-4`}
            >
              <span className="text-2xl sm:text-3xl">{s.emoji}</span>
              <div>
                {loading ? (
                  <>
                    <Pulse className="h-6 w-10 mb-1" />
                    <Pulse className="h-3 w-16" />
                  </>
                ) : (
                  <>
                    <p className="text-xl sm:text-3xl font-bold text-kot-darker">
                      {s.value}
                    </p>
                    <p className="text-xs text-kot-text">{s.label}</p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── Charts Row 1 ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          <RevenueTrendChart hourly={hourly} loading={loading} />
          <OrdersByHourChart hourly={hourly} loading={loading} />
        </div>

        {/* ── Charts Row 2 ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          <PaymentBreakdownChart payments={payments} loading={loading} />
          <TopItemsChart topItems={topItems} loading={loading} />
        </div>
      </main>
    </div>
  );
}
