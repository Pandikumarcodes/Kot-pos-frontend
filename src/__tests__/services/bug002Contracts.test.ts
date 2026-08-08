import { beforeEach, describe, expect, it, vi } from "vitest";

const api = vi.hoisted(() => ({ get: vi.fn(), post: vi.fn() }));
vi.mock("../../services/apiClient", () => ({ default: api }));

import { createUserApi } from "../../services/admin/staff.api";
import {
  getDashboardSummaryApi,
  getDashboardTablesApi,
} from "../../services/admin/adminDashboard.api";

describe("BUG-002 branch contracts", () => {
  beforeEach(() => vi.clearAllMocks());

  it("sends selected branch for staff creation without trusting body branchId", () => {
    const payload = {
      username: "newwaiter",
      password: "Password1",
      role: "waiter",
      status: "active",
    };
    createUserApi(payload, "507f1f77bcf86cd799439011");
    expect(api.post).toHaveBeenCalledWith("/admin/create-user", payload, {
      params: { branchId: "507f1f77bcf86cd799439011" },
    });
  });

  it("keeps report range and selected branch together", () => {
    getDashboardSummaryApi("week", "507f1f77bcf86cd799439011");
    getDashboardTablesApi("507f1f77bcf86cd799439011");
    expect(api.get).toHaveBeenNthCalledWith(1, "/admin/reports/summary", {
      params: { range: "week", branchId: "507f1f77bcf86cd799439011" },
    });
    expect(api.get).toHaveBeenNthCalledWith(2, "/admin/tables", {
      params: { branchId: "507f1f77bcf86cd799439011" },
    });
  });
});
