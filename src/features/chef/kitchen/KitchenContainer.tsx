import { useCallback, useEffect, useMemo, useState } from "react";
import {
  cancelKotApi,
  getKotOrdersApi,
  markKotReadyApi,
  serveKotApi,
  startKotApi,
} from "../../../services/chef/chef.api";
import type {
  KitchenSortField,
  KitchenSortOrder,
  Kot,
} from "../../../services/chef/chef.api";
import { useToast } from "../../../contexts/toastContext";
import { useNotifications } from "../../../hooks/useNotifications";
import { useFilters } from "../../../hooks/useFilters";
import { usePagination } from "../../../hooks/usePagination";
import { useQueryState } from "../../../hooks/useQueryState";
import { useSorting } from "../../../hooks/useSorting";
import { KitchenPresenter } from "./KitchenPresenter";
import type { KitchenTabFilter } from "./Kitchen.types";
import { useAppSelector } from "../../../state/hooks";
import { resolveOperationalBranchId } from "../../../state/branchContext";

const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_SORT: KitchenSortField = "createdAt";
const DEFAULT_ORDER: KitchenSortOrder = "asc";
const ACTIVE_STATUSES = ["pending", "preparing", "ready"] as const;

const getErrorMessage = (error: unknown) => {
  const response = error as { response?: { data?: { error?: string; message?: string } } };
  return response.response?.data?.error || response.response?.data?.message || "Failed to load orders";
};

