import { useState, useEffect, useRef } from "react";
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
  Building2,
  MapPin,
  ChevronDown,
  Check,
  Rocket,
  Package,
  ClipboardList,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getBranchesApi } from "../../services/adminApi/Branch.api";
import type { Branch } from "../../services/adminApi/Branch.api";

interface NavLink {
  label: string;
  to: string;
  icon: LucideIcon;
}

const NAV_LINKS: NavLink[] = [
  { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Inventory", to: "/admin/inventory", icon: Package },
  { label: "Orders", to: "/admin/orders", icon: ClipboardList },
  { label: "Branches", to: "/admin/branches", icon: Building2 },
  { label: "Menu", to: "/admin/menu", icon: UtensilsCrossed },
  { label: "Tables", to: "/waiter/tables", icon: Home },
  { label: "Kitchen", to: "/chef/kot", icon: ChefHat },
  { label: "Billing", to: "/cashier/billing", icon: CreditCard },
  { label: "Customers", to: "/admin/customers", icon: User },
  { label: "Staff", to: "/admin/staff", icon: Users },
  { label: "Reports", to: "/admin/reports", icon: BarChart3 },
  { label: "Settings", to: "/admin/settings", icon: Settings },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);
  const role = user?.role as Role | undefined;

  // ── super-admin detection ─────────────────────────────────
  const isSuperAdmin = role === "admin" && !user?.branchId;

  // ── Branch switcher state (super-admin only) ──────────────
  const [branches, setBranches] = useState<Branch[]>([]);
  const [activeBranch, setActiveBranch] = useState<Branch | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch branches once for super-admin
  useEffect(() => {
    if (!isSuperAdmin) return;
    getBranchesApi()
      .then((res) => {
        const active = res.data.branches.filter((b) => b.isActive);
        setBranches(active);
      })
      .catch(() => {});
  }, [isSuperAdmin]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Filter nav links by role + permission ─────────────────
  const visibleLinks = NAV_LINKS.filter((link) =>
    role ? (NAV_PERMISSIONS[link.label] ?? []).includes(role) : false,
  );

  // ── Branch name to show for staff ─────────────────────────
  const staffBranchName =
    !isSuperAdmin && user?.branchId
      ? (activeBranch?.name ?? "My Branch")
      : null;

  // Resolve staff branch name on mount
  useEffect(() => {
    if (isSuperAdmin || !user?.branchId) return;
    getBranchesApi()
      .then((res) => {
        const found = res.data.branches.find((b) => b._id === user.branchId);
        if (found) setActiveBranch(found);
      })
      .catch(() => {});
  }, [isSuperAdmin, user?.branchId]);

  return (
    <aside className="w-64 min-h-screen bg-kot-header border-r border-kot-chart flex-shrink-0 flex flex-col">
      <div className="p-4 flex flex-col h-full">
        {/* ── Logo ── */}
        <div className="mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-kot-dark flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            <span className="font-bold text-lg text-kot-darker">KOT POS</span>
          </div>
          <p className="text-xs text-kot-text mt-1 ml-0.5 capitalize">
            {role} Dashboard
          </p>
        </div>

        {/* ── Branch Selector (super-admin) ── */}
        {isSuperAdmin && (
          <div className="mb-4" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((p) => !p)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border-2 border-kot-chart bg-kot-white hover:border-kot-dark transition-all group"
            >
              <MapPin size={16} className="text-kot-dark flex-shrink-0" />
              <span className="flex-1 text-left text-sm font-medium text-kot-darker truncate">
                {activeBranch ? activeBranch.name : "All Branches"}
              </span>
              <div className="flex items-center gap-1">
                <Rocket
                  size={14}
                  className="text-kot-text group-hover:text-kot-dark transition-colors"
                />
                <ChevronDown
                  size={14}
                  className={`text-kot-text transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                />
              </div>
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <div className="absolute z-50 mt-1 w-56 bg-kot-white rounded-xl shadow-kot-lg border border-kot-chart overflow-hidden">
                {/* All branches option */}
                <button
                  onClick={() => {
                    setActiveBranch(null);
                    setDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-kot-light transition-colors text-left"
                >
                  <div className="w-6 h-6 rounded-full bg-kot-stats flex items-center justify-center flex-shrink-0">
                    <Building2 size={12} className="text-kot-darker" />
                  </div>
                  <span className="text-sm font-medium text-kot-darker flex-1">
                    All Branches
                  </span>
                  {!activeBranch && (
                    <Check size={14} className="text-kot-dark" />
                  )}
                </button>

                {branches.length > 0 && (
                  <div className="border-t border-kot-chart">
                    <p className="px-3 py-1.5 text-[10px] font-semibold text-kot-text uppercase tracking-wide">
                      Branches
                    </p>
                    {branches.map((branch) => (
                      <button
                        key={branch._id}
                        onClick={() => {
                          setActiveBranch(branch);
                          setDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-kot-light transition-colors text-left"
                      >
                        <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                          <MapPin size={11} className="text-emerald-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-kot-darker truncate">
                            {branch.name}
                          </p>
                          {branch.address && (
                            <p className="text-[10px] text-kot-text truncate">
                              {branch.address}
                            </p>
                          )}
                        </div>
                        {activeBranch?._id === branch._id && (
                          <Check
                            size={14}
                            className="text-kot-dark flex-shrink-0"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* Manage branches link */}
                <div className="border-t border-kot-chart p-2">
                  <button
                    onClick={() => {
                      navigate("/admin/branches");
                      setDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium text-kot-dark hover:bg-kot-light transition-colors"
                  >
                    <Building2 size={12} />
                    Manage Branches
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Branch Badge (branch staff) ── */}
        {!isSuperAdmin && staffBranchName && (
          <div className="mb-4 flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200">
            <MapPin size={14} className="text-emerald-600 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-emerald-600 font-medium uppercase tracking-wide">
                Branch
              </p>
              <p className="text-xs font-semibold text-emerald-800 truncate">
                {staffBranchName}
              </p>
            </div>
          </div>
        )}

        {/* ── Nav Links ── */}
        <nav className="space-y-0.5 flex-1">
          {visibleLinks.map(({ label, to, icon: Icon }) => {
            const isActive = location.pathname === to;
            return (
              <button
                key={to}
                onClick={() => navigate(to)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${
                  isActive
                    ? "bg-kot-sidebar text-kot-darker font-medium shadow-kot"
                    : "text-kot-text hover:bg-kot-light hover:text-kot-darker"
                }`}
              >
                <Icon size={18} className="shrink-0" />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        {/* ── Active branch indicator at bottom ── */}
        {isSuperAdmin && activeBranch && (
          <div className="mt-4 pt-4 border-t border-kot-chart">
            <div className="flex items-center gap-2 px-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-xs text-kot-text">
                Viewing:{" "}
                <span className="font-semibold text-kot-darker">
                  {activeBranch.name}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
