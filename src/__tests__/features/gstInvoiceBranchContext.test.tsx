import { render, waitFor } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { beforeEach, describe, expect, it, vi } from "vitest";
import authReducer from "../../state/slices/authSlice";
import uiReducer from "../../state/slices/uiSlice";

const { getSettingsApi, getCashierSettingsApi } = vi.hoisted(() => ({ getSettingsApi: vi.fn(), getCashierSettingsApi: vi.fn() }));
vi.mock("../../services/admin/settings.api", () => ({ getSettingsApi, getCashierSettingsApi }));

import GSTInvoice from "../../features/cashier/billing/GstInvoice";

const bill = {
  _id: "bill-1", billNumber: "B-1", customerName: "Walk-in", customerPhone: "",
  items: [], totalAmount: 100, paymentStatus: "paid", paymentMethod: "cash", createdAt: new Date().toISOString(),
};

const renderInvoice = (user: { role: "admin" | "cashier"; branchId: string | null }, selectedBranchId: string | null) => {
  const store = configureStore({
    reducer: { auth: authReducer, ui: uiReducer },
    preloadedState: {
      auth: { user: { id: "u1", name: "User", email: "u@example.com", ...user }, isAuthenticated: true, isLoading: false },
      ui: { sidebarOpen: true, toasts: [], selectedBranchId },
    },
  });
  return render(<Provider store={store}><GSTInvoice bill={bill as never} onClose={vi.fn()} /></Provider>);
};

describe("GST invoice branch settings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getSettingsApi.mockResolvedValue({ data: { settings: {} } });
    getCashierSettingsApi.mockResolvedValue({ data: { settings: {} } });
  });

  it("requests settings with the selected global-admin branch", async () => {
    renderInvoice({ role: "admin", branchId: null }, "507f1f77bcf86cd799439011");
    await waitFor(() => expect(getSettingsApi).toHaveBeenCalledWith("507f1f77bcf86cd799439011", expect.anything()));
  });

  it("does not request settings without an effective branch", async () => {
    renderInvoice({ role: "admin", branchId: null }, null);
    await waitFor(() => expect(getSettingsApi).not.toHaveBeenCalled());
  });

  it("uses the cashier branch and operational settings endpoint", async () => {
    renderInvoice({ role: "cashier", branchId: "507f1f77bcf86cd799439011" }, "69bc3a288e828f43deb5b812");
    await waitFor(() => expect(getCashierSettingsApi).toHaveBeenCalledWith("507f1f77bcf86cd799439011"));
    expect(getSettingsApi).not.toHaveBeenCalled();
  });
});
