import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "../../../state/hooks";
import {
  getMenuItemsApi,
  createMenuItemApi,
  updateMenuItemApi,
  deleteMenuItemApi,
} from "../../../services/admin/menu.api";
import type {
  MenuItem,
  CreateMenuPayload,
  MenuQuery,
} from "../../../services/admin/menu.api";
import { useToast } from "../../../contexts/toastContext";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";
import type { PaginationMeta } from "../../../types/query";
import {
  validateMenuItem,
  hasErrors,
  type ValidationErrors,
} from "../../../utils/validation";
import { MenuManagementPresenter } from "./MenuManagementPresenter";

const DEFAULT_QUERY: MenuQuery = { page: 1, limit: 20, search: "" };

const EMPTY_PAGINATION: PaginationMeta = {
  page: 1,
  limit: 20,
  total: 0,
  pages: 0,
  hasNext: false,
  hasPrev: false,
};

export default function MenuManagementContainer() {
  const { user } = useAppSelector((state) => state.auth);
  const toast = useToast();
  const isAdmin = user?.role === "admin";

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [query, setQuery] = useState<MenuQuery>(DEFAULT_QUERY);
  const [pagination, setPagination] = useState(EMPTY_PAGINATION);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const activeRequest = useRef<AbortController | null>(null);
  const debouncedSearch = useDebouncedValue(query.search ?? "");
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formErrors, setFormErrors] = useState<ValidationErrors>({});
  const [formData, setFormData] = useState<CreateMenuPayload>({
    ItemName: "",
    price: 0,
    category: "starter",
    available: true,
  });

  useEffect(() => {
    if ((query.search ?? "").trim() !== debouncedSearch.trim()) {
      activeRequest.current?.abort();
      return;
    }

    const controller = new AbortController();
    activeRequest.current?.abort();
    activeRequest.current = controller;
    let redirectingToValidPage = false;
    const requestQuery: MenuQuery = {
      page: query.page ?? 1,
      limit: query.limit ?? 20,
      search: debouncedSearch.trim() || undefined,
      category: query.category || undefined,
      availability: query.availability,
      sort: query.sort,
      order: query.order,
    };

    void getMenuItemsApi(requestQuery, controller.signal)
      .then(({ data }) => {
        if (controller.signal.aborted) return;
        if (!data.pagination) {
          throw new Error("Paginated menu response did not include metadata");
        }
        const lastValidPage = Math.max(1, data.pagination.pages);
        if (data.pagination.page > lastValidPage) {
          redirectingToValidPage = true;
          setQuery((previous) => ({ ...previous, page: lastValidPage }));
          return;
        }
        setMenuItems(data.menuItems);
        setPagination(data.pagination);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        const apiError = err as { response?: { data?: { error?: string } } };
        setError(apiError.response?.data?.error || "Failed to load menu items");
      })
      .finally(() => {
        if (!controller.signal.aborted && !redirectingToValidPage) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [
    debouncedSearch,
    query.availability,
    query.category,
    query.limit,
    query.order,
    query.page,
    query.search,
    query.sort,
    refreshKey,
  ]);

  const refreshMenu = () => {
    activeRequest.current?.abort();
    setLoading(true);
    setError(null);
    setRefreshKey((value) => value + 1);
  };

  const updateQueryAndResetPage = (updates: Partial<MenuQuery>) => {
    activeRequest.current?.abort();
    setLoading(true);
    setError(null);
    setQuery((previous) => ({ ...previous, ...updates, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page === query.page) return;
    activeRequest.current?.abort();
    setLoading(true);
    setError(null);
    setQuery((previous) => ({ ...previous, page }));
  };

  const handleOpenModal = (item?: MenuItem) => {
    setEditingItem(item || null);
    setFormData(
      item
        ? {
            ItemName: item.ItemName,
            price: item.price,
            category: item.category,
            available: item.available,
          }
        : { ItemName: "", price: 0, category: "starter", available: true },
    );
    setFormErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormErrors({});
  };

  const handleFieldChange = (
    field: string,
    value: string | number | boolean,
  ) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((previous) => ({
        ...previous,
        [field]: undefined as unknown as string,
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const errors = validateMenuItem(formData);
    if (hasErrors(errors)) {
      setFormErrors(errors);
      return;
    }
    try {
      if (editingItem) {
        await updateMenuItemApi(editingItem._id, {
          price: formData.price,
          available: formData.available,
        });
      } else {
        await createMenuItemApi(formData);
      }
      handleCloseModal();
      toast.success(editingItem ? "Item updated!" : "Item added!");
      refreshMenu();
    } catch (err) {
      const apiError = err as { response?: { data?: { error?: string } } };
      toast.error(apiError.response?.data?.error || "Failed to save item");
    }
  };

  const handleDelete = async (item: MenuItem) => {
    if (!window.confirm(`Delete "${item.ItemName}"?`)) return;
    try {
      await deleteMenuItemApi(item._id);
      toast.success(`"${item.ItemName}" deleted!`);
      refreshMenu();
    } catch (err) {
      const apiError = err as { response?: { data?: { error?: string } } };
      toast.error(apiError.response?.data?.error || "Failed to delete item");
    }
  };

  const handleToggle = async (item: MenuItem) => {
    try {
      await updateMenuItemApi(item._id, { available: !item.available });
      refreshMenu();
    } catch (err) {
      const apiError = err as { response?: { data?: { error?: string } } };
      toast.error(
        apiError.response?.data?.error || "Failed to update availability",
      );
    }
  };

  return (
    <MenuManagementPresenter
      menuItems={menuItems}
      pagination={pagination}
      loading={loading}
      error={error}
      selectedCategory={query.category ?? "all"}
      searchQuery={query.search ?? ""}
      showModal={showModal}
      editingItem={editingItem}
      formData={formData}
      formErrors={formErrors}
      isAdmin={isAdmin}
      onCategoryChange={(category) =>
        updateQueryAndResetPage({ category: category === "all" ? undefined : category })
      }
      onSearchChange={(search) => updateQueryAndResetPage({ search })}
      onPageChange={handlePageChange}
      onLimitChange={(limit) => updateQueryAndResetPage({ limit })}
      onOpenModal={handleOpenModal}
      onCloseModal={handleCloseModal}
      onFieldChange={handleFieldChange}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
      onToggle={handleToggle}
      onRetry={refreshMenu}
    />
  );
}
