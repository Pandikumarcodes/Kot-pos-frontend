import { AdminLayout } from "../../components/templates/AdminLayout";
import { KpiCard } from "../../components/molecules/KpiCard";
import { OrdersTable } from "../../components/organisms/OrdersTable";

export function AdminDashboard() {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold text-[var(--text-main)] mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard label="Orders" value="24" icon="ShoppingCart" />
        <KpiCard label="Revenue" value="₹4500" icon="DollarSign" />
        <KpiCard label="Customers" value="12" icon="Users" />
        <KpiCard label="Tables" value="6" icon="Table" />
      </div>

      <h3 className="text-lg font-semibold text-[var(--text-main)] mb-4">
        Recent Orders
      </h3>

      <OrdersTable
        orders={[
          { id: "101", table: "T1", amount: 450, status: "PAID" },
          { id: "102", table: "T2", amount: 320, status: "PENDING" },
          { id: "103", table: "T3", amount: 600, status: "READY" },
        ]}
      />
    </AdminLayout>
  );
}
