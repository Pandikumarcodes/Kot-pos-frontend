import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { InventoryPresenter } from "../../features/admin/inventory/InventoryPresenter";
import type { InventoryPresenterProps } from "../../features/admin/inventory/Inventory.types";

const props = {
  items: [], loading: false, lowStockCount: 0,
  pagination: { page: 1, limit: 20, total: 0, pages: 0, hasNext: false, hasPrev: false },
  error: null, search: "", filterLow: false, filterCat: "",
  onSearchChange: vi.fn(), onFilterLowToggle: vi.fn(), onFilterCatChange: vi.fn(),
  onRefresh: vi.fn(), onPageChange: vi.fn(), sortBy: "currentStock", sortOrder: "asc",
  onSortChange: vi.fn(), onRetry: vi.fn(), showModal: false, editingItem: null,
  formData: { name: "", unit: "pcs", currentStock: 0, lowStockThreshold: 10, category: "other", costPerUnit: 0, supplier: "", menuItemId: "" },
  saving: false, onOpenCreate: vi.fn(), onOpenEdit: vi.fn(), onCloseModal: vi.fn(),
  onFormChange: vi.fn(), onSave: vi.fn(), restockItem: null, restockQty: "", restockNote: "",
  restocking: false, onOpenRestock: vi.fn(), onCloseRestock: vi.fn(), onRestockQtyChange: vi.fn(),
  onRestockNoteChange: vi.fn(), onRestock: vi.fn(), adjustItem: null, adjustQty: "", adjustNote: "",
  adjusting: false, onOpenAdjust: vi.fn(), onCloseAdjust: vi.fn(), onAdjustQtyChange: vi.fn(),
  onAdjustNoteChange: vi.fn(), onAdjust: vi.fn(), logsItem: null, logs: [], logsLoading: false,
  onOpenLogs: vi.fn(), onCloseLogs: vi.fn(), onDelete: vi.fn(),
} as unknown as InventoryPresenterProps;

describe("Inventory filtering toolbar", () => {
  it("renders one search input and one category filter control", () => {
    render(<InventoryPresenter {...props} />);
    expect(screen.getAllByPlaceholderText("Search inventory by name...")).toHaveLength(1);
    expect(screen.getByRole("combobox", { name: "Category" })).toBeInTheDocument();
  });
});
