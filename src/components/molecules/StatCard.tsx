import { Card } from "../atoms/Card";

type StatCardProps = {
  label: string;
  value: string;
};

export default function StatCard({ label, value }: StatCardProps) {
  return (
    <Card>
      <div className="space-y-1">
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-semibold">{value}</p>
      </div>
    </Card>
  );
}
