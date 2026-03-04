import { useState } from "react";
import {
  Receipt,
  CreditCard,
  Wallet,
  Percent,
  Plus,
  Minus,
} from "lucide-react";

type PaymentMethod = "cash" | "card" | "upi" | "wallet";

interface BillItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

interface BillingPanelProps {
  billNumber?: string;
  tableNumber?: string;
  items: BillItem[];
  onGenerateBill?: (payment: PaymentDetails) => void;
  onPrintBill?: () => void;
  className?: string;
}

interface PaymentDetails {
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  method: PaymentMethod;
  amountReceived?: number;
  change?: number;
}

export default function BillingPanel({
  billNumber = "INV-001",
  tableNumber,
  items,
  onGenerateBill,
  onPrintBill,
  className = "",
}: BillingPanelProps) {
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [amountReceived, setAmountReceived] = useState<string>("");

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const taxableAmount = subtotal - discountAmount;
  const cgst = taxableAmount * 0.025;
  const sgst = taxableAmount * 0.025;
  const totalTax = cgst + sgst;
  const grandTotal = taxableAmount + totalTax;

  const receivedAmount = parseFloat(amountReceived) || 0;
  const changeAmount =
    receivedAmount > grandTotal ? receivedAmount - grandTotal : 0;

  const handleDiscountChange = (delta: number) => {
    setDiscountPercent(Math.max(0, Math.min(100, discountPercent + delta)));
  };

  const handleGenerateBill = () => {
    onGenerateBill?.({
      subtotal,
      discount: discountAmount,
      tax: totalTax,
      total: grandTotal,
      method: paymentMethod,
      amountReceived: receivedAmount || undefined,
      change: changeAmount || undefined,
    });
  };

  const paymentMethods = [
    { value: "cash" as PaymentMethod, label: "Cash", icon: Wallet },
    { value: "card" as PaymentMethod, label: "Card", icon: CreditCard },
    { value: "upi" as PaymentMethod, label: "UPI", icon: CreditCard },
    { value: "wallet" as PaymentMethod, label: "Wallet", icon: Wallet },
  ];

  return (
    <div
      className={`flex flex-col h-full bg-kot-white border border-kot-chart rounded-lg shadow-kot-lg ${className}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-kot-chart bg-gradient-to-r from-kot-dark to-kot-darker rounded-t-lg">
        <div className="flex items-center justify-between text-white">
          <div>
            <h2 className="text-xl font-bold">Generate Bill</h2>
            <p className="text-sm text-kot-stats">Invoice #{billNumber}</p>
          </div>
          <Receipt size={32} className="text-kot-light" />
        </div>
        {tableNumber && (
          <div className="mt-2 text-sm text-kot-stats">
            Table:{" "}
            <span className="font-semibold text-white">{tableNumber}</span>
          </div>
        )}
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto p-4 bg-kot-primary">
        <h3 className="text-sm font-semibold text-kot-darker mb-3 uppercase tracking-wide">
          Order Items
        </h3>
        <div className="space-y-2">
          {items.length === 0 ? (
            <div className="text-center py-8 text-kot-text">
              <p>No items to bill</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-2 px-3 bg-kot-white rounded border border-kot-chart"
              >
                <div className="flex-1">
                  <p className="font-medium text-kot-darker">{item.name}</p>
                  <p className="text-sm text-kot-text">
                    ₹{item.price} × {item.quantity}
                  </p>
                </div>
                <span className="font-semibold text-kot-darker">
                  ₹{item.total}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Discount Section */}
      <div className="p-4 border-t border-kot-chart bg-kot-white">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-kot-darker flex items-center gap-2">
            <Percent size={16} />
            Discount
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDiscountChange(-5)}
              className="w-7 h-7 flex items-center justify-center bg-kot-light rounded hover:bg-kot-stats transition-colors"
            >
              <Minus size={14} className="text-kot-darker" />
            </button>
            <input
              type="number"
              value={discountPercent}
              onChange={(e) =>
                setDiscountPercent(
                  Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)),
                )
              }
              className="w-16 text-center border border-kot-chart rounded px-2 py-1 font-semibold text-kot-darker focus:outline-none focus:ring-2 focus:ring-kot-dark"
              min="0"
              max="100"
            />
            <span className="text-sm text-kot-text">%</span>
            <button
              onClick={() => handleDiscountChange(5)}
              className="w-7 h-7 flex items-center justify-center bg-kot-light rounded hover:bg-kot-stats transition-colors"
            >
              <Plus size={14} className="text-kot-darker" />
            </button>
          </div>
        </div>
      </div>

      {/* Bill Summary */}
      <div className="p-4 border-t border-kot-chart bg-kot-light space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-kot-text">Subtotal</span>
          <span className="font-medium text-kot-darker">
            ₹{subtotal.toFixed(2)}
          </span>
        </div>

        {discountAmount > 0 && (
          <div className="flex items-center justify-between text-sm text-green-600">
            <span>Discount ({discountPercent}%)</span>
            <span className="font-medium">-₹{discountAmount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <span className="text-kot-text">CGST (2.5%)</span>
          <span className="font-medium text-kot-darker">
            ₹{cgst.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-kot-text">SGST (2.5%)</span>
          <span className="font-medium text-kot-darker">
            ₹{sgst.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center justify-between text-lg font-bold pt-2 border-t border-kot-chart">
          <span className="text-kot-darker">Grand Total</span>
          <span className="text-kot-dark">₹{grandTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Payment Method */}
      <div className="p-4 border-t border-kot-chart bg-kot-white">
        <label className="text-sm font-semibold text-kot-darker mb-2 block">
          Payment Method
        </label>
        <div className="grid grid-cols-2 gap-2">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            return (
              <button
                key={method.value}
                onClick={() => setPaymentMethod(method.value)}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border-2 font-medium transition-all ${
                  paymentMethod === method.value
                    ? "border-kot-dark bg-kot-light text-kot-darker"
                    : "border-kot-chart bg-kot-white text-kot-text hover:border-kot-stats"
                }`}
              >
                <Icon size={18} />
                {method.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Cash Payment Details */}
      {paymentMethod === "cash" && (
        <div className="p-4 border-t border-kot-chart bg-kot-light space-y-3">
          <div>
            <label className="text-sm font-semibold text-kot-darker mb-1 block">
              Amount Received
            </label>
            <input
              type="number"
              value={amountReceived}
              onChange={(e) => setAmountReceived(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-2.5 border border-kot-chart rounded-lg text-lg font-semibold text-kot-darker focus:outline-none focus:ring-2 focus:ring-kot-dark bg-kot-white"
            />
          </div>

          {receivedAmount > 0 && (
            <div className="flex items-center justify-between text-lg">
              <span className="font-semibold text-kot-darker">
                Change to Return
              </span>
              <span className="font-bold text-green-600">
                ₹{changeAmount.toFixed(2)}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="p-4 border-t border-kot-chart bg-kot-white space-y-2">
        <button
          onClick={handleGenerateBill}
          disabled={items.length === 0}
          className="w-full bg-kot-dark hover:bg-kot-darker disabled:bg-kot-chart disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors"
        >
          Generate Bill
        </button>
        <button
          onClick={onPrintBill}
          disabled={items.length === 0}
          className="w-full bg-kot-white hover:bg-kot-light disabled:bg-kot-light disabled:cursor-not-allowed border-2 border-kot-chart text-kot-darker font-semibold py-3 px-4 rounded-lg transition-colors"
        >
          Print Bill
        </button>
      </div>
    </div>
  );
}
