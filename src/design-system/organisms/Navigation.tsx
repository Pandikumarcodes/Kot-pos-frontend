import { useState } from "react";
import {
  Menu,
  X,
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
  Home,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

interface NavigationProps {
  activeRoute?: string;
  onNavigate?: (path: string) => void;
  className?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Menu", path: "/menu", icon: UtensilsCrossed },
  { label: "Tables", path: "/waiter/tables", icon: LayoutDashboard },
  { label: "POS", path: "/pos", icon: ShoppingCart },
  { label: "Orders", path: "/waiter/order/1", icon: Receipt },
  { label: "Kitchen", path: "/chef/kot", icon: ChefHat },
  { label: "Billing", path: "/cashier/billing", icon: CreditCard },
  { label: "Customers", path: "/customers", icon: Users },
  { label: "Staff", path: "/staff", icon: User },
  { label: "Payments", path: "/payments", icon: DollarSign },
  { label: "Reports", path: "/reports", icon: BarChart3 },
];

export default function Navigation({
  activeRoute = "/dashboard",
  onNavigate,
  className = "",
}: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (path: string) => {
    onNavigate?.(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation - Top Bar */}
      <nav
        className={`bg-white border-b border-gray-200 shadow-sm ${className}`}
      >
        <div className="max-w-full mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Home className="text-white" size={24} />
              </div>
              <span className="text-xl font-bold text-gray-900">KOT POS</span>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeRoute === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavClick(item.path)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-100 text-blue-700 font-semibold"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <Icon size={18} />
                    <span className="text-sm">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* User Section (Desktop) */}
            <div className="hidden md:flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">John Doe</p>
                <p className="text-xs text-gray-500">Manager</p>
              </div>
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <User size={20} className="text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 py-3 space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeRoute === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavClick(item.path)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-100 text-blue-700 font-semibold"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile User Section */}
            <div className="border-t border-gray-200 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <User size={20} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    John Doe
                  </p>
                  <p className="text-xs text-gray-500">Manager</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
/* // Main Navigation
<Navigation
  activeRoute="/dashboard"
  onNavigate={(path) => handleNavigate(path)}
/> */
