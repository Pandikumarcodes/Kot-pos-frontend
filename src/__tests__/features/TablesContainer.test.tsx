import { act, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import TablesContainer from "../../features/waiter/tablesPage/TablesContainer";
import type { TablesPresenterProps } from "../../features/waiter/tablesPage/Tables.types";
import type { NotificationEvent } from "../../services/notificationService";
import type { Table } from "../../services/waiter/table.api";
import {
  allocateTableApi,
  createTableApi,
  deleteTableApi,
  getTablesApi,
} from "../../services/waiter/table.api";

const toast = { success: vi.fn(), error: vi.fn(), warning: vi.fn(), info: vi.fn() };
const navigate = vi.fn();
let role: "admin" | "waiter" = "admin";
let latestProps: TablesPresenterProps;
let notificationHandlers: Partial<Record<NotificationEvent, (payload: unknown) => void>>;

vi.mock("react-router-dom", () => ({ useNavigate: () => navigate }));
vi.mock("../../contexts/toastContext", () => ({ useToast: () => toast }));
vi.mock("../../state/hooks", () => ({
  useAppSelector: () => ({
    user: { id: "user", name: "Admin", email: "admin@example.com", role, branchId: null },
  }),
}));
vi.mock("../../hooks/useNotifications", () => ({
  useNotifications: (
    handlers: Partial<Record<NotificationEvent, (payload: unknown) => void>>,
  ) => {
    notificationHandlers = handlers;
    return true;
  },
}));
vi.mock("../../features/waiter/tablesPage/TablesPresenter", () => ({
  TablesPresenter: (props: TablesPresenterProps) => {
    latestProps = props;
    return (
      <div>
        {props.tables.map((table) => `${table.tableNumber}:${table.status}`).join(",")}
        <button type="button" onClick={props.onOpenAddModal}>open</button>
      </div>
    );
  },
}));
vi.mock("../../services/waiter/table.api", async (importOriginal) => {
  const original = await importOriginal<typeof import("../../services/waiter/table.api")>();
  return {
    ...original,
    getTablesApi: vi.fn(),
    createTableApi: vi.fn(),
    deleteTableApi: vi.fn(),
    allocateTableApi: vi.fn(),
  };
});

const table = (status: Table["status"], tableNumber = 1): Table => ({
  _id: `table-${tableNumber}`,
  tableNumber,
  capacity: 4,
  status,
});

const response = (...tables: Table[]) =>
  ({ data: { tables } }) as Awaited<ReturnType<typeof getTablesApi>>;

describe("TablesContainer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    role = "admin";
    notificationHandlers = {};
    vi.mocked(getTablesApi).mockResolvedValue(response(table("available")));
    vi.mocked(createTableApi).mockResolvedValue({
      data: { message: "created", table: table("available", 2) },
    } as never);
    vi.mocked(deleteTableApi).mockResolvedValue({ data: { message: "deleted" } } as never);
    vi.mocked(allocateTableApi).mockResolvedValue({
      data: { message: "allocated", table: table("occupied") },
    } as never);
  });

  it("loads Tables and renders occupied status directly from fresh API data", async () => {
    vi.mocked(getTablesApi).mockResolvedValue(response(table("occupied", 3)));
    render(<TablesContainer />);

    expect(await screen.findByText("3:occupied")).toBeInTheDocument();
    expect(latestProps.counts).toEqual({
      available: 0,
      occupied: 1,
      billing: 0,
      reserved: 0,
    });
  });

  it("refetches authoritative table data after the existing table:updated event", async () => {
    render(<TablesContainer />);
    expect(await screen.findByText("1:available")).toBeInTheDocument();
    vi.mocked(getTablesApi).mockResolvedValue(response(table("occupied")));

    act(() => notificationHandlers["table:updated"]?.({ _id: "table-1" }));

    expect(await screen.findByText("1:occupied")).toBeInTheDocument();
    expect(getTablesApi).toHaveBeenCalledTimes(2);
  });

  it("keeps create and delete CRUD behavior intact", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    render(<TablesContainer />);
    await waitFor(() => expect(getTablesApi).toHaveBeenCalledTimes(1));

    act(() => latestProps.onOpenAddModal());
    act(() => latestProps.onAddFormChange("tableNumber", "2"));
    act(() => latestProps.onAddFormChange("capacity", "6"));
    await act(async () => latestProps.onAddTable({ preventDefault: vi.fn() } as never));
    expect(createTableApi).toHaveBeenCalledWith({ tableNumber: 2, capacity: 6 });
    expect(latestProps.tables.map((item) => item.tableNumber)).toEqual([1, 2]);
    expect(latestProps.showAddModal).toBe(false);

    await act(async () =>
      latestProps.onDeleteTable(latestProps.tables[0], { stopPropagation: vi.fn() } as never),
    );
    expect(deleteTableApi).toHaveBeenCalledWith("table-1");
    expect(latestProps.tables.map((item) => item.tableNumber)).toEqual([2]);
  });

  it("preserves waiter allocation and navigation behavior", async () => {
    role = "waiter";
    render(<TablesContainer />);
    await waitFor(() => expect(getTablesApi).toHaveBeenCalledTimes(1));

    act(() => latestProps.onTableClick(latestProps.tables[0]));
    expect(latestProps.showAllocateModal).toBe(true);
    act(() => latestProps.onAllocateFormChange("name", "Guest"));
    act(() => latestProps.onAllocateFormChange("phone", "1234567890"));
    await act(async () => latestProps.onAllocate({ preventDefault: vi.fn() } as never));

    expect(allocateTableApi).toHaveBeenCalledWith("table-1", {
      name: "Guest",
      phone: "1234567890",
    });
    expect(navigate).toHaveBeenCalledWith("/waiter/order/table-1", {
      state: { customerName: "Guest", customerPhone: "1234567890", tableNumber: 1 },
    });
  });

  it("shows the Tables API error instead of presenting an empty state", async () => {
    vi.mocked(getTablesApi).mockRejectedValue({
      response: { status: 503, data: { error: "Tables service unavailable" } },
    });
    render(<TablesContainer />);

    expect(await screen.findByText("Tables service unavailable")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });
});
