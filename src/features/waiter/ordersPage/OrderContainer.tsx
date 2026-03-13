import { useState, useEffect, useCallback, useRef } from "react";
import { getOrdersApi } from "../../../services/waiterApi/waiter.api";
import type { Order, OrdersQuery } from "./Order.types";
import { OrdersPresenter } from "./OrdersPresenter";
const PAGE_SIZE = 20;

export default function OrdersContainer() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [tableNum, setTableNum] = useState("");

  const searchDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchOrders = useCallback(
    async (p = 1, showRefresh = false) => {
      try {
        if (showRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }
        const q: OrdersQuery = {
          page: p,
          limit: PAGE_SIZE,
          ...(search && { search }),
          ...(status !== "all" && { status }),
          ...(from && { from }),
          ...(to && { to }),
          ...(tableNum && { tableNumber: tableNum }),
        };
        const { data } = await getOrdersApi(q);
        setOrders(data.orders ?? []);
        setTotal(data.total ?? 0);
        setTotalPages(data.totalPages ?? 1);
        setPage(p);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [search, status, from, to, tableNum],
  );

  useEffect(() => {
    if (searchDebounce.current) clearTimeout(searchDebounce.current);
    searchDebounce.current = setTimeout(() => fetchOrders(1), search ? 400 : 0);
    return () => {
      if (searchDebounce.current) clearTimeout(searchDebounce.current);
    };
  }, [search, status, from, to, tableNum, fetchOrders]);

  const handleClearFilters = () => {
    setSearch("");
    setStatus("all");
    setFrom("");
    setTo("");
    setTableNum("");
  };

  const activeFilterCount = [status !== "all", !!from, !!to, !!tableNum].filter(
    Boolean,
  ).length;

  return (
    <OrdersPresenter
      orders={orders}
      total={total}
      page={page}
      totalPages={totalPages}
      loading={loading}
      refreshing={refreshing}
      search={search}
      status={status}
      from={from}
      to={to}
      tableNum={tableNum}
      showFilters={showFilters}
      activeFilterCount={activeFilterCount}
      selectedOrder={selectedOrder}
      onSearchChange={setSearch}
      onStatusChange={setStatus}
      onFromChange={setFrom}
      onToChange={setTo}
      onTableNumChange={setTableNum}
      onToggleFilters={() => setShowFilters((v) => !v)}
      onClearFilters={handleClearFilters}
      onSelectOrder={setSelectedOrder}
      onPageChange={(p) => fetchOrders(p)}
      onRefresh={() => fetchOrders(page, true)}
    />
  );
}
