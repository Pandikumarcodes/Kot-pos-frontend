// src/Router/RoleRedirect.tsx
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../Store/hooks";

const ROLE_HOME: Record<string, string> = {
  admin: "/admin/dashboard",
  cashier: "/cashier/billing",
  waiter: "/waiter/tables",
  chef: "/chef/kot",
};

export default function RoleRedirect() {
  const { user, isAuthenticated, isLoading } = useAppSelector(
    (state) => state.auth,
  );

  // ── Still checking auth cookie → show spinner, not null ──
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-kot-primary">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-kot-dark border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <Navigate to={ROLE_HOME[user!.role] ?? "/login"} replace />;
}
