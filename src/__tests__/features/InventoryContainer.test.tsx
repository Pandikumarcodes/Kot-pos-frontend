import { act, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { InventoryPresenterProps } from "../../features/admin/inventory/Inventory.types";
import type { InventoryItem } from "../../services/admin/inventory.api";
import InventoryContainer from "../../features/admin/inventory/InventoryContainer";
import {
  adjustStockApi,
  createInventoryApi,
  deleteInventoryApi,
  getInventoryApi,
  restockApi,
  updateInventoryApi,
} from "../../services/admin/inventory.api";

const toast = { success: vi.fn(), error: vi.fn(), warning: vi.fn(), info: vi.fn() };
let latestProps: InventoryPresenterProps;

vi.mock("../../contexts/toastContext", () => ({ useToast: () => toast }));
vi.mock("../../features/admin/inventory/InventoryPresenter", () => ({
  InventoryPresenter: (props: InventoryPresenterProps) => {
    latestProps = props;
    return <div>{props.error ?? props.items.map((item) => item.name).join(",")}</div>;
  },
}));
vi.mock("../../services/admin/inventory.api", async (importOriginal) => {
  const original = await importOriginal<typeof import("../../services/admin/inventory.api")>();
  return {
    ...original,
    getInventoryApi: vi.fn(),
    createInventoryApi: vi.fn(),
    updateInventoryApi: vi.fn(),
    restockApi: vi.fn(),
    adjustStockApi: vi.fn(),
    getStockLogsApi: vi.fn(),
    deleteInventoryApi: vi.fn(),
  };
});

const item = (name: string): InventoryItem => ({
  _id: name,
  branchId: "branch",
  name,
  unit: "pcs",
  currentStock: 1,
  lowStockThreshold: 2,
  category: "other",
  costPerUnit: 0,
  supplier: "",
  isActive: true,
  isLowStock: true,
  createdAt: "2026-01-01",
  updatedAt: "2026-01-01",
});

const response = (name = "Default", page = 1) => ({
  data: {
    items: [item(name)],
    lowStockCount: 1,
    pagination: {
      page,
      limit: 20,
      total: 45,
      pages: 3,
      hasNext: page < 3,
      hasPrev: page > 1,
    },
  },
}) as Awaited<ReturnType<typeof getInventoryApi>>;

describe("InventoryContainer queries", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getInventoryApi).mockResolvedValue(response());
    vi.mocked(createInventoryApi).mockResolvedValue({ data: { message: "created", item: item("Created") } } as never);
    vi.mocked(updateInventoryApi).mockResolvedValue({ data: { message: "updated", item: item("Updated") } } as never);
    vi.mocked(restockApi).mockResolvedValue({ data: { message: "restocked", item: item("Restocked") } } as never);
    vi.mocked(adjustStockApi).mockResolvedValue({ data: { message: "adjusted", item: item("Adjusted") } } as never);
    vi.mocked(deleteInventoryApi).mockResolvedValue({ data: { message: "removed" } } as never);
  });

  it("uses defaults, backend page metadata, and resets filters and limit to page one", async () => {
    render(<InventoryContainer />);
    await waitFor(() => expect(getInventoryApi).toHaveBeenCalledTimes(1));
    expect(vi.mocked(getInventoryApi).mock.calls[0][0]).toEqual({
      page: 1, limit: 20, search: undefined, lowStock: undefined,
      category: undefined, sort: "currentStock", order: "asc",
    });

    act(() => latestProps.onPageChange(2));
    await waitFor(() => expect(getInventoryApi).toHaveBeenCalledTimes(2));
    expect(vi.mocked(getInventoryApi).mock.calls[1][0]?.page).toBe(2);

    act(() => latestProps.onFilterCatChange("produce"));
    await waitFor(() => expect(getInventoryApi).toHaveBeenCalledTimes(3));
    expect(vi.mocked(getInventoryApi).mock.calls[2][0]).toMatchObject({ page: 1, category: "produce" });

    act(() => latestProps.onLimitChange(50));
    await waitFor(() => expect(getInventoryApi).toHaveBeenCalledTimes(4));
    expect(vi.mocked(getInventoryApi).mock.calls[3][0]).toMatchObject({ page: 1, limit: 50 });
  });

  it("debounces rapid search and prevents an aborted older response from overwriting it", async () => {
    vi.useFakeTimers();
    let resolveOld!: (value: ReturnType<typeof response>) => void;
    let resolveNew!: (value: ReturnType<typeof response>) => void;
    vi.mocked(getInventoryApi)
      .mockReturnValueOnce(new Promise((resolve) => { resolveOld = resolve; }))
      .mockReturnValueOnce(new Promise((resolve) => { resolveNew = resolve; }));

    render(<InventoryContainer />);
    act(() => latestProps.onSearchChange("r"));
    act(() => latestProps.onSearchChange("rice"));
    act(() => vi.advanceTimersByTime(299));
    expect(getInventoryApi).toHaveBeenCalledTimes(1);
    act(() => vi.advanceTimersByTime(1));
    await act(async () => undefined);
    expect(getInventoryApi).toHaveBeenCalledTimes(2);
    expect(vi.mocked(getInventoryApi).mock.calls[1][0]?.search).toBe("rice");

    await act(async () => resolveNew(response("Newest")));
    expect(screen.getByText("Newest")).toBeInTheDocument();
    await act(async () => resolveOld(response("Stale")));
    expect(screen.queryByText("Stale")).not.toBeInTheDocument();
    expect(screen.getByText("Newest")).toBeInTheDocument();
    vi.useRealTimers();
  });

  it("shows list errors with retry and refetches after every inventory mutation", async () => {
    vi.mocked(getInventoryApi).mockRejectedValueOnce(new Error("offline"));
    render(<InventoryContainer />);
    await waitFor(() => expect(latestProps.error).toContain("could not be loaded"));
    act(() => latestProps.onRetry());
    await waitFor(() => expect(getInventoryApi).toHaveBeenCalledTimes(2));
    act(() => latestProps.onFilterCatChange("produce"));
    await waitFor(() => expect(getInventoryApi).toHaveBeenCalledTimes(3));

    act(() => latestProps.onOpenCreate());
    act(() => latestProps.onFormChange("name", "New"));
    await act(async () => latestProps.onSave({ preventDefault: vi.fn() } as never));
    await waitFor(() => expect(getInventoryApi).toHaveBeenCalledTimes(4));

    act(() => latestProps.onOpenEdit(item("Existing")));
    await act(async () => latestProps.onSave({ preventDefault: vi.fn() } as never));
    await waitFor(() => expect(getInventoryApi).toHaveBeenCalledTimes(5));

    act(() => latestProps.onOpenRestock(item("Existing")));
    act(() => latestProps.onRestockQtyChange("2"));
    await act(async () => latestProps.onRestock({ preventDefault: vi.fn() } as never));
    await waitFor(() => expect(getInventoryApi).toHaveBeenCalledTimes(6));

    act(() => latestProps.onOpenAdjust(item("Existing")));
    act(() => latestProps.onAdjustQtyChange("-1"));
    await act(async () => latestProps.onAdjust({ preventDefault: vi.fn() } as never));
    await waitFor(() => expect(getInventoryApi).toHaveBeenCalledTimes(7));

    vi.spyOn(window, "confirm").mockReturnValue(true);
    await act(async () => latestProps.onDelete(item("Existing")));
    await waitFor(() => expect(getInventoryApi).toHaveBeenCalledTimes(8));
    expect(vi.mocked(getInventoryApi).mock.calls.slice(3).every(
      ([activeQuery]) => activeQuery?.category === "produce" && activeQuery.page === 1,
    )).toBe(true);
  });
});
