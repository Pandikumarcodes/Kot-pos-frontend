import { useState } from "react";
import { useLocation } from "react-router-dom";
import { LogOut, Bell, Menu, X, ChefHat } from "lucide-react";
import { useAppSelector } from "../../app/store/hooks";
import { useLogout } from "../../hooks/useLogout";

// ── Role config ───────────────────────────────────────────────
const ROLE_CONFIG: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  admin:   { label: "Admin",   color: "text-purple-700", bg: "bg-purple-100",  icon: "👑" },
  manager: { label: "Manager", color: "text-blue-700",   bg: "bg-blue-100",    icon: "🏪" },
  waiter:  { label: "Waiter",  color: "text-green-700",  bg: "bg-green-100",   icon: "🛎️" },
  chef:    { label: "Chef",    color: "text-orange-700", bg: "bg-orange-100",  icon: "🧑‍🍳" },
  cashier: { label: "Cashier", color: "text-teal-700",   bg: "bg-teal-100",    icon: "💰" },
};

interface NavbarProps {
  /** Called when hamburger is pressed on mobile — toggles sidebar */
  onMenuToggle: () => void;
  /** Whether sidebar is currently open (mobile) */
  sidebarOpen: boolean;
}

export function Navbar({ onMenuToggle, sidebarOpen }: NavbarProps) {
  const { user }   = useAppSelector((s) => s.auth);
  const handleLogout = useLogout();
  const [showConfirm, setShowConfirm] = useState(false);

  const role   = user?.role ?? "waiter";
  const rc     = ROLE_CONFIG[role] ?? ROLE_CONFIG.waiter;
  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <>
      <header className="bg-kot-white border-b border-kot-chart shadow-kot sticky top-0 z-30 h-14 sm:h-16">
        <div className="h-full px-3 sm:px-4 lg:px-6 flex items-center justify-between max-w-[2400px] mx-auto">

          {/* Left — hamburger + logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Hamburger (mobile only) */}
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-1.5 rounded-lg text-kot-text hover:bg-kot-light hover:text-kot-darker transition-colors"
              aria-label="Toggle menu"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-kot-dark flex items-center justify-center flex-shrink-0">
                <ChefHat className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-sm sm:text-base font-bold text-kot-darker hidden xs:block">
                KOT<span className="text-kot-dark">-POS</span>
              </span>
            </div>
          </div>

          {/* Right — notifications + role badge + avatar + logout */}
          <div className="flex items-center gap-1.5 sm:gap-2">

            {/* Notification bell */}
            <button className="relative p-1.5 sm:p-2 rounded-lg text-kot-text hover:bg-kot-light hover:text-kot-darker transition-colors">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              {/* Unread dot */}
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* Role badge — hidden on very small screens */}
            <span className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${rc.bg} ${rc.color}`}>
              <span>{rc.icon}</span>
              {rc.label}
            </span>

            {/* Avatar + name */}
            <div className="flex items-center gap-1.5 sm:gap-2 pl-1 sm:pl-2 border-l border-kot-chart">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-kot-dark flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {initials}
              </div>
              <div className="hidden md:block">
                <p className="text-xs font-semibold text-kot-darker leading-tight">{user?.name ?? "User"}</p>
                <p className="text-[10px] text-kot-text leading-tight capitalize">{role}</p>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={() => setShowConfirm(true)}
              className="p-1.5 sm:p-2 rounded-lg text-kot-text hover:bg-red-50 hover:text-red-600 transition-colors ml-0.5"
              title="Logout"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Logout confirm modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-kot-white rounded-2xl shadow-kot-lg p-6 w-full max-w-sm">
            <div className="text-center mb-5">
              <span className="text-4xl">👋</span>
              <h2 className="text-lg font-bold text-kot-darker mt-2">Logging out?</h2>
              <p className="text-sm text-kot-text mt-1">You will be redirected to the login page.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2.5 border-2 border-kot-chart rounded-xl text-sm font-semibold text-kot-darker hover:bg-kot-light transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}