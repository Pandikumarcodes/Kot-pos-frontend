type Status = "PAID" | "PENDING" | "READY";

const styles: Record<Status, string> = {
  PAID: "bg-[var(--bg-soft)] text-[var(--primary)]",
  PENDING: "bg-[#facc15] text-[#92400e]",
  READY: "bg-[#22c55e] text-white",
};

export function StatusPill({ status }: { status: Status }) {
  return (
    <span
      className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold min-w-[80px] transition-colors ${styles[status]}`}
    >
      {status}
    </span>
  );
}
