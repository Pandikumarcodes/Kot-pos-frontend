import type { ReactNode } from "react";
export function FormActions({ children, className = "" }: { children: ReactNode; className?: string }) { return <div className={`flex flex-col-reverse gap-2 sm:flex-row sm:justify-end ${className}`}>{children}</div>; }
