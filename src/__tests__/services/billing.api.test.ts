import { beforeEach, describe, expect, it, vi } from "vitest";
import api from "../../services/apiClient";
import { getBillsApi } from "../../services/cashier/cashier.api";

vi.mock("../../services/apiClient", () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

describe("getBillsApi", () => {
  beforeEach(() => vi.clearAllMocks());

  it("preserves the legacy no-argument request", () => {
    void getBillsApi();
    expect(api.get).toHaveBeenCalledWith("/cashier/bills");
  });

  it("passes only the supported typed query and AbortSignal", () => {
    const controller = new AbortController();
    const query = {
      page: 2,
      limit: 50,
      search: "BILL-123",
      status: "unpaid" as const,
      sort: "paymentStatus" as const,
      order: "asc" as const,
    };

    void getBillsApi(query, controller.signal);

    expect(api.get).toHaveBeenCalledWith("/cashier/bills", {
      params: query,
      signal: controller.signal,
    });
    expect(query).not.toHaveProperty("branchId");
  });
});
