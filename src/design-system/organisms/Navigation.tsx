import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Menu,
  X,
  LayoutDashboard,
  UtensilsCrossed,
  Users,
  BarChart3,
  Receipt,
  ChefHat,
  CreditCard,
  User,
  Home,
  LogOut,
  Settings,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../Store/hooks";
import { clearCredentials } from "../../Store/Slices/authSlice";

interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  roles: string[]; // which roles can see this
}

// ✅ Fixed paths + role-based visibility
const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
    roles: ["admin"],
  },
  {
    label: "Menu",
    path: "/admin/menu",
    icon: UtensilsCrossed,
    roles: ["admin"],
  },
  {
    label: "Tables",
    path: "/waiter/tables",
    icon: Home,
    roles: ["admin", "waiter"],
  },
  {
    label: "Orders",
    path: "/waiter/order",
    icon: Receipt,
    roles: ["admin", "waiter"],
  },
  {
    label: "Kitchen",
    path: "/chef/kot",
    icon: ChefHat,
    roles: ["admin", "chef"],
  },
  {
    label: "Billing",
    path: "/cashier/billing",
    icon: CreditCard,
    roles: ["admin", "cashier"],
  },
  { label: "Staff", path: "/admin/staff", icon: Users, roles: ["admin"] },
  {
    label: "Customers",
    path: "/admin/customers",
    icon: User,
    roles: ["admin"],
  },
  {
    label: "Reports",
    path: "/admin/reports",
    icon: BarChart3,
    roles: ["admin"],
  },
  {
    label: "Settings",
    path: "/admin/settings",
    icon: Settings,
    roles: ["admin"],
  },
];

export default function Navigation({ className = "" }: { className?: string }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Filter nav items by role
  const visibleItems = NAV_ITEMS.filter((item) =>
    user?.role ? item.roles.includes(user.role) : false,
  );

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/auth/logout",
        {},
        { withCredentials: true },
      );
    } catch {
      // clear anyway
    } finally {
      dispatch(clearCredentials());
      navigate("/login");
    }
  };

  return (
    <nav
      className={`bg-kot-header border-b border-kot-chart shadow-kot ${className}`}
    >
      <div className="max-w-full mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-kot-dark rounded-lg flex items-center justify-center">
              <Home className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold text-kot-darker">KOT POS</span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {visibleItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-kot-stats text-kot-darker font-semibold"
                      : "text-kot-text hover:bg-kot-light hover:text-kot-darker"
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-sm">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Desktop: User + Logout */}
          <div className="hidden md:flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-kot-darker capitalize">
                {user?.name ?? "User"}
              </p>
              <p className="text-xs text-kot-text capitalize">{user?.role}</p>
            </div>
            <div className="w-10 h-10 bg-kot-stats rounded-full flex items-center justify-center font-bold text-kot-darker">
              {user?.name?.charAt(0).toUpperCase() ?? "U"}
            </div>
            {/* ✅ Logout button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-kot-text hover:bg-red-50 hover:text-red-600 transition-colors border border-kot-chart ml-1"
              title="Logout"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile: Menu toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-kot-text hover:bg-kot-light"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-kot-chart bg-kot-white">
          <div className="px-2 py-3 space-y-1">
            {visibleItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? "bg-kot-stats text-kot-darker font-semibold"
                      : "text-kot-text hover:bg-kot-light hover:text-kot-darker"
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile: User + Logout */}
          <div className="border-t border-kot-chart px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-kot-stats rounded-full flex items-center justify-center font-bold text-kot-darker">
                {user?.name?.charAt(0).toUpperCase() ?? "U"}
              </div>
              <div>
                <p className="text-sm font-semibold text-kot-darker capitalize">
                  {user?.name}
                </p>
                <p className="text-xs text-kot-text capitalize">{user?.role}</p>
              </div>
            </div>
            {/* ✅ Mobile logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
