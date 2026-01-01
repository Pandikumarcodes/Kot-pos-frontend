import { StatusPill } from "../atoms/StatusPill";

interface Order {
  id: string;
  table: string;
  amount: number;
  status: "PAID" | "PENDING" | "READY";
}

export function OrdersTable({ orders }: { orders: Order[] }) {
  return (
    <div className="bg-white rounded-xl shadow-[var(--shadow-soft)] overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-[var(--bg-soft)] text-[var(--text-muted)]">
          <tr>
            <th className="px-4 py-3 text-left">Order</th>
            <th className="px-4 py-3">Table</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders?.map((o) => (
            <tr key={o.id} className="border-t">
              <td className="px-4 py-3">#{o.id}</td>
              <td className="px-4 py-3 text-center">{o.table}</td>
              <td className="px-4 py-3 text-center">₹{o.amount}</td>
              <td className="px-4 py-3 text-center">
                <StatusPill status={o.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
