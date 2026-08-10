import { configureStore } from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { ROUTE_PERMISSIONS } from "../../config/permissions";
import ProtectedRoute from "../../routing/ProtectedRoute";
import authReducer, { setCredentials } from "../../state/slices/authSlice";
import type { UserRole } from "../../state/slices/authSlice";
import cartReducer from "../../state/slices/cartSlice";
import uiReducer from "../../state/slices/uiSlice";

function renderGuard({
  role,
  branchId,
  path,
}: {
  role: UserRole;
  branchId: string | null;
  path: string;
}) {
  const testStore = configureStore({
    reducer: { auth: authReducer, cart: cartReducer, ui: uiReducer },
  });

  testStore.dispatch(
    setCredentials({
      id: role,
      name: role,
      email: `${role}@example.com`,
      role,
      branchId,
    }),
  );

  render(
    <Provider store={testStore}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route
            element={
              <ProtectedRoute
                allowedRoles={ROUTE_PERMISSIONS[path] ?? []}
              />
            }
          >
            <Route path={path} element={<div>Allowed</div>} />
          </Route>
          <Route path="/admin/branches" element={<div>Branches</div>} />
          <Route path="/admin/dashboard" element={<div>Dashboard</div>} />
          <Route path="/waiter/tables" element={<div>Tables</div>} />
          <Route path="/chef/kot" element={<div>Kitchen</div>} />
          <Route path="/cashier/billing" element={<div>Billing</div>} />
          <Route path="/login" element={<div>Login</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
}

describe("ProtectedRoute RBAC", () => {
  it("allows superadmin to access Branch management", () => {
    renderGuard({
      role: "superadmin",
      branchId: null,
      path: "/admin/branches",
    });

    expect(screen.getByText("Allowed")).toBeInTheDocument();
  });

  it("redirects branch admin away from global Branch management", () => {
    renderGuard({
      role: "admin",
      branchId: "branch-a",
      path: "/admin/branches",
    });

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("redirects superadmin away from operational routes", () => {
    renderGuard({
      role: "superadmin",
      branchId: null,
      path: "/waiter/tables",
    });

    expect(screen.getByText("Branches")).toBeInTheDocument();
  });

  it("keeps branch admin access to branch admin routes", () => {
    renderGuard({
      role: "admin",
      branchId: "branch-a",
      path: "/admin/dashboard",
    });

    expect(screen.getByText("Allowed")).toBeInTheDocument();
  });
});
