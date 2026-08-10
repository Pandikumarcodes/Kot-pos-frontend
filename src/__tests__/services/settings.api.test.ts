import { beforeEach, describe, expect, it, vi } from "vitest";
import api from "../../services/apiClient";
import { getReceiptSettingsApi } from "../../services/settings.api";
import { getSettingsApi } from "../../services/admin/settings.api";

vi.mock("../../services/apiClient", () => ({
  default: {
    get: vi.fn(),
  },
}));

describe("settings API contracts", () => {
  beforeEach(() => vi.clearAllMocks());

  it("uses the read-only receipt endpoint for Billing", () => {
    getReceiptSettingsApi();
    expect(api.get).toHaveBeenCalledWith("/settings", { signal: undefined });
  });

  it("keeps Admin Settings on its management endpoint", () => {
    getSettingsApi();
    expect(api.get).toHaveBeenCalledWith("/admin/settings");
  });
});
