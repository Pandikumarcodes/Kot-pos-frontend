import type { HTMLAttributes, ReactNode } from "react";

interface PageContainerProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
}

export function PageContainer({
  children,
  className = "",
  ...props
}: PageContainerProps) {
  return (
    <main
      className={`min-h-screen bg-kot-primary p-3 sm:p-4 md:p-6 ${className}`}
      {...props}
    >
      <div className="mx-auto w-full max-w-[2400px]">{children}</div>
    </main>
  );
}
