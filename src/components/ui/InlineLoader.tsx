export function InlineLoader({ label = "Loading..." }: { label?: string }) {
  return (
    <span
      className="inline-flex items-center gap-2 text-sm text-kot-text"
      role="status"
    >
      <span
        aria-hidden="true"
        className="h-4 w-4 animate-spin rounded-full border-2 border-kot-chart border-t-kot-dark"
      />
      {label}
    </span>
  );
}
