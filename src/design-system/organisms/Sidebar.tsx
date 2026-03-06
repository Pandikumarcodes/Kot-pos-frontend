// src/design-system/organisms/Sidebar.tsx
import { useNavigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../../Store/hooks";
import { NAV_PERMISSIONS } from "../../config/Permission";
import type { Role } from "../../config/Permission";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Users,
  BarChart3,
  ChefHat,
  CreditCard,
  User,
  Settings,
  Home,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface NavLink {
  label: string;
  to: string;
  icon: LucideIcon;
}

const NAV_LINKS: NavLink[] = [
  { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Menu", to: "/admin/menu", icon: UtensilsCrossed },
  { label: "Tables", to: "/waiter/tables", icon: Home },
  { label: "Kitchen", to: "/chef/kot", icon: ChefHat },
  { label: "Billing", to: "/cashier/billing", icon: CreditCard },
  { label: "Customers", to: "/admin/customers", icon: Users },
  { label: "Staff", to: "/admin/staff", icon: User },
  { label: "Reports", to: "/admin/reports", icon: BarChart3 },
  { label: "Settings", to: "/admin/settings", icon: Settings },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);
  const role = user?.role as Role | undefined;

  // ✅ Filter using central NAV_PERMISSIONS config
  const visibleLinks = NAV_LINKS.filter((link) =>
    role ? (NAV_PERMISSIONS[link.label] ?? []).includes(role) : false,
  );

  return (
    <aside className="w-64 min-h-screen bg-kot-header border-r border-kot-chart flex-shrink-0">
      <div className="p-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-kot-darker">KOT POS</h1>
          <p className="text-sm text-kot-text mt-1 capitalize">
            {role} Dashboard
          </p>
        </div>

        <nav className="space-y-1">
          {visibleLinks.map(({ label, to, icon: Icon }) => {
            const isActive = location.pathname === to;
            return (
              <button
                key={to}
                onClick={() => navigate(to)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? "bg-kot-sidebar text-kot-darker font-medium shadow-kot"
                    : "text-kot-text hover:bg-kot-light hover:text-kot-darker"
                }`}
              >
                <Icon size={20} className="shrink-0" />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
