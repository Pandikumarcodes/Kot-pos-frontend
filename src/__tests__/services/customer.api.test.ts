import { beforeEach, describe, expect, it, vi } from "vitest";
import api from "../../services/apiClient";
import { getCustomersApi } from "../../services/admin/customer.api";

vi.mock("../../services/apiClient", () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

describe("getCustomersApi", () => {
  beforeEach(() => vi.clearAllMocks());

  it("keeps no-argument requests unpaginated", () => {
    void getCustomersApi();

    expect(api.get).toHaveBeenCalledWith("/admin/customers");
  });

  it("passes only the approved customer query and cancellation signal", () => {
    const controller = new AbortController();
    const query = {
      page: 2,
      limit: 20,
      search: "9876",
      sort: "createdAt" as const,
      order: "desc" as const,
    };

    void getCustomersApi(query, controller.signal);

    expect(api.get).toHaveBeenCalledWith("/admin/customers", {
      params: query,
      signal: controller.signal,
    });
    expect(query).not.toHaveProperty("email");
  });
});
