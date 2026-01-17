import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

// Eager imports for critical routes
import TablesPage from "../pages/waiter/TablesPage";
import OrderPage from "../pages/waiter/OrderPage";
import CustomersPage from "../pages/admin/CustomerPage";
import MenuManagementPage from "../pages/admin/MenuManagement";
import SettingsPage from "../pages/admin/Settings";

import LoginPage from "../pages/auth/LoginPage";
import SignInPage from "../pages/auth/SighInPage";
import SignUpPage from "../pages/auth/SignUpPage";

// Lazy imports for better code splitting
const KitchenDashboard = lazy(() => import("../pages/chef/KitchenDashboard"));
const BillingPage = lazy(() => import("../pages/cashier/BillingPage"));
const ReportsPage = lazy(() => import("../pages/admin/ReportsPage"));
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));

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

        {/* Auth routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Waiter routes */}
        <Route path="/waiter/tables" element={<TablesPage />} />
        <Route path="/waiter/order/:tableId" element={<OrderPage />} />

        {/* Chef routes */}
        <Route path="/chef/kot" element={<KitchenDashboard />} />

        {/* Cashier routes */}
        <Route path="/cashier/billing" element={<BillingPage />} />

        {/* Admin routes */}
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/menu" element={<MenuManagementPage />} />
        <Route path="/admin/reports" element={<ReportsPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/settings" element={<SettingsPage />} />

        {/* 404 catch-all */}
        <Route path="*" element={<Navigate to="/waiter/tables" replace />} />
      </Routes>
    </Suspense>
  );
}
