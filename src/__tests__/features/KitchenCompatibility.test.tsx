import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { KitchenPresenterProps, Kot } from "../../features/chef/kitchen/Kitchen.types";
import KitchenContainer from "../../features/chef/kitchen/KitchenContainer";
import {
  cancelKotApi,
  getKotOrdersApi,
  markKotReadyApi,
  startKotApi,
} from "../../services/chef/chef.api";

const toast = { success: vi.fn(), error: vi.fn(), warning: vi.fn(), info: vi.fn() };
let latestProps: KitchenPresenterProps;
let socketHandlers: Record<string, (payload: unknown) => void> = {};

vi.mock("../../contexts/toastContext", () => ({ useToast: () => toast }));
vi.mock("../../hooks/useNotifications", () => ({
  useNotifications: (handlers: Record<string, (payload: unknown) => void>) => {
    socketHandlers = handlers;
    return true;
  },
}));
vi.mock("../../features/chef/kitchen/KitchenPresenter", async (importOriginal) => {
  const original = await importOriginal<typeof import("../../features/chef/kitchen/KitchenPresenter")>();
  return {
    ...original,
    KitchenPresenter: vi.fn((props: KitchenPresenterProps) => {
      latestProps = props;
      return <div>{props.error ?? props.kots.map((kot) => kot.customerName).join(",")}</div>;
    }),
  };
});
vi.mock("../../services/chef/chef.api", async (importOriginal) => {
  const original = await importOriginal<typeof import("../../services/chef/chef.api")>();
  return {
    ...original,
    getKotOrdersApi: vi.fn(),
    startKotApi: vi.fn(),
    markKotReadyApi: vi.fn(),
    cancelKotApi: vi.fn(),
  };
});

const kot = (customerName: string, status: Kot["status"] = "pending"): Kot => ({
  _id: customerName,
  orderType: "dine-in",
  tableNumber: 1,
  customerName,
  createdBy: "waiter",
  items: [{ itemId: "tea", name: "Tea", quantity: 1, price: 20 }],
  totalAmount: 20,
  status,
  createdAt: "2026-01-01T10:00:00.000Z",
  updatedAt: "2026-01-01T10:00:00.000Z",
});

const response = (name = "Asha", page = 1, total = 45) => ({
  data: {
    KotOrders: total ? [kot(name)] : [],
    pagination: {
      page,
      limit: 20,
      total,
      pages: total ? 3 : 0,
      hasNext: total > 0 && page < 3,
      hasPrev: page > 1,
    },
  },
}) as Awaited<ReturnType<typeof getKotOrdersApi>>;

