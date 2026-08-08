import { beforeEach, describe, expect, it, vi } from "vitest";

const api = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
}));

vi.mock("../../services/apiClient", () => ({ default: api }));

import { getInventoryApi } from "../../services/admin/inventory.api";
import { getSettingsApi } from "../../services/admin/settings.api";
import { getSummaryApi } from "../../services/admin/reports.api";
import { getKotOrdersApi } from "../../services/chef/chef.api";
import { getBillsApi } from "../../services/cashier/cashier.api";
import { getTablesApi } from "../../services/waiter/table.api";

describe("branch-scoped API clients", () => {
  beforeEach(() => vi.clearAllMocks());

  it("passes the same selected branch through audited page requests", () => {
    getInventoryApi({ branchId: "branch-a" });
    getTablesApi("branch-a");
    getKotOrdersApi({ branchId: "branch-a" });
    getBillsApi({ branchId: "branch-a" });
    getSettingsApi("branch-a");
    getSummaryApi("today", undefined, undefined, "branch-a");

    expect(api.get).toHaveBeenNthCalledWith(1, "/admin/inventory", {
      params: { branchId: "branch-a" },
    });
    expect(api.get).toHaveBeenNthCalledWith(2, "/admin/tables", {
      params: { branchId: "branch-a" },
    });
    expect(api.get).toHaveBeenNthCalledWith(3, "/chef/kot", {
      params: { branchId: "branch-a" },
    });
    expect(api.get).toHaveBeenNthCalledWith(4, "/cashier/bills", {
      params: { branchId: "branch-a" },
    });
    expect(api.get).toHaveBeenNthCalledWith(5, "/admin/settings", {
      params: { branchId: "branch-a" },
    });
    expect(api.get).toHaveBeenNthCalledWith(6, "/admin/reports/summary", {
      params: { range: "today", from: undefined, to: undefined, branchId: "branch-a" },
    });
  });
});
