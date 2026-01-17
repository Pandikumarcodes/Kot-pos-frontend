import { useState, useEffect } from "react";
import BillingPanel from "../../design-system/organisms/BillingPanel";
import { Search, Eye } from "lucide-react";

interface BillItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

interface Order {
  id: string;
  kotNumber: string;
  tableNumber: string;
  items: BillItem[];
  status: "ready" | "billed" | "paid";
  orderTime: string;
  waiter: string;
}

interface PaymentDetails {
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  method: string;
  amountReceived?: number;
  change?: number;
}

// Mock data - replace with API call
const MOCK_ORDERS: Order[] = [
  {
    id: "1",
    kotNumber: "KOT-001",
    tableNumber: "T-02",
    items: [
      {
        id: "1",
        name: "Paneer Butter Masala",
        quantity: 2,
        price: 220,
        total: 440,
      },
      { id: "2", name: "Garlic Naan", quantity: 4, price: 45, total: 180 },
    ],
    status: "ready",
    orderTime: "12:30 PM",
    waiter: "Raj",
  },
  {
    id: "2",
    kotNumber: "KOT-004",
    tableNumber: "T-11",
    items: [
      { id: "3", name: "Paneer Tikka", quantity: 1, price: 200, total: 200 },
      { id: "4", name: "Gulab Jamun", quantity: 3, price: 80, total: 240 },
    ],
    status: "ready",
    orderTime: "1:15 PM",
    waiter: "Sita",
  },
  {
    id: "3",
    kotNumber: "KOT-005",
    tableNumber: "T-03",
    items: [{ id: "5", name: "Biryani", quantity: 2, price: 250, total: 500 }],
    status: "billed",
    orderTime: "11:45 AM",
    waiter: "Raj",
  },
];

export default function BillingPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Fetch orders on mount
  useEffect(() => {
    // TODO: Replace with actual API call
    // fetchReadyOrders().then(data => setOrders(data));

    // Simulate API call
    setTimeout(() => {
      setOrders(MOCK_ORDERS);
      setLoading(false);
    }, 500);
  }, []);

  // Filter orders by search query
  const filteredOrders = searchQuery
    ? orders.filter(
        (order) =>
          order.tableNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.kotNumber.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : orders;

  // Handle order selection
  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
  };

  // Handle generate bill
  const handleGenerateBill = async (payment: PaymentDetails) => {
    if (!selectedOrder) return;

    // TODO: Replace with actual API call
    // await generateBill(selectedOrder.id, payment);

    console.log("Generate Bill:", {
      order: selectedOrder,
      payment,
    });

    // Show success message
    alert(
      `Bill generated successfully!\n\nInvoice: INV-${
        selectedOrder.kotNumber
      }\nTable: ${selectedOrder.tableNumber}\nTotal: ₹${payment.total.toFixed(
        2
      )}`
    );

    // Update order status
    setOrders(
      orders.map((order) =>
        order.id === selectedOrder.id
          ? { ...order, status: "billed" as const }
          : order
      )
    );

    // Clear selection
    setSelectedOrder(null);
  };

  // Handle print bill
  const handlePrintBill = () => {
    if (!selectedOrder) return;

    console.log("Print Bill:", selectedOrder);

    // TODO: Implement actual print functionality
    alert(`Printing bill for ${selectedOrder.tableNumber}...`);
  };

  // Get status badge color
  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "ready":
        return "bg-blue-100 text-blue-700";
      case "billed":
        return "bg-green-100 text-green-700";
      case "paid":
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Left Side - Orders List */}
      <div className="flex-1 flex flex-col border-r border-gray-200 bg-white">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Billing</h1>

          {/* Search Bar */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by table or KOT number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Orders List */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Search size={64} className="mb-4 text-gray-300" />
              <p className="text-xl font-medium">No orders found</p>
              <p className="text-sm mt-2">Try adjusting your search</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredOrders.map((order) => (
                <button
                  key={order.id}
                  onClick={() => handleSelectOrder(order)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedOrder?.id === order.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">
                        {order.tableNumber}
                      </h3>
                      <p className="text-sm text-gray-500">{order.kotNumber}</p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusBadge(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600 mb-2">
                    {order.items.length} items • {order.orderTime}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Waiter: {order.waiter}
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      ₹{order.items.reduce((sum, item) => sum + item.total, 0)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-500">
            <span className="font-medium text-gray-900">
              {filteredOrders.length}
            </span>{" "}
            orders ready for billing
          </p>
        </div>
      </div>

      {/* Right Side - Billing Panel */}
      <div className="w-96">
        {selectedOrder ? (
          <BillingPanel
            billNumber={`INV-${selectedOrder.kotNumber}`}
            tableNumber={selectedOrder.tableNumber}
            items={selectedOrder.items}
            onGenerateBill={handleGenerateBill}
            onPrintBill={handlePrintBill}
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-white p-8">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Eye size={48} className="text-gray-300" />
            </div>
            <p className="text-lg font-medium text-center">Select an order</p>
            <p className="text-sm mt-2 text-center">
              Choose an order from the left to generate a bill
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
