import { describe, expect, it } from "vitest";
import {
  CASHIER_BRANCH_ASSIGNMENT_MESSAGE,
  getCashierBillsError,
  getCashierSettingsError,
  mapCashierBills,
} from "../../features/cashier/billing/billing.contracts";

describe("cashier billing contracts", () => {
  it("maps the backend myBills property, including an empty response", () => {
    expect(mapCashierBills({ myBills: [] })).toEqual([]);
  });

  it("keeps missing-branch 403 distinct from the empty state", () => {
    expect(getCashierBillsError(403)).toBeNull();
    expect(CASHIER_BRANCH_ASSIGNMENT_MESSAGE).toContain("not assigned to a branch");
  });

  it("uses a retryable error for unexpected bill failures", () => {
    expect(getCashierBillsError(500)).toBe("Failed to load bills");
  });

  it("keeps settings failures independent and sanitized", () => {
    expect(getCashierSettingsError(403)).toBeNull();
    expect(getCashierSettingsError(500)).toContain("Bills remain available");
  });
});
