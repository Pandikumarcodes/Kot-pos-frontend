import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { btn } from "./Token";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "danger";
  children: ReactNode;
}

export function IconButton({
  type = "button",
  variant = "default",
  className,
  children,
  ...props
}: IconButtonProps) {
  const color =
    variant === "danger"
      ? "text-red-600 hover:bg-red-50"
      : "text-kot-dark hover:bg-kot-light";
  return (
    <button
      type={type}
      className={cn(
        btn.icon,
        color,
        "inline-flex min-h-10 min-w-10 items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kot-dark focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
