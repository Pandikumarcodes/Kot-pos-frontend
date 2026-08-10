import { beforeEach, describe, expect, it, vi } from "vitest";
import api from "../../services/apiClient";
import { getMenuItemsApi } from "../../services/admin/menu.api";

vi.mock("../../services/apiClient", () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

describe("getMenuItemsApi", () => {
  beforeEach(() => vi.clearAllMocks());

  it("keeps no-argument requests unpaginated", () => {
    void getMenuItemsApi();

    expect(api.get).toHaveBeenCalledWith("/admin/menuItems");
  });

  it("passes the approved menu query and cancellation signal", () => {
    const controller = new AbortController();
    const query = {
      page: 2,
      limit: 20,
      search: "coffee",
      category: "beverage",
      availability: false,
      sort: "price" as const,
      order: "desc" as const,
    };

    void getMenuItemsApi(query, controller.signal);

    expect(api.get).toHaveBeenCalledWith("/admin/menuItems", {
      params: query,
      signal: controller.signal,
    });
  });
});
