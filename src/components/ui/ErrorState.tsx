import type { ReactNode } from "react";
export function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this content.",
  action,
}: {
  title?: string;
  message?: string;
  action?: ReactNode;
}) {
  return (
    <section
      role="alert"
      className="rounded-2xl bg-kot-white p-8 text-center shadow-kot"
    >
      <p className="text-lg font-bold text-kot-darker">{title}</p>
      <p className="mt-1 text-sm text-kot-text">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </section>
  );
}
