import { beforeEach, describe, expect, it, vi } from "vitest";
import api from "../../services/apiClient";
import { getOrdersApi } from "../../services/waiter/waiter.api";

vi.mock("../../services/apiClient", () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

describe("getOrdersApi", () => {
  beforeEach(() => vi.clearAllMocks());

  it("passes the supported query and AbortSignal through Axios params", () => {
    const controller = new AbortController();
    const query = {
      page: 2,
      limit: 20,
      status: "sent_to_kitchen" as const,
      sort: "createdAt" as const,
      order: "desc" as const,
    };

    void getOrdersApi(query, controller.signal);

    expect(api.get).toHaveBeenCalledWith("/waiter/orders", {
      params: query,
      signal: controller.signal,
    });
    for (const unsupported of ["search", "from", "to", "tableNumber", "branchId"]) {
      expect(query).not.toHaveProperty(unsupported);
    }
  });
});
