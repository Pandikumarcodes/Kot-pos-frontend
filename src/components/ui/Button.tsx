import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { btn } from "./Token";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

export function Button({
  type = "button",
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const minHeight = {
    sm: "min-h-9",
    md: "min-h-10",
    lg: "min-h-11",
  }[size];

  return (
    <button
      type={type}
      className={cn(
        btn[variant],
        btn[size],
        minHeight,
        "inline-flex items-center justify-center gap-2 align-middle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kot-dark focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
