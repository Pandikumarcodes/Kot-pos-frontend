// src/pages/admin/AdminDashboard.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const stats = {
  todayRevenue: 45230,
  todayOrders: 156,
  activeOrders: 12,
  availableTables: 8,
  occupiedTables: 15,
  totalTables: 25,
  avgOrderValue: 290,
  peakHour: "1:00 PM",
};

const recentOrders = [
  {
    id: "ORD-001",
    table: 5,
    amount: 1250,
    status: "preparing",
    time: "2 min ago",
    items: 4,
  },
  {
    id: "ORD-002",
    table: 12,
    amount: 890,
    status: "ready",
    time: "5 min ago",
    items: 3,
  },
  {
    id: "ORD-003",
    table: 3,
    amount: 2100,
    status: "preparing",
    time: "8 min ago",
    items: 6,
  },
  {
    id: "ORD-004",
    table: 18,
    amount: 650,
    status: "served",
    time: "12 min ago",
    items: 2,
  },
  {
    id: "ORD-005",
    table: 7,
    amount: 1580,
    status: "preparing",
    time: "15 min ago",
    items: 5,
  },
];

const topItems = [
  { name: "Paneer Butter Masala", orders: 23 },
  { name: "Masala Dosa", orders: 18 },
  { name: "Biryani", orders: 15 },
  { name: "Dal Makhani", orders: 12 },
];

const staffPerformance = [
  { name: "Rahul", orders: 45, revenue: 12500, rating: 4.8 },
  { name: "Priya", orders: 38, revenue: 10200, rating: 4.9 },
  { name: "Amit", orders: 32, revenue: 8900, rating: 4.6 },
  { name: "Sneha", orders: 28, revenue: 7800, rating: 4.7 },
];

const tables = [
  { id: "t1", tableNumber: 1, status: "available", capacity: 4 },
  {
    id: "t2",
    tableNumber: 2,
    status: "occupied",
    capacity: 2,
    currentGuests: 2,
    orderAmount: 850,
    duration: "25 min",
    waiterName: "Rahul",
  },
  {
    id: "t3",
    tableNumber: 3,
    status: "billing",
    capacity: 6,
    orderAmount: 2100,
    duration: "1h 15m",
    waiterName: "Priya",
  },
  { id: "t4", tableNumber: 4, status: "available", capacity: 4 },
  {
    id: "t5",
    tableNumber: 5,
    status: "occupied",
    capacity: 4,
    currentGuests: 3,
    orderAmount: 1250,
    duration: "35 min",
    waiterName: "Amit",
  },
  { id: "t6", tableNumber: 6, status: "reserved", capacity: 8 },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "preparing":
      return { className: "bg-yellow-100 text-yellow-800", label: "Preparing" };
    case "ready":
      return { className: "bg-green-100 text-green-800", label: "Ready" };
    case "served":
      return { className: "bg-blue-100 text-blue-800", label: "Served" };
    default:
      return { className: "bg-kot-light text-kot-darker", label: status };
  }
};

