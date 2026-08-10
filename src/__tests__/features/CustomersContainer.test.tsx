import { act, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { CustomerPresenterProps } from "../../features/admin/customers/customers.types";
import CustomersContainer from "../../features/admin/customers/CustomersContainer";
import type { Customer } from "../../services/admin/customer.api";
import {
  createCustomerApi,
  deleteCustomerApi,
  getCustomersApi,
  updateCustomerApi,
} from "../../services/admin/customer.api";

const toast = { success: vi.fn(), error: vi.fn(), warning: vi.fn(), info: vi.fn() };
let latestProps: CustomerPresenterProps;

vi.mock("../../state/hooks", () => ({
  useAppSelector: () => ({ user: { role: "admin" } }),
}));
vi.mock("../../contexts/toastContext", () => ({ useToast: () => toast }));
vi.mock("../../features/admin/customers/CustomersPresenter", () => ({
  CustomerPresenter: (props: CustomerPresenterProps) => {
    latestProps = props;
    return <div>{props.error ?? props.customers.map((customer) => customer.name).join(",")}</div>;
  },
}));
vi.mock("../../services/admin/customer.api", async (importOriginal) => {
  const original = await importOriginal<typeof import("../../services/admin/customer.api")>();
  return {
    ...original,
    getCustomersApi: vi.fn(),
    createCustomerApi: vi.fn(),
    updateCustomerApi: vi.fn(),
    deleteCustomerApi: vi.fn(),
  };
});

const customer = (name: string): Customer => ({
  _id: name,
  name,
  phone: "9876543210",
  email: `${name.toLowerCase()}@example.com`,
  totalOrders: 2,
  totalSpent: 500,
  lastVisit: "2026-01-02",
  createdAt: "2026-01-01",
});

const response = (name = "Default", page = 1) => ({
  data: {
    customers: [customer(name)],
    pagination: {
      page,
      limit: 20,
      total: 45,
      pages: 3,
      hasNext: page < 3,
      hasPrev: page > 1,
    },
  },
}) as Awaited<ReturnType<typeof getCustomersApi>>;

describe("CustomersContainer queries", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getCustomersApi).mockResolvedValue(response());
    vi.mocked(createCustomerApi).mockResolvedValue({ data: { message: "created", customer: customer("Created") } } as never);
    vi.mocked(updateCustomerApi).mockResolvedValue({ data: { message: "updated", customer: customer("Updated") } } as never);
    vi.mocked(deleteCustomerApi).mockResolvedValue({ data: { message: "deleted" } } as never);
  });

  afterEach(() => vi.useRealTimers());

  it("uses page defaults and resets page size changes to page one", async () => {
    render(<CustomersContainer />);
    await waitFor(() => expect(getCustomersApi).toHaveBeenCalledTimes(1));
    expect(vi.mocked(getCustomersApi).mock.calls[0][0]).toEqual({
      page: 1,
      limit: 20,
      search: undefined,
      sort: undefined,
      order: undefined,
    });

    act(() => latestProps.onPageChange(2));
    await waitFor(() => expect(getCustomersApi).toHaveBeenCalledTimes(2));
    expect(vi.mocked(getCustomersApi).mock.calls[1][0]?.page).toBe(2);

    act(() => latestProps.onLimitChange(50));
    await waitFor(() => expect(getCustomersApi).toHaveBeenCalledTimes(3));
    expect(vi.mocked(getCustomersApi).mock.calls[2][0]).toMatchObject({ page: 1, limit: 50 });
  });

  it("debounces name or phone search and ignores an aborted stale response", async () => {
    vi.useFakeTimers();
    let resolveOld!: (value: ReturnType<typeof response>) => void;
    let resolveNew!: (value: ReturnType<typeof response>) => void;
    vi.mocked(getCustomersApi)
      .mockReturnValueOnce(new Promise((resolve) => { resolveOld = resolve; }))
      .mockReturnValueOnce(new Promise((resolve) => { resolveNew = resolve; }));

    render(<CustomersContainer />);
    act(() => latestProps.onSearchChange("9"));
    act(() => latestProps.onSearchChange("9876"));
    act(() => vi.advanceTimersByTime(299));
    expect(getCustomersApi).toHaveBeenCalledTimes(1);
    act(() => vi.advanceTimersByTime(1));
    await act(async () => undefined);
    expect(vi.mocked(getCustomersApi).mock.calls[1][0]).toMatchObject({ page: 1, search: "9876" });
    expect(vi.mocked(getCustomersApi).mock.calls[1][0]).not.toHaveProperty("email");

    await act(async () => resolveNew(response("Newest")));
    expect(screen.getByText("Newest")).toBeInTheDocument();
    await act(async () => resolveOld(response("Stale")));
    expect(screen.queryByText("Stale")).not.toBeInTheDocument();
  });

  it("retries failures and refetches the active search after mutations", async () => {
    vi.mocked(getCustomersApi).mockRejectedValueOnce(new Error("offline"));
    render(<CustomersContainer />);
    await waitFor(() => expect(latestProps.error).toContain("Failed to load"));
    act(() => latestProps.onRetry());
    await waitFor(() => expect(getCustomersApi).toHaveBeenCalledTimes(2));

    act(() => latestProps.onOpenModal());
    act(() => latestProps.onFormChange("name", "New"));
    await act(async () => latestProps.onSubmit({ preventDefault: vi.fn() } as never));
    await waitFor(() => expect(getCustomersApi).toHaveBeenCalledTimes(3));

    act(() => latestProps.onOpenModal(customer("Existing")));
    await act(async () => latestProps.onSubmit({ preventDefault: vi.fn() } as never));
    await waitFor(() => expect(getCustomersApi).toHaveBeenCalledTimes(4));

    vi.spyOn(window, "confirm").mockReturnValue(true);
    await act(async () => latestProps.onDelete(customer("Existing")));
    await waitFor(() => expect(getCustomersApi).toHaveBeenCalledTimes(5));
  });
});
