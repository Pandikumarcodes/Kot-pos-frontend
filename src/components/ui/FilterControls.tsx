import type { ReactNode } from "react";
import { Select } from "./Select";
import type { FilterOption } from "./sharedTypes";

export function FilterDropdown<T extends string = string>({ label = "Filter", value, options, onChange, className = "" }: { label?: string; value: T; options: FilterOption<T>[]; onChange: (value: T) => void; className?: string }) {
  return <div className={className}><Select aria-label={label} value={value} onChange={(event) => onChange(event.target.value as T)}><option value="">{label}</option>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</Select></div>;
}
export function SortDropdown({ value, options, onChange, label = "Sort by" }: { value: string; options: FilterOption[]; onChange: (value: string) => void; label?: string }) { return <FilterDropdown label={label} value={value} options={options} onChange={onChange} />; }
export function FilterBar({ children, className = "" }: { children: ReactNode; className?: string }) { return <div className={`flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center ${className}`}>{children}</div>; }
