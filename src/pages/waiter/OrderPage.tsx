// src/pages/waiter/OrderPage.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../../Store/hooks";
import api from "../../services/apiClient";
import { createOrderApi } from "../../services/waiterApi/waiter.api";

interface MenuItem {
  _id: string;
  ItemName: string;
  price: number;
  category: string;
  available: boolean;
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  note: string;
}

interface Table {
  _id: string;
  tableNumber: number;
  capacity: number;
  status: string;
}

export default function OrderPage() {
  const { tableId } = useParams<{ tableId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);

  // ✅ Read customerName passed from TablesPage after allocation
  const customerName =
    (location.state as { customerName?: string })?.customerName || "Walk-in";

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [table, setTable] = useState<Table | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [menuRes, tableRes] = await Promise.all([
          api.get<{ menuItems: MenuItem[] }>("/admin/menuItems"),
          api.get<{ table: Table }>(`/admin/tables/${tableId}`),
        ]);
        setMenuItems(menuRes.data.menuItems.filter((i) => i.available));
        setTable(tableRes.data.table);
      } catch (err) {
        const e = err as { response?: { data?: { error?: string } } };
        setError(e?.response?.data?.error || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    if (tableId) fetchData();
  }, [tableId]);

  const categories = [
    "All",
    ...Array.from(new Set(menuItems.map((i) => i.category))),
  ];
  const filteredItems =
    selectedCategory === "All"
      ? menuItems
      : menuItems.filter((i) => i.category === selectedCategory);

  const handleAddToOrder = (item: MenuItem) => {
    const existing = orderItems.find((oi) => oi.id === item._id);
    if (existing) {
      setOrderItems(
        orderItems.map((oi) =>
          oi.id === item._id ? { ...oi, quantity: oi.quantity + 1 } : oi,
        ),
      );
    } else {
      setOrderItems([
        ...orderItems,
        {
          id: item._id,
          name: item.ItemName,
          price: item.price,
          quantity: 1,
          note: "",
        },
      ]);
    }
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setOrderItems(orderItems.filter((item) => item.id !== id));
    } else {
      setOrderItems(
        orderItems.map((item) =>
          item.id === id ? { ...item, quantity } : item,
        ),
      );
    }
  };

  const handleUpdateNote = (id: string, note: string) => {
    setOrderItems(
      orderItems.map((item) => (item.id === id ? { ...item, note } : item)),
    );
  };

  const handleRemoveItem = (id: string) => {
    setOrderItems(orderItems.filter((item) => item.id !== id));
  };

  const handleClearOrder = () => {
    if (window.confirm("Clear the entire order?")) setOrderItems([]);
  };

  const handleSendToKitchen = async () => {
    if (orderItems.length === 0) {
      alert("Please add items first!");
      return;
    }
    try {
      setSending(true);

      // ✅ Step 1 — Create order
      const res = await createOrderApi({
        tableId: tableId!,
        tableNumber: table?.tableNumber,
        customerName,
        items: orderItems.map((item) => ({
          itemId: item.id,
          quantity: item.quantity,
        })),
      });

      // ✅ Step 2 — Send to kitchen (creates KOT entry for chef)
      await api.put(`/waiter/orders/${res.data.order._id}/send`);

      alert("Order sent to kitchen successfully!");
      navigate("/waiter/tables");
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } } };
      alert(e?.response?.data?.error || "Failed to send order");
    } finally {
      setSending(false);
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-kot-primary">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-kot-dark border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-kot-text">Loading menu...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="h-screen flex items-center justify-center bg-kot-primary">
        <div className="text-center">
          <p className="text-red-600 font-medium mb-3">{error}</p>
          <button
            onClick={() => navigate("/waiter/tables")}
            className="px-4 py-2 bg-kot-dark text-white rounded-lg hover:bg-kot-darker"
          >
            Back to Tables
          </button>
        </div>
      </div>
    );

  const total = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className="h-screen flex flex-col bg-kot-primary">
      {/* Top bar */}
      <div className="bg-kot-white border-b border-kot-chart shadow-kot px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/waiter/tables")}
            className="p-2 rounded-lg text-kot-text hover:bg-kot-light transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div>
            <h1 className="text-lg font-bold text-kot-darker">
              Table {table?.tableNumber ?? tableId}
            </h1>
            {/* ✅ Shows real customer name */}
            <p className="text-xs text-kot-text">
              {customerName} · {user?.name}
            </p>
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-1 overflow-x-auto max-w-xl">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? "bg-kot-dark text-white"
                  : "text-kot-text hover:bg-kot-light hover:text-kot-darker"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Menu Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredItems.length === 0 ? (
            <div className="flex items-center justify-center h-full text-kot-text">
              <p>No items in this category</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredItems.map((item) => {
                const inOrder = orderItems.find((oi) => oi.id === item._id);
                return (
                  <button
                    key={item._id}
                    onClick={() => handleAddToOrder(item)}
                    className="bg-kot-white rounded-xl p-4 text-left shadow-kot hover:shadow-kot-lg border border-kot-chart hover:border-kot-dark transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-kot-light text-kot-dark font-medium capitalize">
                        {item.category}
                      </span>
                      {inOrder && (
                        <span className="w-6 h-6 rounded-full bg-kot-dark text-white text-xs flex items-center justify-center font-bold">
                          {inOrder.quantity}
                        </span>
                      )}
                    </div>
                    <p className="font-semibold text-kot-darker text-sm mt-2 leading-tight">
                      {item.ItemName}
                    </p>
                    <p className="text-kot-dark font-bold mt-1">
                      ₹{item.price}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Order Summary Panel */}
        <div className="w-80 border-l border-kot-chart bg-kot-white flex flex-col flex-shrink-0">
          <div className="p-4 border-b border-kot-chart bg-kot-light">
            <h2 className="font-bold text-kot-darker">
              Order — Table {table?.tableNumber}
            </h2>
            {/* ✅ Shows customer name in panel header */}
            <p className="text-xs text-kot-text mt-0.5">
              {customerName} · {orderItems.length} items
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {orderItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-kot-text gap-2">
                <p className="text-4xl">🍽️</p>
                <p className="text-sm font-medium">No items added yet</p>
                <p className="text-xs">Tap menu items to add</p>
              </div>
            ) : (
              orderItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-kot-light rounded-lg p-3 border border-kot-chart"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-kot-darker flex-1 truncate">
                      {item.name}
                    </p>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-400 hover:text-red-600 ml-2 text-xs font-bold"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-7 h-7 rounded-full bg-kot-white border-2 border-kot-chart text-kot-darker font-bold flex items-center justify-center hover:bg-kot-stats"
                      >
                        −
                      </button>
                      <span className="text-sm font-bold text-kot-darker w-5 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-7 h-7 rounded-full bg-kot-white border-2 border-kot-chart text-kot-darker font-bold flex items-center justify-center hover:bg-kot-stats"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-sm font-bold text-kot-dark">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                  <input
                    type="text"
                    placeholder="Add note (e.g. less spicy)..."
                    value={item.note}
                    onChange={(e) => handleUpdateNote(item.id, e.target.value)}
                    className="w-full mt-2 px-2 py-1.5 text-xs border border-kot-chart rounded-lg bg-kot-white text-kot-darker placeholder:text-kot-text/50 focus:outline-none focus:border-kot-dark"
                  />
                </div>
              ))
            )}
          </div>

          {orderItems.length > 0 && (
            <div className="p-4 border-t border-kot-chart space-y-3 bg-kot-white">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-kot-darker">Total</span>
                <span className="text-xl font-bold text-kot-darker">
                  ₹{total.toFixed(2)}
                </span>
              </div>
              <button
                onClick={handleClearOrder}
                className="w-full py-2 border-2 border-kot-chart text-kot-text rounded-lg text-sm hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
              >
                Clear Order
              </button>
              <button
                onClick={handleSendToKitchen}
                disabled={sending}
                className="w-full py-2.5 bg-kot-dark hover:bg-kot-darker text-white font-bold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {sending ? "Sending..." : "Send to Kitchen 🍳"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
