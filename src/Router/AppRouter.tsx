import { BrowserRouter, Routes, Route } from "react-router-dom";
import TablesPage from "../pages/waiter/TablesPage";
import OrderPage from "../pages/waiter/OrdersPage";
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/waiter/tables" element={<TablesPage />} />
        <Route path="/waiter/order/:tableId" element={<OrderPage />} />
      </Routes>
    </BrowserRouter>
  );
}
