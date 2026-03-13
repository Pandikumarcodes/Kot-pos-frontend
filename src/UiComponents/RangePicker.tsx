interface RangePickerProps<T extends string> {
  ranges: T[];
  active: T;
  onChange: (r: T) => void;
}

export function RangePicker<T extends string>({
  ranges,
  active,
  onChange,
}: RangePickerProps<T>) {
  return (
    <div className="flex bg-kot-white rounded-xl border-2 border-kot-chart overflow-hidden">
      {ranges.map((r) => (
        <button
          key={r}
          onClick={() => onChange(r)}
          className={`px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium capitalize transition-all ${
            active === r
              ? "bg-kot-dark text-white"
              : "text-kot-text hover:bg-kot-light"
          }`}
        >
          {r}
        </button>
      ))}
    </div>
  );
}
