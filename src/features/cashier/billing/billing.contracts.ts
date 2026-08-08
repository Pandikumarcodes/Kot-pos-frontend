import type { Bill, BillsPagination } from "../../../services/cashier/cashier.api";

export interface CashierBillsResponse {
  myBills: Bill[];
  pagination?: BillsPagination;
}

export const CASHIER_BRANCH_ASSIGNMENT_MESSAGE =
  "This cashier account is not assigned to a branch. Ask an administrator to assign a branch.";

export const mapCashierBills = (response: CashierBillsResponse): Bill[] =>
  response.myBills;

export const getCashierBillsError = (status?: number): string | null =>
  status === 403 ? null : "Failed to load bills";

export const getCashierSettingsError = (status?: number): string | null => {
  if (status === 403) return null;
  if (status === 500) return "Settings are temporarily unavailable. Bills remain available.";
  return "Could not load cashier settings. Bills remain available.";
};
