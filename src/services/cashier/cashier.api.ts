import api from "../apiClient";

// ── Types ─────────────────────────────────────────────────────

export type PaymentMethod = "cash" | "card" | "upi";
export type PaymentStatus = "paid" | "pending" | "due";
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

export interface BillsQuery {
  branchId?: string;
  page?: number;
  limit?: number;
  search?: string;
  status?: "paid" | "unpaid";
  sort?: "billDate" | "paymentStatus";
  order?: "asc" | "desc";
}

export interface BillsPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
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

// ── Takeaway APIs ─────────────────────────────────────────────

// POST /cashier/takeaway-orders — create takeaway order
export const createTakeawayApi = (data: CreateTakeawayPayload, branchId?: string) =>
  api.post<{ message: string; order: TakeawayOrder }>(
    "/cashier/takeaway-orders",
    data,
    { params: branchId ? { branchId } : undefined },
  );

// GET /cashier/takeaway-orders — get all takeaway orders
export const getTakeawayOrdersApi = (branchId?: string) =>
  api.get<{ myOrders: TakeawayOrder[] }>("/cashier/takeaway-orders", {
    params: branchId ? { branchId } : undefined,
  });

// GET /cashier/takeaway/:orderId — get single takeaway order
export const getTakeawayByIdApi = (orderId: string, branchId?: string) =>
  api.get<{ order: TakeawayOrder }>(`/cashier/takeaway/${orderId}`, {
    params: branchId ? { branchId } : undefined,
  });

// PUT /cashier/takeaway/:orderId/send — send to kitchen (KOT)
export const sendTakeawayToKitchenApi = (orderId: string, branchId?: string) =>
  api.put<{ message: string; order: TakeawayOrder }>(
    `/cashier/takeaway/${orderId}/send`,
    undefined,
    { params: branchId ? { branchId } : undefined },
  );

// PUT /cashier/takeAway/:orderId/received — mark received
export const markTakeawayReceivedApi = (orderId: string, branchId?: string) =>
  api.put<{ message: string; order: TakeawayOrder }>(
    `/cashier/takeAway/${orderId}/received`,
    undefined,
    { params: branchId ? { branchId } : undefined },
  );

// PUT /cashier/takeAway/:orderId/cancel — cancel order
export const cancelTakeawayApi = (orderId: string, branchId?: string) =>
  api.put<{ message: string; order: TakeawayOrder }>(
    `/cashier/takeAway/${orderId}/cancel`,
    undefined,
    { params: branchId ? { branchId } : undefined },
  );

// ── Billing APIs ──────────────────────────────────────────────

// POST /cashier/billing — create bill + collect payment
export const createBillApi = (data: CreateBillPayload, branchId?: string) =>
  api.post<{ message: string; bill: Bill }>("/cashier/billing", data, {
    params: branchId ? { branchId } : undefined,
  });

// GET /cashier/bills — get all bills
export const getBillsApi = (params?: BillsQuery) =>
  api.get<{ myBills: Bill[]; pagination?: BillsPagination }>("/cashier/bills", {
    params,
  });

// GET /cashier/bills/:billId — get single bill
export const getBillByIdApi = (billId: string, branchId?: string) =>
  api.get<{ bill: Bill }>(`/cashier/bills/${billId}`, {
    params: branchId ? { branchId } : undefined,
  });

// PUT /cashier/bills/:billId/pay — mark bill as paid
export interface MarkBillPaidResponse {
  message: string;
  bill: Bill;
}

export const markBillPaidApi = (billId: string, paymentMethod: PaymentMethod, branchId?: string) =>
  api.put<MarkBillPaidResponse>(`/cashier/bills/${billId}/pay`, {
    paymentMethod,
  }, { params: branchId ? { branchId } : undefined });

export function getPaymentErrorMessage(error: unknown): string {
  const status = (error as { response?: { status?: number } })?.response?.status;
  switch (status) {
    case 400:
      return "Select a valid payment method and try again.";
    case 403:
      return "You do not have permission to pay bills for this branch.";
    case 404:
      return "This bill is unavailable or could not be found.";
    case 409:
      return "This bill has already been paid.";
    case 500:
      return "Payment could not be completed. Please try again.";
    default:
      return "Payment could not be completed. Please try again.";
  }
}

// DELETE /cashier/bills/:billId — delete bill
export const deleteBillApi = (billId: string, branchId?: string) =>
  api.delete<{ message: string }>(`/cashier/bills/${billId}`, {
    params: branchId ? { branchId } : undefined,
  });

// ── Reports API ───────────────────────────────────────────────

// GET /cashier/income — today's total income
export const getTodayIncomeApi = (branchId?: string) =>
  api.get<{ totalIncome: number }>("/cashier/income", {
    params: branchId ? { branchId } : undefined,
  });
