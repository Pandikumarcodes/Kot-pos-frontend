// src/App.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "./Store/hooks";
import {
  setCredentials,
  clearCredentials,
  setAuthLoading,
} from "./Store/Slices/authSlice";
import AppRouter from "./Router/AppRouter";
import Header from "./design-system/organisms/Header";
import Sidebar from "./design-system/organisms/Sidebar";

export default function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, user } = useAppSelector((s) => s.auth);

  // ── Boot: check if cookie session is valid ──
  useEffect(() => {
    dispatch(setAuthLoading(true)); // ✅ set loading BEFORE the request
    axios
      .get("http://localhost:3000/auth/me", { withCredentials: true })
      .then((res) => dispatch(setCredentials(res.data.user)))
      .catch(() => dispatch(clearCredentials()))
      .finally(() => dispatch(setAuthLoading(false))); // ✅ clear loading AFTER
  }, []);

  // ── Logout ──
  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/auth/logout",
        {},
        { withCredentials: true },
      );
    } catch {
      // clear anyway
    } finally {
      dispatch(clearCredentials());
      navigate("/login");
    }
  };

  // ── While checking session, show full-screen spinner ──
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-kot-primary">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-kot-dark border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      {isAuthenticated ? (
        <div className="flex flex-col min-h-screen">
          <Header
            userName={user?.name}
            userRole={user?.role}
            onLogout={handleLogout}
          />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto bg-kot-primary">
              <AppRouter />
            </main>
          </div>
        </div>
      ) : (
        <AppRouter />
      )}
    </>
  );
}
