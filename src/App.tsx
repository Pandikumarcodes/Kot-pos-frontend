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
import { notificationService } from "./services/notificationServices";
import { useToast } from "./Context/ToastContext";

export default function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, user } = useAppSelector((s) => s.auth);
  const [slowLoad, setSlowLoad] = useState(false);
  const toast = useToast();

  useEffect(() => {
    notificationService.setToast(toast);
  }, [toast]);

  useEffect(() => {
    if (isAuthenticated && user?.role) notificationService.connect(user.role);
    else notificationService.disconnect();
  }, [isAuthenticated, user?.role]);

  useEffect(() => {
    const controller = new AbortController();
    dispatch(setAuthLoading(true));
    const slowTimer = setTimeout(() => setSlowLoad(true), 5000);
    const maxTimer = setTimeout(() => {
      controller.abort();
      dispatch(clearCredentials());
      dispatch(setAuthLoading(false));
    }, 10000);

    api
      .get("/auth/me", {
        signal: controller.signal,
        headers: { "x-skip-refresh": "true" },
      })
      .then((res) => dispatch(setCredentials(res.data.user)))
      .catch((err) => {
        if (err.name !== "CanceledError" && err.name !== "AbortError")
          dispatch(clearCredentials());
      })
      .finally(() => {
        clearTimeout(slowTimer);
        clearTimeout(maxTimer);
        setSlowLoad(false);
        dispatch(setAuthLoading(false));
      });

    return () => {
      controller.abort();
      clearTimeout(slowTimer);
      clearTimeout(maxTimer);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.log(err);
    } finally {
      notificationService.disconnect();
      dispatch(clearCredentials());
      navigate("/login");
    }
  };

  if (isLoading)
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
            {/*
              pl-10 on mobile: offset content so it's not hidden under the
              fixed hamburger button (w-9 + left-3 = ~48px ≈ pl-12).
              md:pl-0: tablet icon-sidebar is in flow, no offset needed.
            */}
            <main className="flex-1 overflow-y-auto bg-kot-primary pl-12 md:pl-0">
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
