import { describe, expect, it } from "vitest";
import { shouldLoadAssignedBranch } from "../../design-system/organisms/sidebar.utils";

describe("sidebar assigned branch loading", () => {
  it("never loads branches for cashier users", () => {
    expect(shouldLoadAssignedBranch("cashier", false, "branch-1")).toBe(false);
    expect(shouldLoadAssignedBranch("cashier", false, null)).toBe(false);
  });

  it("preserves assigned-branch loading for non-cashier roles", () => {
    expect(shouldLoadAssignedBranch("manager", false, "branch-1")).toBe(true);
    expect(shouldLoadAssignedBranch("admin", true, null)).toBe(false);
  });
});
