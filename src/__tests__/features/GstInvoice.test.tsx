import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import GstInvoice from "../../features/cashier/billing/GstInvoice";
import type { Bill } from "../../services/cashier/cashier.api";
import { getReceiptSettingsApi } from "../../services/settings.api";

vi.mock("../../services/settings.api", () => ({
  getReceiptSettingsApi: vi.fn(),
}));

const bill: Bill = {
  _id: "bill-1",
  billNumber: "BILL-001",
  customerName: "Customer",
  customerPhone: "9876543210",
  items: [
    {
      itemId: "item-1",
      name: "Meal",
      quantity: 1,
      price: 100,
      total: 100,
    },
  ],
  totalAmount: 105,
  paymentStatus: "paid",
  paymentMethod: "cash",
  createdAt: "2026-08-09T10:00:00.000Z",
};

const receiptSettings = {
  businessName: "Branch Receipt Name",
  email: "branch@example.test",
  phone: "9876543210",
  address: "Branch address",
  gstin: "29ABCDE1234F1Z5",
  fssai: "12345678901234",
  hsn: "996331",
  currency: "INR",
  taxRate: 5,
  serviceCharge: 0,
  autoRoundOff: true,
  printReceipt: true,
};

describe("GST invoice receipt settings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getReceiptSettingsApi).mockResolvedValue({
      data: { settings: receiptSettings },
    } as never);
  });

  it("loads invoice configuration through the cashier-safe endpoint", async () => {
    render(<GstInvoice bill={bill} onClose={vi.fn()} />);

    await waitFor(() => expect(getReceiptSettingsApi).toHaveBeenCalledOnce());
    await waitFor(() =>
      expect(screen.getByText(/Branch Receipt Name/i)).toBeInTheDocument(),
    );
  });

  it("renders safe defaults with an explicit status when the read fails", async () => {
    vi.mocked(getReceiptSettingsApi).mockRejectedValueOnce(new Error("offline"));
    render(<GstInvoice bill={bill} onClose={vi.fn()} />);

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Receipt settings unavailable; showing safe defaults.",
    );
    expect(screen.getByText(/My Restaurant/i)).toBeInTheDocument();
  });
});
