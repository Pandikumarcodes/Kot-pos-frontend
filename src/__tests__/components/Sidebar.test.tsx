import { configureStore } from "@reduxjs/toolkit";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Sidebar from "../../design-system/organisms/Sidebar";
import { getBranchesApi } from "../../services/admin/branch.api";
import authReducer, { setCredentials } from "../../state/slices/authSlice";
import cartReducer from "../../state/slices/cartSlice";
import uiReducer, {
  setSelectedBranchId,
} from "../../state/slices/uiSlice";

vi.mock("../../services/admin/branch.api", () => ({
  getBranchesApi: vi.fn(),
}));

const branches = [
  {
    _id: "branch-a",
    name: "Branch A",
    address: "First Street",
    phone: "",
    email: "",
    gstin: "",
    isActive: true,
    createdAt: "2026-01-01",
  },
  {
    _id: "branch-b",
    name: "Branch B",
    address: "Second Street",
    phone: "",
    email: "",
    gstin: "",
    isActive: true,
    createdAt: "2026-01-01",
  },
];

function renderSidebar(selectedBranchId: string | null = null) {
  const testStore = configureStore({
    reducer: { auth: authReducer, cart: cartReducer, ui: uiReducer },
  });
  testStore.dispatch(
    setCredentials({
      id: "admin",
      name: "Global Admin",
      email: "admin@example.com",
      role: "admin",
      branchId: null,
    }),
  );
  testStore.dispatch(setSelectedBranchId(selectedBranchId));

  render(
    <Provider store={testStore}>
      <MemoryRouter>
        <Sidebar isOpen={false} onClose={vi.fn()} />
      </MemoryRouter>
    </Provider>,
  );

  return testStore;
}

describe("Sidebar operational branch selector", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getBranchesApi).mockResolvedValue({
      data: { branches },
    } as Awaited<ReturnType<typeof getBranchesApi>>);
  });

  it("reflects shared selection and dispatches branch changes to shared state", async () => {
    const testStore = renderSidebar("branch-b");

    const selector = await screen.findByRole("button", { name: /Branch B/i });
    expect(selector).toBeInTheDocument();
    expect(screen.getByText("Viewing:").parentElement).toHaveTextContent(
      "Viewing: Branch B",
    );

    fireEvent.click(selector);
    fireEvent.click(screen.getByRole("button", { name: /Branch A/i }));

    await waitFor(() =>
      expect(testStore.getState().ui.selectedBranchId).toBe("branch-a"),
    );
    expect(screen.getByRole("button", { name: /Branch A/i })).toBeInTheDocument();
  });

  it("shows All Branches when shared state has no selection", async () => {
    const testStore = renderSidebar();

    expect(await screen.findByRole("button", { name: /All Branches/i })).toBeInTheDocument();
    expect(testStore.getState().ui.selectedBranchId).toBeNull();
    expect(screen.queryByText("Viewing:")).not.toBeInTheDocument();
  });
});
