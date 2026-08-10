import { beforeEach, describe, expect, it, vi } from "vitest";
import api from "../../services/apiClient";
import { getKotOrdersApi } from "../../services/chef/chef.api";

vi.mock("../../services/apiClient", () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

describe("getKotOrdersApi", () => {
  beforeEach(() => vi.clearAllMocks());

  it("preserves the legacy no-argument request", () => {
    void getKotOrdersApi();
    expect(api.get).toHaveBeenCalledWith("/chef/kot");
  });

  it("passes only the typed Kitchen query and AbortSignal", () => {
    const controller = new AbortController();
    const query = {
      page: 2,
      limit: 50,
      status: "preparing" as const,
      sort: "createdAt" as const,
      order: "asc" as const,
    };

    void getKotOrdersApi(query, controller.signal);

    expect(api.get).toHaveBeenCalledWith("/chef/kot", {
      params: query,
      signal: controller.signal,
    });
    expect(query).not.toHaveProperty("search");
    expect(query).not.toHaveProperty("branchId");
  });
});
