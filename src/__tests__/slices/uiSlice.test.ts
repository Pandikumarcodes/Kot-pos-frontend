import { describe, expect, it } from "vitest";
import uiReducer, {
  setSelectedBranchId,
} from "../../state/slices/uiSlice";

describe("uiSlice operational branch", () => {
  it("stores and clears the selected operational branch without a default", () => {
    const initial = uiReducer(undefined, { type: "@@INIT" });
    expect(initial.selectedBranchId).toBeNull();

    const selected = uiReducer(
      initial,
      setSelectedBranchId("branch-selected"),
    );
    expect(selected.selectedBranchId).toBe("branch-selected");

    expect(
      uiReducer(selected, setSelectedBranchId(null)).selectedBranchId,
    ).toBeNull();
  });
});
