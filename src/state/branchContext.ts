const STORAGE_PREFIX = "kot-pos:selected-branch:";

export const isValidBranchId = (value: unknown): value is string =>
  typeof value === "string" && /^[a-f\d]{24}$/i.test(value);

export const resolveOperationalBranchId = (
  assignedBranchId: unknown,
  selectedBranchId: unknown,
): string | undefined => {
  if (isValidBranchId(assignedBranchId)) return assignedBranchId;
  return isValidBranchId(selectedBranchId) ? selectedBranchId : undefined;
};

export const resolveCashierBranchId = (assignedBranchId: unknown): string | undefined =>
  isValidBranchId(assignedBranchId) ? assignedBranchId : undefined;

function storageKey(userId: string) {
  return `${STORAGE_PREFIX}${userId}`;
}

export function getStoredSelectedBranchId(userId: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(storageKey(userId));
  } catch {
    return null;
  }
}

export function storeSelectedBranchId(
  userId: string,
  branchId: string | null,
): void {
  if (typeof window === "undefined") return;
  try {
    if (branchId) window.localStorage.setItem(storageKey(userId), branchId);
    else window.localStorage.removeItem(storageKey(userId));
  } catch {
    // Persistence is best effort; in-memory Redux state remains authoritative.
  }
}
