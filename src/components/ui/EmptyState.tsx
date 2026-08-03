import { type ReactNode } from "react";
import { emptyState } from "./Token";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  sub?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, sub, action }: EmptyStateProps) {
  return (
    <div className={emptyState.wrapper} role="status">
      {icon && <div className={emptyState.icon} aria-hidden="true">{icon}</div>}
      <p className={emptyState.title}>{title}</p>
      {sub && <p className={emptyState.sub}>{sub}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