export default function KitchenContainer() {
  const toast = useToast();
  const user = useAppSelector((state) => state.auth.user);
  const selectedBranchId = useAppSelector((state) => state.ui.selectedBranchId);
  const requiresBranchSelection = user?.role === "admin" && !user.branchId;
  const branchId = resolveOperationalBranchId(user?.branchId, selectedBranchId);
  const { query, updateQuery } = useQueryState({
    initialState: { page: 1, pageSize: DEFAULT_PAGE_SIZE, sortBy: DEFAULT_SORT, sortOrder: DEFAULT_ORDER },
  });
  const queryStatus = query.filters?.status;
  const initialFilters = queryStatus === "pending" || queryStatus === "preparing" || queryStatus === "ready" ? { status: queryStatus } : {};
  const filterState = useFilters(initialFilters);
  const initialSort = query.sortBy === "status" || query.sortBy === "createdAt" ? query.sortBy : DEFAULT_SORT;
  const sortingState = useSorting({ sortBy: initialSort, sortOrder: query.sortOrder === "desc" ? "desc" : DEFAULT_ORDER });
  const pageSize = Math.min(100, Math.max(1, query.pageSize));
  const paginationState = usePagination({ page: query.page, pageSize });
  const activeTab = (filterState.filters.status as KitchenTabFilter | undefined) ?? "all";
  const sortBy = (sortingState.sortBy ?? DEFAULT_SORT) as KitchenSortField;
  const sortOrder = sortingState.sortOrder ?? DEFAULT_ORDER;

  const [kots, setKots] = useState<Kot[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: DEFAULT_PAGE_SIZE, total: 0, pages: 0, hasNext: false, hasPrev: false });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setTick((tick) => tick + 1), 60000);
    return () => window.clearInterval(id);
  }, []);

  const fetchKots = useCallback(async (background = false) => {
    if (background) setRefreshing(true);
    else setLoading(true);
    setError(null);
    if (requiresBranchSelection && !branchId) {
      setKots([]);
      setError("Select a branch to view kitchen orders");
      setLoading(false);
      setRefreshing(false);
      return;
    }
    try {
      const response = await getKotOrdersApi({
        branchId,
        page: query.page,
        limit: pageSize,
        status: activeTab === "all" ? undefined : activeTab,
        sort: sortBy,
        order: sortOrder,
      });
      setKots(response.data.KotOrders);
      if (response.data.pagination) setPagination(response.data.pagination);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeTab, branchId, pageSize, query.page, requiresBranchSelection, sortBy, sortOrder]);

  useEffect(() => {
    const request = window.setTimeout(() => void fetchKots(), 0);
    return () => window.clearTimeout(request);
  }, [fetchKots]);

  useEffect(() => {
    setKots([]);
    setPagination((current) => ({ ...current, page: 1, total: 0, pages: 0 }));
  }, [branchId]);

  useEffect(() => {
    updateQuery({ filters: filterState.filters, page: 1 });
  }, [filterState.filters, updateQuery]);

  useEffect(() => {
    updateQuery({ sortBy: sortingState.sortBy ?? DEFAULT_SORT, sortOrder: sortingState.sortOrder ?? DEFAULT_ORDER, page: 1 });
  }, [sortingState.sortBy, sortingState.sortOrder, updateQuery]);

  useEffect(() => {
    updateQuery({ page: paginationState.page, pageSize: paginationState.pageSize });
  }, [paginationState.page, paginationState.pageSize, updateQuery]);

  const matchesView = useCallback((kot: Kot) => activeTab === "all" ? ACTIVE_STATUSES.includes(kot.status as typeof ACTIVE_STATUSES[number]) : kot.status === activeTab, [activeTab]);
  const ordered = useCallback((items: Kot[]) => [...items].sort((a, b) => {
    const left = sortBy === "status" ? a.status : a.createdAt;
    const right = sortBy === "status" ? b.status : b.createdAt;
    const result = left < right ? -1 : left > right ? 1 : a._id.localeCompare(b._id);
    return sortOrder === "asc" ? result : -result;
  }), [sortBy, sortOrder]);

  const isConnected = useNotifications({
    "order:new": (payload: unknown) => {
      const kot = payload as Kot;
      if (paginationState.page !== 1 || !matchesView(kot)) return;
      setKots((current) => {
        if (current.some((item) => item._id === kot._id)) return current;
        return ordered([kot, ...current]).slice(0, paginationState.pageSize);
      });
    },
    "kot:updated": (payload: unknown) => {
      const kot = payload as Kot;
      setKots((current) => {
        const exists = current.some((item) => item._id === kot._id);
        if (!matchesView(kot)) return exists ? current.filter((item) => item._id !== kot._id) : current;
        return ordered(exists ? current.map((item) => item._id === kot._id ? kot : item) : current);
      });
    },
  });

  const handleAction = async (id: string, action: () => Promise<{ data: { order: Kot } }>, message: string, kind: "success" | "info" = "success") => {
    try {
      setUpdatingId(id);
      const response = await action();
      setKots((current) => ordered(current
        .map((kot) => kot._id === id ? response.data.order : kot)
        .filter(matchesView)));
      toast[kind](message);
    } catch (actionError) {
      toast.error(getErrorMessage(actionError));
    } finally {
      setUpdatingId(null);
    }
  };

  const counts = useMemo(() => ({
    all: pagination.total,
    pending: kots.filter((kot) => kot.status === "pending").length,
    preparing: kots.filter((kot) => kot.status === "preparing").length,
    ready: kots.filter((kot) => kot.status === "ready").length,
    served: kots.filter((kot) => kot.status === "served").length,
    cancelled: kots.filter((kot) => kot.status === "cancelled").length,
  }), [kots, pagination.total]);

  return (
    <KitchenPresenter
      kots={ordered(kots)} counts={counts} loading={loading} refreshing={refreshing}
      isConnected={isConnected} activeTab={activeTab} sortBy={sortBy} sortOrder={sortOrder}
      pagination={pagination} updatingId={updatingId} error={error}
      onTabChange={(value) => { paginationState.setPage(1); value === "all" ? filterState.clearFilter("status") : filterState.setFilter("status", value); }}
      onSortChange={(value) => { paginationState.setPage(1); sortingState.setSort(value || DEFAULT_SORT, sortOrder); }}
      onSortOrderChange={(value) => { paginationState.setPage(1); sortingState.setSort(sortBy, value); }}
      onPageChange={paginationState.setPage} onRetry={() => void fetchKots()} onRefresh={() => void fetchKots(true)}
      onStart={(id) => void handleAction(id, () => startKotApi(id, branchId), "Cooking started! 🔥")}
      onReady={(id) => void handleAction(id, () => markKotReadyApi(id, branchId), "Order ready! ✅")}
      onServe={(id) => void handleAction(id, () => serveKotApi(id, branchId), "Order served", "info")}
      onCancel={(id) => { if (window.confirm("Cancel?")) void handleAction(id, () => cancelKotApi(id, branchId), "Cancelled", "info"); }}
    />
  );
}
