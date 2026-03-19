import { type ReactNode } from "react";
import { emptyState } from "./Token";

interface EmptyStateProps {
  icon: string;
  title: string;
  sub?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, sub, action }: EmptyStateProps) {
  return (
    <div className={emptyState.wrapper}>
      <p className={emptyState.icon}>{icon}</p>
      <p className={emptyState.title}>{title}</p>
      {sub && <p className={emptyState.sub}>{sub}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
