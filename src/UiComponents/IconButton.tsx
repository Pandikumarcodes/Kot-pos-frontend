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
    <button className={cn(btn.icon, color, className)} {...props}>
      {children}
    </button>
  );
}
