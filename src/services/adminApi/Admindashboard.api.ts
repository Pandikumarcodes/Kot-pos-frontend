import api from "../apiClient";

// ── Summary Stats ─────────────────────────────────────────────
export const getDashboardSummaryApi = (range = "today") =>
  api.get(`/admin/reports/summary?range=${range}`);

// ── Top Selling Items ─────────────────────────────────────────
export const getTopItemsApi = (range = "today") =>
  api.get(`/admin/reports/top-items?range=${range}`);

// ── Tables ────────────────────────────────────────────────────
export const getDashboardTablesApi = () =>
  api.get("/admin/tables");

// ── Hourly Sales ──────────────────────────────────────────────
export const getHourlySalesApi = (range = "today") =>
  api.get(`/admin/reports/hourly?range=${range}`);

// ── Payment Methods ───────────────────────────────────────────
export const getPaymentMethodsApi = (range = "today") =>
  api.get(`/admin/reports/payments?range=${range}`);