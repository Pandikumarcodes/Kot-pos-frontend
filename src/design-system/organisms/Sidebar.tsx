// import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  Settings,
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
  { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Menu", to: "/menu", icon: UtensilsCrossed },
  { label: "Tables", to: "/waiter/tables", icon: LayoutDashboard },
  { label: "POS", to: "/pos", icon: ShoppingCart },
  { label: "Orders", to: "/waiter/order/1", icon: Receipt },
  { label: "Kitchen", to: "/chef/kot", icon: ChefHat },
  { label: "Billing", to: "/cashier/billing", icon: CreditCard },
  { label: "Customers", to: "/customers", icon: Users },
  { label: "Staff", to: "/staff", icon: User },
  { label: "Payments", to: "/payments", icon: DollarSign },
  { label: "Reports", to: "/admin/reports", icon: BarChart3 },
  { label: "Settings", to: "/settings", icon: Settings },
];

const NavItem = ({
  label,
  to,
  icon: Icon,
  isActive,
  onClick,
}: NavItemProps) => (
  <button
    onClick={() => onClick(to)}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
      isActive
        ? "bg-kot-primary text-white font-medium"
        : "text-kot-text hover:bg-kot-light hover:text-kot-darker"
    }`}
  >
    <Icon size={20} className="shrink-0" />
    <span>{label}</span>
  </button>
);

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const activePath = location.pathname;

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <aside className="w-64 min-h-screen bg-kot-header border-r border-kot-chart">
      <div className="p-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-kot-darker">KOT POS</h1>
          <p className="text-sm text-kot-text mt-1">Restaurant Management</p>
        </div>

        <nav className="space-y-1">
          {NAV_LINKS.map(({ label, to, icon }) => (
            <NavItem
              key={to}
              label={label}
              to={to}
              icon={icon}
              isActive={activePath === to}
              onClick={handleNavigation}
            />
          ))}
        </nav>
      </div>
    </aside>
  );
}
