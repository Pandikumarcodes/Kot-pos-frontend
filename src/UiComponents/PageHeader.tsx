import { type ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  sub?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, sub, actions }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-lg sm:text-2xl font-bold text-kot-darker">
          {title}
        </h1>
        {sub && (
          <p className="text-xs sm:text-sm text-kot-text mt-0.5">{sub}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
