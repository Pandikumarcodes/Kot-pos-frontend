// src/pages/chef/KitchenPage.tsx
import { useState, useEffect, useCallback } from "react";
import { RefreshCw, Clock, ChefHat } from "lucide-react";
import {
  getKotOrdersApi,
  startKotApi,
  markKotReadyApi,
  cancelKotApi,
} from "../../services/chefApi/chef.api";
import type { Kot, KotStatus } from "../../services/chefApi/chef.api";

// ── Status config ─────────────────────────────────────────────
const STATUS_CONFIG: Record<
  KotStatus,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  pending: {
    label: "Pending",
    bg: "bg-yellow-50",
    text: "text-yellow-800",
    border: "border-yellow-400",
    dot: "bg-yellow-400",
  },
  preparing: {
    label: "Preparing",
    bg: "bg-orange-50",
    text: "text-orange-800",
    border: "border-orange-400",
    dot: "bg-orange-400",
  },
  ready: {
    label: "Ready",
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    border: "border-emerald-400",
    dot: "bg-emerald-500",
  },
  served: {
    label: "Served",
    bg: "bg-kot-stats",
    text: "text-kot-darker",
    border: "border-kot-dark",
    dot: "bg-kot-dark",
  },
  cancelled: {
    label: "Cancelled",
    bg: "bg-red-50",
    text: "text-red-800",
    border: "border-red-400",
    dot: "bg-red-400",
  },
};

function formatTime(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  const h = Math.floor(diff / 3600);
  const m = Math.floor((diff % 3600) / 60);
  return h > 0 ? `${h}h ${m}m ago` : m > 0 ? `${m}m ago` : "Just now";
}

function isUrgent(iso: string): boolean {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000 / 60);
  return diff >= 15;
}

type TabFilter = KotStatus | "all";

