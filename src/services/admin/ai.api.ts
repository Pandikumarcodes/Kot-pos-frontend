import api from "../apiClient";

export const getDailySummaryApi = (branchId?: string) =>
  api.get("/ai/daily-summary", {
    params: branchId ? { branchId } : undefined,
  });

export const getInventoryAlertsApi = (branchId?: string) =>
  api.get("/ai/inventory-alerts", {
    params: branchId ? { branchId } : undefined,
  });

export const sendAiChatApi = (
  payload: { message: string; context: object },
  branchId?: string,
) =>
  api.post("/ai/chat", payload, {
    params: branchId ? { branchId } : undefined,
  });
