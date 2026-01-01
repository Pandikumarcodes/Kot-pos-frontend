import { cn } from "../../library/cn";

type ButtonVariant = "primary" | "secondary" | "danger";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variants: Record<ButtonVariant, string> = {
  primary: "bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white",
  secondary:
    "bg-[var(--bg-soft)] hover:bg-[var(--bg-hover)] text-[var(--primary)]",
  danger: "bg-[#ef4444] hover:bg-red-600 text-white",
};

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded-lg font-medium transition-all duration-200 active:scale-[0.98] disabled:opacity-50",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
