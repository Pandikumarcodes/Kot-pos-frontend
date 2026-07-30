import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../state/hooks";
import type { UserRole } from "../state/slices/authSlice";
import { ROLE_HOME } from "../config/permissions";
import { LoadingScreen } from "../components/ui/LoadingScreen";

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAppSelector(
    (state) => state.auth,
  );
  const location = useLocation();

  if (isLoading) {
    return <LoadingScreen message="Checking your session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user!.role)) {
    return <Navigate to={ROLE_HOME[user!.role] ?? "/login"} replace />;
  }

  return <Outlet />;
}

export function PublicRoute() {
  const { isAuthenticated, isLoading, user } = useAppSelector(
    (state) => state.auth,
  );

  if (isLoading) {
    return <LoadingScreen message="Checking your session..." />;
  }

  if (isAuthenticated && user) {
    return <Navigate to={ROLE_HOME[user.role] ?? "/admin/dashboard"} replace />;
  }

  return <Outlet />;
}
