import { useState } from "react";
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
  Menu,
  X,
  LogOut,
  ClipboardList,
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
  { label: "Orders", to: "/admin/orders", icon: ClipboardList },
  { label: "Tables", to: "/waiter/tables", icon: Home },
  { label: "Kitchen", to: "/chef/kot", icon: ChefHat },
  { label: "Billing", to: "/cashier/billing", icon: CreditCard },
  { label: "Customers", to: "/admin/customers", icon: Users },
  { label: "Staff", to: "/admin/staff", icon: User },
  { label: "Reports", to: "/admin/reports", icon: BarChart3 },
  { label: "Settings", to: "/admin/settings", icon: Settings },
];

// ── NavItem — declared outside to avoid "component created during render" ──
interface NavItemProps {
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  compact: boolean;
  onClick: () => void;
}

function NavItem({
  label,
  icon: Icon,
  isActive,
  compact,
  onClick,
}: NavItemProps) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
        compact ? "justify-center" : ""
      } ${
        isActive
          ? "bg-kot-sidebar text-kot-darker font-semibold shadow-kot"
          : "text-kot-text hover:bg-kot-light hover:text-kot-darker"
      }`}
    >
      <Icon size={20} className="shrink-0" />
      {!compact && <span className="text-sm truncate">{label}</span>}
      {compact && isActive && (
        <span className="absolute right-1.5 w-1.5 h-1.5 rounded-full bg-kot-dark" />
      )}
    </button>
  );
}

// ── SidebarContent — declared outside ────────────────────────
interface SidebarContentProps {
  compact?: boolean;
  visibleLinks: NavLink[];
  pathname: string;
  role: string | undefined;
  userName: string | undefined;
  onNavigate: (to: string) => void;
}

function SidebarContent({
  compact = false,
  visibleLinks,
  pathname,
  role,
  userName,
  onNavigate,
}: SidebarContentProps) {
  return (
    <div className={`flex flex-col h-full ${compact ? "items-center" : ""}`}>
      {/* Logo */}
      <div className={`mb-6 sm:mb-8 ${compact ? "flex justify-center" : ""}`}>
        {compact ? (
          <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-kot-dark">
            <span className="text-white font-bold text-sm">K</span>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-kot-dark flex-shrink-0">
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <h1 className="text-lg font-bold text-kot-darker">KOT POS</h1>
            </div>
            <p className="text-xs text-kot-text mt-1 capitalize ml-10">
              {role} Dashboard
            </p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav
        className={`flex-1 space-y-1 w-full ${compact ? "flex flex-col items-center" : ""}`}
      >
        {visibleLinks.map((link) => (
          <NavItem
            key={link.to}
            {...link}
            isActive={pathname === link.to}
            compact={compact}
            onClick={() => onNavigate(link.to)}
          />
        ))}
      </nav>

      {/* User badge */}
      {!compact && (
        <div className="mt-4 pt-4 border-t border-kot-chart">
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-kot-light">
            <div className="w-7 h-7 rounded-full bg-kot-dark flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">
                {userName?.[0]?.toUpperCase() || "U"}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-kot-darker truncate">
                {userName || "User"}
              </p>
              <p className="text-[10px] text-kot-text capitalize">{role}</p>
            </div>
            <LogOut
              size={14}
              className="text-kot-text hover:text-red-500 cursor-pointer flex-shrink-0 ml-auto transition-colors"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Sidebar ──────────────────────────────────────────────
export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);
  const role = user?.role as Role | undefined;
  const [mobileOpen, setMobileOpen] = useState(false);

  const visibleLinks = NAV_LINKS.filter((link) =>
    role ? (NAV_PERMISSIONS[link.label] ?? []).includes(role) : false,
  );

  const handleNavigate = (to: string) => {
    navigate(to);
    setMobileOpen(false);
  };

  const sharedProps = {
    visibleLinks,
    pathname: location.pathname,
    role: user?.role,
    userName: user?.name,
    onNavigate: handleNavigate,
  };

  return (
    <>
      {/* ── Mobile hamburger ── */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-3 left-3 z-50 md:hidden w-9 h-9 bg-kot-white rounded-xl shadow-kot flex items-center justify-center border border-kot-chart"
      >
        <Menu size={18} className="text-kot-darker" />
      </button>

      {/* ── Mobile overlay ── */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed top-0 left-0 h-full w-64 bg-kot-header border-r border-kot-chart z-50 md:hidden p-4 overflow-y-auto flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-kot-dark">
                  <span className="text-white font-bold text-sm">K</span>
                </div>
                <h1 className="text-lg font-bold text-kot-darker">KOT POS</h1>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg text-kot-text hover:bg-kot-light transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-xs text-kot-text mb-5 capitalize px-1">
              {role} Dashboard
            </p>
            <nav className="flex-1 space-y-1">
              {visibleLinks.map((link) => (
                <NavItem
                  key={link.to}
                  {...link}
                  isActive={location.pathname === link.to}
                  compact={false}
                  onClick={() => handleNavigate(link.to)}
                />
              ))}
            </nav>
            <div className="mt-4 pt-4 border-t border-kot-chart">
              <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-kot-light">
                <div className="w-7 h-7 rounded-full bg-kot-dark flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-kot-darker truncate">
                    {user?.name || "User"}
                  </p>
                  <p className="text-[10px] text-kot-text capitalize">{role}</p>
                </div>
              </div>
            </div>
          </aside>
        </>
      )}

      {/* ── Tablet: icon-only (md, hidden lg+) ── */}
      <aside className="hidden md:flex lg:hidden w-16 min-h-screen bg-kot-header border-r border-kot-chart flex-shrink-0 flex-col p-3 overflow-y-auto">
        <SidebarContent {...sharedProps} compact={true} />
      </aside>

      {/* ── Desktop: full (lg+) ── */}
      <aside className="hidden lg:flex xl:w-64 2xl:w-72 min-h-screen bg-kot-header border-r border-kot-chart flex-shrink-0 flex-col p-4 xl:p-5 overflow-y-auto">
        <SidebarContent {...sharedProps} compact={false} />
      </aside>
    </>
  );
}
