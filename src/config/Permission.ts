export type Role = "admin" | "manager" | "waiter" | "chef" | "cashier";

// ── Route permissions ─────────────────────────────────────────
// Each route → which roles can access it
export const ROUTE_PERMISSIONS: Record<string, Role[]> = {
  "/admin/dashboard": ["admin", "manager"],
  "/admin/menu": ["admin", "manager"],
  "/admin/staff": ["admin"],
  "/admin/customers": ["admin", "manager"],
  "/admin/reports": ["admin", "manager"],
  "/admin/settings": ["admin"],
  "/admin/tables": ["admin", "manager"],
  "/waiter/tables": ["admin", "manager", "waiter"],
  "/waiter/order": ["admin", "manager", "waiter"],
  "/chef/kot": ["admin", "chef"],
  "/cashier/billing": ["admin", "cashier"],
};

// ── Role home pages ───────────────────────────────────────────
// Where each role lands after login
export const ROLE_HOME: Record<Role, string> = {
  admin: "/admin/dashboard",
  manager: "/admin/dashboard",
  waiter: "/waiter/tables",
  chef: "/chef/kot",
  cashier: "/cashier/billing",
};

// ── Sidebar nav items per role ────────────────────────────────
export const NAV_PERMISSIONS: Record<string, Role[]> = {
  Dashboard: ["admin", "manager"],
  Menu: ["admin", "manager"],
  Tables: ["admin", "manager", "waiter"],
  Kitchen: ["admin", "chef"],
  Billing: ["admin", "cashier"],
  Customers: ["admin", "manager"],
  Staff: ["admin"],
  Reports: ["admin", "manager"],
  Settings: ["admin"],
};

// ── Feature-level permissions ─────────────────────────────────
// Fine-grained UI control (show/hide buttons, actions)
export const FEATURE_PERMISSIONS = {
  canAddTable: ["admin"] as Role[],
  canDeleteTable: ["admin"] as Role[],
  canEditMenu: ["admin", "manager"] as Role[],
  canDeleteMenu: ["admin"] as Role[],
  canAddStaff: ["admin"] as Role[],
  canDeleteStaff: ["admin"] as Role[],
  canViewReports: ["admin", "manager"] as Role[],
  canAllocateTable: ["admin", "manager", "waiter"] as Role[],
  canSendToKitchen: ["admin", "manager", "waiter"] as Role[],
  canProcessBilling: ["admin", "cashier"] as Role[],
  canViewKOT: ["admin", "chef"] as Role[],
} as const;

export type FeatureKey = keyof typeof FEATURE_PERMISSIONS;

// ── Helper function ───────────────────────────────────────────
export const hasPermission = (role: Role, feature: FeatureKey): boolean => {
  return (FEATURE_PERMISSIONS[feature] as Role[]).includes(role);
};
