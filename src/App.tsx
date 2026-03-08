// src/App.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./Store/hooks";
import {
  setCredentials,
  clearCredentials,
  setAuthLoading,
} from "./Store/Slices/authSlice";
import AppRouter from "./Router/AppRouter";
import Header from "./design-system/organisms/Header";
import Sidebar from "./design-system/organisms/Sidebar";
import api from "./services/apiClient";

export default function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, user } = useAppSelector((s) => s.auth);
  const [slowLoad, setSlowLoad] = useState(false);

  // ── Boot: check if cookie session is valid ──
  useEffect(() => {
    dispatch(setAuthLoading(true));

    // ✅ Show message if server takes more than 5 seconds (Render cold start)
    const slowTimer = setTimeout(() => setSlowLoad(true), 5000);

    api
      .get("/auth/me")
      .then((res) => dispatch(setCredentials(res.data.user)))
      .catch(() => dispatch(clearCredentials()))
      .finally(() => {
        clearTimeout(slowTimer);
        setSlowLoad(false);
        dispatch(setAuthLoading(false));
      });

    return () => clearTimeout(slowTimer);
  }, []);

  // ── Logout ──
  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-kot-primary gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-kot-dark">
            <span className="text-white font-bold text-sm">K</span>
          </div>
          <span className="font-bold text-xl text-kot-darker">KOT POS</span>
        </div>
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-kot-dark border-t-transparent" />
        {slowLoad && (
          <div className="text-center">
            <p className="text-sm text-kot-text animate-pulse">
              Starting server, please wait...
            </p>
            <p className="text-xs text-kot-text/60 mt-1">
              This may take up to 30 seconds
            </p>
          </div>
        )}
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
