import { useState, useEffect, useCallback } from "react";
import {
  getKotOrdersApi,
  startKotApi,
  markKotReadyApi,
  cancelKotApi,
} from "../../../services/chefApi/chef.api";
import type { Kot } from "../../../services/chefApi/chef.api";
import { useToast } from "../../../Context/ToastContext";
import { useNotifications } from "../../../hooks/useNotifications";
import { KitchenPresenter } from "./KitchenPresenter";
import type { TabFilter } from "./Kitchen.types";

export default function KitchenContainer() {
  const toast = useToast();

  const [kots, setKots] = useState<Kot[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [, setTick] = useState(0);

  // Re-render every minute so formatTime stays fresh
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
    "order:new": (kot: unknown) => {
      const k = kot as Kot;
      setKots((prev) =>
        prev.some((x) => x._id === k._id) ? prev : [k, ...prev],
      );
    },
    "kot:updated": (kot: unknown) => {
      const k = kot as Kot;
      setKots((prev) => prev.map((x) => (x._id === k._id ? k : x)));
    },
  });

  const handleStart = async (id: string) => {
    try {
      setUpdatingId(id);
      const r = await startKotApi(id);
      setKots((prev) => prev.map((k) => (k._id === id ? r.data.order : k)));
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
      setKots((prev) => prev.map((k) => (k._id === id ? r.data.order : k)));
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
      setKots((prev) => prev.map((k) => (k._id === id ? r.data.order : k)));
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

  // Derived
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
    <KitchenPresenter
      kots={kots}
      sorted={sorted}
      counts={counts}
      loading={loading}
      refreshing={refreshing}
      isConnected={isConnected}
      activeTab={activeTab}
      updatingId={updatingId}
      onTabChange={setActiveTab}
      onRefresh={() => fetchKots(true)}
      onStart={handleStart}
      onReady={handleReady}
      onCancel={handleCancel}
    />
  );
}
