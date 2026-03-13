import { type ReactNode } from "react";
import { card, shadow } from "./Token";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover }: CardProps) {
  return (
    <div
      className={cn(
        card,
        hover ? `hover:${shadow.lg} transition-all` : "",
        className,
      )}
    >
      {children}
    </div>
  );
}
