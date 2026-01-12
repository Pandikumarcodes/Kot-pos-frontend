import { useState } from "react";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Users,
  DollarSign,
  BarChart3,
  ShoppingCart,
  Receipt,
  ChefHat,
  CreditCard,
  User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface NavLink {
  label: string;
  to: string;
  icon: LucideIcon;
}

interface NavItemProps {
  label: string;
  to: string;
  icon: LucideIcon;
  isActive: boolean;
  onClick: (path: string) => void;
}

const NAV_LINKS: NavLink[] = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Menu", to: "/menu", icon: UtensilsCrossed },
  { label: "Tables", to: "/waiter/tables", icon: LayoutDashboard },
  { label: "POS", to: "/pos", icon: ShoppingCart },
  { label: "Orders", to: "/waiter/order/1", icon: Receipt },
  { label: "Kitchen", to: "/chef/kot", icon: ChefHat },
  { label: "Billing", to: "/cashier/billing", icon: CreditCard },
  { label: "Customers", to: "/customers", icon: Users },
  { label: "Staff", to: "/staff", icon: User },
  { label: "Payments", to: "/payments", icon: DollarSign },
  { label: "Reports", to: "/reports", icon: BarChart3 },
];

const NavItem = ({
  label,
  to,
  icon: Icon,
  isActive,
  onClick,
}: NavItemProps) => (
  <a
    href={to}
    onClick={(e) => {
      e.preventDefault();
      onClick(to);
    }}
    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
      isActive
        ? "bg-blue-500 text-white font-medium"
        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
    }`}
  >
    <Icon size={20} className="shrink-0" />
    <span>{label}</span>
  </a>
);

export default function Sidebar() {
  const [activePath, setActivePath] = useState("/dashboard");

  return (
    <aside className="w-64 min-h-screen bg-gray-50 border-r border-gray-200">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">KOT POS</h1>

        <nav className="space-y-1">
          {NAV_LINKS.map(({ label, to, icon }) => (
            <NavItem
              key={to}
              label={label}
              to={to}
              icon={icon}
              isActive={activePath === to}
              onClick={setActivePath}
            />
          ))}
        </nav>
      </div>
    </aside>
  );
}
