import api from "./apiClient";

export interface ReceiptSettings {
  businessName: string;
  email: string;
  phone: string;
  address: string;
  gstin: string;
  fssai: string;
  hsn: string;
  currency: string;
  taxRate: number;
  serviceCharge: number;
  autoRoundOff: boolean;
  printReceipt: boolean;
}

// Cashier-safe, branch-scoped, read-only receipt configuration.
export const getReceiptSettingsApi = (signal?: AbortSignal) =>
  api.get<{ settings: ReceiptSettings }>("/settings", { signal });
