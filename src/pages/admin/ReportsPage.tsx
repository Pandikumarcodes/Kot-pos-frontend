// src/pages/ReportsPage/ReportsPage.tsx
import { useState } from "react";
import Header from "../../design-system/organisms/Header";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../design-system/atoms/Card/Card";
import StatCard from "../../design-system/molecules/StatCard";
import { Button } from "../../design-system/atoms/Button/Button";
import { Input } from "../../design-system/atoms/Input/Input";

type DateRange = "today" | "week" | "month" | "custom";

export const ReportsPage = () => {
  const [dateRange, setDateRange] = useState<DateRange>("today");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  // Mock data - replace with actual API calls
  const stats = {
    totalRevenue: 125430,
    totalOrders: 234,
    avgOrderValue: 536,
    topSellingItem: "Paneer Butter Masala",
  };

  const topItems = [
    { name: "Paneer Butter Masala", quantity: 45, revenue: 12600 },
    { name: "Masala Dosa", quantity: 38, revenue: 4560 },
    { name: "Biryani", quantity: 32, revenue: 11200 },
    { name: "Dal Makhani", quantity: 28, revenue: 5600 },
    { name: "Naan", quantity: 67, revenue: 3350 },
  ];

  const salesByHour = [
    { hour: "9 AM", orders: 12, revenue: 3400 },
    { hour: "10 AM", orders: 18, revenue: 5200 },
    { hour: "11 AM", orders: 25, revenue: 7800 },
    { hour: "12 PM", orders: 35, revenue: 12500 },
    { hour: "1 PM", orders: 42, revenue: 15600 },
    { hour: "2 PM", orders: 38, revenue: 13200 },
    { hour: "3 PM", orders: 15, revenue: 4800 },
    { hour: "4 PM", orders: 8, revenue: 2900 },
    { hour: "5 PM", orders: 12, revenue: 4200 },
    { hour: "6 PM", orders: 18, revenue: 6800 },
    { hour: "7 PM", orders: 28, revenue: 10500 },
    { hour: "8 PM", orders: 32, revenue: 12400 },
  ];

  const paymentMethods = [
    { method: "Cash", count: 98, amount: 45230, percentage: 36 },
    { method: "UPI", count: 85, amount: 52100, percentage: 42 },
    { method: "Card", count: 51, amount: 28100, percentage: 22 },
  ];

  const handleExport = () => {
    // Implement export functionality
    console.log("Exporting report...");
  };

  const handlePrint = () => {
    // Implement print functionality
    window.print();
  };

  return (
    <div className="min-h-screen bg-kot-light">
      <Header
        title="Reports & Analytics"
        subtitle="View your business performance"
        userName="Admin"
        userRole="Manager"
        onLogout={() => console.log("Logout")}
      />

      <main className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
        {/* Date Range Filter */}
        <Card padding="md">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-kot-darker mb-1">
                Select Period
              </h2>
              <p className="text-sm text-kot-text">
                Choose a date range to view reports
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {(["today", "week", "month", "custom"] as DateRange[]).map(
                (range) => (
                  <button
                    key={range}
                    onClick={() => setDateRange(range)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                      dateRange === range
                        ? "bg-kot-primary text-white"
                        : "bg-white text-kot-text hover:bg-kot-light border border-kot-chart"
                    }`}
                  >
                    {range}
                  </button>
                )
              )}
            </div>
          </div>

          {dateRange === "custom" && (
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <Input
                type="date"
                label="Start Date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
              />
              <Input
                type="date"
                label="End Date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
              />
              <div className="flex items-end">
                <Button variant="primary">Apply</Button>
              </div>
            </div>
          )}
        </Card>

        {/* Key Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Revenue"
            value={`₹${stats.totalRevenue.toLocaleString()}`}
            trend={{ value: 12.5, isPositive: true }}
            description="vs previous period"
          />
          <StatCard
            label="Total Orders"
            value={stats.totalOrders}
            trend={{ value: 8.3, isPositive: true }}
            description="vs previous period"
          />
          <StatCard
            label="Avg Order Value"
            value={`₹${stats.avgOrderValue}`}
            trend={{ value: 2.1, isPositive: false }}
            description="vs previous period"
          />
          <StatCard
            label="Top Selling Item"
            value={stats.topSellingItem}
            description="Most popular dish"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Selling Items */}
          <Card padding="lg">
            <CardHeader>
              <CardTitle>Top Selling Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topItems.map((item, index) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-3 bg-kot-light rounded-lg"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <span className="w-8 h-8 rounded-full bg-kot-primary text-white flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-kot-darker truncate">
                          {item.name}
                        </p>
                        <p className="text-sm text-kot-text">
                          {item.quantity} orders
                        </p>
                      </div>
                    </div>
                    <p className="font-bold text-kot-primary">
                      ₹{item.revenue.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card padding="lg">
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentMethods.map((payment) => (
                  <div key={payment.method} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-kot-darker">
                          {payment.method}
                        </p>
                        <p className="text-sm text-kot-text">
                          {payment.count} transactions
                        </p>
                      </div>
                      <p className="font-bold text-kot-primary">
                        ₹{payment.amount.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-kot-light rounded-full overflow-hidden">
                        <div
                          className="h-full bg-kot-primary rounded-full transition-all"
                          style={{ width: `${payment.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-kot-text w-10 text-right">
                        {payment.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sales by Hour */}
        <Card padding="lg">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Sales by Hour</CardTitle>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={handlePrint}>
                  Print
                </Button>
                <Button variant="primary" onClick={handleExport}>
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-kot-chart">
                    <th className="text-left py-3 px-2 text-sm font-semibold text-kot-darker">
                      Time
                    </th>
                    <th className="text-right py-3 px-2 text-sm font-semibold text-kot-darker">
                      Orders
                    </th>
                    <th className="text-right py-3 px-2 text-sm font-semibold text-kot-darker">
                      Revenue
                    </th>
                    <th className="py-3 px-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {salesByHour.map((data) => {
                    const maxRevenue = Math.max(
                      ...salesByHour.map((d) => d.revenue)
                    );
                    const percentage = (data.revenue / maxRevenue) * 100;

                    return (
                      <tr
                        key={data.hour}
                        className="border-b border-kot-chart hover:bg-kot-light transition-colors"
                      >
                        <td className="py-3 px-2 font-medium text-kot-darker">
                          {data.hour}
                        </td>
                        <td className="py-3 px-2 text-right text-kot-text">
                          {data.orders}
                        </td>
                        <td className="py-3 px-2 text-right font-semibold text-kot-primary">
                          ₹{data.revenue.toLocaleString()}
                        </td>
                        <td className="py-3 px-2 w-32">
                          <div className="h-2 bg-kot-light rounded-full overflow-hidden">
                            <div
                              className="h-full bg-kot-primary rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ReportsPage;
