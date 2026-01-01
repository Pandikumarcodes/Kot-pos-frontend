import { cn } from "../../library/cn";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-[var(--bg-surface)] rounded-[var(--radius-md)] shadow-[var(--shadow-soft)] p-4",
        className
      )}
      {...props}
    />
  );
}
