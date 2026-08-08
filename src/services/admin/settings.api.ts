import api from "../apiClient";

export interface Settings {
  _id: string;
  // General
  businessName: string;
  email: string;
  phone: string;
  address: string;
  gstin: string;
  currency: string;
  timezone: string;
  // Restaurant
  openTime: string;
  closeTime: string;
  avgServiceTime: number;
  maxCapacity: number;
  takeawayEnabled: boolean;
  deliveryEnabled: boolean;
  // Billing
  taxRate: number;
  serviceCharge: number;
  autoRoundOff: boolean;
  printReceipt: boolean;
  paymentMethods: {
    cash: boolean;
    card: boolean;
    upi: boolean;
  };
  // Notifications
  orderAlerts: boolean;
  lowStockAlerts: boolean;
  emailNotifications: boolean;
}

/** Settings fields intentionally exposed by the read-only operational endpoint. */
export interface CashierSettings {
  businessName: string;
  phone: string;
  address: string;
  currency: string;
  timezone: string;
  taxRate: number;
  serviceCharge: number;
  autoRoundOff: boolean;
  printReceipt: boolean;
  paymentMethods: {
    cash: boolean;
    card: boolean;
    upi: boolean;
  };
  takeawayEnabled: boolean;
  deliveryEnabled: boolean;
}

// GET /admin/settings
export const getSettingsApi = (branchId?: string, signal?: AbortSignal) =>
  api.get<{ settings: Settings }>("/admin/settings", {
    params: branchId ? { branchId } : undefined,
    ...(signal ? { signal } : {}),
  });

export const getCashierSettingsApi = (branchId?: string) =>
  api.get<{ settings: CashierSettings }>("/settings", {
    params: branchId ? { branchId } : undefined,
  });

// PUT /admin/settings
export const updateSettingsApi = (data: Partial<Settings>, branchId?: string) =>
  api.put<{ message: string; settings: Settings }>("/admin/settings", data, {
    params: branchId ? { branchId } : undefined,
  });
