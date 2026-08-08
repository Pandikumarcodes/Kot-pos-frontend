import { useState, useEffect, useCallback } from "react";
import { useToast } from "../../../contexts/toastContext";
import {
  getInventoryApi,
  createInventoryApi,
  updateInventoryApi,
  restockApi,
  adjustStockApi,
  getStockLogsApi,
  deleteInventoryApi,
} from "../../../services/admin/inventory.api";
import type {
  InventoryItem,
  StockLog,
  CreateInventoryPayload,
  InventoryCategory,
} from "./Inventory.types";
import { EMPTY_FORM } from "./Inventory.types";
import { InventoryPresenter } from "./InventoryPresenter";
import { useQueryState } from "../../../hooks/useQueryState";
import { useFilters, usePagination, useSearch, useSorting } from "../../../query/hooks";
import { useAppSelector } from "../../../state/hooks";
import { resolveOperationalBranchId } from "../../../state/branchContext";

export default function InventoryContainer() {
  const toast = useToast();
  const user = useAppSelector((state) => state.auth.user);
  const selectedBranchId = useAppSelector((state) => state.ui.selectedBranchId);
  const requiresBranchSelection = user?.role === "admin" && !user.branchId;
  const branchId = resolveOperationalBranchId(user?.branchId, selectedBranchId);

  // ── List state ────────────────────────────────────────────
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [paginationMeta, setPaginationMeta] = useState({
    page: 1, limit: 20, total: 0, pages: 0, hasNext: false, hasPrev: false,
  });

  // ── Filters ───────────────────────────────────────────────
  const { query, updateQuery } = useQueryState({
    initialState: { page: 1, pageSize: 20 },
  });
  const searchState = useSearch(query.search ?? "");
  const filterState = useFilters(query.filters ?? {});
  const sortingState = useSorting({ sortBy: query.sortBy, sortOrder: query.sortOrder });
  const paginationState = usePagination({ page: query.page, pageSize: query.pageSize });
  const search = searchState.search;
  const filterLow = filterState.filters.lowStock === true;
  const filterCat = (filterState.filters.category as InventoryCategory | undefined) ?? "";
  const sortBy = sortingState.sortBy ?? "currentStock";
  const sortOrder = sortingState.sortOrder ?? "asc";

  // ── Create / Edit modal ───────────────────────────────────
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState<CreateInventoryPayload>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  // ── Restock modal ─────────────────────────────────────────
  const [restockItem, setRestockItem] = useState<InventoryItem | null>(null);
  const [restockQty, setRestockQty] = useState("");
  const [restockNote, setRestockNote] = useState("");
  const [restocking, setRestocking] = useState(false);

  // ── Adjust modal ──────────────────────────────────────────
  const [adjustItem, setAdjustItem] = useState<InventoryItem | null>(null);
  const [adjustQty, setAdjustQty] = useState("");
  const [adjustNote, setAdjustNote] = useState("");
  const [adjusting, setAdjusting] = useState(false);

  // ── Logs panel ────────────────────────────────────────────
  const [logsItem, setLogsItem] = useState<InventoryItem | null>(null);
  const [logs, setLogs] = useState<StockLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);

  // ── Fetch ─────────────────────────────────────────────────
  const fetchItems = useCallback(async () => {
    if (requiresBranchSelection && !branchId) {
      setLoading(false);
      setError("Select a branch to manage inventory");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data } = await getInventoryApi({
        branchId,
        page: query.page,
        limit: query.pageSize,
        lowStock: filterLow || undefined,
        category: filterCat || undefined,
        search: searchState.debouncedSearch || undefined,
        sort: query.sortBy as "name" | "currentStock" | "lowStockThreshold" | "category" | "createdAt" | "updatedAt" | undefined,
        order: query.sortOrder,
      });
      setItems(data.items);
      setLowStockCount(data.lowStockCount);
      setPaginationMeta(data.pagination);
    } catch {
      setError("Failed to load inventory");
      toast.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  }, [branchId, filterCat, filterLow, query.page, query.pageSize, query.sortBy, query.sortOrder, requiresBranchSelection, searchState.debouncedSearch, toast]);

  useEffect(() => {
    const request = window.setTimeout(() => void fetchItems(), 0);
    return () => window.clearTimeout(request);
  }, [fetchItems]);

  useEffect(() => {
    setItems([]);
    setLowStockCount(0);
    setPaginationMeta((current) => ({ ...current, page: 1, total: 0, pages: 0 }));
  }, [branchId]);

  useEffect(() => {
    updateQuery({ search: searchState.debouncedSearch || undefined, page: 1 });
  }, [searchState.debouncedSearch, updateQuery]);

  useEffect(() => {
    updateQuery({ filters: filterState.filters, page: 1 });
  }, [filterState.filters, updateQuery]);

  useEffect(() => {
    updateQuery({ sortBy: sortingState.sortBy, sortOrder: sortingState.sortOrder, page: 1 });
  }, [sortingState.sortBy, sortingState.sortOrder, updateQuery]);

  useEffect(() => {
    updateQuery({ page: paginationState.page, pageSize: paginationState.pageSize });
  }, [paginationState.page, paginationState.pageSize, updateQuery]);

  const handleSearchChange = (nextSearch: string) => {
    searchState.onSearchChange(nextSearch);
  };

  const handleFilterLowToggle = () => {
    filterState.setFilter("lowStock", filterLow ? undefined : true);
  };

  const handleFilterCatChange = (nextFilterCat: InventoryCategory | "") => {
    if (nextFilterCat) filterState.setFilter("category", nextFilterCat);
    else filterState.clearFilter("category");
  };

  const handleRefresh = () => {
    void fetchItems();
  };

  const handleSortChange = (value: string) => {
    sortingState.setSort(value || undefined, value ? sortOrder : "asc");
  };

  // ── Modal handlers ────────────────────────────────────────
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
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // ── Save ──────────────────────────────────────────────────
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      toast.warning("Name is required");
      return;
    }
    try {
      setSaving(true);
      if (editingItem) {
        const { data } = await updateInventoryApi(editingItem._id, formData, branchId);
        setItems((prev) =>
          prev.map((i) =>
            i._id === editingItem._id ? { ...i, ...data.item } : i,
          ),
        );
        toast.success("Updated!");
      } else {
        const { data } = await createInventoryApi(formData, branchId);
        setItems((prev) => [data.item, ...prev]);
        toast.success("Item added!");
      }
      handleCloseModal();
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } } };
      toast.error(e?.response?.data?.error || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  // ── Restock handlers ──────────────────────────────────────
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

  const handleRestock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockItem || !restockQty || Number(restockQty) <= 0) {
      toast.warning("Enter a valid quantity");
      return;
    }
    try {
      setRestocking(true);
      const { data } = await restockApi(
        restockItem._id,
        Number(restockQty),
        restockNote,
        branchId,
      );
      setItems((prev) =>
        prev.map((i) =>
          i._id === restockItem._id ? { ...i, ...data.item } : i,
        ),
      );
      setLowStockCount((c) => Math.max(0, c - (data.item.isLowStock ? 0 : 1)));
      toast.success(data.message);
      handleCloseRestock();
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } } };
      toast.error(e?.response?.data?.error || "Failed to restock");
    } finally {
      setRestocking(false);
    }
  };

  // ── Adjust handlers ───────────────────────────────────────
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

  const handleAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustItem || adjustQty === "") {
      toast.warning("Enter a quantity");
      return;
    }
    try {
      setAdjusting(true);
      const { data } = await adjustStockApi(
        adjustItem._id,
        Number(adjustQty),
        adjustNote,
        branchId,
      );
      setItems((prev) =>
        prev.map((i) =>
          i._id === adjustItem._id ? { ...i, ...data.item } : i,
        ),
      );
      toast.success(data.message);
      handleCloseAdjust();
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } } };
      toast.error(e?.response?.data?.error || "Failed to adjust");
    } finally {
      setAdjusting(false);
    }
  };

  // ── Logs handlers ─────────────────────────────────────────
  const handleOpenLogs = async (item: InventoryItem) => {
    setLogsItem(item);
    setLogsLoading(true);
    try {
      const { data } = await getStockLogsApi(item._id, branchId);
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

  // ── Delete ────────────────────────────────────────────────
  const handleDelete = async (item: InventoryItem) => {
    if (!window.confirm(`Remove "${item.name}" from inventory?`)) return;
    try {
      await deleteInventoryApi(item._id, branchId);
      setItems((prev) => prev.filter((i) => i._id !== item._id));
      toast.success("Removed");
    } catch {
      toast.error("Failed to remove");
    }
  };

  return (
    <InventoryPresenter
      // List
      items={items}
      loading={loading}
      lowStockCount={lowStockCount}
      pagination={paginationMeta}
      error={error}
      // Filters
      search={search}
      filterLow={filterLow}
      filterCat={filterCat}
      onSearchChange={handleSearchChange}
      onFilterLowToggle={handleFilterLowToggle}
      onFilterCatChange={handleFilterCatChange}
      onRefresh={handleRefresh}
      onPageChange={paginationState.setPage}
      sortBy={sortBy}
      sortOrder={sortOrder}
      onSortChange={handleSortChange}
      onRetry={handleRefresh}
      // Create / Edit modal
      showModal={showModal}
      editingItem={editingItem}
      formData={formData}
      saving={saving}
      onOpenCreate={handleOpenCreate}
      onOpenEdit={handleOpenEdit}
      onCloseModal={handleCloseModal}
      onFormChange={handleFormChange}
      onSave={handleSave}
      // Restock
      restockItem={restockItem}
      restockQty={restockQty}
      restockNote={restockNote}
      restocking={restocking}
      onOpenRestock={handleOpenRestock}
      onCloseRestock={handleCloseRestock}
      onRestockQtyChange={setRestockQty}
      onRestockNoteChange={setRestockNote}
      onRestock={handleRestock}
      // Adjust
      adjustItem={adjustItem}
      adjustQty={adjustQty}
      adjustNote={adjustNote}
      adjusting={adjusting}
      onOpenAdjust={handleOpenAdjust}
      onCloseAdjust={handleCloseAdjust}
      onAdjustQtyChange={setAdjustQty}
      onAdjustNoteChange={setAdjustNote}
      onAdjust={handleAdjust}
      // Logs
      logsItem={logsItem}
      logs={logs}
      logsLoading={logsLoading}
      onOpenLogs={handleOpenLogs}
      onCloseLogs={handleCloseLogs}
      // Delete
      onDelete={handleDelete}
    />
  );
}
