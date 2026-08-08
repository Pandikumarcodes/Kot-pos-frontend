import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { WaiterOrderPresenter } from "../../features/waiter/orderEntry/WaiterOrderPresenter";

const props = {
  customerName: "Walk-in",
  tableNumber: 5,
  roundCount: 0,
  view: "history" as const,
  onSwitchToMenu: vi.fn(),
  onSwitchToHistory: vi.fn(),
  onBack: vi.fn(),
  historyLoading: false,
  allItems: [],
  grandTotal: 0,
  menuLoading: false,
  categories: [],
  selectedCategory: "All",
  onCategoryChange: vi.fn(),
  filteredMenu: [],
  search: "",
  onSearchChange: vi.fn(),
  orderItems: [],
  cartTotal: 0,
  onAddItem: vi.fn(),
  onUpdateQty: vi.fn(),
  showOrderPanel: false,
  onToggleOrderPanel: vi.fn(),
  sendingKot: false,
  onSendKot: vi.fn(),
  canSendToCashier: false,
  sendingToCashier: false,
  cashierHandoffComplete: false,
  onSendToCashier: vi.fn(),
};

describe("waiter table-order reload state", () => {
  it("shows Start Order for a legitimate empty response", () => {
    render(<WaiterOrderPresenter {...props} historyError={null} />);
    expect(screen.getByText("No items ordered yet")).toBeInTheDocument();
    expect(screen.getByText("Start Order")).toBeInTheDocument();
  });

  it("shows a controlled error instead of the empty-order state", () => {
    render(
      <WaiterOrderPresenter
        {...props}
        historyError="Failed to load this table's order. Please try again."
      />,
    );
    expect(screen.getByText(/Failed to load this table's order/)).toBeInTheDocument();
    expect(screen.queryByText("No items ordered yet")).not.toBeInTheDocument();
  });
});
