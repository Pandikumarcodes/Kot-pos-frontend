import { act, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { BillingPresenterProps } from "../../features/cashier/billing/Billing.types";
import BillingContainer from "../../features/cashier/billing/BillingContainer";
import type { Bill } from "../../services/cashier/cashier.api";
import {
  getBillsApi,
  markBillPaidApi,
} from "../../services/cashier/cashier.api";
import { getReceiptSettingsApi } from "../../services/settings.api";

const toast = { success: vi.fn(), error: vi.fn(), warning: vi.fn(), info: vi.fn() };
let latestProps: BillingPresenterProps;
let notificationHandlers: Record<string, (payload: unknown) => void> = {};

vi.mock("../../contexts/toastContext", () => ({ useToast: () => toast }));
vi.mock("../../hooks/usePrint", () => ({ usePrint: () => ({ printBill: vi.fn() }) }));
vi.mock("../../hooks/useNotifications", () => ({
  useNotifications: (handlers: Record<string, (payload: unknown) => void>) => {
    notificationHandlers = handlers;
    return true;
  },
}));
vi.mock("../../services/settings.api", () => ({
  getReceiptSettingsApi: vi.fn().mockResolvedValue({ data: { settings: {} } }),
}));
vi.mock("../../services/apiClient", () => ({
  default: { get: vi.fn().mockResolvedValue({ data: { menuItems: [] } }) },
}));
vi.mock("../../features/cashier/billing/BillingPresenter", () => ({
  BillingPresenter: (props: BillingPresenterProps) => {
    latestProps = props;
    return <div>{props.billsError ?? props.bills.map((bill) => bill.customerName).join(",")}</div>;
  },
}));
vi.mock("../../services/cashier/cashier.api", async (importOriginal) => {
  const original = await importOriginal<typeof import("../../services/cashier/cashier.api")>();
  return {
    ...original,
    getBillsApi: vi.fn(),
    markBillPaidApi: vi.fn(),
    createBillApi: vi.fn(),
    createTakeawayApi: vi.fn(),
    sendTakeawayToKitchenApi: vi.fn(),
  };
});

const bill = (name: string, paymentStatus: Bill["paymentStatus"] = "unpaid"): Bill => ({
  _id: name,
  billNumber: `BILL-${name}`,
  customerName: name,
  customerPhone: "9876543210",
  items: [],
  totalAmount: 500,
  paymentStatus,
  paymentMethod: "cash",
  createdAt: "2026-08-08T00:00:00.000Z",
});

const response = (name = "Default", page = 1, limit = 20) => ({
  data: {
    myBills: [bill(name)],
    pagination: {
      page,
      limit,
      total: 45,
      pages: Math.ceil(45 / limit),
      hasNext: page < Math.ceil(45 / limit),
      hasPrev: page > 1,
    },
  },
}) as never;

describe("BillingContainer list queries", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    notificationHandlers = {};
    vi.mocked(getBillsApi).mockResolvedValue(response());
    vi.mocked(markBillPaidApi).mockResolvedValue({
      data: { message: "paid", bill: bill("Default", "paid") },
    } as never);
  });

  afterEach(() => vi.useRealTimers());

  const openBills = async () => {
    render(<BillingContainer />);
    act(() => latestProps.onTabChange("bills"));
    await waitFor(() => expect(getBillsApi).toHaveBeenCalledTimes(1));
  };

  it("loads the cashier-safe receipt contract", async () => {
    render(<BillingContainer />);
    await waitFor(() => expect(getReceiptSettingsApi).toHaveBeenCalledOnce());
  });

  it("keeps Billing operational and reports receipt-setting fallback", async () => {
    vi.mocked(getReceiptSettingsApi).mockRejectedValueOnce(new Error("offline"));
    render(<BillingContainer />);

    await waitFor(() =>
      expect(toast.warning).toHaveBeenCalledWith(
        "Receipt settings could not be loaded. Billing will use receipt defaults.",
      ),
    );
    expect(latestProps.step).toBe("customer");
  });

  it("requests page 1 at 20 and supports page, status, and page-size changes", async () => {
    await openBills();
    expect(vi.mocked(getBillsApi).mock.calls[0][0]).toEqual({
      page: 1,
      limit: 20,
      search: undefined,
      status: undefined,
      sort: undefined,
      order: undefined,
    });

    act(() => latestProps.onPageChange(2));
    await waitFor(() => expect(getBillsApi).toHaveBeenCalledTimes(2));
    expect(vi.mocked(getBillsApi).mock.calls[1][0]).toMatchObject({ page: 2 });

    act(() => latestProps.onStatusFilterChange("paid"));
    await waitFor(() => expect(getBillsApi).toHaveBeenCalledTimes(3));
    expect(vi.mocked(getBillsApi).mock.calls[2][0]).toMatchObject({ page: 1, status: "paid" });

    act(() => latestProps.onLimitChange(50));
    await waitFor(() => expect(getBillsApi).toHaveBeenCalledTimes(4));
    expect(vi.mocked(getBillsApi).mock.calls[3][0]).toMatchObject({ page: 1, limit: 50 });
  });

  it("debounces backend search and prevents an aborted stale response from winning", async () => {
    vi.useFakeTimers();
    let resolveOld!: (value: ReturnType<typeof response>) => void;
    let resolveNew!: (value: ReturnType<typeof response>) => void;
    vi.mocked(getBillsApi)
      .mockReturnValueOnce(new Promise((resolve) => { resolveOld = resolve; }))
      .mockReturnValueOnce(new Promise((resolve) => { resolveNew = resolve; }));

    render(<BillingContainer />);
    act(() => latestProps.onTabChange("bills"));
    await act(async () => undefined);
    act(() => latestProps.onSearchChange("987"));
    act(() => latestProps.onSearchChange("BILL-987"));
    act(() => vi.advanceTimersByTime(299));
    expect(getBillsApi).toHaveBeenCalledTimes(1);
    act(() => vi.advanceTimersByTime(1));
    await act(async () => undefined);
    expect(vi.mocked(getBillsApi).mock.calls[1][0]).toMatchObject({
      page: 1,
      search: "BILL-987",
    });

    await act(async () => resolveNew(response("Newest")));
    expect(screen.getByText("Newest")).toBeInTheDocument();
    await act(async () => resolveOld(response("Stale")));
    expect(screen.queryByText("Stale")).not.toBeInTheDocument();
  });

  it("normalizes only the known empty 404 and retries genuine errors", async () => {
    vi.mocked(getBillsApi).mockRejectedValueOnce({
      response: { status: 404, data: { error: "No Bills found" } },
    });
    await openBills();
    await waitFor(() => expect(latestProps.bills).toEqual([]));
    expect(latestProps.billsError).toBeNull();
    expect(latestProps.pagination.total).toBe(0);

    vi.mocked(getBillsApi).mockRejectedValueOnce({
      response: { status: 500, data: { error: "Database unavailable" } },
    });
    act(() => notificationHandlers["billing:created"]?.({}));
    await waitFor(() => expect(latestProps.billsError).toBe("Database unavailable"));
    act(() => latestProps.onRetryBills());
    await waitFor(() => expect(getBillsApi).toHaveBeenCalledTimes(3));
  });

  it("refetches the active query after payment and billing socket events", async () => {
    await openBills();
    act(() => latestProps.onSelectBill(bill("Default")));
    await act(async () => latestProps.onMarkPaid("Default"));
    await waitFor(() => expect(getBillsApi).toHaveBeenCalledTimes(2));
    expect(vi.mocked(getBillsApi).mock.calls[1][0]).toEqual(
      vi.mocked(getBillsApi).mock.calls[0][0],
    );

    act(() => notificationHandlers["billing:created"]?.(bill("Socket")));
    await waitFor(() => expect(getBillsApi).toHaveBeenCalledTimes(3));
    expect(latestProps.bills.some((item) => item.customerName === "Socket")).toBe(false);
  });
});
