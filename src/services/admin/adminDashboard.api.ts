import api from "../apiClient";

// ── Summary Stats ─────────────────────────────────────────────
export const getDashboardSummaryApi = (range = "today", branchId?: string) =>
  api.get(`/admin/reports/summary`, { params: { range, branchId } });

// ── Top Selling Items ─────────────────────────────────────────
export const getTopItemsApi = (range = "today", branchId?: string) =>
  api.get(`/admin/reports/top-items`, { params: { range, branchId } });

// ── Tables ────────────────────────────────────────────────────
export const getDashboardTablesApi = (branchId?: string) =>
  api.get("/admin/tables", { params: branchId ? { branchId } : undefined });

// ── Hourly Sales ──────────────────────────────────────────────
export const getHourlySalesApi = (range = "today", branchId?: string) =>
  api.get(`/admin/reports/hourly`, { params: { range, branchId } });

// ── Payment Methods ───────────────────────────────────────────
export const getPaymentMethodsApi = (range = "today", branchId?: string) =>
  api.get(`/admin/reports/payments`, { params: { range, branchId } });