describe("KitchenContainer compatibility", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    socketHandlers = {};
    vi.mocked(getKotOrdersApi).mockResolvedValue(response());
    vi.mocked(startKotApi).mockResolvedValue({ data: { message: "started", order: kot("Asha", "preparing") } } as never);
    vi.mocked(markKotReadyApi).mockResolvedValue({ data: { message: "ready", order: kot("Asha", "ready") } } as never);
    vi.mocked(cancelKotApi).mockResolvedValue({ data: { message: "cancelled", order: kot("Asha", "cancelled") } } as never);
  });

  it("uses server pagination, supported status filters, ascending creation order, and active-query refresh", async () => {
    render(<KitchenContainer />);
    await waitFor(() => expect(getKotOrdersApi).toHaveBeenCalledTimes(1));
    expect(vi.mocked(getKotOrdersApi).mock.calls[0][0]).toEqual({
      page: 1,
      limit: 20,
      status: undefined,
      sort: "createdAt",
      order: "asc",
    });

    act(() => latestProps.onPageChange(2));
    await waitFor(() => expect(getKotOrdersApi).toHaveBeenCalledTimes(2));
    act(() => latestProps.onTabChange("preparing"));
    await waitFor(() => expect(getKotOrdersApi).toHaveBeenCalledTimes(3));
    expect(vi.mocked(getKotOrdersApi).mock.calls[2][0]).toMatchObject({ page: 1, status: "preparing" });

    act(() => latestProps.onPageChange(2));
    await waitFor(() => expect(getKotOrdersApi).toHaveBeenCalledTimes(4));
    act(() => latestProps.onRefresh());
    await waitFor(() => expect(getKotOrdersApi).toHaveBeenCalledTimes(5));
    expect(vi.mocked(getKotOrdersApi).mock.calls[4][0]).toEqual({
      page: 2,
      limit: 20,
      status: "preparing",
      sort: "createdAt",
      order: "asc",
    });

    act(() => latestProps.onLimitChange(50));
    await waitFor(() => expect(getKotOrdersApi).toHaveBeenCalledTimes(6));
    expect(vi.mocked(getKotOrdersApi).mock.calls[5][0]).toMatchObject({
      page: 1,
      limit: 50,
      status: "preparing",
    });
  });

  it("refetches after mutations and relevant socket events", async () => {
    render(<KitchenContainer />);
    await waitFor(() => expect(getKotOrdersApi).toHaveBeenCalledTimes(1));

    await act(async () => latestProps.onStart("Asha"));
    await waitFor(() => expect(getKotOrdersApi).toHaveBeenCalledTimes(2));
    await act(async () => latestProps.onReady("Asha"));
    await waitFor(() => expect(getKotOrdersApi).toHaveBeenCalledTimes(3));
    vi.spyOn(window, "confirm").mockReturnValueOnce(true);
    await act(async () => latestProps.onCancel("Asha"));
    await waitFor(() => expect(getKotOrdersApi).toHaveBeenCalledTimes(4));

    act(() => socketHandlers["order:new"]?.(kot("New")));
    await waitFor(() => expect(getKotOrdersApi).toHaveBeenCalledTimes(5));
    act(() => socketHandlers["kot:updated"]?.(kot("Updated")));
    await waitFor(() => expect(getKotOrdersApi).toHaveBeenCalledTimes(6));
  });

  it("keeps failures distinct, retries, and ignores a superseded response", async () => {
    vi.mocked(getKotOrdersApi).mockRejectedValueOnce(new Error("offline"));
    render(<KitchenContainer />);
    await waitFor(() => expect(latestProps.error).toContain("could not be loaded"));
    act(() => latestProps.onRetry());
    await waitFor(() => expect(getKotOrdersApi).toHaveBeenCalledTimes(2));
    await waitFor(() => expect(latestProps.error).toBeNull());

    let resolveOlder!: (value: ReturnType<typeof response>) => void;
    let resolveLatest!: (value: ReturnType<typeof response>) => void;
    vi.mocked(getKotOrdersApi)
      .mockReturnValueOnce(new Promise((resolve) => { resolveOlder = resolve; }))
      .mockReturnValueOnce(new Promise((resolve) => { resolveLatest = resolve; }));
    act(() => latestProps.onTabChange("pending"));
    await waitFor(() => expect(getKotOrdersApi).toHaveBeenCalledTimes(3));
    act(() => latestProps.onTabChange("ready"));
    await waitFor(() => expect(getKotOrdersApi).toHaveBeenCalledTimes(4));
    await act(async () => resolveLatest(response("Latest")));
    expect(screen.getByText("Latest")).toBeInTheDocument();
    await act(async () => resolveOlder(response("Older")));
    expect(screen.queryByText("Older")).not.toBeInTheDocument();
  });
});

describe("KitchenPresenter compatibility", () => {
  it("keeps Served visible but disabled and distinguishes filtered empty and API errors", async () => {
    const realPresenter = await vi.importActual<typeof import("../../features/chef/kitchen/KitchenPresenter")>("../../features/chef/kitchen/KitchenPresenter");
    const props: KitchenPresenterProps = {
      kots: [],
      counts: { page: 0, pending: 0, preparing: 0, ready: 0 },
      pagination: { page: 1, limit: 20, total: 0, pages: 0, hasNext: false, hasPrev: false },
      loading: false,
      refreshing: false,
      error: null,
      isConnected: true,
      activeTab: "pending",
      updatingId: null,
      onTabChange: vi.fn(),
      onPageChange: vi.fn(),
      onLimitChange: vi.fn(),
      onRefresh: vi.fn(),
      onRetry: vi.fn(),
      onStart: vi.fn(),
      onReady: vi.fn(),
      onCancel: vi.fn(),
    };
    const { rerender } = render(<realPresenter.KitchenPresenter {...props} />);
    expect(screen.getByRole("button", { name: "Served" })).toBeDisabled();
    expect(screen.getByText("No pending orders")).toBeInTheDocument();
    expect(screen.getByText(/Served history is unavailable/)).toBeInTheDocument();

    rerender(<realPresenter.KitchenPresenter {...props} error="Kitchen API failed" />);
    expect(screen.getByText("Kitchen API failed")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(props.onRetry).toHaveBeenCalledOnce();
  });
});
