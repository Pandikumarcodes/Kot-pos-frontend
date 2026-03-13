import type { Bill } from "../cashier-api-services/cashier.service";

interface Props {
  bill: Bill;
  restaurantName?: string;
  restaurantAddress?: string;
  gstNumber?: string;
  onClose: () => void;
}

export default function GSTInvoice({
  bill,
  restaurantName = "KOT POS Restaurant",
  restaurantAddress = "123 MG Road, Bangalore",
  gstNumber = "29ABCDE1234F1Z5",
  onClose,
}: Props) {
  const handlePrint = () => {
    const win = window.open("", "_blank");
    if (!win) return;
    const subtotal = bill.items.reduce(
      (s, i) => s + (i.total ?? i.price * i.quantity),
      0,
    );
    const tax = +(subtotal * 0.05).toFixed(2);
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>GST Invoice - ${bill.billNumber}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; font-family: Arial, sans-serif; }
          body { padding: 24px; font-size: 13px; color: #2E3D34; }
          h1 { font-size: 22px; color: #2E3D34; }
          h2 { font-size: 15px; color: #4A5F52; margin-bottom: 4px; }
          .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #A8C5B2; padding-bottom: 12px; }
          .row { display: flex; justify-content: space-between; margin-bottom: 6px; }
          table { width: 100%; border-collapse: collapse; margin: 16px 0; }
          th, td { padding: 8px 10px; text-align: left; border-bottom: 1px solid #C8E3D0; }
          th { background: #DFF0E6; font-weight: 600; }
          .total-row { font-weight: 700; background: #EEF4F0; }
          .footer { margin-top: 20px; text-align: center; color: #6B8A75; font-size: 11px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${restaurantName}</h1>
          <p>${restaurantAddress}</p>
          <p>GSTIN: ${gstNumber}</p>
          <h2 style="margin-top:12px">TAX INVOICE</h2>
        </div>
        <div class="row"><span><strong>Bill No:</strong> ${bill.billNumber}</span><span><strong>Date:</strong> ${new Date(bill.createdAt).toLocaleDateString("en-IN")}</span></div>
        <div class="row"><span><strong>Customer:</strong> ${bill.customerName}</span><span><strong>Phone:</strong> ${bill.customerPhone}</span></div>
        <table>
          <thead><tr><th>#</th><th>Item</th><th>Qty</th><th>Rate</th><th>Amount</th></tr></thead>
          <tbody>
            ${bill.items
              .map(
                (item, i) => `
              <tr>
                <td>${i + 1}</td>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>₹${item.price}</td>
                <td>₹${item.total ?? item.price * item.quantity}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
          <tfoot>
            <tr><td colspan="4" style="text-align:right">Subtotal</td><td>₹${subtotal.toFixed(2)}</td></tr>
            <tr><td colspan="4" style="text-align:right">GST (5%)</td><td>₹${tax}</td></tr>
            <tr class="total-row"><td colspan="4" style="text-align:right">Total</td><td>₹${bill.totalAmount.toFixed(2)}</td></tr>
          </tfoot>
        </table>
        <div class="footer">
          <p>Payment: ${(bill.paymentMethod ?? "—").toUpperCase()} · Status: ${bill.paymentStatus}</p>
          <p style="margin-top:8px">Thank you for dining with us!</p>
        </div>
      </body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
      <div className="bg-kot-white rounded-2xl shadow-kot-lg p-6 max-w-sm w-full space-y-4">
        <h2 className="text-lg font-bold text-kot-darker">GST Invoice</h2>
        <p className="text-sm text-kot-text">
          Bill <strong>{bill.billNumber}</strong> · {bill.customerName}
        </p>
        <p className="text-2xl font-bold text-kot-darker">
          ₹{bill.totalAmount.toLocaleString("en-IN")}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border-2 border-kot-chart text-kot-darker font-semibold rounded-xl hover:bg-kot-light"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 bg-kot-dark hover:bg-kot-darker text-white font-semibold rounded-xl"
          >
            🖨 Print
          </button>
        </div>
      </div>
    </div>
  );
}
