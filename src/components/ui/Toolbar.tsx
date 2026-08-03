import type { HTMLAttributes, ReactNode } from "react";

interface ToolbarProps extends HTMLAttributes<HTMLDivElement> { children: ReactNode; }

export function Toolbar({ children, className = "", ...props }: ToolbarProps) {
  return <div className={`flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between ${className}`} {...props}>{children}</div>;
}
