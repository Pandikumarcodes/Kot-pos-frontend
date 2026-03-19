import type { Settings } from "../services/adminApi/Settings.api";
import type { Kot } from "../services/chefApi/chef.api";
import type { Bill } from "../services/CashierApi/cashier.api";

// ── Shared 80mm thermal CSS ───────────────────────────────────
const THERMAL_CSS = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Courier New', Courier, monospace;
    font-size: 12px;
    width: 80mm;
    max-width: 80mm;
    color: #000;
    background: #fff;
  }
  @media print {
    @page { size: 80mm auto; margin: 0; }
    body  { width: 80mm; }
  }
  .wrap   { padding: 8px; }
  .c      { text-align: center; }
  .r      { text-align: right; }
  .b      { font-weight: bold; }
  .lg     { font-size: 15px; }
  .xl     { font-size: 18px; }
  .sm     { font-size: 10px; }
  .dash   { border-top: 1px dashed #000; margin: 5px 0; }
  .solid  { border-top: 2px solid #000; margin: 5px 0; }
  .row    { display: flex; justify-content: space-between; margin: 2px 0; }
  .badge  { border: 2px solid #000; padding: 1px 6px; font-weight: bold; font-size: 13px; display: inline-block; }
  .mb1    { margin-bottom: 4px; }
  .mb2    { margin-bottom: 8px; }
  .mt1    { margin-top: 4px; }
  .mt2    { margin-top: 8px; }
  .col3   { display: flex; }
  .col3 .name  { flex: 1; padding-right: 4px; }
  .col3 .qty   { min-width: 20px; text-align: center; }
  .col3 .amt   { min-width: 52px; text-align: right; }
`;

function openPrint(html: string) {
  const win = window.open("", "_blank", "width=420,height=640");
  if (!win) {
    alert("Please allow popups to enable printing.");
    return;
  }
  win.document.write(html);
  win.document.close();
  setTimeout(() => {
    win.focus();
    win.print();
    win.close();
  }, 350);
}

// ── KOT Slip ──────────────────────────────────────────────────
function kotHtml(kot: Kot, s?: Partial<Settings>): string {
  const d = new Date(kot.createdAt);
  const dt = d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const tm = d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const items = kot.items
    .map(
      (i) => `
    <div class="row mb1">
      <span class="b">${i.quantity}x</span>
      <span style="flex:1;padding:0 4px">${i.name}</span>
    </div>
  `,
    )
    .join("");

  const totalQty = kot.items.reduce((s, i) => s + i.quantity, 0);

  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
  <title>KOT</title><style>${THERMAL_CSS}</style></head><body><div class="wrap">
    <div class="c b lg mb1">${s?.businessName || "KOT POS"}</div>
    <div class="c sm mb2">KITCHEN ORDER TICKET</div>
    <div class="solid"></div>
    <div class="row b mb1">
      <span>KOT #${(kot as unknown as { kotNumber?: string | number }).kotNumber || kot._id.slice(-4)}</span>
      <span class="badge">${kot.orderType === "dine-in" ? `TABLE ${kot.tableNumber}` : "TAKEAWAY"}</span>
    </div>
    <div class="row sm mb1"><span>${dt}</span><span>${tm}</span></div>
    ${kot.customerName ? `<div class="sm mb1">Customer: <span class="b">${kot.customerName}</span></div>` : ""}
    ${kot.createdBy ? `<div class="sm mb2">By: <span class="b">${kot.createdBy}</span></div>` : ""}
    <div class="dash"></div>
    <div class="mt1 mb2">${items}</div>
    <div class="solid"></div>
    <div class="c sm mt1">Total items: <b>${totalQty}</b></div>
    <div class="c sm mt1 mb2">— Please prepare promptly —</div>
  </div></body></html>`;
}

// ── Bill Receipt ──────────────────────────────────────────────
function billHtml(bill: Bill, s?: Partial<Settings>): string {
  const d = new Date(bill.createdAt);
  const dt = d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const tm = d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const cur = s?.currency === "USD" ? "$" : s?.currency === "EUR" ? "€" : "₹";
  const taxRate = s?.taxRate ?? 5;
  const svcRate = s?.serviceCharge ?? 0;
  const subtotal = bill.items.reduce(
    (acc, i) => acc + (i.total ?? i.price * i.quantity),
    0,
  );
  const taxAmt = +((subtotal * taxRate) / 100).toFixed(2);
  const svcAmt = +((subtotal * svcRate) / 100).toFixed(2);
  const rawTotal = subtotal + taxAmt + svcAmt;
  const finalTotal = s?.autoRoundOff ? Math.round(rawTotal) : rawTotal;
  const roundDiff = +(finalTotal - rawTotal).toFixed(2);

  const pmEmoji: Record<string, string> = {
    cash: "💵 Cash",
    card: "💳 Card",
    upi: "📱 UPI",
  };

  const items = bill.items
    .map(
      (i) => `
    <div class="col3 mb1">
      <span class="name">${i.name}</span>
      <span class="qty">${i.quantity}</span>
      <span class="amt">${cur}${(i.total ?? i.price * i.quantity).toFixed(2)}</span>
    </div>
  `,
    )
    .join("");

  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
  <title>Receipt</title><style>${THERMAL_CSS}</style></head><body><div class="wrap">
    <div class="c b xl mb1">${s?.businessName || "KOT POS"}</div>
    ${s?.address ? `<div class="c sm mb1">${s.address}</div>` : ""}
    ${s?.phone ? `<div class="c sm mb1">Ph: ${s.phone}</div>` : ""}
    ${s?.gstin ? `<div class="c sm mb2">GSTIN: ${s.gstin}</div>` : ""}
    <div class="solid"></div>
    <div class="row sm mb1">
      <span>Bill: <b>${bill.billNumber || "—"}</b></span>
      <span>${dt} ${tm}</span>
    </div>
    ${bill.customerName ? `<div class="row sm mb1"><span>Customer: <b>${bill.customerName}</b></span>${bill.customerPhone ? `<span>${bill.customerPhone}</span>` : ""}</div>` : ""}
    <div class="dash"></div>
    <div class="col3 sm b mb1">
      <span class="name">Item</span><span class="qty">Qty</span><span class="amt">Amt</span>
    </div>
    <div class="dash"></div>
    <div class="mb1">${items}</div>
    <div class="dash"></div>
    <div class="row mb1"><span>Subtotal</span><span>${cur}${subtotal.toFixed(2)}</span></div>
    ${taxAmt > 0 ? `<div class="row sm mb1"><span>GST (${taxRate}%)</span><span>${cur}${taxAmt.toFixed(2)}</span></div>` : ""}
    ${svcAmt > 0 ? `<div class="row sm mb1"><span>Service (${svcRate}%)</span><span>${cur}${svcAmt.toFixed(2)}</span></div>` : ""}
    ${roundDiff !== 0 ? `<div class="row sm mb1"><span>Round Off</span><span>${roundDiff > 0 ? "+" : ""}${roundDiff.toFixed(2)}</span></div>` : ""}
    <div class="solid"></div>
    <div class="row b lg mt1 mb2"><span>TOTAL</span><span>${cur}${finalTotal.toFixed(2)}</span></div>
    ${bill.paymentMethod ? `<div class="c sm mb2">Paid via: <b>${pmEmoji[bill.paymentMethod] || bill.paymentMethod.toUpperCase()}</b></div>` : ""}
    <div class="dash"></div>
    <div class="c sm mt1">Thank you for visiting!</div>
    ${s?.businessName ? `<div class="c sm mb1">— ${s.businessName} —</div>` : ""}
  </div></body></html>`;
}

// ── Hook ──────────────────────────────────────────────────────
export function usePrint() {
  const printKOT = (kot: Kot, settings?: Partial<Settings>) =>
    openPrint(kotHtml(kot, settings));
  const printBill = (bill: Bill, settings?: Partial<Settings>) =>
    openPrint(billHtml(bill, settings));
  return { printKOT, printBill };
}
