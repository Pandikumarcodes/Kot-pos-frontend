import { describe, it, expect } from "vitest";
import {
  hasPermission,
  ROUTE_PERMISSIONS,
  ROLE_HOME,
  NAV_PERMISSIONS,
} from "../../config/Permission";
import type { Role, FeatureKey } from "../../config/Permission";

// ─── hasPermission — admin ────────────────────────────────────────────────────
describe("hasPermission — admin", () => {
  const role: Role = "admin";

  it("can add a table", () =>
    expect(hasPermission(role, "canAddTable")).toBe(true));
  it("can delete a table", () =>
    expect(hasPermission(role, "canDeleteTable")).toBe(true));
  it("can edit menu", () =>
    expect(hasPermission(role, "canEditMenu")).toBe(true));
  it("can delete menu", () =>
    expect(hasPermission(role, "canDeleteMenu")).toBe(true));
  it("can add staff", () =>
    expect(hasPermission(role, "canAddStaff")).toBe(true));
  it("can delete staff", () =>
    expect(hasPermission(role, "canDeleteStaff")).toBe(true));
  it("can view reports", () =>
    expect(hasPermission(role, "canViewReports")).toBe(true));
  it("can allocate table", () =>
    expect(hasPermission(role, "canAllocateTable")).toBe(true));
  it("can send to kitchen", () =>
    expect(hasPermission(role, "canSendToKitchen")).toBe(true));
  it("can process billing", () =>
    expect(hasPermission(role, "canProcessBilling")).toBe(true));
  it("can view KOT", () =>
    expect(hasPermission(role, "canViewKOT")).toBe(true));
});

// ─── hasPermission — manager ──────────────────────────────────────────────────
describe("hasPermission — manager", () => {
  const role: Role = "manager";

  it("can edit menu", () =>
    expect(hasPermission(role, "canEditMenu")).toBe(true));
  it("can view reports", () =>
    expect(hasPermission(role, "canViewReports")).toBe(true));
  it("can allocate table", () =>
    expect(hasPermission(role, "canAllocateTable")).toBe(true));
  it("can send to kitchen", () =>
    expect(hasPermission(role, "canSendToKitchen")).toBe(true));

  it("cannot add a table", () =>
    expect(hasPermission(role, "canAddTable")).toBe(false));
  it("cannot delete a table", () =>
    expect(hasPermission(role, "canDeleteTable")).toBe(false));
  it("cannot delete menu", () =>
    expect(hasPermission(role, "canDeleteMenu")).toBe(false));
  it("cannot add staff", () =>
    expect(hasPermission(role, "canAddStaff")).toBe(false));
  it("cannot delete staff", () =>
    expect(hasPermission(role, "canDeleteStaff")).toBe(false));
  it("cannot process billing", () =>
    expect(hasPermission(role, "canProcessBilling")).toBe(false));
  it("cannot view KOT", () =>
    expect(hasPermission(role, "canViewKOT")).toBe(false));
});

// ─── hasPermission — waiter ───────────────────────────────────────────────────
describe("hasPermission — waiter", () => {
  const role: Role = "waiter";

  it("can allocate table", () =>
    expect(hasPermission(role, "canAllocateTable")).toBe(true));
  it("can send to kitchen", () =>
    expect(hasPermission(role, "canSendToKitchen")).toBe(true));

  it("cannot add a table", () =>
    expect(hasPermission(role, "canAddTable")).toBe(false));
  it("cannot delete a table", () =>
    expect(hasPermission(role, "canDeleteTable")).toBe(false));
  it("cannot edit menu", () =>
    expect(hasPermission(role, "canEditMenu")).toBe(false));
  it("cannot delete menu", () =>
    expect(hasPermission(role, "canDeleteMenu")).toBe(false));
  it("cannot add staff", () =>
    expect(hasPermission(role, "canAddStaff")).toBe(false));
  it("cannot view reports", () =>
    expect(hasPermission(role, "canViewReports")).toBe(false));
  it("cannot process billing", () =>
    expect(hasPermission(role, "canProcessBilling")).toBe(false));
  it("cannot view KOT", () =>
    expect(hasPermission(role, "canViewKOT")).toBe(false));
});

// ─── hasPermission — chef ─────────────────────────────────────────────────────
describe("hasPermission — chef", () => {
  const role: Role = "chef";

  it("can view KOT", () =>
    expect(hasPermission(role, "canViewKOT")).toBe(true));

  it("cannot add a table", () =>
    expect(hasPermission(role, "canAddTable")).toBe(false));
  it("cannot edit menu", () =>
    expect(hasPermission(role, "canEditMenu")).toBe(false));
  it("cannot add staff", () =>
    expect(hasPermission(role, "canAddStaff")).toBe(false));
  it("cannot view reports", () =>
    expect(hasPermission(role, "canViewReports")).toBe(false));
  it("cannot allocate table", () =>
    expect(hasPermission(role, "canAllocateTable")).toBe(false));
  it("cannot send to kitchen", () =>
    expect(hasPermission(role, "canSendToKitchen")).toBe(false));
  it("cannot process billing", () =>
    expect(hasPermission(role, "canProcessBilling")).toBe(false));
});

