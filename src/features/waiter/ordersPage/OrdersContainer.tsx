import { useEffect, useRef, useState } from "react";
import { getOrdersApi } from "../../../services/waiter/waiter.api";
import type { PaginationMeta } from "../../../types/query";
import type {
  Order,
  OrdersQuery,
  OrderStatusFilter,
} from "./Orders.types";
import { OrdersPresenter } from "./OrdersPresenter";

const DEFAULT_QUERY: OrdersQuery = {
  page: 1,
  limit: 20,
  sort: "createdAt",
  order: "desc",
};

const EMPTY_PAGINATION: PaginationMeta = {
  page: 1,
  limit: 20,
  total: 0,
  pages: 0,
  hasNext: false,
  hasPrev: false,
};

export default function OrderContainer() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState(EMPTY_PAGINATION);
  const [query, setQuery] = useState<OrdersQuery>(DEFAULT_QUERY);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const activeRequest = useRef<AbortController | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    activeRequest.current?.abort();
    activeRequest.current = controller;
    let redirectingToValidPage = false;

    const supportedQuery: OrdersQuery = {
      page: query.page ?? 1,
      limit: query.limit ?? 20,
      status: query.status,
      sort: query.sort ?? "createdAt",
      order: query.order ?? "desc",
    };

    void getOrdersApi(supportedQuery, controller.signal)
      .then(({ data }) => {
        if (controller.signal.aborted) return;
        if (!data.pagination) {
          throw new Error("Paginated Orders response is missing pagination metadata");
        }

        const lastValidPage = Math.max(1, data.pagination.pages);
        if (data.pagination.page > lastValidPage) {
          redirectingToValidPage = true;
          setQuery((previous) => ({ ...previous, page: lastValidPage }));
          return;
        }

        setOrders(data.myOrders);
        setPagination(data.pagination);
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setError("Orders could not be loaded. Please try again.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted && !redirectingToValidPage) {
          setLoading(false);
          setRefreshing(false);
        }
      });

    return () => controller.abort();
  }, [query.limit, query.order, query.page, query.sort, query.status, refreshKey]);

  const handleStatusChange = (status: OrderStatusFilter) => {
    const nextStatus = status === "all" ? undefined : status;
    if (nextStatus === query.status && (query.page ?? 1) === 1) return;
    activeRequest.current?.abort();
    setLoading(true);
    setError(null);
    setQuery((previous) => ({
      ...previous,
      page: 1,
      status: nextStatus,
    }));
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page === query.page) return;
    activeRequest.current?.abort();
    setLoading(true);
    setError(null);
    setQuery((previous) => ({ ...previous, page }));
  };

  const handleRefresh = () => {
    activeRequest.current?.abort();
    setRefreshing(true);
    setError(null);
    setRefreshKey((value) => value + 1);
  };

  const handleRetry = () => {
    setLoading(true);
    handleRefresh();
  };

  const handleClearFilters = () => handleStatusChange("all");
  const status = query.status ?? "all";

  return (
    <OrdersPresenter
      orders={orders}
      pagination={pagination}
      loading={loading}
      refreshing={refreshing}
      error={error}
      status={status}
      showFilters={showFilters}
      activeFilterCount={status === "all" ? 0 : 1}
      selectedOrder={selectedOrder}
      onStatusChange={handleStatusChange}
      onToggleFilters={() => setShowFilters((value) => !value)}
      onClearFilters={handleClearFilters}
      onSelectOrder={setSelectedOrder}
      onPageChange={handlePageChange}
      onRefresh={handleRefresh}
      onRetry={handleRetry}
    />
  );
}
