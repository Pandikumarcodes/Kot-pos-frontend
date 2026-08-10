import api from "../apiClient";
import type { BaseListQuery, PaginationMeta } from "../../types/query";

// ── Types ─────────────────────────────────────────────────────

export type PaymentMethod = "cash" | "card" | "upi";
export type PaymentStatus = "paid" | "unpaid" | "pending" | "due";
export type BillingListStatus = "unpaid" | "paid";
export type BillingSort = "billDate" | "paymentStatus";
export type TakeawayStatus =
  | "pending"
  | "sent_to_kitchen"
  | "received"
  | "cancelled";

export interface BillItem {
  itemId: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Bill {
  _id: string;
  billNumber: string;
  customerName: string;
  customerPhone: string;
  items: BillItem[];
  totalAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  createdAt: string;
  paidAt?: string;
}

export interface TakeawayOrder {
  _id: string;
  customerName: string;
  customerPhone: string;
  items: BillItem[];
  totalAmount: number;
  status: TakeawayStatus;
  createdAt: string;
}

export interface CreateTakeawayPayload {
  customerName: string;
  customerPhone: string;
  items: { itemId: string; quantity: number }[];
}

export interface CreateBillPayload {
  customerName: string;
  customerPhone: string;
  items: { itemId: string; quantity: number }[];
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
}

export interface BillingQuery extends BaseListQuery {
  search?: string;
  status?: BillingListStatus;
  sort?: BillingSort;
}

export interface BillsResponse {
  myBills: Bill[];
  pagination?: PaginationMeta;
}

// ── Takeaway APIs ─────────────────────────────────────────────

// POST /cashier/takeaway-orders — create takeaway order
export const createTakeawayApi = (data: CreateTakeawayPayload) =>
  api.post<{ message: string; order: TakeawayOrder }>(
    "/cashier/takeaway-orders",
    data,
  );

// GET /cashier/takeaway-orders — get all takeaway orders
export const getTakeawayOrdersApi = () =>
  api.get<{ myOrders: TakeawayOrder[] }>("/cashier/takeaway-orders");

// GET /cashier/takeaway/:orderId — get single takeaway order
export const getTakeawayByIdApi = (orderId: string) =>
  api.get<{ order: TakeawayOrder }>(`/cashier/takeaway/${orderId}`);

// PUT /cashier/takeaway/:orderId/send — send to kitchen (KOT)
export const sendTakeawayToKitchenApi = (orderId: string) =>
  api.put<{ message: string; order: TakeawayOrder }>(
    `/cashier/takeaway/${orderId}/send`,
  );

// PUT /cashier/takeAway/:orderId/received — mark received
export const markTakeawayReceivedApi = (orderId: string) =>
  api.put<{ message: string; order: TakeawayOrder }>(
    `/cashier/takeAway/${orderId}/received`,
  );

// PUT /cashier/takeAway/:orderId/cancel — cancel order
export const cancelTakeawayApi = (orderId: string) =>
  api.put<{ message: string; order: TakeawayOrder }>(
    `/cashier/takeAway/${orderId}/cancel`,
  );

// ── Billing APIs ──────────────────────────────────────────────

// POST /cashier/billing — create bill + collect payment
export const createBillApi = (data: CreateBillPayload) =>
  api.post<{ message: string; bill: Bill }>("/cashier/billing", data);

// GET /cashier/bills — get all bills
export const getBillsApi = (query?: BillingQuery, signal?: AbortSignal) => {
  if (!query && !signal) return api.get<BillsResponse>("/cashier/bills");
  return api.get<BillsResponse>("/cashier/bills", { params: query, signal });
};

// GET /cashier/bills/:billId — get single bill
export const getBillByIdApi = (billId: string) =>
  api.get<{ bill: Bill }>(`/cashier/bills/${billId}`);

// PUT /cashier/bills/:billId/pay — mark bill as paid
export const markBillPaidApi = (billId: string, paymentMethod?: string) =>
  api.put<{ message: string; bill: Bill }>(`/cashier/bills/${billId}/pay`, {
    paymentMethod: paymentMethod ?? "cash",
  });

// DELETE /cashier/bills/:billId — delete bill
export const deleteBillApi = (billId: string) =>
  api.delete<{ message: string }>(`/cashier/bills/${billId}`);

// ── Reports API ───────────────────────────────────────────────

// GET /cashier/income — today's total income
export const getTodayIncomeApi = () =>
  api.get<{ totalIncome: number }>("/cashier/income");
