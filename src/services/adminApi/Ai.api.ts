import api from "../apiClient";

// AI Sales Assistant
export const aiChatApi = (message: string, context: object) =>
  api.post<{ reply: string }>("/ai/chat", { message, context });

// Inventory Alerts
export const getInventoryAlertsApi = () => api.get("/ai/inventory-alerts");

// Daily Summary
export const getDailySummaryApi = () => api.get("/ai/daily-summary");
