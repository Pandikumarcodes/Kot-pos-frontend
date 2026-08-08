import { beforeEach, describe, expect, it, vi } from "vitest";

const api = vi.hoisted(() => ({ get: vi.fn(), post: vi.fn() }));
vi.mock("../../services/apiClient", () => ({ default: api }));

import {
  getDailySummaryApi,
  getInventoryAlertsApi,
  sendAiChatApi,
} from "../../services/admin/ai.api";

describe("AI branch-scoped API clients", () => {
  beforeEach(() => vi.clearAllMocks());

  it("passes the selected branch to all branch-scoped AI endpoints", () => {
    getDailySummaryApi("507f1f77bcf86cd799439011");
    getInventoryAlertsApi("507f1f77bcf86cd799439011");
    sendAiChatApi({ message: "summary", context: {} }, "507f1f77bcf86cd799439011");

    const params = { params: { branchId: "507f1f77bcf86cd799439011" } };
    expect(api.get).toHaveBeenNthCalledWith(1, "/ai/daily-summary", params);
    expect(api.get).toHaveBeenNthCalledWith(2, "/ai/inventory-alerts", params);
    expect(api.post).toHaveBeenCalledWith(
      "/ai/chat",
      { message: "summary", context: {} },
      params,
    );
  });
});
