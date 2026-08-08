import { Search, X } from "lucide-react";
import { Input } from "./Input";

export function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  label = "Search",
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}) {
  return (
    <div className={`relative min-w-0 flex-1 sm:min-w-64 ${className}`}>
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-kot-text"
      />
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={label}
        style={{ paddingInlineStart: "2.5rem", paddingInlineEnd: "2.75rem" }}
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => onChange("")}
          className="absolute right-0.5 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-kot-text hover:bg-kot-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kot-dark focus-visible:ring-offset-1"
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
