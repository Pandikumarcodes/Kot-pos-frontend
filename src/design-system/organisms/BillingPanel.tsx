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

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const taxableAmount = subtotal - discountAmount;
  const cgst = taxableAmount * 0.025; // 2.5%
  const sgst = taxableAmount * 0.025; // 2.5%
  const totalTax = cgst + sgst;
  const grandTotal = taxableAmount + totalTax;

  const receivedAmount = parseFloat(amountReceived) || 0;
  const changeAmount =
    receivedAmount > grandTotal ? receivedAmount - grandTotal : 0;

  const handleDiscountChange = (delta: number) => {
    const newDiscount = Math.max(0, Math.min(100, discountPercent + delta));
    setDiscountPercent(newDiscount);
  };

  const handleGenerateBill = () => {
    const paymentDetails: PaymentDetails = {
      subtotal,
      discount: discountAmount,
      tax: totalTax,
      total: grandTotal,
      method: paymentMethod,
      amountReceived: receivedAmount || undefined,
      change: changeAmount || undefined,
    };
    onGenerateBill?.(paymentDetails);
  };

  const paymentMethods = [
    { value: "cash" as PaymentMethod, label: "Cash", icon: Wallet },
    { value: "card" as PaymentMethod, label: "Card", icon: CreditCard },
    { value: "upi" as PaymentMethod, label: "UPI", icon: CreditCard },
    { value: "wallet" as PaymentMethod, label: "Wallet", icon: Wallet },
  ];

  return (
    <div
      className={`flex flex-col h-full bg-white border border-gray-200 rounded-lg shadow-lg ${className}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="flex items-center justify-between text-white">
          <div>
            <h2 className="text-xl font-bold">Generate Bill</h2>
            <p className="text-sm text-blue-100">Invoice #{billNumber}</p>
          </div>
          <Receipt size={32} className="text-blue-200" />
        </div>
        {tableNumber && (
          <div className="mt-2 text-sm text-blue-100">
            Table:{" "}
            <span className="font-semibold text-white">{tableNumber}</span>
          </div>
        )}
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase">
          Order Items
        </h3>
        <div className="space-y-2">
          {items.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>No items to bill</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-2 px-3 bg-white rounded border border-gray-200"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    ₹{item.price} × {item.quantity}
                  </p>
                </div>
                <span className="font-semibold text-gray-900">
                  ₹{item.total}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Discount Section */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Percent size={16} />
            Discount
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDiscountChange(-5)}
              className="w-7 h-7 flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200"
            >
              <Minus size={14} />
            </button>
            <input
              type="number"
              value={discountPercent}
              onChange={(e) =>
                setDiscountPercent(
                  Math.max(0, Math.min(100, parseFloat(e.target.value) || 0))
                )
              }
              className="w-16 text-center border border-gray-300 rounded px-2 py-1 font-semibold"
              min="0"
              max="100"
            />
            <span className="text-sm text-gray-600">%</span>
            <button
              onClick={() => handleDiscountChange(5)}
              className="w-7 h-7 flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Bill Summary */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium text-gray-900">
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
          <span className="text-gray-600">CGST (2.5%)</span>
          <span className="font-medium text-gray-900">₹{cgst.toFixed(2)}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">SGST (2.5%)</span>
          <span className="font-medium text-gray-900">₹{sgst.toFixed(2)}</span>
        </div>

        <div className="flex items-center justify-between text-lg font-bold pt-2 border-t border-gray-300">
          <span className="text-gray-900">Grand Total</span>
          <span className="text-blue-600">₹{grandTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Payment Method */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <label className="text-sm font-semibold text-gray-700 mb-2 block">
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
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
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
        <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-3">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">
              Amount Received
            </label>
            <input
              type="number"
              value={amountReceived}
              onChange={(e) => setAmountReceived(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {receivedAmount > 0 && (
            <div className="flex items-center justify-between text-lg">
              <span className="font-semibold text-gray-700">
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
      <div className="p-4 border-t border-gray-200 bg-white space-y-2">
        <button
          onClick={handleGenerateBill}
          disabled={items.length === 0}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors"
        >
          Generate Bill
        </button>
        <button
          onClick={onPrintBill}
          disabled={items.length === 0}
          className="w-full bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed border-2 border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors"
        >
          Print Bill
        </button>
      </div>
    </div>
  );
}

{
  /* <BillingPanel
  billNumber="INV-001"
  tableNumber="5"
  items={billItems}
  onGenerateBill={(payment) => handleGenerateBill(payment)}
  onPrintBill={() => handlePrintBill()}
/> */
}
