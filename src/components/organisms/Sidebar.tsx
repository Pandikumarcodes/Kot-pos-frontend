import { Icon } from "../atoms/Icon";

const items = [
  { label: "Dashboard", icon: "LayoutDashboard", active: true },
  { label: "Orders", icon: "ShoppingBag" },
  { label: "Menu", icon: "Utensils" },
  { label: "Tables", icon: "Table" },
  { label: "Staff", icon: "Users" },
  { label: "Reports", icon: "BarChart3" },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-[var(--bg-soft)] rounded-xl p-4">
      <h1 className="text-2xl font-bold text-[var(--primary)] mb-8">
        POS Admin
      </h1>

      <nav className="space-y-1">
        {items.map((i) => (
          <div
            key={i.label}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
              i.active
                ? "bg-[var(--primary)] text-white"
                : "text-[var(--text-main)] hover:bg-[var(--bg-hover)]"
            }`}
          >
            <Icon name={i.icon as any} />
            <span className="font-medium">{i.label}</span>
          </div>
        ))}
      </nav>
    </aside>
  );
}
