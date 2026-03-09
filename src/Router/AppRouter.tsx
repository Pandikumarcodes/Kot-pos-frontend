import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute, { PublicRoute } from "./ProtectedRoute";
import RoleRedirect from "./RoleRedirect";
import { ROUTE_PERMISSIONS } from "../config/Permission";

import LoginPage from "../pages/auth/LoginPage";
import SignInPage from "../pages/auth/SighInPage";
import SignUpPage from "../pages/auth/SignUpPage";

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

const r = (path: string) => ROUTE_PERMISSIONS[path] ?? [];

export default function AppRouter() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<RoleRedirect />} />

        {/* ── PUBLIC — redirect to dashboard if already logged in ── */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Route>

        {/* ── WAITER + MANAGER + ADMIN ── */}
        <Route element={<ProtectedRoute allowedRoles={r("/waiter/tables")} />}>
          <Route path="/waiter/tables" element={<TablesPage />} />
          <Route path="/waiter/order/:tableId" element={<OrderPage />} />
        </Route>

        {/* ── CHEF + ADMIN ── */}
        <Route element={<ProtectedRoute allowedRoles={r("/chef/kot")} />}>
          <Route path="/chef/kot" element={<KitchenDashboard />} />
        </Route>

        {/* ── CASHIER + ADMIN ── */}
        <Route
          element={<ProtectedRoute allowedRoles={r("/cashier/billing")} />}
        >
          <Route path="/cashier/billing" element={<BillingPage />} />
        </Route>

        {/* ── ADMIN + MANAGER ── */}
        <Route
          element={<ProtectedRoute allowedRoles={r("/admin/dashboard")} />}
        >
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={r("/admin/reports")} />}>
          <Route path="/admin/reports" element={<ReportsPage />} />
        </Route>
        <Route
          element={<ProtectedRoute allowedRoles={r("/admin/customers")} />}
        >
          <Route path="/admin/customers" element={<CustomersPage />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={r("/admin/menu")} />}>
          <Route path="/admin/menu" element={<MenuManagement />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={r("/admin/tables")} />}>
          <Route path="/admin/tables" element={<TablesPage />} />
        </Route>

        {/* ── ADMIN ONLY ── */}
        <Route element={<ProtectedRoute allowedRoles={r("/admin/staff")} />}>
          <Route path="/admin/staff" element={<StaffManagementPage />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={r("/admin/settings")} />}>
          <Route path="/admin/settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
