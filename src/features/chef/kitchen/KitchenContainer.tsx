import { useCallback, useEffect, useRef, useState } from "react";
import {
  getKotOrdersApi,
  startKotApi,
  markKotReadyApi,
  cancelKotApi,
} from "../../../services/chef/chef.api";
import type { Kot } from "../../../services/chef/chef.api";
import type { PaginationMeta } from "../../../types/query";
import { useToast } from "../../../contexts/toastContext";
import { useNotifications } from "../../../hooks/useNotifications";
import { KitchenPresenter } from "./KitchenPresenter";
import type { KitchenQuery, TabFilter } from "./Kitchen.types";

const DEFAULT_QUERY: KitchenQuery = {
  page: 1,
  limit: 20,
  sort: "createdAt",
  order: "asc",
};

const EMPTY_PAGINATION: PaginationMeta = {
  page: 1,
  limit: 20,
  total: 0,
  pages: 0,
  hasNext: false,
  hasPrev: false,
};

export default function KitchenContainer() {
  const toast = useToast();
  const [kots, setKots] = useState<Kot[]>([]);
  const [pagination, setPagination] = useState(EMPTY_PAGINATION);
  const [query, setQuery] = useState<KitchenQuery>(DEFAULT_QUERY);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const activeRequest = useRef<AbortController | null>(null);
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((tick) => tick + 1), 60000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    activeRequest.current?.abort();
    activeRequest.current = controller;
    let redirectingToValidPage = false;
    const requestQuery: KitchenQuery = {
      page: query.page ?? 1,
      limit: query.limit ?? 20,
      status: query.status,
      sort: query.sort ?? "createdAt",
      order: query.order ?? "asc",
    };

    void getKotOrdersApi(requestQuery, controller.signal)
      .then(({ data }) => {
        if (controller.signal.aborted) return;
        if (!data.pagination) {
          throw new Error("Paginated Kitchen response is missing pagination metadata");
        }
        const lastValidPage = Math.max(1, data.pagination.pages);
        if (data.pagination.page > lastValidPage) {
          redirectingToValidPage = true;
          setQuery((previous) => ({ ...previous, page: lastValidPage }));
          return;
        }
        setKots(data.KotOrders);
        setPagination(data.pagination);
        setError(null);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        const apiError = err as { response?: { data?: { error?: string } } };
        setError(
          apiError.response?.data?.error ||
            "Kitchen orders could not be loaded. Please try again.",
        );
      })
      .finally(() => {
        if (!controller.signal.aborted && !redirectingToValidPage) {
          setLoading(false);
          setRefreshing(false);
        }
      });
    return () => controller.abort();
  }, [query.limit, query.order, query.page, query.sort, query.status, refreshKey]);

  const refreshActiveQuery = useCallback(() => {
    activeRequest.current?.abort();
    setRefreshing(true);
    setError(null);
    setRefreshKey((key) => key + 1);
  }, []);

  const handleRetry = () => {
    setLoading(true);
    refreshActiveQuery();
  };

  const handleTabChange = (tab: TabFilter) => {
    if (tab === "served") return;
    const status = tab === "all" ? undefined : tab;
    if (status === query.status && (query.page ?? 1) === 1) return;
    activeRequest.current?.abort();
    setActiveTab(tab);
    setLoading(true);
    setError(null);
    setQuery((previous) => ({ ...previous, page: 1, status }));
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page === query.page) return;
    activeRequest.current?.abort();
    setLoading(true);
    setError(null);
    setQuery((previous) => ({ ...previous, page }));
  };

  const handleLimitChange = (limit: number) => {
    activeRequest.current?.abort();
    setLoading(true);
    setError(null);
    setQuery((previous) => ({ ...previous, page: 1, limit }));
  };

  const isConnected = useNotifications({
    "order:new": refreshActiveQuery,
    "kot:updated": refreshActiveQuery,
  });

  const handleStart = async (id: string) => {
    try {
      setUpdatingId(id);
      await startKotApi(id);
      toast.success("Cooking started! ðŸ”¥");
      refreshActiveQuery();
    } catch (e: unknown) {
      toast.error((e as { response?: { data?: { error?: string } } })?.response?.data?.error || "Failed");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleReady = async (id: string) => {
    try {
      setUpdatingId(id);
      await markKotReadyApi(id);
      toast.success("Order ready! âœ…");
      refreshActiveQuery();
    } catch (e: unknown) {
      toast.error((e as { response?: { data?: { error?: string } } })?.response?.data?.error || "Failed");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCancel = async (id: string) => {
    if (!window.confirm("Cancel?")) return;
    try {
      setUpdatingId(id);
      await cancelKotApi(id);
      toast.info("Cancelled");
      refreshActiveQuery();
    } catch (e: unknown) {
      toast.error((e as { response?: { data?: { error?: string } } })?.response?.data?.error || "Failed");
    } finally {
      setUpdatingId(null);
    }
  };

  const counts = {
    page: kots.length,
    pending: kots.filter((kot) => kot.status === "pending").length,
    preparing: kots.filter((kot) => kot.status === "preparing").length,
    ready: kots.filter((kot) => kot.status === "ready").length,
  };

  return (
    <KitchenPresenter
      kots={kots}
      counts={counts}
      pagination={pagination}
      loading={loading}
      refreshing={refreshing}
      error={error}
      isConnected={isConnected}
      activeTab={activeTab}
      updatingId={updatingId}
      onTabChange={handleTabChange}
      onPageChange={handlePageChange}
      onLimitChange={handleLimitChange}
      onRefresh={refreshActiveQuery}
      onRetry={handleRetry}
      onStart={handleStart}
      onReady={handleReady}
      onCancel={handleCancel}
    />
  );
}
