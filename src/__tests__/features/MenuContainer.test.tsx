import { act, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { MenuPresenterProps } from "../../features/admin/menu/menu.types";
import MenuContainer from "../../features/admin/menu/MenuContainer";
import type { MenuItem } from "../../services/admin/menu.api";
import {
  createMenuItemApi,
  deleteMenuItemApi,
  getMenuItemsApi,
  updateMenuItemApi,
} from "../../services/admin/menu.api";

const toast = { success: vi.fn(), error: vi.fn(), warning: vi.fn(), info: vi.fn() };
let latestProps: MenuPresenterProps;

vi.mock("../../state/hooks", () => ({
  useAppSelector: () => ({ user: { role: "admin" } }),
}));
vi.mock("../../contexts/toastContext", () => ({ useToast: () => toast }));
vi.mock("../../features/admin/menu/MenuManagementPresenter", () => ({
  MenuManagementPresenter: (props: MenuPresenterProps) => {
    latestProps = props;
    return <div>{props.error ?? props.menuItems.map((item) => item.ItemName).join(",")}</div>;
  },
}));
vi.mock("../../services/admin/menu.api", async (importOriginal) => {
  const original = await importOriginal<typeof import("../../services/admin/menu.api")>();
  return {
    ...original,
    getMenuItemsApi: vi.fn(),
    createMenuItemApi: vi.fn(),
    updateMenuItemApi: vi.fn(),
    deleteMenuItemApi: vi.fn(),
  };
});

const item = (name: string): MenuItem => ({
  _id: name,
  ItemName: name,
  category: "beverage",
  price: 100,
  available: true,
});

const response = (name = "Default", page = 1) => ({
  data: {
    menuItems: [item(name)],
    pagination: {
      page,
      limit: 20,
      total: 45,
      pages: 3,
      hasNext: page < 3,
      hasPrev: page > 1,
    },
  },
}) as Awaited<ReturnType<typeof getMenuItemsApi>>;

describe("MenuContainer queries", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getMenuItemsApi).mockResolvedValue(response());
    vi.mocked(createMenuItemApi).mockResolvedValue({ data: { message: "created", menuItem: item("Created") } } as never);
    vi.mocked(updateMenuItemApi).mockResolvedValue({ data: { message: "updated", menuItem: item("Updated") } } as never);
    vi.mocked(deleteMenuItemApi).mockResolvedValue({ data: { message: "deleted" } } as never);
  });

  afterEach(() => vi.useRealTimers());

  it("uses page defaults and resets category and limit changes to page one", async () => {
    render(<MenuContainer />);
    await waitFor(() => expect(getMenuItemsApi).toHaveBeenCalledTimes(1));
    expect(vi.mocked(getMenuItemsApi).mock.calls[0][0]).toEqual({
      page: 1,
      limit: 20,
      search: undefined,
      category: undefined,
      availability: undefined,
      sort: undefined,
      order: undefined,
    });

    act(() => latestProps.onPageChange(2));
    await waitFor(() => expect(getMenuItemsApi).toHaveBeenCalledTimes(2));
    expect(vi.mocked(getMenuItemsApi).mock.calls[1][0]?.page).toBe(2);

    act(() => latestProps.onCategoryChange("beverage"));
    await waitFor(() => expect(getMenuItemsApi).toHaveBeenCalledTimes(3));
    expect(vi.mocked(getMenuItemsApi).mock.calls[2][0]).toMatchObject({ page: 1, category: "beverage" });

    act(() => latestProps.onLimitChange(50));
    await waitFor(() => expect(getMenuItemsApi).toHaveBeenCalledTimes(4));
    expect(vi.mocked(getMenuItemsApi).mock.calls[3][0]).toMatchObject({ page: 1, limit: 50 });
  });

  it("debounces server search and ignores an aborted stale response", async () => {
    vi.useFakeTimers();
    let resolveOld!: (value: ReturnType<typeof response>) => void;
    let resolveNew!: (value: ReturnType<typeof response>) => void;
    vi.mocked(getMenuItemsApi)
      .mockReturnValueOnce(new Promise((resolve) => { resolveOld = resolve; }))
      .mockReturnValueOnce(new Promise((resolve) => { resolveNew = resolve; }));

    render(<MenuContainer />);
    act(() => latestProps.onSearchChange("c"));
    act(() => latestProps.onSearchChange("coffee"));
    act(() => vi.advanceTimersByTime(299));
    expect(getMenuItemsApi).toHaveBeenCalledTimes(1);
    act(() => vi.advanceTimersByTime(1));
    await act(async () => undefined);
    expect(vi.mocked(getMenuItemsApi).mock.calls[1][0]?.search).toBe("coffee");

    await act(async () => resolveNew(response("Newest")));
    expect(screen.getByText("Newest")).toBeInTheDocument();
    await act(async () => resolveOld(response("Stale")));
    expect(screen.queryByText("Stale")).not.toBeInTheDocument();
  });

  it("clears raw search immediately and returns the debounced query to page one", async () => {
    vi.useFakeTimers();
    render(<MenuContainer />);
    await act(async () => undefined);

    act(() => latestProps.onSearchChange("coffee"));
    expect(latestProps.searchQuery).toBe("coffee");
    act(() => vi.advanceTimersByTime(300));
    await act(async () => undefined);
    expect(vi.mocked(getMenuItemsApi).mock.calls.at(-1)?.[0]).toMatchObject({
      page: 1,
      search: "coffee",
    });

    act(() => latestProps.onPageChange(2));
    await act(async () => undefined);
    act(() => latestProps.onSearchChange(""));
    expect(latestProps.searchQuery).toBe("");
    act(() => vi.advanceTimersByTime(300));
    await act(async () => undefined);

    expect(vi.mocked(getMenuItemsApi).mock.calls.at(-1)?.[0]).toMatchObject({
      page: 1,
      search: undefined,
    });
  });

  it("retries failures and refetches the active query after all mutations", async () => {
    vi.mocked(getMenuItemsApi).mockRejectedValueOnce(new Error("offline"));
    render(<MenuContainer />);
    await waitFor(() => expect(latestProps.error).toContain("Failed to load"));
    act(() => latestProps.onRetry());
    await waitFor(() => expect(getMenuItemsApi).toHaveBeenCalledTimes(2));
    act(() => latestProps.onCategoryChange("beverage"));
    await waitFor(() => expect(getMenuItemsApi).toHaveBeenCalledTimes(3));

    act(() => latestProps.onOpenModal());
    act(() => latestProps.onFieldChange("ItemName", "New"));
    act(() => latestProps.onFieldChange("price", 100));
    await act(async () => latestProps.onSubmit({ preventDefault: vi.fn() } as never));
    await waitFor(() => expect(getMenuItemsApi).toHaveBeenCalledTimes(4));

    act(() => latestProps.onOpenModal(item("Existing")));
    await act(async () => latestProps.onSubmit({ preventDefault: vi.fn() } as never));
    await waitFor(() => expect(getMenuItemsApi).toHaveBeenCalledTimes(5));

    await act(async () => latestProps.onToggle(item("Existing")));
    await waitFor(() => expect(getMenuItemsApi).toHaveBeenCalledTimes(6));

    vi.spyOn(window, "confirm").mockReturnValue(true);
    await act(async () => latestProps.onDelete(item("Existing")));
    await waitFor(() => expect(getMenuItemsApi).toHaveBeenCalledTimes(7));
    expect(vi.mocked(getMenuItemsApi).mock.calls.slice(3).every(
      ([activeQuery]) => activeQuery?.category === "beverage" && activeQuery.page === 1,
    )).toBe(true);
  });
});
