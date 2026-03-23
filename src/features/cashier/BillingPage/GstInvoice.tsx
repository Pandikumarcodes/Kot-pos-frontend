import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../../../services/apiClient";
import type { Bill } from "../../../services/CashierApi/cashier.api";
import DOMPurify from "dompurify";
interface RestaurantSettings {
  businessName: string;
  email: string;
  phone: string;
  address: string;
  gstin: string;
  fssai: string;
  hsn: string;
  currency: string;
  taxRate: number;
  serviceCharge: number;
  autoRoundOff: boolean;
  printReceipt: boolean;
}

interface GSTInvoiceProps {
  bill: Bill;
  onClose: () => void;
}

// ─────────────────────────────────────────────────────────────
// Constants — outside component, never recreated on re-renders
// ─────────────────────────────────────────────────────────────
const DEFAULTS: RestaurantSettings = {
  businessName: "My Restaurant",
  email: "",
  phone: "",
  address: "",
  gstin: "",
  fssai: "",
  hsn: "996331",
  currency: "INR",
  taxRate: 5,
  serviceCharge: 0,
  autoRoundOff: true,
  printReceipt: true,
};

const ONES = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];

const TENS = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];

// ─────────────────────────────────────────────────────────────
// Pure utility functions — outside component, zero re-creation
// ─────────────────────────────────────────────────────────────

