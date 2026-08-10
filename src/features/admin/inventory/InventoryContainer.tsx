import { useEffect, useRef, useState } from "react";
import { useToast } from "../../../contexts/toastContext";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";
import {
  getInventoryApi,
  createInventoryApi,
  updateInventoryApi,
  restockApi,
  adjustStockApi,
  getStockLogsApi,
  deleteInventoryApi,
} from "../../../services/admin/inventory.api";
import type { PaginationMeta } from "../../../types/query";
import type {
  InventoryItem,
  StockLog,
  CreateInventoryPayload,
  InventoryCategory,
  InventoryQuery,
} from "./Inventory.types";
import { EMPTY_FORM } from "./Inventory.types";
import { InventoryPresenter } from "./InventoryPresenter";

const DEFAULT_QUERY: InventoryQuery = {
  page: 1,
  limit: 20,
  search: "",
  sort: "currentStock",
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

export default function InventoryContainer() {
  const toast = useToast();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [pagination, setPagination] = useState(EMPTY_PAGINATION);
  const [query, setQuery] = useState<InventoryQuery>(DEFAULT_QUERY);
  const [refreshKey, setRefreshKey] = useState(0);
  const activeRequest = useRef<AbortController | null>(null);
  const debouncedSearch = useDebouncedValue(query.search ?? "");

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState<CreateInventoryPayload>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [restockItem, setRestockItem] = useState<InventoryItem | null>(null);
  const [restockQty, setRestockQty] = useState("");
  const [restockNote, setRestockNote] = useState("");
  const [restocking, setRestocking] = useState(false);
  const [adjustItem, setAdjustItem] = useState<InventoryItem | null>(null);
  const [adjustQty, setAdjustQty] = useState("");
  const [adjustNote, setAdjustNote] = useState("");
  const [adjusting, setAdjusting] = useState(false);
  const [logsItem, setLogsItem] = useState<InventoryItem | null>(null);
  const [logs, setLogs] = useState<StockLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);

  useEffect(() => {
    if ((query.search ?? "").trim() !== debouncedSearch.trim()) {
      activeRequest.current?.abort();
      return;
    }

    const controller = new AbortController();
    activeRequest.current?.abort();
    activeRequest.current = controller;
    let redirectingToValidPage = false;
    const requestQuery: InventoryQuery = {
      page: query.page ?? 1,
      limit: query.limit ?? 20,
      search: debouncedSearch.trim() || undefined,
      lowStock: query.lowStock || undefined,
      category: query.category || undefined,
      sort: query.sort ?? "currentStock",
      order: query.order ?? "asc",
    };

    void getInventoryApi(requestQuery, controller.signal)
      .then(({ data }) => {
        if (controller.signal.aborted) return;
        const lastValidPage = Math.max(1, data.pagination.pages);
        if (data.pagination.page > lastValidPage) {
          redirectingToValidPage = true;
          setQuery((previous) => ({ ...previous, page: lastValidPage }));
          return;
        }
        setItems(data.items);
        setLowStockCount(data.lowStockCount);
        setPagination(data.pagination);
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setError("Inventory could not be loaded. Please try again.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted && !redirectingToValidPage) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [debouncedSearch, query.category, query.limit, query.lowStock, query.order,
    query.page, query.search, query.sort, refreshKey]);

  const refreshInventory = () => {
    activeRequest.current?.abort();
    setLoading(true);
    setError(null);
    setRefreshKey((value) => value + 1);
  };

  const updateQueryAndResetPage = (updates: Partial<InventoryQuery>) => {
    activeRequest.current?.abort();
    setLoading(true);
    setError(null);
    setQuery((previous) => ({ ...previous, ...updates, page: 1 }));
  };

  const handleSearchChange = (search: string) => updateQueryAndResetPage({ search });
  const handleFilterLowToggle = () =>
    updateQueryAndResetPage({ lowStock: !query.lowStock || undefined });
  const handleFilterCatChange = (category: InventoryCategory | "") =>
    updateQueryAndResetPage({ category: category || undefined });
  const handlePageChange = (page: number) => {
    if (page < 1 || page === query.page) return;
    activeRequest.current?.abort();
    setLoading(true);
    setError(null);
    setQuery((previous) => ({ ...previous, page }));
  };
  const handleLimitChange = (limit: number) => updateQueryAndResetPage({ limit });
  const handleClearFilters = () =>
    updateQueryAndResetPage({ search: "", lowStock: undefined, category: undefined });

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData(EMPTY_FORM);
    setShowModal(true);
  };
  const handleOpenEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      unit: item.unit,
      lowStockThreshold: item.lowStockThreshold,
      category: item.category,
      costPerUnit: item.costPerUnit,
      supplier: item.supplier,
      menuItemId: item.menuItemId?._id ?? "",
    });
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData(EMPTY_FORM);
  };
  const handleFormChange = <K extends keyof CreateInventoryPayload>(
    key: K,
    value: CreateInventoryPayload[K],
  ) => setFormData((previous) => ({ ...previous, [key]: value }));

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.name?.trim()) {
      toast.warning("Name is required");
      return;
    }
    try {
      setSaving(true);
      if (editingItem) {
        await updateInventoryApi(editingItem._id, formData);
        toast.success("Updated!");
      } else {
        await createInventoryApi(formData);
        toast.success("Item added!");
      }
      handleCloseModal();
      refreshInventory();
    } catch (err) {
      const apiError = err as { response?: { data?: { error?: string } } };
      toast.error(apiError.response?.data?.error || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleOpenRestock = (item: InventoryItem) => {
    setRestockItem(item);
    setRestockQty("");
    setRestockNote("");
  };
  const handleCloseRestock = () => {
    setRestockItem(null);
    setRestockQty("");
    setRestockNote("");
  };
  const handleRestock = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!restockItem || !restockQty || Number(restockQty) <= 0) {
      toast.warning("Enter a valid quantity");
      return;
    }
    try {
      setRestocking(true);
      const { data } = await restockApi(restockItem._id, Number(restockQty), restockNote);
      toast.success(data.message);
      handleCloseRestock();
      refreshInventory();
    } catch (err) {
      const apiError = err as { response?: { data?: { error?: string } } };
      toast.error(apiError.response?.data?.error || "Failed to restock");
    } finally {
      setRestocking(false);
    }
  };

  const handleOpenAdjust = (item: InventoryItem) => {
    setAdjustItem(item);
    setAdjustQty("");
    setAdjustNote("");
  };
  const handleCloseAdjust = () => {
    setAdjustItem(null);
    setAdjustQty("");
    setAdjustNote("");
  };
  const handleAdjust = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!adjustItem || adjustQty === "") {
      toast.warning("Enter a quantity");
      return;
    }
    try {
      setAdjusting(true);
      const { data } = await adjustStockApi(adjustItem._id, Number(adjustQty), adjustNote);
      toast.success(data.message);
      handleCloseAdjust();
      refreshInventory();
    } catch (err) {
      const apiError = err as { response?: { data?: { error?: string } } };
      toast.error(apiError.response?.data?.error || "Failed to adjust");
    } finally {
      setAdjusting(false);
    }
  };

  const handleOpenLogs = async (item: InventoryItem) => {
    setLogsItem(item);
    setLogsLoading(true);
    try {
      const { data } = await getStockLogsApi(item._id);
      setLogs(data.logs);
    } catch {
      toast.error("Failed to load logs");
    } finally {
      setLogsLoading(false);
    }
  };
  const handleCloseLogs = () => {
    setLogsItem(null);
    setLogs([]);
  };
  const handleDelete = async (item: InventoryItem) => {
    if (!window.confirm(`Remove "${item.name}" from inventory?`)) return;
    try {
      await deleteInventoryApi(item._id);
      toast.success("Removed");
      refreshInventory();
    } catch {
      toast.error("Failed to remove");
    }
  };

  const hasActiveFilters = Boolean(
    (query.search ?? "").trim() || query.lowStock || query.category,
  );

  return (
    <InventoryPresenter
      items={items}
      loading={loading}
      error={error}
      lowStockCount={lowStockCount}
      pagination={pagination}
      hasActiveFilters={hasActiveFilters}
      search={query.search ?? ""}
      filterLow={Boolean(query.lowStock)}
      filterCat={query.category ?? ""}
      onSearchChange={handleSearchChange}
      onFilterLowToggle={handleFilterLowToggle}
      onFilterCatChange={handleFilterCatChange}
      onRefresh={refreshInventory}
      onRetry={refreshInventory}
      onClearFilters={handleClearFilters}
      onPageChange={handlePageChange}
      onLimitChange={handleLimitChange}
      showModal={showModal}
      editingItem={editingItem}
      formData={formData}
      saving={saving}
      onOpenCreate={handleOpenCreate}
      onOpenEdit={handleOpenEdit}
      onCloseModal={handleCloseModal}
      onFormChange={handleFormChange}
      onSave={handleSave}
      restockItem={restockItem}
      restockQty={restockQty}
      restockNote={restockNote}
      restocking={restocking}
      onOpenRestock={handleOpenRestock}
      onCloseRestock={handleCloseRestock}
      onRestockQtyChange={setRestockQty}
      onRestockNoteChange={setRestockNote}
      onRestock={handleRestock}
      adjustItem={adjustItem}
      adjustQty={adjustQty}
      adjustNote={adjustNote}
      adjusting={adjusting}
      onOpenAdjust={handleOpenAdjust}
      onCloseAdjust={handleCloseAdjust}
      onAdjustQtyChange={setAdjustQty}
      onAdjustNoteChange={setAdjustNote}
      onAdjust={handleAdjust}
      logsItem={logsItem}
      logs={logs}
      logsLoading={logsLoading}
      onOpenLogs={handleOpenLogs}
      onCloseLogs={handleCloseLogs}
      onDelete={handleDelete}
    />
  );
}