const getTableStatus = (status: string) => {
  switch (status) {
    case "available":
      return {
        badge: "bg-kot-stats text-kot-darker",
        border: "border-kot-dark",
      };
    case "occupied":
      return {
        badge: "bg-yellow-100 text-yellow-800",
        border: "border-yellow-400",
      };
    case "billing":
      return { badge: "bg-red-100 text-red-800", border: "border-red-400" };
    case "reserved":
      return { badge: "bg-blue-100 text-blue-800", border: "border-blue-400" };
    default:
      return {
        badge: "bg-kot-light text-kot-text",
        border: "border-kot-chart",
      };
  }
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [selectedView, setSelectedView] = useState<
    "overview" | "tables" | "orders"
  >("overview");

  return (
    <div className="min-h-screen bg-kot-primary">
      <main className="p-4 md:p-6 max-w-[1600px] mx-auto space-y-6">
        {/* Page Title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-kot-darker">
              Admin Dashboard
            </h1>
            <p className="text-sm mt-0.5 text-kot-text">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border-2 border-kot-chart text-kot-dark bg-kot-white hover:bg-kot-light transition-all">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              Alerts (3)
            </button>
            <button className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-kot-dark hover:bg-kot-darker transition-all">
              + New Order
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Today's Revenue",
              value: `₹${stats.todayRevenue.toLocaleString()}`,
              sub: "+15.3% vs yesterday",
              positive: true,
            },
            {
              label: "Orders Today",
              value: stats.todayOrders,
              sub: `${stats.activeOrders} active now`,
              positive: true,
            },
            {
              label: "Table Occupancy",
              value: `${stats.occupiedTables}/${stats.totalTables}`,
              sub: `${stats.availableTables} available`,
              positive: null,
            },
            {
              label: "Avg Order Value",
              value: `₹${stats.avgOrderValue}`,
              sub: `Peak: ${stats.peakHour}`,
              positive: false,
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-kot-white rounded-2xl p-5 shadow-kot"
            >
              <p className="text-xs font-medium uppercase tracking-wide mb-3 text-kot-text">
                {s.label}
              </p>
              <p className="text-2xl font-bold mb-1 text-kot-darker">
                {s.value}
              </p>
              <p
                className={`text-xs font-medium ${s.positive === null ? "text-kot-text" : s.positive ? "text-kot-dark" : "text-red-500"}`}
              >
                {s.positive === true ? "↑ " : s.positive === false ? "↓ " : ""}
                {s.sub}
              </p>
            </div>
          ))}
        </div>

        {/* View Toggle */}
        <div className="bg-kot-white rounded-2xl p-2 flex gap-1 shadow-kot w-fit">
          {(["overview", "tables", "orders"] as const).map((view) => (
            <button
              key={view}
              onClick={() => setSelectedView(view)}
              className={`px-5 py-2 rounded-xl text-sm font-medium capitalize transition-all duration-200 ${
                selectedView === view
                  ? "bg-kot-dark text-white"
                  : "text-kot-text hover:bg-kot-light hover:text-kot-darker"
              }`}
            >
              {view}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {selectedView === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Orders */}
            <div className="lg:col-span-2 bg-kot-white rounded-2xl p-6 shadow-kot">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-base font-bold text-kot-darker">
                  Recent Orders
                </h2>
                <button className="text-xs font-medium px-3 py-1.5 rounded-lg border-2 border-kot-chart text-kot-dark hover:bg-kot-light transition-all">
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {recentOrders.map((order) => {
                  const badge = getStatusBadge(order.status);
                  return (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-kot-primary hover:bg-kot-light transition-all"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white text-sm bg-kot-dark">
                          {order.table}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="font-semibold text-sm text-kot-darker">
                              {order.id}
                            </p>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.className}`}
                            >
                              {badge.label}
                            </span>
                          </div>
                          <p className="text-xs text-kot-text">
                            {order.items} items • {order.time}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-kot-darker">
                          ₹{order.amount}
                        </p>
                        <button className="text-xs mt-1 px-2 py-1 rounded-lg text-kot-dark bg-kot-light">
                          View
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-5">
              {/* Top Items */}
              <div className="bg-kot-white rounded-2xl p-6 shadow-kot">
                <h2 className="text-base font-bold mb-4 text-kot-darker">
                  Top Items Today
                </h2>
                <div className="space-y-3">
                  {topItems.map((item, index) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-kot-light text-kot-dark">
                          {index + 1}
                        </span>
                        <p className="text-sm font-medium text-kot-darker">
                          {item.name}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-kot-dark">
                        {item.orders}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-kot-white rounded-2xl p-6 shadow-kot">
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
                    }, // ✅ fixed
                    {
                      label: "View Reports",
                      primary: false,
                      path: "/admin/reports",
                    },
                    {
                      label: "Staff Management",
                      primary: false,
                      path: "/admin/staff",
                    }, // ✅ fixed
                  ].map((action) => (
                    <button
                      key={action.label}
                      onClick={() => navigate(action.path)}
                      className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                        action.primary
                          ? "bg-kot-dark hover:bg-kot-darker text-white"
                          : "bg-kot-primary hover:bg-kot-light text-kot-dark border-2 border-kot-chart"
                      }`}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TABLES VIEW ── */}
        {selectedView === "tables" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-kot-darker">
                Table Management
              </h2>
              <div className="flex gap-2">
                <button className="px-4 py-2 rounded-xl text-sm font-medium border-2 border-kot-chart text-kot-dark bg-kot-white hover:bg-kot-light transition-all">
                  Filter
                </button>
                <button className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-kot-dark hover:bg-kot-darker transition-all">
                  + Add Table
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {tables.map((table) => {
                const ts = getTableStatus(table.status);
                return (
                  <div
                    key={table.id}
                    className={`bg-kot-white rounded-2xl p-5 border-l-4 shadow-kot ${ts.border}`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-lg font-bold text-kot-darker">
                          Table {table.tableNumber}
                        </p>
                        <p className="text-xs text-kot-text">
                          Capacity: {table.capacity}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${ts.badge}`}
                      >
                        {table.status}
                      </span>
                    </div>
                    {"waiterName" in table && (
                      <div className="space-y-1 pt-3 border-t border-kot-light">
                        <p className="text-xs text-kot-text">
                          Waiter:{" "}
                          <span className="text-kot-darker font-semibold">
                            {(table as { waiterName?: string }).waiterName}
                          </span>
                        </p>
                        {"orderAmount" in table && (
                          <p className="text-sm font-bold text-kot-dark">
                            ₹{(table as { orderAmount?: number }).orderAmount}
                          </p>
                        )}
                        {"duration" in table && (
                          <p className="text-xs text-kot-text">
                            {(table as { duration?: string }).duration}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── ORDERS VIEW ── */}
        {selectedView === "orders" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-kot-darker">All Orders</h2>
              <div className="flex gap-2">
                {["Filter", "Export"].map((label) => (
                  <button
                    key={label}
                    className="px-4 py-2 rounded-xl text-sm font-medium border-2 border-kot-chart text-kot-dark bg-kot-white hover:bg-kot-light transition-all"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-kot-white rounded-2xl overflow-hidden shadow-kot">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-kot-primary">
                    <tr>
                      {[
                        "Order ID",
                        "Table",
                        "Items",
                        "Status",
                        "Time",
                        "Amount",
                        "Actions",
                      ].map((h, i) => (
                        <th
                          key={h}
                          className={`py-3 px-4 text-xs font-semibold uppercase tracking-wide text-kot-text ${i >= 5 ? "text-right" : "text-left"}`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => {
                      const badge = getStatusBadge(order.status);
                      return (
                        <tr
                          key={order.id}
                          className="border-b border-kot-light hover:bg-kot-primary transition-colors"
                        >
                          <td className="py-3 px-4 text-sm font-semibold text-kot-darker">
                            {order.id}
                          </td>
                          <td className="py-3 px-4 text-sm text-kot-text">
                            Table {order.table}
                          </td>
                          <td className="py-3 px-4 text-sm text-kot-text">
                            {order.items} items
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${badge.className}`}
                            >
                              {badge.label}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-kot-text">
                            {order.time}
                          </td>
                          <td className="py-3 px-4 text-right text-sm font-bold text-kot-darker">
                            ₹{order.amount}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button className="text-xs px-3 py-1.5 rounded-lg font-medium bg-kot-light text-kot-dark hover:bg-kot-stats transition-colors">
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Staff Performance */}
        {selectedView === "overview" && (
          <div className="bg-kot-white rounded-2xl p-6 shadow-kot">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-base font-bold text-kot-darker">
                Staff Performance Today
              </h2>
              <button className="text-xs font-medium px-3 py-1.5 rounded-lg border-2 border-kot-chart text-kot-dark hover:bg-kot-light transition-all">
                View Details
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {staffPerformance.map((staff) => (
                <div
                  key={staff.name}
                  className="p-4 rounded-xl space-y-3 bg-kot-primary"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm text-kot-darker">
                      {staff.name}
                    </h4>
                    <div className="flex items-center gap-1">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="#FBBF24"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-xs font-semibold text-kot-darker">
                        {staff.rating}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-kot-text">Orders</span>
                      <span className="font-semibold text-kot-darker">
                        {staff.orders}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-kot-text">Revenue</span>
                      <span className="font-semibold text-kot-dark">
                        ₹{staff.revenue.toLocaleString()}
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div className="h-1.5 rounded-full mt-2 bg-kot-chart">
                      <div
                        className="h-1.5 rounded-full bg-kot-dark"
                        style={{ width: `${(staff.orders / 50) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
