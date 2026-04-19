import { describe, it, expect } from "vitest";
import authReducer, {
  setCredentials,
  clearCredentials,
  setAuthLoading,
} from "../../Store/Slices/authSlice";
import type { AuthUser, UserRole } from "../../Store/Slices/authSlice";

// ─── Fixtures ─────────────────────────────────────────────────────────────────
const adminUser: AuthUser = {
  id: "user_001",
  name: "Arjun Sharma",
  email: "arjun@kotpos.in",
  role: "admin",
  branchId: "branch_001",
};

const cashierUser: AuthUser = {
  id: "user_002",
  name: "Priya Nair",
  email: "priya@kotpos.in",
  role: "cashier",
  branchId: "branch_001",
};

// matches initialState exactly
const emptyState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

// ─── Initial state ────────────────────────────────────────────────────────────
describe("authSlice — initial state", () => {
  it("starts with no user, unauthenticated, and loading = true", () => {
    const state = authReducer(undefined, { type: "@@INIT" });
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(true);
  });
});

// ─── setCredentials ───────────────────────────────────────────────────────────
describe("authSlice — setCredentials", () => {
  it("sets user and marks isAuthenticated = true", () => {
    const state = authReducer(emptyState, setCredentials(adminUser));
    expect(state.user).toEqual(adminUser);
    expect(state.isAuthenticated).toBe(true);
  });

  it("sets isLoading = false after credentials are set", () => {
    const state = authReducer(emptyState, setCredentials(adminUser));
    expect(state.isLoading).toBe(false);
  });

  it("correctly stores all user fields", () => {
    const state = authReducer(emptyState, setCredentials(cashierUser));
    expect(state.user?.id).toBe(cashierUser.id);
    expect(state.user?.email).toBe(cashierUser.email);
    expect(state.user?.role).toBe("cashier");
    expect(state.user?.branchId).toBe(cashierUser.branchId);
  });

  it("replaces existing user when called again (token rotation / re-auth)", () => {
    const asAdmin = authReducer(emptyState, setCredentials(adminUser));
    const asCashier = authReducer(asAdmin, setCredentials(cashierUser));
    expect(asCashier.user?.role).toBe("cashier");
    expect(asCashier.user?.id).toBe(cashierUser.id);
    expect(asCashier.isAuthenticated).toBe(true);
  });

  it("works for all five recognised roles", () => {
    const roles: UserRole[] = ["admin", "manager", "cashier", "waiter", "chef"];
    roles.forEach((role) => {
      const user: AuthUser = { ...adminUser, id: `user_${role}`, role };
      const state = authReducer(emptyState, setCredentials(user));
      expect(state.user?.role).toBe(role);
      expect(state.isAuthenticated).toBe(true);
    });
  });

  it("handles null branchId (super-admin with no branch)", () => {
    const globalAdmin: AuthUser = { ...adminUser, branchId: null };
    const state = authReducer(emptyState, setCredentials(globalAdmin));
    expect(state.user?.branchId).toBeNull();
    expect(state.isAuthenticated).toBe(true);
  });

  it("stores branchId correctly for multi-branch support", () => {
    const branchBUser: AuthUser = { ...adminUser, branchId: "branch_002" };
    const state = authReducer(emptyState, setCredentials(branchBUser));
    expect(state.user?.branchId).toBe("branch_002");
  });
});

// ─── clearCredentials ─────────────────────────────────────────────────────────
describe("authSlice — clearCredentials", () => {
  function authenticatedState() {
    return authReducer(emptyState, setCredentials(adminUser));
  }

  it("resets user to null on logout", () => {
    const state = authReducer(authenticatedState(), clearCredentials());
    expect(state.user).toBeNull();
  });

  it("sets isAuthenticated to false on logout", () => {
    const state = authReducer(authenticatedState(), clearCredentials());
    expect(state.isAuthenticated).toBe(false);
  });

  it("sets isLoading to false on logout", () => {
    const state = authReducer(authenticatedState(), clearCredentials());
    expect(state.isLoading).toBe(false);
  });

  it("is idempotent — clearing an already-empty state stays empty", () => {
    const state = authReducer(emptyState, clearCredentials());
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
  });
});

// ─── setAuthLoading ───────────────────────────────────────────────────────────
describe("authSlice — setAuthLoading", () => {
  it("sets isLoading to true while /auth/me is in flight", () => {
    const state = authReducer(emptyState, setAuthLoading(true));
    expect(state.isLoading).toBe(true);
  });

  it("sets isLoading to false after /auth/me resolves", () => {
    const state = authReducer(emptyState, setAuthLoading(false));
    expect(state.isLoading).toBe(false);
  });

  it("does not affect user or isAuthenticated", () => {
    const authed = authReducer(emptyState, setCredentials(adminUser));
    const state = authReducer(authed, setAuthLoading(true));
    expect(state.user).toEqual(adminUser);
    expect(state.isAuthenticated).toBe(true);
  });
});
