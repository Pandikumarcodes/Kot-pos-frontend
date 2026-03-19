import { type TextareaHTMLAttributes } from "react";
import { input } from "./Token";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function TextArea({ label, error, className, ...props }: TextareaProps) {
  return (
    <div>
      {label && <label className={input.label}>{label}</label>}
      <textarea
        className={cn(
          input.base,
          error ? input.error : input.normal,
          className,
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