// ─── hasPermission — cashier ──────────────────────────────────────────────────
describe("hasPermission — cashier", () => {
  const role: Role = "cashier";

  it("can process billing", () =>
    expect(hasPermission(role, "canProcessBilling")).toBe(true));

  it("cannot add a table", () =>
    expect(hasPermission(role, "canAddTable")).toBe(false));
  it("cannot edit menu", () =>
    expect(hasPermission(role, "canEditMenu")).toBe(false));
  it("cannot add staff", () =>
    expect(hasPermission(role, "canAddStaff")).toBe(false));
  it("cannot view reports", () =>
    expect(hasPermission(role, "canViewReports")).toBe(false));
  it("cannot allocate table", () =>
    expect(hasPermission(role, "canAllocateTable")).toBe(false));
  it("cannot send to kitchen", () =>
    expect(hasPermission(role, "canSendToKitchen")).toBe(false));
  it("cannot view KOT", () =>
    expect(hasPermission(role, "canViewKOT")).toBe(false));
});

// ─── ROUTE_PERMISSIONS ────────────────────────────────────────────────────────
describe("ROUTE_PERMISSIONS", () => {
  it("admin can access /admin/staff", () => {
    expect(ROUTE_PERMISSIONS["/admin/staff"]).toContain("admin");
  });

  it("manager cannot access /admin/staff", () => {
    expect(ROUTE_PERMISSIONS["/admin/staff"]).not.toContain("manager");
  });

  it("admin can access /admin/settings", () => {
    expect(ROUTE_PERMISSIONS["/admin/settings"]).toContain("admin");
  });

  it("manager cannot access /admin/settings", () => {
    expect(ROUTE_PERMISSIONS["/admin/settings"]).not.toContain("manager");
  });

  it("waiter can access /waiter/tables", () => {
    expect(ROUTE_PERMISSIONS["/waiter/tables"]).toContain("waiter");
  });

  it("cashier cannot access /waiter/tables", () => {
    expect(ROUTE_PERMISSIONS["/waiter/tables"]).not.toContain("cashier");
  });

  it("chef can access /chef/kot", () => {
    expect(ROUTE_PERMISSIONS["/chef/kot"]).toContain("chef");
  });

  it("waiter cannot access /chef/kot", () => {
    expect(ROUTE_PERMISSIONS["/chef/kot"]).not.toContain("waiter");
  });

  it("cashier can access /cashier/billing", () => {
    expect(ROUTE_PERMISSIONS["/cashier/billing"]).toContain("cashier");
  });

  it("waiter cannot access /cashier/billing", () => {
    expect(ROUTE_PERMISSIONS["/cashier/billing"]).not.toContain("waiter");
  });
});

// ─── ROLE_HOME ────────────────────────────────────────────────────────────────
describe("ROLE_HOME", () => {
  it("admin lands on /admin/dashboard", () => {
    expect(ROLE_HOME["admin"]).toBe("/admin/dashboard");
  });

  it("manager lands on /admin/dashboard", () => {
    expect(ROLE_HOME["manager"]).toBe("/admin/dashboard");
  });

  it("waiter lands on /waiter/tables", () => {
    expect(ROLE_HOME["waiter"]).toBe("/waiter/tables");
  });

  it("chef lands on /chef/kot", () => {
    expect(ROLE_HOME["chef"]).toBe("/chef/kot");
  });

  it("cashier lands on /cashier/billing", () => {
    expect(ROLE_HOME["cashier"]).toBe("/cashier/billing");
  });

  it("every role has a home page defined", () => {
    const roles: Role[] = ["admin", "manager", "waiter", "chef", "cashier"];
    roles.forEach((role) => {
      expect(ROLE_HOME[role]).toBeTruthy();
    });
  });
});

// ─── NAV_PERMISSIONS ──────────────────────────────────────────────────────────
describe("NAV_PERMISSIONS", () => {
  it("only admin can see Staff nav item", () => {
    expect(NAV_PERMISSIONS["Staff"]).toEqual(["admin"]);
  });

  it("only admin can see Settings nav item", () => {
    expect(NAV_PERMISSIONS["Settings"]).toEqual(["admin"]);
  });

  it("admin and manager can see Dashboard", () => {
    expect(NAV_PERMISSIONS["Dashboard"]).toContain("admin");
    expect(NAV_PERMISSIONS["Dashboard"]).toContain("manager");
  });

  it("waiter can see Tables nav item", () => {
    expect(NAV_PERMISSIONS["Tables"]).toContain("waiter");
  });

  it("waiter cannot see Reports nav item", () => {
    expect(NAV_PERMISSIONS["Reports"]).not.toContain("waiter");
  });

  it("chef can see Kitchen nav item", () => {
    expect(NAV_PERMISSIONS["Kitchen"]).toContain("chef");
  });

  it("chef cannot see Billing nav item", () => {
    expect(NAV_PERMISSIONS["Billing"]).not.toContain("chef");
  });

  it("cashier can see Billing nav item", () => {
    expect(NAV_PERMISSIONS["Billing"]).toContain("cashier");
  });

  it("cashier cannot see Reports nav item", () => {
    expect(NAV_PERMISSIONS["Reports"]).not.toContain("cashier");
  });
});
