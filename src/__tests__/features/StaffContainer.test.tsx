import { act, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { StaffPresenterProps } from "../../features/admin/staff/staff.types";
import StaffContainer from "../../features/admin/staff/StaffContainer";
import type { StaffUser } from "../../services/admin/staff.api";
import {
  createUserApi,
  deleteUserApi,
  getUsersApi,
  updateUserRoleApi,
} from "../../services/admin/staff.api";

const toast = {
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  info: vi.fn(),
};
let latestProps: StaffPresenterProps;

vi.mock("../../state/hooks", () => ({
  useAppSelector: () => ({ user: { role: "admin" } }),
}));
vi.mock("../../contexts/toastContext", () => ({ useToast: () => toast }));
vi.mock("../../features/admin/staff/StaffPresenter", () => ({
  StaffPresenter: (props: StaffPresenterProps) => {
    latestProps = props;
    return <div>{props.error ?? props.users.map((user) => user.username).join(",")}</div>;
  },
}));
vi.mock("../../services/admin/staff.api", async (importOriginal) => {
  const original = await importOriginal<typeof import("../../services/admin/staff.api")>();
  return {
    ...original,
    getUsersApi: vi.fn(),
    createUserApi: vi.fn(),
    updateUserRoleApi: vi.fn(),
    deleteUserApi: vi.fn(),
  };
});

const staff = (username: string): StaffUser => ({
  _id: username,
  username,
  role: "waiter",
  status: "active",
});

const response = (username = "default", page = 1, limit = 20) => ({
  data: {
    users: [staff(username)],
    pagination: {
      page,
      limit,
      total: 45,
      pages: Math.ceil(45 / limit),
      hasNext: page < Math.ceil(45 / limit),
      hasPrev: page > 1,
    },
  },
}) as Awaited<ReturnType<typeof getUsersApi>>;

describe("StaffContainer queries", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getUsersApi).mockResolvedValue(response());
    vi.mocked(createUserApi).mockResolvedValue({
      data: { message: "created", user: staff("created") },
    } as never);
    vi.mocked(updateUserRoleApi).mockResolvedValue({
      data: { message: "updated", user: staff("updated") },
    } as never);
    vi.mocked(deleteUserApi).mockResolvedValue({
      data: { message: "deleted" },
    } as never);
  });

  afterEach(() => vi.useRealTimers());

  it("uses Staff pagination defaults and resets role, status, and page-size changes", async () => {
    render(<StaffContainer />);
    await waitFor(() => expect(getUsersApi).toHaveBeenCalledTimes(1));
    expect(vi.mocked(getUsersApi).mock.calls[0][0]).toEqual({
      page: 1,
      limit: 20,
      search: undefined,
      role: undefined,
      status: undefined,
      sort: undefined,
      order: undefined,
    });

    act(() => latestProps.onPageChange(2));
    await waitFor(() => expect(getUsersApi).toHaveBeenCalledTimes(2));
    expect(vi.mocked(getUsersApi).mock.calls[1][0]?.page).toBe(2);

    act(() => latestProps.onRoleChange("chef"));
    await waitFor(() => expect(getUsersApi).toHaveBeenCalledTimes(3));
    expect(vi.mocked(getUsersApi).mock.calls[2][0]).toMatchObject({ page: 1, role: "chef" });

    act(() => latestProps.onStatusChange("locked"));
    await waitFor(() => expect(getUsersApi).toHaveBeenCalledTimes(4));
    expect(vi.mocked(getUsersApi).mock.calls[3][0]).toMatchObject({
      page: 1,
      role: "chef",
      status: "locked",
    });

    act(() => latestProps.onLimitChange(50));
    await waitFor(() => expect(getUsersApi).toHaveBeenCalledTimes(5));
    expect(vi.mocked(getUsersApi).mock.calls[4][0]).toMatchObject({ page: 1, limit: 50 });
    expect(vi.mocked(getUsersApi).mock.calls[4][0]).not.toHaveProperty("branchId");
  });

  it("debounces username search and prevents an older response from overwriting it", async () => {
    vi.useFakeTimers();
    let resolveOld!: (value: ReturnType<typeof response>) => void;
    let resolveNew!: (value: ReturnType<typeof response>) => void;
    vi.mocked(getUsersApi)
      .mockReturnValueOnce(new Promise((resolve) => { resolveOld = resolve; }))
      .mockReturnValueOnce(new Promise((resolve) => { resolveNew = resolve; }));

    render(<StaffContainer />);
    act(() => latestProps.onSearchChange("a"));
    act(() => latestProps.onSearchChange("anu"));
    act(() => vi.advanceTimersByTime(299));
    expect(getUsersApi).toHaveBeenCalledTimes(1);
    act(() => vi.advanceTimersByTime(1));
    await act(async () => undefined);
    expect(vi.mocked(getUsersApi).mock.calls[1][0]).toMatchObject({
      page: 1,
      search: "anu",
    });
    expect(vi.mocked(getUsersApi).mock.calls[1][0]?.role).toBeUndefined();

    await act(async () => resolveNew(response("newest")));
    expect(screen.getByText("newest")).toBeInTheDocument();
    await act(async () => resolveOld(response("stale")));
    expect(screen.queryByText("stale")).not.toBeInTheDocument();
  });

  it("maps the backend no-users 404 to an empty result but exposes genuine failures for retry", async () => {
    vi.mocked(getUsersApi).mockRejectedValueOnce({
      response: { status: 404, data: { error: "No users found" } },
    });
    render(<StaffContainer />);
    await waitFor(() => expect(latestProps.loading).toBe(false));
    expect(latestProps.users).toEqual([]);
    expect(latestProps.pagination.total).toBe(0);
    expect(latestProps.error).toBeNull();

    vi.mocked(getUsersApi).mockRejectedValueOnce({
      response: { status: 500, data: { error: "Database unavailable" } },
    });
    act(() => latestProps.onRetry());
    await waitFor(() => expect(latestProps.error).toBe("Database unavailable"));
    act(() => latestProps.onRetry());
    await waitFor(() => expect(getUsersApi).toHaveBeenCalledTimes(3));
    await waitFor(() => expect(latestProps.error).toBeNull());
  });

  it("refetches the active query after create, role edit, and delete", async () => {
    render(<StaffContainer />);
    await waitFor(() => expect(getUsersApi).toHaveBeenCalledTimes(1));
    act(() => latestProps.onRoleChange("waiter"));
    await waitFor(() => expect(getUsersApi).toHaveBeenCalledTimes(2));

    act(() => latestProps.onOpenModal());
    act(() => latestProps.onFieldChange("username", "newuser"));
    act(() => latestProps.onFieldChange("password", "Secret123"));
    await act(async () => latestProps.onSubmit({ preventDefault: vi.fn() } as never));
    await waitFor(() => expect(getUsersApi).toHaveBeenCalledTimes(3));
    expect(vi.mocked(getUsersApi).mock.calls[2][0]?.role).toBe("waiter");

    act(() => latestProps.onOpenModal(staff("existing")));
    await act(async () => latestProps.onSubmit({ preventDefault: vi.fn() } as never));
    await waitFor(() => expect(getUsersApi).toHaveBeenCalledTimes(4));

    vi.spyOn(window, "confirm").mockReturnValue(true);
    await act(async () => latestProps.onDelete(staff("existing")));
    await waitFor(() => expect(getUsersApi).toHaveBeenCalledTimes(5));
    expect(vi.mocked(getUsersApi).mock.calls[4][0]?.role).toBe("waiter");
  });
});
