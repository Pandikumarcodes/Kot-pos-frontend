import { beforeEach, describe, expect, it, vi } from "vitest";
import api from "../../services/apiClient";
import { getInventoryApi } from "../../services/admin/inventory.api";

vi.mock("../../services/apiClient", () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

describe("getInventoryApi", () => {
  beforeEach(() => vi.clearAllMocks());

  it("requests the inventory endpoint without query params by default", () => {
    void getInventoryApi();

    expect(api.get).toHaveBeenCalledWith("/admin/inventory", {
      params: {},
      signal: undefined,
    });
  });

  it("passes pagination as Axios params", () => {
    void getInventoryApi({ page: 1, limit: 20 });

    expect(api.get).toHaveBeenCalledWith("/admin/inventory", {
      params: { page: 1, limit: 20 },
      signal: undefined,
    });
  });

  it("passes pagination and sorting as Axios params and supports cancellation", () => {
    const controller = new AbortController();
    const query = {
      page: 1,
      limit: 20,
      sort: "currentStock" as const,
      order: "asc" as const,
    };

    void getInventoryApi(query, controller.signal);

    expect(api.get).toHaveBeenCalledWith("/admin/inventory", {
      params: query,
      signal: controller.signal,
    });
    expect(query).not.toHaveProperty("branchId");
  });
});
