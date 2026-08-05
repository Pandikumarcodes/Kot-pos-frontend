import type { ReactNode } from "react";
import { useId } from "react";
export function FormField({
  label,
  hint,
  error,
  children,
  required = false,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  required?: boolean;
}) {
  const id = useId();
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1 block text-sm font-semibold text-kot-darker"
      >
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="mb-1 text-xs text-kot-text">
          {hint}
        </p>
      )}
      <div aria-describedby={describedBy} aria-invalid={Boolean(error)}>
        {children}
      </div>
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1 text-xs text-red-500"
        >
          {error}
        </p>
      )}
    </div>
  );
}
