import { RefreshCw } from "lucide-react";
import {
  Card,
  Button,
  Pulse,
  PageHeader,
  RangePicker,
  ProgressBar,
  EmptyState,
  StatCard,
} from "../../../UiComponents/Index";
import type { ReportsPresenterProps, DateRange } from "./reports.types";

const PAYMENT_COLORS: Record<string, string> = {
  cash: "bg-green-500",
  card: "bg-blue-500",
  upi: "bg-purple-500",
  other: "bg-gray-400",
};

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
  onApplyCustom,
  onRefresh,
}: ReportsPresenterProps) {
  const maxRevenue = Math.max(...hourly.map((h) => h.revenue), 1);
  const maxQty = Math.max(...topItems.map((i) => i.quantity), 1);

  return (
    <div className="min-h-screen bg-kot-primary">
      <main className="p-3 sm:p-4 lg:p-6 max-w-[2400px] mx-auto space-y-4">
        <PageHeader
          title="Reports"
          sub="Sales analytics and performance"
          actions={
            <>
              <RangePicker<DateRange>
                ranges={["today", "week", "month", "custom"]}
                active={range}
                onChange={onRangeChange}
              />
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
            </>
          }
        />

        {/* Custom date picker */}
        {range === "custom" && (
          <Card className="p-4 flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-xs font-semibold text-kot-darker mb-1">
                From
              </label>
              <input
                type="date"
                value={from}
                onChange={(e) => onFromChange(e.target.value)}
                className="px-3 py-2 border-2 border-kot-chart rounded-lg text-sm focus:outline-none focus:border-kot-dark bg-kot-white text-kot-darker"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-kot-darker mb-1">
                To
              </label>
              <input
                type="date"
                value={to}
                onChange={(e) => onToChange(e.target.value)}
                className="px-3 py-2 border-2 border-kot-chart rounded-lg text-sm focus:outline-none focus:border-kot-dark bg-kot-white text-kot-darker"
              />
            </div>
            <Button size="sm" onClick={onApplyCustom}>
              Apply
            </Button>
          </Card>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            label="Total Revenue"
            value={`₹${(summary?.totalRevenue ?? 0).toLocaleString("en-IN")}`}
            bg="bg-kot-stats"
            loading={loading}
          />
          <StatCard
            label="Total Orders"
            value={summary?.totalOrders ?? 0}
            bg="bg-blue-50"
            loading={loading}
          />
          <StatCard
            label="Total Bills"
            value={summary?.totalBills ?? 0}
            bg="bg-purple-50"
            loading={loading}
          />
          <StatCard
            label="Avg Order Value"
            value={`₹${(summary?.avgOrderValue ?? 0).toLocaleString("en-IN")}`}
            bg="bg-orange-50"
            loading={loading}
          />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Top Items */}
          <Card className="p-5">
            <h2 className="text-base font-bold text-kot-darker mb-4">
              Top Selling Items
            </h2>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i}>
                    <Pulse className="h-3 w-full mb-1" />
                    <Pulse className="h-2 w-full rounded-full" />
                  </div>
                ))}
              </div>
            ) : topItems.length === 0 ? (
              <EmptyState icon="📋" title="No order data" />
            ) : (
              <div className="space-y-3">
                {topItems.slice(0, 8).map((item, idx) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-kot-light text-kot-dark text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between mb-1">
                        <p className="text-sm font-medium text-kot-darker truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-kot-text ml-2 flex-shrink-0">
                          {item.quantity} sold
                        </p>
                      </div>
                      <ProgressBar value={item.quantity} max={maxQty} />
                    </div>
                    <p className="text-sm font-bold text-kot-darker flex-shrink-0 w-24 text-right">
                      ₹{item.revenue.toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Payments */}
          <Card className="p-5">
            <h2 className="text-base font-bold text-kot-darker mb-4">
              Payment Breakdown
            </h2>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i}>
                    <Pulse className="h-3 w-full mb-1" />
                    <Pulse className="h-2 w-full rounded-full" />
                  </div>
                ))}
              </div>
            ) : payments.length === 0 ? (
              <EmptyState icon="💳" title="No payment data" />
            ) : (
              <div className="space-y-3">
                {payments.map((p) => (
                  <div key={p.method}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-kot-darker capitalize">
                        {p.method}
                      </span>
                      <span className="text-kot-text">
                        {p.count} txns · ₹{p.amount.toLocaleString("en-IN")} (
                        {p.percentage}%)
                      </span>
                    </div>
                    <ProgressBar
                      value={p.percentage}
                      max={100}
                      colorClass={PAYMENT_COLORS[p.method] || "bg-kot-dark"}
                    />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Hourly bar chart */}
        <Card className="p-5">
          <h2 className="text-base font-bold text-kot-darker mb-5">
            Hourly Revenue
          </h2>
          {loading ? (
            <div className="flex items-end gap-2 h-40">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Pulse
                  key={i}
                  className="flex-1 rounded-t-lg"
                  style={{ height: `${20 + i * 8}%` }}
                />
              ))}
            </div>
          ) : hourly.length === 0 ? (
            <EmptyState icon="📊" title="No hourly data" />
          ) : (
            <div className="flex items-end gap-1 h-40 overflow-x-auto pb-2">
              {hourly.map((h) => (
                <div
                  key={h.hour}
                  className="flex flex-col items-center gap-0.5 flex-shrink-0"
                  style={{ minWidth: "32px" }}
                >
                  <p className="text-[9px] font-medium text-kot-darker">
                    {h.revenue >= 1000
                      ? `${(h.revenue / 1000).toFixed(1)}k`
                      : h.revenue}
                  </p>
                  <div
                    className="w-7 bg-kot-dark rounded-t-lg hover:bg-kot-darker transition-colors"
                    style={{
                      height: `${Math.max((h.revenue / maxRevenue) * 100, 4)}px`,
                    }}
                    title={`${h.hour}: ₹${h.revenue} (${h.orders} orders)`}
                  />
                  <p className="text-[9px] text-kot-text">{h.hour}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
