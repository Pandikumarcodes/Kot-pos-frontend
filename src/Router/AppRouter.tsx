import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute, { PublicRoute } from "./ProtectedRoute";
import RoleRedirect from "./RoleRedirect";
import { ROUTE_PERMISSIONS } from "../config/Permission";

import LoginPage from "../features/auth/loginPage/LoginContainer";
import SignInPage from "../features/auth/signInPage/SignInContainer";
import SignUpPage from "../features/auth/signUpPage/SignUpContainer";

const TablesPage = lazy(
  () => import("../features/waiter/tablesPage/TablesContainer"),
);
const OrderPage = lazy(
  () => import("../features/waiter/ordersPage/OrderContainer"),
);
const KitchenDashboard = lazy(
  () => import("../features/chef/KitchenPage/KitchenContainer"),
);
const BillingPage = lazy(
  () => import("../features/cashier/BillingPage/BillingContainer"),
);
const AdminDashboard = lazy(
  () => import("../features/admin/dashboard/AdminDashboardContainer"),
);
const ReportsPage = lazy(
  () => import("../features/admin/reports/ReportsContainer"),
);
const CustomersPage = lazy(
  () => import("../features/admin/customers/CustomersContainer"),
);
const MenuManagement = lazy(
  () => import("../features/admin/menu/MenuContainer"),
);
const SettingsPage = lazy(
  () => import("../features/admin/settings/SettingsContainer"),
);
const StaffManagementPage = lazy(
  () => import("../features/admin/staff/StaffContainer"),
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
