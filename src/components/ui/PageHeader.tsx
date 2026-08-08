import { type ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  sub?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, sub, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-lg sm:text-2xl font-bold text-kot-darker">
          {title}
        </h1>
        {sub && (
          <p className="text-xs sm:text-sm text-kot-text mt-0.5">{sub}</p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2 sm:shrink-0 sm:justify-end">
          {actions}
        </div>
      )}
    </div>
  );
}
