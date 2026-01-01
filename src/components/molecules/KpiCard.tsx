import { Card } from "../atoms/Card";
import { Icon } from "../atoms/Icon";

interface Props {
  label: string;
  value: string | number;
  icon: any;
}

export function KpiCard({ label, value, icon }: Props) {
  return (
    <Card className="flex items-center justify-between">
      <div>
        <p className="text-sm text-[var(--text-muted)]">{label}</p>
        <h3 className="text-2xl font-semibold text-[var(--text-main)]">
          {value}
        </h3>
      </div>

      <div className="p-3 bg-[var(--bg-soft)] rounded-lg">
        <Icon name={icon} className="text-[var(--primary)]" />
      </div>
    </Card>
  );
}
