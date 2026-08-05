import { X } from "lucide-react";
export interface ActiveFilter {
  key: string;
  label: string;
  value: string;
}
export function ActiveFilterChips({
  filters,
  onRemove,
  onClear,
}: {
  filters: ActiveFilter[];
  onRemove: (key: string) => void;
  onClear?: () => void;
}) {
  if (filters.length === 0) return null;
  return (
    <div
      className="flex flex-wrap items-center gap-2"
      aria-label="Active filters"
    >
      <span className="text-xs font-semibold text-kot-text">Filters:</span>
      {filters.map((filter) => (
        <span
          key={filter.key}
          className="inline-flex items-center gap-1 rounded-full bg-kot-light px-2.5 py-1 text-xs text-kot-darker"
        >
          {filter.label}: {filter.value}
          <button
            type="button"
            onClick={() => onRemove(filter.key)}
            aria-label={`Remove ${filter.label} filter`}
            className="rounded-full focus:outline-none focus:ring-2 focus:ring-kot-dark"
          >
            <X aria-hidden="true" className="h-3 w-3" />
          </button>
        </span>
      ))}
      {onClear && (
        <button
          type="button"
          onClick={onClear}
          className="text-xs font-semibold text-kot-dark underline focus:outline-none focus:ring-2 focus:ring-kot-dark"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
