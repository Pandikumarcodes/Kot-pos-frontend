import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

// Eager imports for critical routes
import TablesPage from "../pages/waiter/TablesPage";
import OrderPage from "../pages/waiter/OrdersPage";

// Lazy imports for better code splitting
const KitchenDashboard = lazy(() => import("../pages/chef/KitchenDashboard"));
const BillingPage = lazy(() => import("../pages/cashier/BillingPage"));
const KotOrdersPage = lazy(() => import("../pages/cashier/KotOrdersPage"));
const ReportsPage = lazy(() => import("../pages/cashier/ReportsPage"));

// Loading fallback
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-lg">Loading...</div>
  </div>
);

export default function AppRouter() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/waiter/tables" replace />} />

        {/* Waiter routes */}
        <Route path="/waiter/tables" element={<TablesPage />} />
        <Route path="/waiter/order/:tableId" element={<OrderPage />} />

        {/* Chef routes */}
        <Route path="/chef/kot" element={<KitchenDashboard />} />

        {/* Cashier routes */}
        <Route path="/cashier/billing" element={<BillingPage />} />
        <Route path="/cashier/kot-orders" element={<KotOrdersPage />} />
        <Route path="/cashier/reports" element={<ReportsPage />} />

        {/* 404 catch-all */}
        <Route path="*" element={<Navigate to="/waiter/tables" replace />} />
      </Routes>
    </Suspense>
  );
}
