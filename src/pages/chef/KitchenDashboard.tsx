import { useState, useEffect } from "react";
import KOTCard from "../../design-system/organisms/KotCard";
import { RefreshCw } from "lucide-react";

type KOTStatus = "pending" | "preparing" | "ready" | "completed" | "cancelled";

interface KOTItem {
  id: string;
  name: string;
  quantity: number;
  note?: string;
}

interface KOT {
  id: string;
  kotNumber: string;
  tableNumber: string;
  items: KOTItem[];
  status: KOTStatus;
  orderTime: string;
  waiter: string;
  priority?: "high" | "normal" | "low";
}

// Mock data - replace with API call
const MOCK_KOTS: KOT[] = [
  {
    id: "1",
    kotNumber: "KOT-001",
    tableNumber: "T-02",
    items: [
      {
        id: "1",
        name: "Paneer Butter Masala",
        quantity: 2,
        note: "Less spicy",
      },
      { id: "2", name: "Garlic Naan", quantity: 4 },
    ],
    status: "pending",
    orderTime: new Date(Date.now() - 5 * 60000).toISOString(),
    waiter: "Raj",
    priority: "high",
  },
  {
    id: "2",
    kotNumber: "KOT-002",
    tableNumber: "T-05",
    items: [
      { id: "3", name: "Veg Fried Rice", quantity: 1 },
      { id: "4", name: "Spring Rolls", quantity: 2, note: "Extra crispy" },
    ],
    status: "preparing",
    orderTime: new Date(Date.now() - 15 * 60000).toISOString(),
    waiter: "Priya",
  },
  {
    id: "3",
    kotNumber: "KOT-003",
    tableNumber: "T-07",
    items: [
      { id: "5", name: "Dal Makhani", quantity: 2 },
      { id: "6", name: "Tandoori Roti", quantity: 6 },
    ],
    status: "preparing",
    orderTime: new Date(Date.now() - 20 * 60000).toISOString(),
    waiter: "Amit",
    priority: "high",
  },
  {
    id: "4",
    kotNumber: "KOT-004",
    tableNumber: "T-11",
    items: [
      { id: "7", name: "Paneer Tikka", quantity: 1 },
      { id: "8", name: "Gulab Jamun", quantity: 3 },
    ],
    status: "ready",
    orderTime: new Date(Date.now() - 25 * 60000).toISOString(),
    waiter: "Sita",
  },
  {
    id: "5",
    kotNumber: "KOT-005",
    tableNumber: "T-03",
    items: [{ id: "9", name: "Biryani", quantity: 2, note: "Extra raita" }],
    status: "completed",
    orderTime: new Date(Date.now() - 45 * 60000).toISOString(),
    waiter: "Raj",
  },
];

export default function KitchenDashboard() {
  const [kots, setKots] = useState<KOT[]>([]);
  const [activeTab, setActiveTab] = useState<KOTStatus | "all">("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  // Fetch KOTs function
  const fetchKOTs = async (showRefreshing = false) => {
    if (showRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    // ✅ real async boundary
    await delay(500);

    setKots(MOCK_KOTS);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchKOTs();
  }, []);

  const handleRefresh = () => {
    fetchKOTs(true);
  };

  // Filter KOTs by status
  const filteredKOTs =
    activeTab === "all" ? kots : kots.filter((kot) => kot.status === activeTab);

  // Sort by priority and time (high priority first, then oldest first)
  const sortedKOTs = [...filteredKOTs].sort((a, b) => {
    // Priority sorting
    const priorityOrder = { high: 0, normal: 1, low: 2 };
    const aPriority = priorityOrder[a.priority || "normal"];
    const bPriority = priorityOrder[b.priority || "normal"];

    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }

    // Time sorting (oldest first)
    return new Date(a.orderTime).getTime() - new Date(b.orderTime).getTime();
  });

  // Count by status
  const statusCounts = {
    all: kots.length,
    pending: kots.filter((k) => k.status === "pending").length,
    preparing: kots.filter((k) => k.status === "preparing").length,
    ready: kots.filter((k) => k.status === "ready").length,
    completed: kots.filter((k) => k.status === "completed").length,
    cancelled: kots.filter((k) => k.status === "cancelled").length,
  };

  // Handle status change
  const handleStatusChange = (kotId: string, newStatus: KOTStatus) => {
    // TODO: Replace with actual API call
    // await updateKOTStatus(kotId, newStatus);

    // Update local state
    setKots(
      kots.map((kot) =>
        kot.id === kotId ? { ...kot, status: newStatus } : kot
      )
    );

    // Show notification
    const kot = kots.find((k) => k.id === kotId);
    console.log(`KOT ${kot?.kotNumber} status changed to ${newStatus}`);
  };

  // Handle view details
  const handleViewDetails = (kot: KOT) => {
    console.log("View KOT details:", kot);
    // TODO: Open modal or navigate to details page
  };

  const tabs = [
    { value: "all" as const, label: "All", count: statusCounts.all },
    {
      value: "pending" as const,
      label: "Pending",
      count: statusCounts.pending,
    },
    {
      value: "preparing" as const,
      label: "Preparing",
      count: statusCounts.preparing,
    },
    { value: "ready" as const, label: "Ready", count: statusCounts.ready },
    {
      value: "completed" as const,
      label: "Completed",
      count: statusCounts.completed,
    },
  ];

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Kitchen Dashboard
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage kitchen orders in real-time
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-semibold px-4 py-2.5 rounded-lg transition-colors"
            >
              <RefreshCw
                size={20}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>

          {/* Status Tabs */}
          <div className="flex gap-2 flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.value
                    ? "bg-orange-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KOT Cards Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        {sortedKOTs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">🍳</span>
            </div>
            <p className="text-xl font-medium">No orders found</p>
            <p className="text-sm mt-2">
              {activeTab === "all"
                ? "All orders are completed"
                : `No ${activeTab} orders at the moment`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sortedKOTs.map((kot) => (
              <KOTCard
                key={kot.id}
                kot={kot}
                onStatusChange={handleStatusChange}
                onViewDetails={handleViewDetails}
                showActions={
                  kot.status !== "completed" && kot.status !== "cancelled"
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="bg-white border-t border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-medium text-gray-900">
              {sortedKOTs.length}
            </span>{" "}
            of <span className="font-medium text-gray-900">{kots.length}</span>{" "}
            orders
          </p>
          <div className="flex gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-gray-600">
                <span className="font-semibold text-gray-900">
                  {statusCounts.pending}
                </span>{" "}
                Pending
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span className="text-gray-600">
                <span className="font-semibold text-gray-900">
                  {statusCounts.preparing}
                </span>{" "}
                Preparing
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-gray-600">
                <span className="font-semibold text-gray-900">
                  {statusCounts.ready}
                </span>{" "}
                Ready
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
