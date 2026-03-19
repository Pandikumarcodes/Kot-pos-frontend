import {
  Pulse,
  Card,
  Button,
  PageHeader,
  TabBar,
  RangePicker,
  ProgressBar,
  EmptyState,
} from "../../../UiComponents/Index";
import type {
  AdminDashboardPresenterProps,
  RangeType,
  ViewType,
} from "./dashboard.types";

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

function SkeletonStatCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <Pulse className="h-3 w-20" />
            <Pulse className="w-9 h-9 rounded-xl" />
          </div>
          <Pulse className="h-7 w-24 mb-1" />
          <Pulse className="h-3 w-28" />
        </Card>
      ))}
    </div>
  );
}

export function AdminDashboardPresenter({
  summary,
  topItems,
  tables,
  hourly,
  payments,
  loading,
  refreshing,
  range,
  selectedView,
  onRangeChange,
  onViewChange,
  onRefresh,
  onNavigate,
}: AdminDashboardPresenterProps) {
  const availableTables = tables.filter((t) => t.status === "available").length;
  const occupiedTables = tables.filter((t) => t.status === "occupied").length;
  const billingTables = tables.filter((t) => t.status === "billing").length;
  const maxRevenue = Math.max(...hourly.map((h) => h.revenue), 1);

  return (
    <div className="min-h-screen bg-kot-primary">
      <main className="p-3 sm:p-4 lg:p-6 max-w-[2400px] mx-auto space-y-4 sm:space-y-5">
        <PageHeader
          title="Admin Dashboard"
          sub={new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          actions={
            <>
              <RangePicker<RangeType>
                ranges={["today", "week", "month"]}
                active={range}
                onChange={onRangeChange}
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={onRefresh}
                disabled={refreshing}
                className="flex items-center gap-1.5"
              >
                <svg
                  className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
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
              </Button>
              <Button size="sm" onClick={() => onNavigate("/waiter/tables")}>
                + New Order
              </Button>
            </>
          }
        />

        {loading ? (
          <SkeletonStatCards />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                label: "Total Revenue",
                value: `₹${(summary?.totalRevenue ?? 0).toLocaleString("en-IN")}`,
                sub: `${summary?.totalBills ?? 0} bills paid`,
                icon: "💰",
                bg: "bg-kot-stats",
              },
              {
                label: "Total Orders",
                value: summary?.totalOrders ?? 0,
                sub: `${summary?.dineInCount ?? 0} dine-in · ${summary?.takeawayCount ?? 0} takeaway`,
                icon: "📋",
                bg: "bg-blue-50",
              },
              {
                label: "Avg Order Value",
                value: `₹${(summary?.avgOrderValue ?? 0).toLocaleString("en-IN")}`,
                sub: "per bill",
                icon: "📊",
                bg: "bg-purple-50",
              },
              {
                label: "Tables",
                value: `${occupiedTables + billingTables}/${tables.length}`,
                sub: `${availableTables} available · ${billingTables} billing`,
                icon: "🪑",
                bg: "bg-orange-50",
              },
            ].map((s) => (
              <Card key={s.label} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-kot-text">
                    {s.label}
                  </p>
                  <span
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${s.bg}`}
                  >
                    {s.icon}
                  </span>
                </div>
                <p className="text-2xl font-bold text-kot-darker mb-0.5">
                  {s.value}
                </p>
                <p className="text-xs text-kot-text">{s.sub}</p>
              </Card>
            ))}
          </div>
        )}

        <TabBar<ViewType>
          tabs={[
            { key: "overview", label: "Overview" },
            { key: "tables", label: "Tables" },
            { key: "analytics", label: "Analytics" },
          ]}
          active={selectedView}
          onChange={onViewChange}
        />

        {/* OVERVIEW */}
        {selectedView === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2 p-5">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-base font-bold text-kot-darker">
                  Top Selling Items
                </h2>
                <span className="text-xs text-kot-text capitalize">
                  {range}
                </span>
              </div>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Pulse className="w-7 h-7 rounded-full flex-shrink-0" />
                      <div className="flex-1">
                        <Pulse className="h-3 w-full mb-1" />
                        <Pulse className="h-1.5 w-full rounded-full" />
                      </div>
                      <Pulse className="h-4 w-16" />
                    </div>
                  ))}
                </div>
              ) : topItems.length === 0 ? (
                <EmptyState icon="🍽️" title="No orders yet" />
              ) : (
                <div className="space-y-3">
                  {topItems.slice(0, 6).map((item, i) => (
                    <div key={item.name} className="flex items-center gap-4">
                      <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold bg-kot-light text-kot-dark flex-shrink-0">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between mb-1">
                          <p className="text-sm font-medium text-kot-darker truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-kot-text ml-2 flex-shrink-0">
                            {item.quantity} orders
                          </p>
                        </div>
                        <ProgressBar
                          value={item.quantity}
                          max={topItems[0]?.quantity || 1}
                        />
                      </div>
                      <p className="text-sm font-bold text-kot-darker flex-shrink-0">
                        ₹{item.revenue.toLocaleString("en-IN")}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <div className="space-y-4">
              <Card className="p-5">
                <h2 className="text-base font-bold mb-4 text-kot-darker">
                  Payment Methods
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
                  <p className="text-sm text-kot-text text-center py-4">
                    No payments yet
                  </p>
                ) : (
                  <div className="space-y-3">
                    {payments.map((p) => (
                      <div key={p.method}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-medium text-kot-darker capitalize">
                            {p.method}
                          </span>
                          <span className="text-kot-text">
                            {p.percentage}% · ₹
                            {p.amount.toLocaleString("en-IN")}
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

              <Card className="p-5">
                <h2 className="text-base font-bold mb-4 text-kot-darker">
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
                  ].map((a) => (
                    <Button
                      key={a.label}
                      variant={a.primary ? "primary" : "secondary"}
                      size="sm"
                      onClick={() => onNavigate(a.path)}
                      className="w-full"
                    >
                      {a.label}
                    </Button>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* TABLES */}
        {selectedView === "tables" && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {[
                {
                  label: "Available",
                  count: availableTables,
                  cls: "bg-kot-stats text-kot-darker",
                },
                {
                  label: "Occupied",
                  count: occupiedTables,
                  cls: "bg-yellow-100 text-yellow-800",
                },
                {
                  label: "Billing",
                  count: billingTables,
                  cls: "bg-red-100 text-red-800",
                },
              ].map((s) => (
                <span
                  key={s.label}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full ${s.cls}`}
                >
                  {s.label}: {s.count}
                </span>
              ))}
            </div>
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="p-4 border-l-4 border-kot-chart">
                    <Pulse className="h-5 w-8 mb-2" />
                    <Pulse className="h-5 w-14 rounded-full mb-2" />
                    <Pulse className="h-3 w-16" />
                  </Card>
                ))}
              </div>
            ) : tables.length === 0 ? (
              <EmptyState icon="🪑" title="No tables found" />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                {tables.map((t) => {
                  const ts = getTableStyle(t.status);
                  return (
                    <div
                      key={t._id}
                      className={`bg-kot-white rounded-2xl p-4 border-l-4 shadow-kot ${ts.border}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-lg font-bold text-kot-darker">
                          T{t.tableNumber}
                        </p>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${ts.badge}`}
                        >
                          {t.status}
                        </span>
                      </div>
                      <p className="text-xs text-kot-text">Cap: {t.capacity}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ANALYTICS */}
        {selectedView === "analytics" && (
          <div className="space-y-4">
            <Card className="p-5">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-base font-bold text-kot-darker">
                  Hourly Sales
                </h2>
                <span className="text-xs text-kot-text capitalize">
                  {range}
                </span>
              </div>
              {loading ? (
                <div className="flex items-end gap-2 h-40">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <Pulse
                      key={i}
                      className="flex-1 rounded-t-lg"
                      style={{ height: `${30 + i * 10}%` }}
                    />
                  ))}
                </div>
              ) : hourly.length === 0 ? (
                <EmptyState icon="📊" title="No sales data yet" />
              ) : (
                <div className="flex items-end gap-1.5 h-40 overflow-x-auto pb-2">
                  {hourly.map((h) => (
                    <div
                      key={h.hour}
                      className="flex flex-col items-center gap-0.5 flex-shrink-0"
                      style={{ minWidth: "36px" }}
                    >
                      <p className="text-[9px] font-medium text-kot-darker">
                        {h.revenue >= 1000
                          ? `${(h.revenue / 1000).toFixed(1)}k`
                          : h.revenue}
                      </p>
                      <div
                        className="w-8 bg-kot-dark rounded-t-lg hover:bg-kot-darker transition-colors"
                        style={{
                          height: `${Math.max((h.revenue / maxRevenue) * 100, 4)}px`,
                        }}
                        title={`${h.hour}: ₹${h.revenue}`}
                      />
                      <p className="text-[9px] text-kot-text">{h.hour}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
