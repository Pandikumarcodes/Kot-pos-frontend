interface ProgressBarProps {
  value: number;
  max?: number;
  colorClass?: string;
  height?: string;
}

export function ProgressBar({
  value,
  max = 100,
  colorClass = "bg-kot-dark",
  height = "h-2",
}: ProgressBarProps) {
  const pct = Math.min((value / Math.max(max, 1)) * 100, 100);
  return (
    <div
      className={`w-full ${height} bg-kot-light rounded-full overflow-hidden`}
    >
      <div
        className={`${height} ${colorClass} rounded-full transition-all`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
