import { Card } from "../atoms/Card";
import Button from "../atoms/Button";

type TableCardProps = {
  tableNumber: number;
  status: "Available" | "Occupied" | "Billing";
};

const statusColor = {
  Available: "text-green-600",
  Occupied: "text-amber-600",
  Billing: "text-blue-600",
};

export default function TableCard({ tableNumber, status }: TableCardProps) {
  return (
    <Card>
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold">Table {tableNumber}</p>
          <p className={`text-sm ${statusColor[status]}`}>{status}</p>
        </div>

        <Button variant="secondary">Open</Button>
      </div>
    </Card>
  );
}
