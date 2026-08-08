import { beforeEach, describe, expect, it } from "vitest";
import uiReducer, { setSelectedBranchId } from "../../state/slices/uiSlice";
import {
  getStoredSelectedBranchId,
  isValidBranchId,
  resolveOperationalBranchId,
  resolveCashierBranchId,
  storeSelectedBranchId,
} from "../../state/branchContext";

describe("global Admin branch context", () => {
  beforeEach(() => window.localStorage.clear());

  it("stores a selected branch centrally and replaces it on switch", () => {
    const initial = uiReducer(undefined, { type: "@@INIT" });
    const branchA = uiReducer(initial, setSelectedBranchId("branch-a"));
    const branchB = uiReducer(branchA, setSelectedBranchId("branch-b"));

    expect(branchA.selectedBranchId).toBe("branch-a");
    expect(branchB.selectedBranchId).toBe("branch-b");
  });

  it("persists selections per user and clears them safely", () => {
    storeSelectedBranchId("global-admin", "branch-a");
    expect(getStoredSelectedBranchId("global-admin")).toBe("branch-a");
    expect(getStoredSelectedBranchId("other-user")).toBeNull();

    storeSelectedBranchId("global-admin", "branch-b");
    expect(getStoredSelectedBranchId("global-admin")).toBe("branch-b");
    storeSelectedBranchId("global-admin", null);
    expect(getStoredSelectedBranchId("global-admin")).toBeNull();
  });

  it("clears branch context when the Admin has no selection", () => {
    const state = uiReducer(
      { sidebarOpen: true, toasts: [], selectedBranchId: "branch-a" },
      setSelectedBranchId(null),
    );
    expect(state.selectedBranchId).toBeNull();
  });

  it("only resolves real Mongo branch ids", () => {
    const branchId = "507f1f77bcf86cd799439011";
    expect(isValidBranchId(branchId)).toBe(true);
    expect(isValidBranchId("Test Branch - Main")).toBe(false);
    expect(resolveOperationalBranchId(null, branchId)).toBe(branchId);
    expect(resolveOperationalBranchId(null, "undefined")).toBeUndefined();
  });

  it("resolves cashier authority only from the assigned branch", () => {
    const assignedBranch = "507f1f77bcf86cd799439011";
    expect(resolveCashierBranchId(assignedBranch)).toBe(assignedBranch);
    expect(resolveCashierBranchId(null)).toBeUndefined();
    expect(resolveCashierBranchId("previous-admin-branch")).toBeUndefined();
  });
});
