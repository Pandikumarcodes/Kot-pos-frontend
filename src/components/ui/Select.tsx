import { type SelectHTMLAttributes, type ReactNode, useId } from "react";
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
  style,
  ...props
}: SelectProps) {
  const generatedId = useId();
  const id = props.id ?? generatedId;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div>
      {label && (
        <label htmlFor={id} className={input.label}>
          {label}
        </label>
      )}
      <select
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        className={cn(
          input.base,
          error ? input.error : input.normal,
          "min-h-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kot-dark focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:bg-kot-primary disabled:text-kot-text disabled:opacity-70",
          className,
        )}
        style={{ paddingRight: "2.5rem", ...style }}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p id={errorId} className="mt-1 text-xs text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
