import { useState, useEffect, useCallback } from "react";
import { RefreshCw, Clock, ChefHat, Wifi, WifiOff } from "lucide-react";
import {
  getKotOrdersApi,
  startKotApi,
  markKotReadyApi,
  cancelKotApi,
} from "../../services/chefApi/chef.api";
import type { Kot, KotStatus } from "../../services/chefApi/chef.api";
import { useToast } from "../../Context/ToastContext";
import { useNotifications } from "../../hooks/useNotifications";
import type { KotPayload } from "../../services/notificationServices";

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
  const h = Math.floor(diff / 3600),
    m = Math.floor((diff % 3600) / 60);
  return h > 0 ? `${h}h ${m}m ago` : m > 0 ? `${m}m ago` : "Just now";
}
function isUrgent(iso: string) {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 60000) >= 15;
}

const Pulse = ({ className }: { className: string }) => (
  <div className={`bg-kot-chart rounded animate-pulse ${className}`} />
);

function SkeletonStats() {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="bg-kot-white rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3 flex items-center gap-2 shadow-kot"
        >
          <Pulse className="w-2.5 h-2.5 rounded-full flex-shrink-0" />
          <div className="space-y-1.5">
            <Pulse className="h-5 w-5" />
            <Pulse className="h-2 w-12" />
          </div>
        </div>
      ))}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-kot-white rounded-2xl shadow-kot border-l-4 border-kot-chart overflow-hidden">
      <div className="px-4 py-3 bg-kot-light flex items-center justify-between">
        <div className="space-y-1.5">
          <Pulse className="h-4 w-24" />
          <Pulse className="h-3 w-16" />
        </div>
        <Pulse className="h-6 w-16 rounded-full" />
      </div>
      <div className="px-4 py-3 space-y-2.5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Pulse className="w-6 h-6 rounded-full" />
              <Pulse className="h-3 w-28" />
            </div>
            <Pulse className="h-3 w-10" />
          </div>
        ))}
      </div>
      <div className="px-4 pb-4 flex gap-2">
        <Pulse className="flex-1 h-9 rounded-xl" />
        <Pulse className="w-10 h-9 rounded-xl" />
      </div>
    </div>
  );
}

type TabFilter = KotStatus | "all";

