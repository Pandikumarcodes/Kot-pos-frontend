// src/pages/AdminDashboard/AdminDashboard.tsx
import { useState } from "react";
import Header from "../../design-system/organisms/Header";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../design-system/atoms/Card/Card";
import StatCard from "../../design-system/molecules/StatCard";
import TableCard from "../../design-system/molecules/TableCard";
import { Button } from "../../design-system/atoms/Button/Button";

export const AdminDashboard = () => {
  const [selectedView, setSelectedView] = useState<
    "overview" | "tables" | "orders"
  >("overview");

  // Mock data - replace with actual API calls
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

  const tables = [
    { id: "t1", tableNumber: 1, status: "available" as const, capacity: 4 },
    {
      id: "t2",
      tableNumber: 2,
      status: "occupied" as const,
      capacity: 2,
      currentGuests: 2,
      orderAmount: 850,
      duration: "25 min",
      waiterName: "Rahul",
    },
    {
      id: "t3",
      tableNumber: 3,
      status: "billing" as const,
      capacity: 6,
      orderAmount: 2100,
      duration: "1h 15m",
      waiterName: "Priya",
    },
    { id: "t4", tableNumber: 4, status: "available" as const, capacity: 4 },
    {
      id: "t5",
      tableNumber: 5,
      status: "occupied" as const,
      capacity: 4,
      currentGuests: 3,
      orderAmount: 1250,
      duration: "35 min",
      waiterName: "Amit",
    },
    { id: "t6", tableNumber: 6, status: "reserved" as const, capacity: 8 },
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

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case "preparing":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "ready":
        return "bg-green-100 text-green-700 border-green-200";
      case "served":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-kot-light">
      <Header
        title="Admin Dashboard"
        subtitle={`Today: ${new Date().toLocaleDateString("en-IN", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}`}
        userName="Admin User"
        userRole="Restaurant Manager"
        actions={
          <>
            <Button variant="secondary">
              <svg
                className="w-5 h-5"
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
              <span className="hidden sm:inline ml-2">Alerts (3)</span>
            </Button>
            <Button variant="primary">New Order</Button>
          </>
        }
        onLogout={() => console.log("Logout")}
      />

      <main className="p-4 md:p-6 max-w-[1600px] mx-auto space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Today's Revenue"
            value={`₹${stats.todayRevenue.toLocaleString()}`}
            trend={{ value: 15.3, isPositive: true }}
            description="vs yesterday"
          />
          <StatCard
            label="Orders Today"
            value={stats.todayOrders}
            trend={{ value: 8.2, isPositive: true }}
            description={`${stats.activeOrders} active now`}
          />
          <StatCard
            label="Table Occupancy"
            value={`${stats.occupiedTables}/${stats.totalTables}`}
            description={`${stats.availableTables} available`}
          />
          <StatCard
            label="Avg Order Value"
            value={`₹${stats.avgOrderValue}`}
            trend={{ value: 3.1, isPositive: false }}
            description={`Peak: ${stats.peakHour}`}
          />
        </div>

        {/* View Toggle */}
        <Card padding="sm">
          <div className="flex gap-2">
            {(["overview", "tables", "orders"] as const).map((view) => (
              <button
                key={view}
                onClick={() => setSelectedView(view)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                  selectedView === view
                    ? "bg-kot-primary text-white"
                    : "text-kot-text hover:bg-kot-light"
                }`}
              >
                {view}
              </button>
            ))}
          </div>
        </Card>

        {/* Overview View */}
        {selectedView === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Orders - Takes 2 columns */}
            <div className="lg:col-span-2">
              <Card padding="lg">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Recent Orders</CardTitle>
                    <Button variant="secondary">View All</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 bg-kot-light rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-12 h-12 rounded-lg bg-kot-primary text-white flex items-center justify-center font-bold">
                            {order.table}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-kot-darker">
                                {order.id}
                              </p>
                              <span
                                className={`text-xs px-2 py-1 rounded-full border font-medium ${getOrderStatusColor(
                                  order.status
                                )}`}
                              >
                                {order.status}
                              </span>
                            </div>
                            <p className="text-sm text-kot-text">
                              {order.items} items • {order.time}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-kot-primary">
                            ₹{order.amount}
                          </p>
                          <Button variant="secondary" className="mt-2">
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Takes 1 column */}
            <div className="space-y-6">
              {/* Top Items */}
              <Card padding="lg">
                <CardHeader>
                  <CardTitle>Top Items Today</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topItems.map((item, index) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-kot-primary/10 text-kot-primary flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </span>
                          <p className="font-medium text-kot-darker">
                            {item.name}
                          </p>
                        </div>
                        <span className="font-semibold text-kot-primary">
                          {item.orders}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card padding="lg">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="primary" className="w-full">
                      New Order
                    </Button>
                    <Button variant="secondary" className="w-full">
                      Manage Menu
                    </Button>
                    <Button variant="secondary" className="w-full">
                      View Reports
                    </Button>
                    <Button variant="secondary" className="w-full">
                      Staff Management
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Tables View */}
        {selectedView === "tables" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-kot-darker">
                Table Management
              </h2>
              <div className="flex gap-2">
                <Button variant="secondary">Filter</Button>
                <Button variant="primary">Add Table</Button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {tables.map((table) => (
                <TableCard
                  key={table.id}
                  {...table}
                  onClick={(id) => console.log("View table:", id)}
                  onAction={(id, action) => console.log("Action:", action, id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Orders View */}
        {selectedView === "orders" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-kot-darker">All Orders</h2>
              <div className="flex gap-2">
                <Button variant="secondary">Filter</Button>
                <Button variant="secondary">Export</Button>
              </div>
            </div>
            <Card padding="none">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-kot-light">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-kot-darker">
                        Order ID
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-kot-darker">
                        Table
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-kot-darker">
                        Items
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-kot-darker">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-kot-darker">
                        Time
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-kot-darker">
                        Amount
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-kot-darker">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-b border-kot-chart hover:bg-kot-light transition-colors"
                      >
                        <td className="py-3 px-4 font-medium text-kot-darker">
                          {order.id}
                        </td>
                        <td className="py-3 px-4 text-kot-text">
                          Table {order.table}
                        </td>
                        <td className="py-3 px-4 text-kot-text">
                          {order.items} items
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-xs px-2 py-1 rounded-full border font-medium capitalize ${getOrderStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-kot-text">
                          {order.time}
                        </td>
                        <td className="py-3 px-4 text-right font-semibold text-kot-primary">
                          ₹{order.amount}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="secondary">View</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Staff Performance - Only in Overview */}
        {selectedView === "overview" && (
          <Card padding="lg">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Staff Performance Today</CardTitle>
                <Button variant="secondary">View Details</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {staffPerformance.map((staff) => (
                  <div
                    key={staff.name}
                    className="p-4 bg-kot-light rounded-lg space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-kot-darker">
                        {staff.name}
                      </h4>
                      <div className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4 text-yellow-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm font-medium text-kot-darker">
                          {staff.rating}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-kot-text">Orders:</span>
                        <span className="font-medium text-kot-darker">
                          {staff.orders}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-kot-text">Revenue:</span>
                        <span className="font-semibold text-kot-primary">
                          ₹{staff.revenue.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
