import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute, { PublicRoute } from "./ProtectedRoute";
import RoleRedirect from "./RoleRedirect";
import { ROUTE_PERMISSIONS } from "../config/permissions";
import { FEATURES } from "../config/features";
import { LoadingScreen } from "../components/ui/LoadingScreen";
import { NotFoundPage } from "../components/NotFoundPage";

import LoginPage from "../features/auth/loginPage/LoginContainer";
import SignInPage from "../features/auth/signInPage/SignInContainer";
import SignUpPage from "../features/auth/signUpPage/SignUpContainer";

const TablesPage = lazy(
  () => import("../features/waiter/tablesPage/TablesContainer"),
);
// Orders history list
const OrderPage = lazy(
  () => import("../features/waiter/ordersPage/OrdersContainer"),
);
// Menu + cart + KOT + bill (loaded after table allocation)
const WaiterOrderPage = lazy(
  () => import("../features/waiter/orderEntry/WaiterOrderContainer"),
);
const KitchenDashboard = lazy(
  () => import("../features/chef/kitchen/KitchenContainer"),
);
const BillingPage = lazy(
  () => import("../features/cashier/billing/BillingContainer"),
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
const BranchManagementPage = lazy(
  () => import("../features/admin/branch/BranchContainer"),
);
const InventoryPage = lazy(
  () => import("../features/admin/inventory/InventoryContainer"),
);
const QrMenuPage = lazy(() => import("../features/qrCode/QrMenuContainer"));
const AiInsightsPage = lazy(
  () => import("../features/admin/aiAssistant/AiInsightsContainer"),
);
const r = (path: string) => ROUTE_PERMISSIONS[path] ?? [];

export default function AppRouter() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/" element={<RoleRedirect />} />

        {/* ── PUBLIC ── */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/menu/:tableId" element={<QrMenuPage />} />
        </Route>

        {/* ── WAITER + MANAGER + ADMIN ── */}
        <Route element={<ProtectedRoute allowedRoles={r("/waiter/tables")} />}>
          {/* Tables list */}
          <Route path="/waiter/tables" element={<TablesPage />} />
          {/* Order history list */}
          <Route path="/waiter/orders" element={<OrderPage />} />
          {/* Menu + cart + KOT + bill — navigated to after table allocation */}
          <Route path="/waiter/order/:tableId" element={<WaiterOrderPage />} />
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
        {FEATURES.BRANCHES && (
          <Route
            element={
              <ProtectedRoute allowedRoles={r("/admin/branches")} />
            }
          >
            <Route
              path="/admin/branches"
              element={<BranchManagementPage />}
            />
          </Route>
        )}
        <Route
          element={<ProtectedRoute allowedRoles={r("/admin/inventory")} />}
        >
          <Route path="/admin/inventory" element={<InventoryPage />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={r("/admin/ai")} />}>
          <Route path="/admin/ai" element={<AiInsightsPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
