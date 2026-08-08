import { beforeEach, describe, expect, it, vi } from "vitest";
import api from "../../services/apiClient";
import {
  getPaymentErrorMessage,
  markBillPaidApi,
} from "../../services/cashier/cashier.api";
import { getCashierSettingsApi } from "../../services/admin/settings.api";

describe("cashier API contracts", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("loads cashier-safe settings through the configured client", async () => {
    const get = vi.spyOn(api, "get").mockResolvedValue({
      data: { settings: { businessName: "KOT", paymentMethods: { cash: true, card: false, upi: true } } },
    } as never);

    await getCashierSettingsApi();
    expect(get).toHaveBeenCalledWith("/admin/settings");
  });

  it.each(["cash", "card", "upi"] as const)("uses PUT and the %s payment payload", async (method) => {
    const put = vi.spyOn(api, "put").mockResolvedValue({ data: { message: "ok", bill: {} } } as never);

    await markBillPaidApi("bill-1", method);
    expect(put).toHaveBeenCalledWith("/cashier/bills/bill-1/pay", { paymentMethod: method });
  });

  it("maps payment failures without exposing server text", () => {
    expect(getPaymentErrorMessage({ response: { status: 400, data: { error: "secret" } } })).toContain("valid payment");
    expect(getPaymentErrorMessage({ response: { status: 403 } })).toContain("permission");
    expect(getPaymentErrorMessage({ response: { status: 404 } })).toContain("unavailable");
    expect(getPaymentErrorMessage({ response: { status: 409 } })).toContain("already been paid");
    expect(getPaymentErrorMessage({ response: { status: 500 } })).toContain("try again");
    expect(getPaymentErrorMessage({ response: { status: 500, data: { error: "secret" } } })).not.toContain("secret");
  });
});
