import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminDashboard } from "./pages/admin/AdminDashboard";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
