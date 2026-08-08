import { useState, useEffect, useCallback } from "react";
import { useAppSelector } from "../../../state/hooks";
import {
  getMenuItemsApi,
  createMenuItemApi,
  updateMenuItemApi,
  deleteMenuItemApi,
} from "../../../services/admin/menu.api";
import type { MenuItem, CreateMenuPayload } from "../../../services/admin/menu.api";
import { useToast } from "../../../contexts/toastContext";
import { validateMenuItem, hasErrors, type ValidationErrors } from "../../../utils/validation";
import { useQueryState } from "../../../hooks/useQueryState";
import { useFilters, usePagination, useSearch, useSorting } from "../../../query/hooks";
import { MenuManagementPresenter } from "./MenuManagementPresenter";

const EMPTY_PAGINATION = { page: 1, limit: 20, total: 0, pages: 0, hasNext: false, hasPrev: false };

export default function MenuManagementContainer() {
  const { user } = useAppSelector((state) => state.auth);
  const toast = useToast();
  const isAdmin = user?.role === "admin";
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [pagination, setPagination] = useState(EMPTY_PAGINATION);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { query, updateQuery, resetFilters } = useQueryState({ initialState: { page: 1, pageSize: 20 } });
  const searchState = useSearch(query.search ?? "");
  const filterState = useFilters(query.filters ?? {});
  const sortingState = useSorting({ sortBy: query.sortBy, sortOrder: query.sortOrder });
  const paginationState = usePagination({ page: query.page, pageSize: query.pageSize });
  const filterCat = typeof filterState.filters.category === "string" ? filterState.filters.category : "";
  const filterAvailability = typeof filterState.filters.availability === "boolean"
    ? String(filterState.filters.availability)
    : "";
  const sortBy = sortingState.sortBy ?? "";
  const sortOrder = sortingState.sortOrder ?? "asc";

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formErrors, setFormErrors] = useState<ValidationErrors>({});
  const [formData, setFormData] = useState<CreateMenuPayload>({ ItemName: "", price: 0, category: "starter", available: true });

  const fetchMenuItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getMenuItemsApi({
        page: query.page,
        limit: query.pageSize,
        search: searchState.debouncedSearch.trim() || undefined,
        category: filterCat || undefined,
        availability: filterAvailability ? filterAvailability === "true" : undefined,
        sort: query.sortBy as "name" | "price" | "category" | undefined,
        order: query.sortOrder,
      });
      setMenuItems(data.menuItems);
      if (data.pagination) setPagination(data.pagination);
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } } };
      setError(e?.response?.data?.error || "Failed to load menu items");
    } finally {
      setLoading(false);
    }
  }, [filterAvailability, filterCat, query.page, query.pageSize, query.sortBy, query.sortOrder, searchState.debouncedSearch]);

  useEffect(() => {
    const request = window.setTimeout(() => void fetchMenuItems(), 0);
    return () => window.clearTimeout(request);
  }, [fetchMenuItems]);

  useEffect(() => { updateQuery({ search: searchState.debouncedSearch || undefined, page: 1 }); }, [searchState.debouncedSearch, updateQuery]);
  useEffect(() => { updateQuery({ filters: filterState.filters, page: 1 }); }, [filterState.filters, updateQuery]);
  useEffect(() => { updateQuery({ sortBy: sortingState.sortBy, sortOrder: sortingState.sortOrder, page: 1 }); }, [sortingState.sortBy, sortingState.sortOrder, updateQuery]);
  useEffect(() => { updateQuery({ page: paginationState.page, pageSize: paginationState.pageSize }); }, [paginationState.page, paginationState.pageSize, updateQuery]);

  const handleOpenModal = (item?: MenuItem) => {
    setEditingItem(item || null);
    setFormData(item ? { ItemName: item.ItemName, price: item.price, category: item.category, available: item.available } : { ItemName: "", price: 0, category: "starter", available: true });
    setFormErrors({});
    setShowModal(true);
  };
  const handleCloseModal = () => { setShowModal(false); setEditingItem(null); setFormErrors({}); };
  const handleFieldChange = (field: string, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors((prev) => ({ ...prev, [field]: undefined as unknown as string }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateMenuItem(formData);
    if (hasErrors(errors)) { setFormErrors(errors); return; }
    try {
      if (editingItem) {
        await updateMenuItemApi(editingItem._id, { price: formData.price, available: formData.available });
        setMenuItems((items) => items.map((item) => item._id === editingItem._id ? { ...item, price: formData.price, available: formData.available } : item));
      } else {
        const { data } = await createMenuItemApi(formData);
        setMenuItems((items) => [...items, data.menuItem]);
      }
      handleCloseModal();
      toast.success(editingItem ? "Item updated!" : "Item added!");
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } } };
      toast.error(e?.response?.data?.error || "Failed to save item");
    }
  };
  const handleDelete = async (item: MenuItem) => {
    if (!window.confirm(`Delete "${item.ItemName}"?`)) return;
    try { await deleteMenuItemApi(item._id); setMenuItems((items) => items.filter((i) => i._id !== item._id)); toast.success(`"${item.ItemName}" deleted!`); }
    catch (err) { const e = err as { response?: { data?: { error?: string } } }; toast.error(e?.response?.data?.error || "Failed to delete item"); }
  };
  const handleToggle = async (item: MenuItem) => {
    try { await updateMenuItemApi(item._id, { available: !item.available }); setMenuItems((items) => items.map((i) => i._id === item._id ? { ...i, available: !i.available } : i)); }
    catch (err) { const e = err as { response?: { data?: { error?: string } } }; toast.error(e?.response?.data?.error || "Failed to update availability"); }
  };

  const activeFilters = [
    filterCat ? { key: "category", label: "Category", value: filterCat } : null,
    filterAvailability ? { key: "availability", label: "Availability", value: filterAvailability === "true" ? "Available" : "Unavailable" } : null,
  ].filter((value): value is { key: string; label: string; value: string } => value !== null);

  return <MenuManagementPresenter
    menuItems={menuItems} pagination={pagination} loading={loading} error={error}
    search={searchState.search} filterCat={filterCat} filterAvailability={filterAvailability}
    sortBy={sortBy} sortOrder={sortOrder} activeFilters={activeFilters}
    showModal={showModal} editingItem={editingItem} formData={formData} formErrors={formErrors} isAdmin={isAdmin}
    onSearchChange={(value) => { searchState.onSearchChange(value); paginationState.setPage(1); }}
    onFilterCatChange={(value) => { if (value) filterState.setFilter("category", value); else filterState.clearFilter("category"); paginationState.setPage(1); }}
    onFilterAvailabilityChange={(value) => { if (value) filterState.setFilter("availability", value === "true"); else filterState.clearFilter("availability"); paginationState.setPage(1); }}
    onSortChange={(value) => { sortingState.setSort(value || undefined, sortOrder); paginationState.setPage(1); }}
    onSortOrderChange={(value) => { sortingState.setSort(sortBy || undefined, value); paginationState.setPage(1); }}
    onRemoveFilter={(key) => { filterState.clearFilter(key); paginationState.setPage(1); }}
    onClearFilters={() => { resetFilters(); filterState.clearFilters(); paginationState.setPage(1); }}
    onPageChange={paginationState.setPage}
    onOpenModal={handleOpenModal} onCloseModal={handleCloseModal} onFieldChange={handleFieldChange} onSubmit={handleSubmit}
    onDelete={handleDelete} onToggle={handleToggle} onRetry={() => void fetchMenuItems()}
  />;
}
