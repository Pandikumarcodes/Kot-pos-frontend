import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAppSelector } from "../../app/store/hooks";
import { getNavItemsForRole } from "../constants/nav";
import type { NavItem } from "../constants/nav";
import type { Role } from "../types";
import type { cn } from "../utils/validation";

// ── NavItem button ────────────────────────────────────────────
interface NavButtonProps {
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  compact: boolean;
  onClick: () => void;
}

function NavButton({
  label,
  icon: Icon,
  isActive,
  compact,
  onClick,
}: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      title={compact ? label : undefined}
      className={cn(
        "relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
        compact && "justify-center",
        isActive
          ? "bg-kot-sidebar text-kot-darker font-semibold shadow-kot"
          : "text-kot-text hover:bg-kot-light hover:text-kot-darker",
      )}
    >
      <Icon size={20} className="shrink-0" />
      {!compact && <span className="text-sm truncate">{label}</span>}
      {compact && isActive && (
        <span className="absolute right-1.5 w-1.5 h-1.5 rounded-full bg-kot-dark" />
      )}
    </button>
  );
}

// ── Shared sidebar content ────────────────────────────────────
interface SidebarContentProps {
  compact: boolean;
  links: NavItem[];
  pathname: string;
  role?: string;
  userName?: string;
  onNavigate: (to: string) => void;
}

function SidebarContent({
  compact,
  links,
  pathname,
  role,
  userName,
  onNavigate,
}: SidebarContentProps) {
  return (
    <div className={cn("flex flex-col h-full", compact && "items-center")}>
      {/* Logo */}
      <div className={cn("mb-6 sm:mb-8", compact && "flex justify-center")}>
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

      {/* Nav links */}
      <nav
        className={cn(
          "flex-1 space-y-1 w-full",
          compact && "flex flex-col items-center",
        )}
      >
        {links.map((link) => (
          <NavButton
            key={link.to}
            label={link.label}
            icon={link.icon}
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
                {userName?.[0]?.toUpperCase() ?? "U"}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-kot-darker truncate">
                {userName ?? "User"}
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

// ── Main export ───────────────────────────────────────────────
export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);
  const role = user?.role as Role | undefined;
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = getNavItemsForRole(role);

  const handleNavigate = (to: string) => {
    navigate(to);
    setMobileOpen(false);
  };

  const sharedProps: Omit<SidebarContentProps, "compact"> = {
    links,
    pathname: location.pathname,
    role: user?.role,
    userName: user?.name,
    onNavigate: handleNavigate,
  };

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-3 left-3 z-50 md:hidden w-9 h-9 bg-kot-white rounded-xl shadow-kot flex items-center justify-center border border-kot-chart"
      >
        <Menu size={18} className="text-kot-darker" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed top-0 left-0 h-full w-64 bg-kot-header border-r border-kot-chart z-50 md:hidden p-4 overflow-y-auto flex flex-col">
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
            <SidebarContent {...sharedProps} compact={false} />
          </aside>
        </>
      )}

      {/* Tablet: icon-only */}
      <aside className="hidden md:flex lg:hidden w-16 min-h-screen bg-kot-header border-r border-kot-chart flex-shrink-0 flex-col p-3 overflow-y-auto">
        <SidebarContent {...sharedProps} compact={true} />
      </aside>

      {/* Desktop: full */}
      <aside className="hidden lg:flex xl:w-64 2xl:w-72 min-h-screen bg-kot-header border-r border-kot-chart flex-shrink-0 flex-col p-4 xl:p-5 overflow-y-auto">
        <SidebarContent {...sharedProps} compact={false} />
      </aside>
    </>
  );
}
