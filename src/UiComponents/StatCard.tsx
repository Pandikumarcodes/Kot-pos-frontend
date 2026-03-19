import { statCard } from "./Token";
import { Pulse } from "./Pulse";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

interface StatCardProps {
  label: string;
  value: string | number;
  bg?: string;
  loading?: boolean;
}

export function StatCard({
  label,
  value,
  bg = "bg-kot-white",
  loading,
}: StatCardProps) {
  return (
    <div className={cn(statCard.wrapper, bg)}>
      <p className={statCard.label}>{label}</p>
      {loading ? (
        <Pulse className="h-7 w-16 mt-1" />
      ) : (
        <p className={statCard.value}>{value}</p>
      )}
    </div>
  );
}
