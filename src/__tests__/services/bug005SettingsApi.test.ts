import { beforeEach, describe, expect, it, vi } from "vitest";

const { get, put } = vi.hoisted(() => ({ get: vi.fn(), put: vi.fn() }));
vi.mock("../../services/apiClient", () => ({ default: { get, put } }));

import { getCashierSettingsApi } from "../../services/admin/settings.api";

describe("BUG-005C operational settings API", () => {
  beforeEach(() => vi.clearAllMocks());

  it("reads cashier settings through the non-admin endpoint with its branch", async () => {
    get.mockResolvedValue({ data: { settings: {} } });
    await getCashierSettingsApi("507f1f77bcf86cd799439011");

    expect(get).toHaveBeenCalledWith("/settings", {
      params: { branchId: "507f1f77bcf86cd799439011" },
    });
  });

  it("does not expose a cashier settings mutation helper", () => {
    expect(put).not.toHaveBeenCalled();
  });
});
