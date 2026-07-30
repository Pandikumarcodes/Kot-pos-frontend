import { Navigate } from "react-router-dom";
import { useAppSelector } from "../state/hooks";
import { ROLE_HOME } from "../config/permissions";
import { LoadingScreen } from "../components/ui/LoadingScreen";
export default function RoleRedirect() {
  const { user, isAuthenticated, isLoading } = useAppSelector(
    (state) => state.auth,
  );

  if (isLoading) {
    return <LoadingScreen message="Checking your session..." />;
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <Navigate to={ROLE_HOME[user!.role] ?? "/login"} replace />;
}
