import { type SelectHTMLAttributes, type ReactNode } from "react";
import { input } from "./Token";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: ReactNode;
}

export function Select({
  label,
  error,
  className,
  children,
  ...props
}: SelectProps) {
  return (
    <div>
      {label && <label className={input.label}>{label}</label>}
      <select
        className={cn(
          input.base,
          error ? input.error : input.normal,
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
