import api from "../apiClient";

export interface Bill {
  _id: string;
  billNumber: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  paymentStatus: string;
  paymentMethod?: string;
  items: { name: string; quantity: number; price: number; total?: number }[];
  createdAt: string;
}

export const createTakeawayApi = (payload: {
  customerName: string;
  customerPhone: string;
  items: { itemId: string; quantity: number }[];
}) => api.post<{ order: { _id: string } }>("/orders/takeaway", payload);

export const sendTakeawayToKitchenApi = (orderId: string) =>
  api.post(`/orders/${orderId}/send-kot`);

export const createBillApi = (payload: {
  customerName: string;
  customerPhone: string;
  items: { itemId: string; quantity: number }[];
  paymentStatus: string;
  paymentMethod: string;
}) => api.post<{ bill: Bill }>("/bills", payload);

export const getBillsApi = () =>
  api.get<{ myBills: Bill[] }>("/bills");

export const markBillPaidApi = (billId: string) =>
  api.patch<{ bill: Bill }>(`/bills/${billId}/pay`);
