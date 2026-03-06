// src/hooks/usePermission.ts
import { useAppSelector } from "../Store/hooks";
import { hasPermission, ROLE_HOME } from "../config/Permission";
import type { Role, FeatureKey } from "../config/Permission";
export const usePermission = () => {
  const { user } = useAppSelector((state) => state.auth);
  const role = user?.role as Role | undefined;

  return {
    // Current role
    role,

    // Role checks
    isAdmin: role === "admin",
    isManager: role === "manager",
    isWaiter: role === "waiter",
    isChef: role === "chef",
    isCashier: role === "cashier",

    // Check any feature permission
    can: (feature: FeatureKey): boolean => {
      if (!role) return false;
      return hasPermission(role, feature);
    },

    // Check if role is one of the given roles
    isOneOf: (...roles: Role[]): boolean => {
      if (!role) return false;
      return roles.includes(role);
    },

    // Home page for current role
    homeRoute: role ? ROLE_HOME[role] : "/login",
  };
};
