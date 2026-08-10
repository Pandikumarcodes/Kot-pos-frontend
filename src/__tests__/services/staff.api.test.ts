import { beforeEach, describe, expect, it, vi } from "vitest";
import api from "../../services/apiClient";
import { getUsersApi } from "../../services/admin/staff.api";

vi.mock("../../services/apiClient", () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

describe("getUsersApi", () => {
  beforeEach(() => vi.clearAllMocks());

  it("keeps the no-argument Branch request unpaginated", () => {
    void getUsersApi();

    expect(api.get).toHaveBeenCalledWith("/admin/users");
  });

  it("passes only the supported Staff query and AbortSignal", () => {
    const controller = new AbortController();
    const query = {
      page: 2,
      limit: 50,
      search: "anu",
      role: "waiter" as const,
      status: "active" as const,
      sort: "createdAt" as const,
      order: "desc" as const,
    };

    void getUsersApi(query, controller.signal);

    expect(api.get).toHaveBeenCalledWith("/admin/users", {
      params: query,
      signal: controller.signal,
    });
    expect(query).not.toHaveProperty("branchId");
  });

  it("does not add params when only a signal is supplied", () => {
    const controller = new AbortController();

    void getUsersApi(undefined, controller.signal);

    expect(api.get).toHaveBeenCalledWith("/admin/users", {
      signal: controller.signal,
    });
  });
});
