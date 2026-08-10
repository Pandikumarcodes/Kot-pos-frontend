import { act, render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import BranchContainer from "../../features/admin/branch/BranchContainer";
import type { BranchPresenterProps } from "../../features/admin/branch/Branch.types";
import type { Branch } from "../../services/admin/branch.api";
import {
  getBranchesApi,
  getBranchStaffApi,
  getBranchSummaryApi,
} from "../../services/admin/branch.api";
import { getUsersApi } from "../../services/admin/staff.api";

let latestProps: BranchPresenterProps;
const toast = {
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  info: vi.fn(),
};

vi.mock("../../contexts/toastContext", () => ({ useToast: () => toast }));
vi.mock("../../features/admin/branch/BranchPresenter", () => ({
  BranchPresenter: (props: BranchPresenterProps) => {
    latestProps = props;
    return <div>{props.unassignedUsers.map((user) => user.username).join(",")}</div>;
  },
}));
vi.mock("../../services/admin/branch.api", async (importOriginal) => {
  const original = await importOriginal<typeof import("../../services/admin/branch.api")>();
  return {
    ...original,
    getBranchesApi: vi.fn(),
    getBranchStaffApi: vi.fn(),
    getBranchSummaryApi: vi.fn(),
  };
});
vi.mock("../../services/admin/staff.api", async (importOriginal) => {
  const original = await importOriginal<typeof import("../../services/admin/staff.api")>();
  return { ...original, getUsersApi: vi.fn() };
});

const branch: Branch = {
  _id: "branch-1",
  name: "Main",
  address: "Street",
  phone: "123",
  email: "main@example.com",
  gstin: "GST",
  isActive: true,
  createdAt: "2026-01-01",
};

describe("Branch staff compatibility", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getBranchesApi).mockResolvedValue({ data: { branches: [branch] } } as never);
    vi.mocked(getBranchStaffApi).mockResolvedValue({ data: { users: [] } } as never);
    vi.mocked(getUsersApi).mockResolvedValue({
      data: {
        users: [{ _id: "user-1", username: "legacy-user", role: "waiter", status: "active" }],
      },
    } as never);
    vi.mocked(getBranchSummaryApi).mockResolvedValue({
      data: { totalOrders: 0, activeOrders: 0, staffCount: 0 },
    } as never);
  });

  it("continues requesting and consuming the legacy unpaginated users response", async () => {
    render(<BranchContainer />);
    await waitFor(() => expect(getBranchesApi).toHaveBeenCalledTimes(1));

    await act(async () => latestProps.onOpenStaff(branch));

    expect(getUsersApi).toHaveBeenCalledWith();
    expect(latestProps.unassignedUsers).toEqual([
      { _id: "user-1", username: "legacy-user", role: "waiter", status: "active" },
    ]);
  });
});
