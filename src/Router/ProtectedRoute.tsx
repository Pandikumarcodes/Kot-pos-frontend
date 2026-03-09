// src/Router/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../Store/hooks";
import type { UserRole } from "../Store/Slices/authSlice";

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
}

const ROLE_HOME: Record<string, string> = {
  admin: "/admin/dashboard",
  manager: "/admin/dashboard",
  cashier: "/cashier/billing",
  waiter: "/waiter/tables",
  chef: "/chef/kot",
};

// ✅ Private Route — must be logged in + correct role
export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAppSelector(
    (state) => state.auth,
  );
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-kot-primary">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-kot-dark border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user!.role)) {
    return <Navigate to={ROLE_HOME[user!.role] ?? "/login"} replace />;
  }

  return <Outlet />;
}

// ✅ Public Route — if already logged in, redirect to their dashboard
export function PublicRoute() {
  const { isAuthenticated, isLoading, user } = useAppSelector(
    (state) => state.auth,
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-kot-primary">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-kot-dark border-t-transparent" />
      </div>
    );
  }

  // ✅ Already logged in → go to their home page
  if (isAuthenticated && user) {
    return <Navigate to={ROLE_HOME[user.role] ?? "/admin/dashboard"} replace />;
  }

  return <Outlet />;
}
