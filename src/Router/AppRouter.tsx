import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "./ProtectedRoute";
import RoleRedirect from "./RoleRedirect";

// Eager — small auth pages
import LoginPage from "../pages/auth/LoginPage";
import SignInPage from "../pages/auth/SighInPage";
import SignUpPage from "../pages/auth/SignUpPage";

// Lazy — all role pages
const TablesPage = lazy(() => import("../pages/waiter/TablesPage"));
const OrderPage = lazy(() => import("../pages/waiter/OrderPage"));
const KitchenDashboard = lazy(() => import("../pages/chef/KitchenDashboard"));
const BillingPage = lazy(() => import("../pages/cashier/BillingPage"));
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const ReportsPage = lazy(() => import("../pages/admin/ReportsPage"));
const CustomersPage = lazy(() => import("../pages/admin/CustomerPage"));
const MenuManagement = lazy(() => import("../pages/admin/MenuManagement"));
const SettingsPage = lazy(() => import("../pages/admin/Settings"));
const StaffManagementPage = lazy(
  () => import("../pages/admin/StaffManagementPage"),
);

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-kot-primary">
    <div className="animate-spin rounded-full h-10 w-10 border-4 border-kot-dark border-t-transparent" />
  </div>
);

export default function AppRouter() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Root → smart redirect based on role */}
        <Route path="/" element={<RoleRedirect />} />

        {/* ── PUBLIC ── */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* ── WAITER ── */}
        <Route element={<ProtectedRoute allowedRoles={["waiter", "admin"]} />}>
          <Route path="/waiter/tables" element={<TablesPage />} />
          <Route path="/waiter/order/:tableId" element={<OrderPage />} />
        </Route>

        {/* ── CHEF ── */}
        <Route element={<ProtectedRoute allowedRoles={["chef", "admin"]} />}>
          <Route path="/chef/kot" element={<KitchenDashboard />} />
        </Route>

        {/* ── CASHIER ── */}
        <Route element={<ProtectedRoute allowedRoles={["cashier", "admin"]} />}>
          <Route path="/cashier/billing" element={<BillingPage />} />
        </Route>

        {/* ── ADMIN ── */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/reports" element={<ReportsPage />} />
          <Route path="/admin/customers" element={<CustomersPage />} />{" "}
          {/* ✅ fixed */}
          <Route path="/admin/staff" element={<StaffManagementPage />} />{" "}
          {/* ✅ fixed */}
          <Route path="/admin/menu" element={<MenuManagement />} />{" "}
          {/* ✅ fixed */}
          <Route path="/admin/settings" element={<SettingsPage />} />{" "}
          {/* ✅ fixed */}
          <Route path="/admin/tables" element={<TablesPage />} />{" "}
          {/* ✅ fixed */}
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
