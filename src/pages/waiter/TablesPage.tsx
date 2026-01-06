import { Card } from "../../design-system/atoms/Card";
import Button from "../../design-system/atoms/Button";

const tables = [
  { id: 1, status: "Available" },
  { id: 2, status: "Occupied" },
];

export default function TablesPage() {
  return (
    <div className="p-6 grid grid-cols-2 gap-4">
      {tables.map((table) => (
        <Card key={table.id}>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">Table {table.id}</h3>
              <p className="text-sm text-slate-500">{table.status}</p>
            </div>
            <Button variant="secondary">Open</Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