export default function KitchenPage() {
  const [kots, setKots] = useState<Kot[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [, setTick] = useState(0);

  // ── Tick every minute to update "X min ago" ────────────────
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  // ── Fetch KOTs ─────────────────────────────────────────────
  const fetchKots = useCallback(async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      const res = await getKotOrdersApi();
      setKots(res.data.KotOrders);
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } } };
      setError(e?.response?.data?.error || "Failed to load orders");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchKots();
  }, [fetchKots]);

  // ── Auto refresh every 30 seconds ─────────────────────────
  useEffect(() => {
    const id = setInterval(() => fetchKots(true), 30_000);
    return () => clearInterval(id);
  }, [fetchKots]);

  // ── Status actions ─────────────────────────────────────────
  const handleStart = async (kotId: string) => {
    try {
      setUpdatingId(kotId);
      const res = await startKotApi(kotId);
      setKots(kots.map((k) => (k._id === kotId ? res.data.order : k)));
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } } };
      alert(e?.response?.data?.error || "Failed to update");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleReady = async (kotId: string) => {
    try {
      setUpdatingId(kotId);
      const res = await markKotReadyApi(kotId);
      setKots(kots.map((k) => (k._id === kotId ? res.data.order : k)));
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } } };
      alert(e?.response?.data?.error || "Failed to update");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCancel = async (kotId: string) => {
    if (!window.confirm("Cancel this order?")) return;
    try {
      setUpdatingId(kotId);
      const res = await cancelKotApi(kotId);
      setKots(kots.map((k) => (k._id === kotId ? res.data.order : k)));
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } } };
      alert(e?.response?.data?.error || "Failed to cancel");
    } finally {
      setUpdatingId(null);
    }
  };

  // ── Filter & counts ────────────────────────────────────────
  const filtered =
    activeTab === "all" ? kots : kots.filter((k) => k.status === activeTab);
  const sorted = [...filtered].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  const counts = {
    all: kots.length,
    pending: kots.filter((k) => k.status === "pending").length,
    preparing: kots.filter((k) => k.status === "preparing").length,
    ready: kots.filter((k) => k.status === "ready").length,
    served: kots.filter((k) => k.status === "served").length,
    cancelled: kots.filter((k) => k.status === "cancelled").length,
  };

  const tabs: { value: TabFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "preparing", label: "Preparing" },
    { value: "ready", label: "Ready" },
    { value: "served", label: "Served" },
  ];

  // ── Loading ────────────────────────────────────────────────
  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-kot-primary">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-kot-dark border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-kot-text">Loading orders...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="h-screen flex items-center justify-center bg-kot-primary">
        <div className="text-center">
          <p className="text-red-600 font-medium mb-3">{error}</p>
          <button
            onClick={() => fetchKots()}
            className="px-4 py-2 bg-kot-dark text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-kot-primary">
      <div className="p-4 md:p-6 max-w-[1600px] mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-kot-dark flex items-center justify-center">
              <ChefHat size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-kot-darker">
                Kitchen Display
              </h1>
              <p className="text-sm text-kot-text mt-0.5">
                {counts.pending} pending · {counts.preparing} preparing ·{" "}
                {counts.ready} ready
                {refreshing && (
                  <span className="ml-2 text-kot-dark">· Refreshing...</span>
                )}
              </p>
            </div>
          </div>
          <button
            onClick={() => fetchKots(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-kot-chart text-kot-dark bg-kot-white hover:bg-kot-light transition-all disabled:opacity-50"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {[
            { label: "Pending", count: counts.pending, dot: "bg-yellow-400" },
            {
              label: "Preparing",
              count: counts.preparing,
              dot: "bg-orange-400",
            },
            { label: "Ready", count: counts.ready, dot: "bg-emerald-500" },
            { label: "Served", count: counts.served, dot: "bg-kot-dark" },
            { label: "Cancelled", count: counts.cancelled, dot: "bg-red-400" },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-kot-white rounded-2xl px-4 py-3 flex items-center gap-3 shadow-kot"
            >
              <div
                className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${s.dot}`}
              />
              <div>
                <p className="text-xl font-bold text-kot-darker">{s.count}</p>
                <p className="text-xs text-kot-text">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-kot-white rounded-2xl p-1.5 flex gap-1 w-fit shadow-kot flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.value
                  ? "bg-kot-dark text-white"
                  : "text-kot-text hover:bg-kot-light"
              }`}
            >
              {tab.label} ({counts[tab.value as keyof typeof counts]})
            </button>
          ))}
        </div>

        {/* KOT Cards */}
        {sorted.length === 0 ? (
          <div className="bg-kot-white rounded-2xl p-16 text-center shadow-kot">
            <p className="text-5xl mb-4">🍳</p>
            <p className="text-xl font-bold text-kot-darker">No orders</p>
            <p className="text-sm text-kot-text mt-1">
              {activeTab === "all"
                ? "All orders completed!"
                : `No ${activeTab} orders right now`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sorted.map((kot) => {
              const cfg = STATUS_CONFIG[kot.status];
              const urgent =
                isUrgent(kot.createdAt) && kot.status === "pending";
              const isUpdating = updatingId === kot._id;

              return (
                <div
                  key={kot._id}
                  className={`bg-kot-white rounded-2xl shadow-kot border-l-4 ${cfg.border} overflow-hidden transition-all ${urgent ? "ring-2 ring-red-400 ring-offset-2" : ""}`}
                >
                  {/* Card Header */}
                  <div
                    className={`px-4 py-3 flex items-center justify-between ${cfg.bg}`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-kot-darker text-sm">
                          {kot.orderType === "dine-in"
                            ? `Table ${kot.tableNumber}`
                            : "🥡 Takeaway"}
                        </span>
                        {urgent && (
                          <span className="text-[10px] px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-bold animate-pulse">
                            URGENT
                          </span>
                        )}
                      </div>
                      {kot.customerName && (
                        <p className="text-xs text-kot-text mt-0.5">
                          {kot.customerName}
                        </p>
                      )}
                    </div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold ${cfg.bg} ${cfg.text} border ${cfg.border}`}
                    >
                      {cfg.label}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="px-4 py-3 space-y-2">
                    {kot.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-kot-dark text-white text-xs flex items-center justify-center font-bold flex-shrink-0">
                            {item.quantity}
                          </span>
                          <span className="text-sm font-medium text-kot-darker">
                            {item.name}
                          </span>
                        </div>
                        <span className="text-xs text-kot-text">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="px-4 pb-3 pt-1 border-t border-kot-chart">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1 text-xs text-kot-text">
                        <Clock size={12} />
                        {formatTime(kot.createdAt)}
                      </div>
                      <span className="text-sm font-bold text-kot-darker">
                        ₹{kot.totalAmount}
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2">
                      {kot.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleStart(kot._id)}
                            disabled={isUpdating}
                            className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50"
                          >
                            {isUpdating ? "..." : "Start Cooking 🔥"}
                          </button>
                          <button
                            onClick={() => handleCancel(kot._id)}
                            disabled={isUpdating}
                            className="py-2 px-3 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg transition-colors disabled:opacity-50"
                          >
                            ✕
                          </button>
                        </>
                      )}
                      {kot.status === "preparing" && (
                        <button
                          onClick={() => handleReady(kot._id)}
                          disabled={isUpdating}
                          className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50"
                        >
                          {isUpdating ? "..." : "Mark Ready ✓"}
                        </button>
                      )}
                      {kot.status === "ready" && (
                        <div className="flex-1 py-2 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg text-center border border-emerald-200">
                          ✅ Ready for pickup
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
