import type { ReactNode } from "react";
import { Card } from "./Card";

export interface StatItem { label: string; value: ReactNode; description?: ReactNode; icon?: ReactNode; }
export function StatGrid({ items, className = "" }: { items: StatItem[]; className?: string }) {
  return <div className={`grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 ${className}`}>{items.map((item) => <Card key={item.label} className="p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-medium text-kot-text">{item.label}</p><p className="mt-1 text-xl font-bold text-kot-darker">{item.value}</p>{item.description && <p className="mt-1 text-xs text-kot-text">{item.description}</p>}</div>{item.icon && <span aria-hidden="true" className="text-kot-dark">{item.icon}</span>}</div></Card>)}</div>;
}