/** Escapes user/DB strings before injecting into raw HTML — prevents XSS. */
const esc = (str: unknown): string => {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const formatTime = (iso: string): string =>
  new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

const numToWords = (n: number): string => {
  if (n === 0) return "Zero";
  if (n < 20) return ONES[n];
  if (n < 100)
    return TENS[Math.floor(n / 10)] + (n % 10 ? " " + ONES[n % 10] : "");
  if (n < 1000)
    return (
      ONES[Math.floor(n / 100)] +
      " Hundred" +
      (n % 100 ? " " + numToWords(n % 100) : "")
    );
  if (n < 100000)
    return (
      numToWords(Math.floor(n / 1000)) +
      " Thousand" +
      (n % 1000 ? " " + numToWords(n % 1000) : "")
    );
  return (
    numToWords(Math.floor(n / 100000)) +
    " Lakh" +
    (n % 100000 ? " " + numToWords(n % 100000) : "")
  );
};

const amountInWords = (grandTotal: number): string => {
  const r = Math.floor(grandTotal);
  const p = Math.round((grandTotal - r) * 100);
  return (
    "Rupees " +
    numToWords(r) +
    (p > 0 ? " and " + numToWords(p) + " Paise" : "") +
    " Only"
  );
};

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────
export default function GSTInvoice({ bill, onClose }: GSTInvoiceProps) {
  const [settings, setSettings] = useState<RestaurantSettings>(DEFAULTS);
  const [loading, setLoading] = useState(true);

  // Abort fetch on unmount — prevents memory leak / state update on dead component
  useEffect(() => {
    const controller = new AbortController();
    api
      .get<{ settings: RestaurantSettings }>("/admin/settings", {
        signal: controller.signal,
      })
      .then((res) => setSettings({ ...DEFAULTS, ...res.data.settings }))
      .catch((err) => {
        if (err.name !== "AbortError") setSettings(DEFAULTS);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  // ── Tax calculations — only recomputes when relevant values change ──────
  const tax = useMemo(() => {
    const cgstRate = settings.taxRate / 2;
    const sgstRate = settings.taxRate / 2;
    const taxableAmount = parseFloat(
      (bill.totalAmount / (1 + settings.taxRate / 100)).toFixed(2),
    );
    const cgstAmount = parseFloat(
      ((taxableAmount * cgstRate) / 100).toFixed(2),
    );
    const sgstAmount = parseFloat(
      ((taxableAmount * sgstRate) / 100).toFixed(2),
    );
    const totalTax = parseFloat((cgstAmount + sgstAmount).toFixed(2));
    const serviceChargeAmount =
      settings.serviceCharge > 0
        ? parseFloat(
            ((taxableAmount * settings.serviceCharge) / 100).toFixed(2),
          )
        : 0;
    const rawTotal = bill.totalAmount + serviceChargeAmount;
    const grandTotal = settings.autoRoundOff
      ? Math.round(rawTotal)
      : parseFloat(rawTotal.toFixed(2));
    const roundOff = parseFloat((grandTotal - rawTotal).toFixed(2));

    return {
      cgstRate,
      sgstRate,
      taxableAmount,
      cgstAmount,
      sgstAmount,
      totalTax,
      serviceChargeAmount,
      grandTotal,
      roundOff,
    };
  }, [
    bill.totalAmount,
    settings.taxRate,
    settings.serviceCharge,
    settings.autoRoundOff,
  ]);

  // ── Receipt HTML — only rebuilds when bill / settings / tax change ───────
  const receiptHTML = useMemo(
    () => `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Receipt-${esc(bill.billNumber)}</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body {
      font-family: 'Courier New', Courier, monospace;
      font-size: 12px; color: #000; background: #fff;
      width: 302px; margin: 0 auto; padding: 8px 4px 16px 4px;
    }
    .center { text-align: center; }
    .biz-name {
      font-size: 18px; font-weight: 900; text-align: center;
      text-transform: uppercase; letter-spacing: 1px; margin-bottom: 2px;
    }
    .biz-sub { font-size: 10px; text-align: center; color: #333; line-height: 1.6; margin-bottom: 4px; }
    .dash  { border:none; border-top: 1px dashed #000; margin: 6px 0; }
    .solid { border:none; border-top: 2px solid #000;  margin: 6px 0; }
    .eq    { border:none; border-top: 1px solid #000;  margin: 6px 0; }
    .badge {
      text-align: center; font-size: 11px; font-weight: 700;
      letter-spacing: 2px; border: 1px solid #000; padding: 3px 0; margin: 6px 0;
    }
    .meta { display: flex; justify-content: space-between; font-size: 11px; margin: 2px 0; }
    .meta .lbl { color: #444; }
    .meta .val { font-weight: 700; text-align:right; }
    .section-lbl {
      font-size: 10px; font-weight: 700; letter-spacing: 1px;
      color: #555; margin-bottom: 3px; text-transform: uppercase;
    }
    table.items { width: 100%; border-collapse: collapse; font-size: 11px; }
    table.items th {
      font-size: 10px; font-weight:700; text-transform: uppercase;
      border-bottom: 1px solid #000; border-top: 1px solid #000; padding: 3px 2px;
    }
    table.items th.r { text-align:right; }
    table.items td { padding: 4px 2px; vertical-align:top; border-bottom: 1px dashed #ccc; }
    table.items td.r { text-align:right; }
    table.items td.name { max-width: 130px; word-break: break-word; }
    table.items tr:last-child td { border-bottom: none; }
    .row { display: flex; justify-content: space-between; font-size: 11px; margin: 3px 0; }
    .row .lbl { color: #333; }
    .row .amt { font-weight: 600; }
    .grand { display: flex; justify-content: space-between; font-size: 15px; font-weight: 900; margin: 4px 0; }
    .words { font-size: 10px; color: #333; text-align: center; font-style: italic; margin: 4px 0; line-height: 1.5; }
    .gst-info { font-size: 10px; color: #444; line-height: 1.7; margin: 2px 0; }
    .paid { font-weight:900; font-size:13px; }
    .footer { font-size: 10px; text-align: center; color: #444; line-height: 1.7; margin-top: 4px; }
    .thankyou { font-size: 12px; font-weight: 700; text-align: center; margin: 6px 0 2px; letter-spacing: 0.5px; }
    @media print {
      body { margin: 0; padding: 4px 2px; }
      @page { size: 80mm auto; margin: 0; }
    }
  </style>
</head>
<body>

  <div class="biz-name">${esc(settings.businessName)}</div>
  <div class="biz-sub">
    ${settings.address ? `${esc(settings.address)}<br/>` : ""}
    ${settings.phone ? `Tel: ${esc(settings.phone)}` : ""}
    ${settings.phone && settings.email ? " | " : ""}
    ${settings.email ? `${esc(settings.email)}` : ""}
    ${settings.phone || settings.email ? "<br/>" : ""}
    ${settings.gstin ? `GSTIN: ${esc(settings.gstin)}<br/>` : ""}
    ${settings.fssai ? `FSSAI: ${esc(settings.fssai)}` : ""}
  </div>

  <hr class="solid"/>
  <div class="badge">*** TAX INVOICE ***</div>

  <div class="meta"><span class="lbl">Invoice No</span><span class="val">${esc(bill.billNumber)}</span></div>
  <div class="meta"><span class="lbl">Date</span><span class="val">${esc(formatDate(bill.createdAt))}</span></div>
  <div class="meta"><span class="lbl">Time</span><span class="val">${esc(formatTime(bill.createdAt))}</span></div>

  <hr class="dash"/>

  <div class="section-lbl">Customer</div>
  <div class="meta"><span class="lbl">Name</span><span class="val">${esc(bill.customerName)}</span></div>
  <div class="meta"><span class="lbl">Phone</span><span class="val">${esc(bill.customerPhone)}</span></div>

  <hr class="dash"/>

  <table class="items">
    <thead>
      <tr>
        <th>#</th><th>Item</th>
        <th class="r">Qty</th><th class="r">Rate</th><th class="r">Amt</th>
      </tr>
    </thead>
    <tbody>
      ${bill.items
        .map(
          (item, i) => `
        <tr>
          <td>${i + 1}</td>
          <td class="name">${esc(item.name)}</td>
          <td class="r">${esc(item.quantity)}</td>
          <td class="r">${item.price.toFixed(2)}</td>
          <td class="r">${(item.price * item.quantity).toFixed(2)}</td>
        </tr>`,
        )
        .join("")}
    </tbody>
  </table>

  <hr class="solid"/>

  <div class="row"><span class="lbl">Taxable Amt</span><span class="amt">Rs.${tax.taxableAmount.toFixed(2)}</span></div>
  <div class="row"><span class="lbl">CGST @ ${tax.cgstRate}%</span><span class="amt">Rs.${tax.cgstAmount.toFixed(2)}</span></div>
  <div class="row"><span class="lbl">SGST @ ${tax.sgstRate}%</span><span class="amt">Rs.${tax.sgstAmount.toFixed(2)}</span></div>
  <div class="row"><span class="lbl">Total Tax</span><span class="amt">Rs.${tax.totalTax.toFixed(2)}</span></div>
  ${tax.serviceChargeAmount > 0 ? `<div class="row"><span class="lbl">Svc Charge (${settings.serviceCharge}%)</span><span class="amt">Rs.${tax.serviceChargeAmount.toFixed(2)}</span></div>` : ""}
  ${Math.abs(tax.roundOff) > 0 ? `<div class="row"><span class="lbl">Round Off</span><span class="amt">${tax.roundOff >= 0 ? "+" : ""}Rs.${tax.roundOff.toFixed(2)}</span></div>` : ""}

  <hr class="solid"/>

  <div class="grand">
    <span>TOTAL</span>
    <span>Rs.${tax.grandTotal.toFixed(2)}</span>
  </div>

  <hr class="solid"/>

  <div class="meta">
    <span class="lbl">Payment</span>
    <span class="val">${esc((bill.paymentMethod || "—").toUpperCase())}</span>
  </div>
  <div class="meta">
    <span class="lbl">Status</span>
    <span class="val paid">${esc((bill.paymentStatus || "").toUpperCase())}</span>
  </div>

  <hr class="dash"/>

  <div class="words">${esc(amountInWords(tax.grandTotal))}</div>

  <hr class="dash"/>

  <div class="gst-info center">
    GST: CGST ${tax.cgstRate}% + SGST ${tax.sgstRate}% = ${settings.taxRate}% (Inclusive)<br/>
    HSN/SAC: ${esc(settings.hsn || "996331")}
    ${settings.serviceCharge > 0 ? `<br/>Svc Charge: ${settings.serviceCharge}%` : ""}
  </div>

  <hr class="dash"/>

  <div class="thankyou">Thank You! Visit Again</div>
  <div class="footer">
    Goods once sold will not be taken back.<br/>
    This is a computer generated receipt.
  </div>

  <div style="height:24px"></div>

</body>
</html>`,
    [bill, settings, tax],
  );

  // ── Stable print handler — only recreates if receiptHTML changes ─────────
  const openPrintWindow = useCallback(
    (autoPrint = false) => {
      const win = window.open("", "_blank", "width=400,height=700");
      if (!win) {
        alert("Please allow popups for this site.");
        return;
      }
      win.document.write(receiptHTML);
      win.document.close();
      win.focus();
      if (autoPrint) setTimeout(() => win.print(), 600);
    },
    [receiptHTML],
  );

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex flex-col items-center justify-start pt-6 p-4 overflow-y-auto">
      {/* ── Button bar ── */}
      <div
        style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl px-5 py-4 mb-4 flex-shrink-0"
      >
        <p className="text-base font-bold text-gray-800 mb-3">🧾 GST Receipt</p>
        <div className="flex gap-2">
          <button
            onClick={() => openPrintWindow(false)}
            style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-semibold text-sm transition-colors"
          >
            🖨️ Print
          </button>
          <button
            onClick={() => openPrintWindow(true)}
            style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-kot-dark hover:bg-kot-darker text-white rounded-xl font-semibold text-sm transition-colors"
          >
            ⬇️ Download PDF
          </button>
          <button
            onClick={onClose}
            style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold text-sm transition-colors"
          >
            ✕ Close
          </button>
        </div>
      </div>

      {/* ── Receipt preview ── */}
      <div className="bg-gray-300 rounded-2xl shadow-2xl flex justify-center p-5 w-full max-w-md">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-8 h-8 border-4 border-kot-dark border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div
            style={{
              width: "302px",
              background: "#fff",
              padding: "8px 6px 16px",
              fontFamily: "'Courier New', monospace",
              fontSize: "12px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
            }}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(receiptHTML, {
                ALLOWED_TAGS: [
                  "div",
                  "span",
                  "p",
                  "br",
                  "hr",
                  "table",
                  "tr",
                  "td",
                  "th",
                  "thead",
                  "tbody",
                  "strong",
                  "b",
                  "em",
                  "i",
                  "small",
                  "h1",
                  "h2",
                  "h3",
                  "h4",
                ],
                ALLOWED_ATTR: ["style", "class", "align"],
              }),
            }}
          />
        )}
      </div>
    </div>
  );
}
