import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { QrCode, X, Printer } from "lucide-react";

interface TableQrCodeProps {
  tableId: string;
  tableNumber: number;
  restaurantName?: string;
}

export function TableQrCode({
  tableId,
  tableNumber,
  restaurantName = "KOT POS",
}: TableQrCodeProps) {
  const [showModal, setShowModal] = useState(false);

  // The URL the customer lands on after scanning
  const menuUrl = `${window.location.origin}/menu/${tableId}`;

  const handlePrint = () => {
    const win = window.open("", "_blank", "width=400,height=500");
    if (!win) return;

    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>QR Code - Table ${tableNumber}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 24px;
            background: white;
          }
          .restaurant { font-size: 20px; font-weight: bold; color: #2D3A33; margin-bottom: 4px; }
          .table-num  { font-size: 14px; color: #7E8681; margin-bottom: 16px; }
          .qr-box     { border: 3px solid #2D3A33; border-radius: 12px; padding: 16px; margin-bottom: 12px; }
          .scan-text  { font-size: 13px; color: #4A5F52; font-weight: 600; }
          .url        { font-size: 9px; color: #7E8681; margin-top: 8px; word-break: break-all; max-width: 200px; text-align: center; }
          @media print { @page { margin: 8mm; } }
        </style>
      </head>
      <body>
        <p class="restaurant">${restaurantName}</p>
        <p class="table-num">Table ${tableNumber}</p>
        <div class="qr-box">
          <!-- QR code rendered as SVG inline -->
          ${document.getElementById(`qr-svg-${tableId}`)?.outerHTML ?? ""}
        </div>
        <p class="scan-text">📱 Scan to Order</p>
        <p class="url">${menuUrl}</p>
      </body>
      </html>
    `);
    win.document.close();
    setTimeout(() => {
      win.focus();
      win.print();
    }, 200);
  };

  return (
    <>
      {/* Trigger button — add to each table card */}
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 border border-kot-chart text-kot-text hover:bg-kot-light rounded-lg text-xs transition-colors"
        title="Show QR Code"
      >
        <QrCode size={13} /> QR
      </button>

      {/* Hidden QR SVG used for printing */}
      <div style={{ display: "none" }}>
        <QRCodeSVG
          id={`qr-svg-${tableId}`}
          value={menuUrl}
          size={200}
          level="M"
          includeMargin={false}
        />
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-xl p-6 w-full max-w-xs text-center space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-800">Table {tableNumber}</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X size={18} />
              </button>
            </div>

            {/* QR Code */}
            <div className="flex justify-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <QRCodeSVG
                value={menuUrl}
                size={180}
                level="M"
                includeMargin={false}
              />
            </div>

            <p className="text-sm text-gray-500">
              Customer scans this to view the menu and place an order from their
              phone.
            </p>

            {/* URL */}
            <div className="bg-gray-50 rounded-xl p-2">
              <p className="text-[10px] text-gray-400 break-all font-mono">
                {menuUrl}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 border-2 border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 text-sm"
              >
                Close
              </button>
              <button
                onClick={handlePrint}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition-colors"
              >
                <Printer size={14} /> Print
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
