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

// GET /admin/settings
export const getSettingsApi = () =>
  api.get<{ settings: Settings }>("/admin/settings");

// PUT /admin/settings
export const updateSettingsApi = (data: Partial<Settings>) =>
  api.put<{ message: string; settings: Settings }>("/admin/settings", data);
