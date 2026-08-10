import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { OrdersPresenterProps, Order } from "../../features/waiter/ordersPage/Orders.types";
import OrderContainer from "../../features/waiter/ordersPage/OrdersContainer";
import { getOrdersApi } from "../../services/waiter/waiter.api";

const { OrdersPresenter: RealOrdersPresenter } = await vi.importActual<
  typeof import("../../features/waiter/ordersPage/OrdersPresenter")
>("../../features/waiter/ordersPage/OrdersPresenter");

let latestProps: OrdersPresenterProps;

vi.mock("../../features/waiter/ordersPage/OrdersPresenter", async (importOriginal) => {
  const original = await importOriginal<typeof import("../../features/waiter/ordersPage/OrdersPresenter")>();
  return {
    ...original,
    OrdersPresenter: vi.fn((props: OrdersPresenterProps) => {
      latestProps = props;
      return <div>{props.error ?? props.orders.map((order) => order.customerName).join(",")}</div>;
    }),
  };
});
vi.mock("../../services/waiter/waiter.api", async (importOriginal) => {
  const original = await importOriginal<typeof import("../../services/waiter/waiter.api")>();
  return { ...original, getOrdersApi: vi.fn() };
});

const order = (customerName: string): Order => ({
  _id: customerName,
  customerName,
  status: "pending",
  items: [{ name: "Tea", quantity: 1, price: 20 }],
  totalAmount: 20,
  createdBy: "waiter",
  createdAt: "2026-01-01T10:00:00.000Z",
});

const response = (customerName = "Asha", page = 1, total = 45) => ({
  data: {
    myOrders: total ? [order(customerName)] : [],
    pagination: {
      page,
      limit: 20,
      total,
      pages: total ? 3 : 0,
      hasNext: total > 0 && page < 3,
      hasPrev: page > 1,
    },
  },
}) as Awaited<ReturnType<typeof getOrdersApi>>;

describe("OrdersContainer compatibility", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getOrdersApi).mockResolvedValue(response());
  });

  it("uses backend defaults and metadata for page, status, and active-query refresh", async () => {
    render(<OrderContainer />);
    await waitFor(() => expect(getOrdersApi).toHaveBeenCalledTimes(1));
    expect(vi.mocked(getOrdersApi).mock.calls[0][0]).toEqual({
      page: 1,
      limit: 20,
      status: undefined,
      sort: "createdAt",
      order: "desc",
    });

    act(() => latestProps.onPageChange(2));
    await waitFor(() => expect(getOrdersApi).toHaveBeenCalledTimes(2));
    expect(vi.mocked(getOrdersApi).mock.calls[1][0].page).toBe(2);

    act(() => latestProps.onStatusChange("pending"));
    await waitFor(() => expect(getOrdersApi).toHaveBeenCalledTimes(3));
    expect(vi.mocked(getOrdersApi).mock.calls[2][0]).toMatchObject({
      page: 1,
      status: "pending",
    });

    act(() => latestProps.onPageChange(2));
    await waitFor(() => expect(getOrdersApi).toHaveBeenCalledTimes(4));
    act(() => latestProps.onRefresh());
    await waitFor(() => expect(getOrdersApi).toHaveBeenCalledTimes(5));
    expect(vi.mocked(getOrdersApi).mock.calls[4][0]).toMatchObject({
      page: 2,
      status: "pending",
      limit: 20,
      sort: "createdAt",
      order: "desc",
    });
  });

  it("shows a distinct error with Retry instead of replacing it with empty orders", async () => {
    vi.mocked(getOrdersApi).mockRejectedValueOnce(new Error("400"));
    render(<OrderContainer />);
    await waitFor(() => expect(latestProps.error).toContain("could not be loaded"));
    expect(latestProps.orders).toEqual([]);

    act(() => latestProps.onRetry());
    await waitFor(() => expect(getOrdersApi).toHaveBeenCalledTimes(2));
    await waitFor(() => expect(latestProps.error).toBeNull());
  });

  it("does not allow a superseded status response to overwrite the latest query", async () => {
    render(<OrderContainer />);
    await waitFor(() => expect(getOrdersApi).toHaveBeenCalledTimes(1));
    let resolveOlder!: (value: ReturnType<typeof response>) => void;
    let resolveLatest!: (value: ReturnType<typeof response>) => void;
    vi.mocked(getOrdersApi)
      .mockReturnValueOnce(new Promise((resolve) => { resolveOlder = resolve; }))
      .mockReturnValueOnce(new Promise((resolve) => { resolveLatest = resolve; }));

    act(() => latestProps.onStatusChange("pending"));
    await waitFor(() => expect(getOrdersApi).toHaveBeenCalledTimes(2));
    act(() => latestProps.onStatusChange("cancelled"));
    await waitFor(() => expect(getOrdersApi).toHaveBeenCalledTimes(3));
    expect(getOrdersApi).toHaveBeenCalledTimes(3);
    expect(vi.mocked(getOrdersApi).mock.calls[2][0].status).toBe("cancelled");

    await act(async () => resolveLatest(response("Latest")));
    expect(screen.getByText("Latest")).toBeInTheDocument();
    await act(async () => resolveOlder(response("Older")));
    expect(screen.queryByText("Older")).not.toBeInTheDocument();
  });
});

describe("OrdersPresenter compatibility", () => {
  const props = (): OrdersPresenterProps => ({
    orders: [],
    pagination: { page: 1, limit: 20, total: 0, pages: 0, hasNext: false, hasPrev: false },
    loading: false,
    refreshing: false,
    error: null,
    status: "all",
    showFilters: true,
    activeFilterCount: 0,
    selectedOrder: null,
    onStatusChange: vi.fn(),
    onToggleFilters: vi.fn(),
    onClearFilters: vi.fn(),
    onSelectOrder: vi.fn(),
    onPageChange: vi.fn(),
    onRefresh: vi.fn(),
    onRetry: vi.fn(),
  });

  it("maps legacy display labels to supported statuses and disables unsupported controls", () => {
    const presenterProps = props();
    render(<RealOrdersPresenter {...presenterProps} />);

    fireEvent.click(screen.getByRole("button", { name: "Preparing" }));
    fireEvent.click(screen.getByRole("button", { name: "Delivered" }));
    expect(presenterProps.onStatusChange).toHaveBeenNthCalledWith(1, "sent_to_kitchen");
    expect(presenterProps.onStatusChange).toHaveBeenNthCalledWith(2, "served");
    expect(screen.queryByRole("button", { name: "Ready" })).not.toBeInTheDocument();
    expect(screen.getByLabelText("Search unavailable for paginated orders")).toBeDisabled();
    expect(screen.getByLabelText("From Date")).toBeDisabled();
    expect(screen.getByLabelText("To Date")).toBeDisabled();
    expect(screen.getByLabelText("Table Number")).toBeDisabled();
  });

  it("distinguishes status-empty and API-error states and delegates Retry", () => {
    const emptyProps = props();
    emptyProps.status = "served";
    const { rerender } = render(<RealOrdersPresenter {...emptyProps} />);
    expect(screen.getByText("No orders match the selected status")).toBeInTheDocument();

    const errorProps = { ...emptyProps, error: "Orders API returned 400" };
    rerender(<RealOrdersPresenter {...errorProps} />);
    expect(screen.getByText("Orders API returned 400")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(errorProps.onRetry).toHaveBeenCalledOnce();
  });
});
