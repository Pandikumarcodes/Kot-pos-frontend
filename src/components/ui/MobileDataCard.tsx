import type { ReactNode } from "react";

export interface MobileDataCardField {
  label: string;
  value: ReactNode;
}
export function MobileDataCard({
  title,
  subtitle,
  fields,
  actions,
  className = "",
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  fields?: MobileDataCardField[];
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <article
      className={`rounded-xl border border-kot-chart bg-kot-white p-4 shadow-kot ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-kot-darker">{title}</h3>
          {subtitle && <p className="mt-1 text-xs text-kot-text">{subtitle}</p>}
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </div>
      {fields && (
        <dl className="mt-4 grid grid-cols-2 gap-3">
          {fields.map((field) => (
            <div key={field.label}>
              <dt className="text-xs text-kot-text">{field.label}</dt>
              <dd className="mt-0.5 text-sm text-kot-darker">{field.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </article>
  );
}
