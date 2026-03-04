import { Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onNavigate?: (path: string) => void;
}

export function Breadcrumb({ items, onNavigate }: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-kot-text px-4 py-3 bg-kot-light border-b border-kot-chart">
      <Home size={16} className="text-kot-dark" />
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <span className="text-kot-chart">/</span>
          {item.path ? (
            <button
              onClick={() => onNavigate?.(item.path!)}
              className="hover:text-kot-dark transition-colors"
            >
              {item.label}
            </button>
          ) : (
            <span className="font-semibold text-kot-darker">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
