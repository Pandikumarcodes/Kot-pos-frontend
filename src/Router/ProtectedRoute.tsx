// src/Router/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../Store/hooks";
import type { UserRole } from "../Store/Slices/authSlice";

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
}

const ROLE_HOME: Record<string, string> = {
  admin: "/admin/dashboard",
  cashier: "/cashier/billing",
  waiter: "/waiter/tables",
  chef: "/chef/kot",
};

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAppSelector(
    (state) => state.auth,
  );
  const location = useLocation();

  // ── Still checking auth cookie ──
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-kot-primary">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-kot-dark border-t-transparent" />
      </div>
    );
  }

  // ── Not logged in → go to login ──
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ── Wrong role → redirect to their own home, not /unauthorized ──
  if (!allowedRoles.includes(user!.role)) {
    return <Navigate to={ROLE_HOME[user!.role] ?? "/login"} replace />;
  }

  return <Outlet />;
}
