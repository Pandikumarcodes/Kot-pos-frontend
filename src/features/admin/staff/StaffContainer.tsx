import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "../../../state/hooks";
import {
  getUsersApi,
  createUserApi,
  updateUserRoleApi,
  deleteUserApi,
} from "../../../services/admin/staff.api";
import type {
  StaffUser,
  CreateUserPayload,
  StaffQuery,
} from "../../../services/admin/staff.api";
import { useToast } from "../../../contexts/toastContext";
import {
  validateStaff,
  hasErrors,
  type ValidationErrors,
} from "../../../utils/validation";
import { StaffPresenter as StaffManagementPresenter } from "./StaffPresenter";
import { ALLOWED_ROLES } from "./staff.types";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";
import type { PaginationMeta } from "../../../types/query";

const DEFAULT_QUERY: StaffQuery = { page: 1, limit: 20, search: "" };

const EMPTY_PAGINATION: PaginationMeta = {
  page: 1,
  limit: 20,
  total: 0,
  pages: 0,
  hasNext: false,
  hasPrev: false,
};

const isNoUsersResponse = (error: unknown): boolean => {
  const apiError = error as {
    response?: { status?: number; data?: { error?: string } };
  };
  return (
    apiError.response?.status === 404 &&
    apiError.response.data?.error === "No users found"
  );
};

export default function StaffManagementContainer() {
  const toast = useToast();
  const { user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";

  const [users, setUsers] = useState<StaffUser[]>([]);
  const [query, setQuery] = useState<StaffQuery>(DEFAULT_QUERY);
  const [pagination, setPagination] = useState(EMPTY_PAGINATION);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const activeRequest = useRef<AbortController | null>(null);
  const debouncedSearch = useDebouncedValue(query.search ?? "");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<StaffUser | null>(null);
  const [formErrors, setFormErrors] = useState<ValidationErrors>({});
  const [formData, setFormData] = useState<CreateUserPayload>({
    username: "",
    password: "",
    role: "waiter",
    status: "active",
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
    const requestQuery: StaffQuery = {
      page: query.page ?? 1,
      limit: query.limit ?? 20,
      search: debouncedSearch.trim() || undefined,
      role: query.role,
      status: query.status,
      sort: query.sort,
      order: query.order,
    };

    void getUsersApi(requestQuery, controller.signal)
      .then(({ data }) => {
        if (controller.signal.aborted) return;
        if (!data.pagination) {
          throw new Error("Paginated staff response did not include metadata");
        }
        const lastValidPage = Math.max(1, data.pagination.pages);
        if (data.pagination.page > lastValidPage) {
          redirectingToValidPage = true;
          setQuery((previous) => ({ ...previous, page: lastValidPage }));
          return;
        }
        setUsers(data.users);
        setPagination(data.pagination);
        setError(null);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        if (isNoUsersResponse(err)) {
          if ((query.page ?? 1) > 1) {
            redirectingToValidPage = true;
            setQuery((previous) => ({ ...previous, page: 1 }));
            return;
          }
          setUsers([]);
          setPagination({
            ...EMPTY_PAGINATION,
            limit: query.limit ?? 20,
          });
          setError(null);
          return;
        }
        const e = err as { response?: { data?: { error?: string } } };
        setError(e?.response?.data?.error || "Failed to load staff");
      })
      .finally(() => {
        if (!controller.signal.aborted && !redirectingToValidPage) {
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, [
    debouncedSearch,
    query.limit,
    query.order,
    query.page,
    query.role,
    query.search,
    query.sort,
    query.status,
    refreshKey,
  ]);

  const refreshUsers = () => {
    activeRequest.current?.abort();
    setLoading(true);
    setError(null);
    setRefreshKey((value) => value + 1);
  };

  const updateQueryAndResetPage = (updates: Partial<StaffQuery>) => {
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

  const activeCount = users.filter((u) => u.status === "active").length;
  const lockedCount = users.filter((u) => u.status === "locked").length;
  const rolesActive = ALLOWED_ROLES.filter((r) =>
    users.some((u) => u.role === r),
  ).length;

  const handleOpenModal = (u?: StaffUser) => {
    setEditingUser(u || null);
    setFormData(
      u
        ? { username: u.username, password: "", role: u.role, status: u.status }
        : { username: "", password: "", role: "waiter", status: "active" },
    );
    setFormErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormErrors({});
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field])
      setFormErrors((prev) => ({
        ...prev,
        [field]: undefined as unknown as string,
      }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateStaff(formData, !!editingUser);
    if (hasErrors(errors)) {
      setFormErrors(errors);
      return;
    }
    try {
      if (editingUser) {
        await updateUserRoleApi(editingUser._id, formData.role);
      } else {
        await createUserApi(formData);
      }
      handleCloseModal();
      toast.success(editingUser ? "Role updated!" : "Staff added!");
      refreshUsers();
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } } };
      toast.error(e?.response?.data?.error || "Failed to save user");
    }
  };

  const handleDelete = async (u: StaffUser) => {
    if (!window.confirm(`Delete "${u.username}"?`)) return;
    try {
      await deleteUserApi(u._id);
      toast.success(`"${u.username}" deleted!`);
      refreshUsers();
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } } };
      toast.error(e?.response?.data?.error || "Failed to delete user");
    }
  };

  return (
    <StaffManagementPresenter
      users={users}
      pagination={pagination}
      activeCount={activeCount}
      lockedCount={lockedCount}
      rolesActive={rolesActive}
      loading={loading}
      error={error}
      searchQuery={query.search ?? ""}
      roleFilter={query.role ?? ""}
      statusFilter={query.status ?? ""}
      showModal={showModal}
      editingUser={editingUser}
      formData={formData}
      formErrors={formErrors}
      isAdmin={isAdmin}
      onSearchChange={(search) => updateQueryAndResetPage({ search })}
      onRoleChange={(role) =>
        updateQueryAndResetPage({ role: role || undefined })
      }
      onStatusChange={(status) =>
        updateQueryAndResetPage({ status: status || undefined })
      }
      onPageChange={handlePageChange}
      onLimitChange={(limit) => updateQueryAndResetPage({ limit })}
      onOpenModal={handleOpenModal}
      onCloseModal={handleCloseModal}
      onFieldChange={handleFieldChange}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
      onRetry={refreshUsers}
    />
  );
}
