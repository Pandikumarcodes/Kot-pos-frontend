import api from "../apiClient";

export type DateRange = "today" | "week" | "month" | "custom";

export interface SummaryStats {
  totalRevenue: number;
  totalOrders: number;
  totalBills: number;
  avgOrderValue: number;
  dineInCount: number;
  takeawayCount: number;
}

export interface TopItem {
  name: string;
  quantity: number;
  revenue: number;
}

export interface PaymentStat {
  method: string;
  count: number;
  amount: number;
  percentage: number;
}

export interface HourlyStat {
  hour: string;
  orders: number;
  revenue: number;
}

// GET /admin/reports/summary
export const getSummaryApi = (range: DateRange, from?: string, to?: string) =>
  api.get<SummaryStats>("/admin/reports/summary", {
    params: { range, from, to },
  });

// GET /admin/reports/top-items
export const getTopItemsApi = (range: DateRange, from?: string, to?: string) =>
  api.get<{ topItems: TopItem[] }>("/admin/reports/top-items", {
    params: { range, from, to },
  });

// GET /admin/reports/payments
export const getPaymentsApi = (range: DateRange, from?: string, to?: string) =>
  api.get<{ payments: PaymentStat[] }>("/admin/reports/payments", {
    params: { range, from, to },
  });

// GET /admin/reports/hourly
export const getHourlyApi = (range: DateRange, from?: string, to?: string) =>
  api.get<{ hourly: HourlyStat[] }>("/admin/reports/hourly", {
    params: { range, from, to },
  });
