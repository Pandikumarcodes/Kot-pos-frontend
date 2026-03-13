import { type ReactNode } from "react";
import { badge } from "./Token";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

type BadgeVariant = "success" | "warning" | "danger" | "info" | "neutral";

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

export function Badge({
  variant = "neutral",
  children,
  className,
}: BadgeProps) {
  return (
    <span className={cn(badge.base, badge[variant], className)}>
      {children}
    </span>
  );
}