export default function KitchenPage() {
  const toast = useToast();
  const [kots, setKots] = useState<Kot[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(id);
  }, []);

  const fetchKots = useCallback(async (showRefresh = false) => {
    try {
      if (showRefresh) setRefreshing(true);
      else setLoading(true);
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

  const isConnected = useNotifications({
    "order:new": (kot: KotPayload) =>
      setKots((prev) =>
        prev.some((k) => k._id === kot._id)
          ? prev
          : [kot as unknown as Kot, ...prev],
      ),
    "kot:updated": (kot: KotPayload) =>
      setKots((prev) =>
        prev.map((k) => (k._id === kot._id ? (kot as unknown as Kot) : k)),
      ),
  });

  const handleStart = async (id: string) => {
    try {
      setUpdatingId(id);
      const r = await startKotApi(id);
      setKots(kots.map((k) => (k._id === id ? r.data.order : k)));
      toast.success("Cooking started! 🔥");
    } catch (e: unknown) {
      toast.error(
        (e as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || "Failed",
      );
    } finally {
      setUpdatingId(null);
    }
  };
  const handleReady = async (id: string) => {
    try {
      setUpdatingId(id);
      const r = await markKotReadyApi(id);
      setKots(kots.map((k) => (k._id === id ? r.data.order : k)));
      toast.success("Order ready! ✅");
    } catch (e: unknown) {
      toast.error(
        (e as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || "Failed",
      );
    } finally {
      setUpdatingId(null);
    }
  };
  const handleCancel = async (id: string) => {
    if (!window.confirm("Cancel?")) return;
    try {
      setUpdatingId(id);
      const r = await cancelKotApi(id);
      setKots(kots.map((k) => (k._id === id ? r.data.order : k)));
      toast.info("Cancelled");
    } catch (e: unknown) {
      toast.error(
        (e as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || "Failed",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const counts = {
    all: kots.length,
    pending: kots.filter((k) => k.status === "pending").length,
    preparing: kots.filter((k) => k.status === "preparing").length,
    ready: kots.filter((k) => k.status === "ready").length,
    served: kots.filter((k) => k.status === "served").length,
    cancelled: kots.filter((k) => k.status === "cancelled").length,
  };
  const filtered =
    activeTab === "all" ? kots : kots.filter((k) => k.status === activeTab);
  const sorted = [...filtered].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
  const tabs: { value: TabFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "preparing", label: "Preparing" },
    { value: "ready", label: "Ready" },
    { value: "served", label: "Served" },
  ];

  if (error)
    return (
      <div className="h-screen flex items-center justify-center bg-kot-primary px-4">
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
      <div className="p-3 sm:p-4 lg:p-6 xl:p-8 max-w-[2400px] mx-auto space-y-3 sm:space-y-4 lg:space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl bg-kot-dark flex items-center justify-center flex-shrink-0">
              <ChefHat size={18} className="text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl lg:text-2xl xl:text-3xl font-bold text-kot-darker truncate">
                Kitchen Display
              </h1>
              <p className="text-[10px] sm:text-xs lg:text-sm text-kot-text mt-0.5">
                {counts.pending} pending · {counts.preparing} preparing ·{" "}
                {counts.ready} ready
                {refreshing && (
                  <span className="ml-1 text-kot-dark"> · Refreshing...</span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <div
              className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl text-xs font-semibold border-2 ${isConnected ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-600 border-red-200"}`}
            >
              {isConnected ? <Wifi size={12} /> : <WifiOff size={12} />}
              <span className="hidden sm:inline">
                {isConnected ? "Live" : "Offline"}
              </span>
            </div>
            <button
              onClick={() => fetchKots(true)}
              disabled={refreshing}
              className="flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl border-2 border-kot-chart text-kot-dark bg-kot-white hover:bg-kot-light transition-all disabled:opacity-50 text-xs sm:text-sm"
            >
              <RefreshCw
                size={13}
                className={refreshing ? "animate-spin" : ""}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        {loading ? (
          <SkeletonStats />
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3">
            {[
              { label: "Pending", count: counts.pending, dot: "bg-yellow-400" },
              {
                label: "Preparing",
                count: counts.preparing,
                dot: "bg-orange-400",
              },
              { label: "Ready", count: counts.ready, dot: "bg-emerald-500" },
              { label: "Served", count: counts.served, dot: "bg-kot-dark" },
              {
                label: "Cancelled",
                count: counts.cancelled,
                dot: "bg-red-400",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-kot-white rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3 lg:px-5 lg:py-4 flex items-center gap-2 sm:gap-3 shadow-kot"
              >
                <div
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 rounded-full flex-shrink-0 ${s.dot}`}
                />
                <div>
                  <p className="text-base sm:text-xl lg:text-2xl font-bold text-kot-darker leading-none">
                    {s.count}
                  </p>
                  <p className="text-[9px] sm:text-xs lg:text-sm text-kot-text mt-0.5">
                    {s.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-kot-white rounded-2xl p-1 sm:p-1.5 flex gap-1 shadow-kot overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-2.5 py-1.5 sm:px-4 sm:py-2 lg:px-5 lg:py-2.5 rounded-xl text-[11px] sm:text-sm lg:text-base font-medium transition-all whitespace-nowrap flex-shrink-0 ${activeTab === tab.value ? "bg-kot-dark text-white" : "text-kot-text hover:bg-kot-light"}`}
            >
              {tab.label} ({counts[tab.value as keyof typeof counts]})
            </button>
          ))}
        </div>

        {/* Cards */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="bg-kot-white rounded-2xl p-10 sm:p-16 lg:p-24 text-center shadow-kot">
            <p className="text-4xl sm:text-5xl lg:text-6xl mb-3">🍳</p>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-kot-darker">
              No orders
            </p>
            <p className="text-xs sm:text-sm lg:text-base text-kot-text mt-1">
              {activeTab === "all"
                ? "All done!"
                : "No " + activeTab + " orders"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4">
            {sorted.map((kot) => {
              const cfg = STATUS_CONFIG[kot.status];
              const urgent =
                isUrgent(kot.createdAt) && kot.status === "pending";
              const isUpdating = updatingId === kot._id;
              return (
                <div
                  key={kot._id}
                  className={`bg-kot-white rounded-2xl shadow-kot border-l-4 ${cfg.border} overflow-hidden transition-all ${urgent ? "ring-2 ring-red-400 ring-offset-1" : ""}`}
                >
                  <div
                    className={`px-3 py-2.5 sm:px-4 sm:py-3 flex items-center justify-between ${cfg.bg}`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-kot-darker text-sm lg:text-base">
                          {kot.orderType === "dine-in"
                            ? `Table ${kot.tableNumber}`
                            : "🥡 Takeaway"}
                        </span>
                        {urgent && (
                          <span className="text-[9px] px-1.5 py-0.5 bg-red-100 text-red-700 rounded-full font-bold animate-pulse">
                            URGENT
                          </span>
                        )}
                      </div>
                      {kot.customerName && (
                        <p className="text-[10px] sm:text-xs text-kot-text mt-0.5">
                          {kot.customerName}
                        </p>
                      )}
                    </div>
                    <span
                      className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-semibold ${cfg.bg} ${cfg.text} border ${cfg.border}`}
                    >
                      {cfg.label}
                    </span>
                  </div>
                  <div className="px-3 py-2.5 sm:px-4 sm:py-3 space-y-1.5 sm:space-y-2">
                    {kot.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between gap-1"
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-kot-dark text-white text-[9px] sm:text-xs flex items-center justify-center font-bold flex-shrink-0">
                            {item.quantity}
                          </span>
                          <span className="text-xs sm:text-sm font-medium text-kot-darker truncate">
                            {item.name}
                          </span>
                        </div>
                        <span className="text-[10px] sm:text-xs text-kot-text flex-shrink-0">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="px-3 pb-1.5 sm:px-4 sm:pb-2 flex items-center gap-1 text-[10px] sm:text-xs text-kot-text">
                    <Clock size={10} />
                    {formatTime(kot.createdAt)}
                  </div>
                  {kot.status !== "served" && kot.status !== "cancelled" && (
                    <div className="px-3 pb-3 sm:px-4 sm:pb-4 flex gap-2">
                      {kot.status === "pending" && (
                        <button
                          onClick={() => handleStart(kot._id)}
                          disabled={isUpdating}
                          className="flex-1 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-semibold transition-colors disabled:opacity-50"
                        >
                          {isUpdating ? "..." : "Start 🔥"}
                        </button>
                      )}
                      {kot.status === "preparing" && (
                        <button
                          onClick={() => handleReady(kot._id)}
                          disabled={isUpdating}
                          className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-semibold transition-colors disabled:opacity-50"
                        >
                          {isUpdating ? "..." : "Ready ✅"}
                        </button>
                      )}
                      {kot.status === "ready" && (
                        <div className="flex-1 py-2 rounded-xl bg-emerald-100 text-emerald-700 text-xs sm:text-sm font-semibold text-center">
                          Waiting pickup
                        </div>
                      )}
                      <button
                        onClick={() => handleCancel(kot._id)}
                        disabled={isUpdating}
                        className="px-2.5 sm:px-3 py-2 rounded-xl border-2 border-red-200 text-red-500 hover:bg-red-50 text-sm transition-colors disabled:opacity-50"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
