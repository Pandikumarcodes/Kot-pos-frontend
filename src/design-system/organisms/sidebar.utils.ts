import type { Role } from "../../config/permissions";

export const shouldLoadAssignedBranch = (
  role: Role | undefined,
  isSuperAdmin: boolean,
  branchId: string | null | undefined,
) => Boolean(!isSuperAdmin && role !== "cashier" && branchId);
