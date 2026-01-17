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
    <nav className="flex items-center space-x-2 text-sm text-gray-600 px-4 py-3 bg-gray-50 border-b border-gray-200">
      <Home size={16} className="text-gray-400" />
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <span className="text-gray-400">/</span>
          {item.path ? (
            <button
              onClick={() => onNavigate?.(item.path!)}
              className="hover:text-blue-600 transition-colors"
            >
              {item.label}
            </button>
          ) : (
            <span className="font-semibold text-gray-900">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}

/* // Breadcrumb (optional)
<Breadcrumb
  items={[
    { label: "Home", path: "/" },
    { label: "Orders", path: "/orders" },
    { label: "Order #123" }
  ]}
  onNavigate={(path) => handleNavigate(path)}
/> */
