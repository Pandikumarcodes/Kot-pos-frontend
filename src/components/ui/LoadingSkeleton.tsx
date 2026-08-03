export function LoadingSkeleton({ rows = 3, className = "" }: { rows?: number; className?: string }) {
  return <div role="status" aria-label="Loading" className={`space-y-3 ${className}`}>{Array.from({ length: rows }, (_, index) => <div key={index} className="h-4 w-full animate-pulse rounded bg-kot-chart" />)}<span className="sr-only">Loading...</span></div>;
}
