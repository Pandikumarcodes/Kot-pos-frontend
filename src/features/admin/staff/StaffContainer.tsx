import { useState, useEffect, useCallback } from "react";
import { useAppSelector } from "../../../state/hooks";
import { resolveOperationalBranchId } from "../../../state/branchContext";
import {
  getUsersApi,
  createUserApi,
  updateUserRoleApi,
  deleteUserApi,
} from "../../../services/admin/staff.api";
import type {
  StaffUser,
  CreateUserPayload,
  StaffSortField,
  StaffStatus,
  StaffPagination,
} from "../../../services/admin/staff.api";
import { useToast } from "../../../contexts/toastContext";
import {
  validateStaff,
  hasErrors,
  type ValidationErrors,
} from "../../../utils/validation";
import { StaffPresenter as StaffManagementPresenter } from "./StaffPresenter";
import { ALLOWED_ROLES } from "./staff.types";
import { useQueryState } from "../../../hooks/useQueryState";
import { useFilters, usePagination, useSearch, useSorting } from "../../../query/hooks";

const EMPTY_PAGINATION: StaffPagination = {
  page: 1,
  limit: 20,
  total: 0,
  pages: 0,
  hasNext: false,
  hasPrev: false,
};

const isStaffSortField = (value: string | undefined): value is StaffSortField =>
  value === "name" || value === "createdAt";

const asString = (value: unknown) => (typeof value === "string" ? value : "");

export default function StaffManagementContainer() {
  const toast = useToast();
  const { user } = useAppSelector((state) => state.auth);
  const selectedBranchId = useAppSelector((state) => state.ui.selectedBranchId);
  const branchId = resolveOperationalBranchId(user?.branchId, selectedBranchId);
  const requiresBranchSelection = user?.role === "admin" && !user.branchId;
  const isAdmin = user?.role === "admin";
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [pagination, setPagination] = useState<StaffPagination>(EMPTY_PAGINATION);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { query, updateQuery } = useQueryState({ initialState: { page: 1, pageSize: 20 } });
  const searchState = useSearch(query.search ?? "");
  const filterState = useFilters(query.filters ?? {});
  const sortingState = useSorting({ sortBy: query.sortBy, sortOrder: query.sortOrder });
  const paginationState = usePagination({ page: query.page, pageSize: query.pageSize });
  const sortBy = isStaffSortField(sortingState.sortBy) ? sortingState.sortBy : "";
  const sortOrder = sortingState.sortOrder ?? "asc";
  const roleFilter = asString(filterState.filters.role);
  const statusFilter = asString(filterState.filters.status);

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<StaffUser | null>(null);
  const [formErrors, setFormErrors] = useState<ValidationErrors>({});
  const [formData, setFormData] = useState<CreateUserPayload>({
    username: "",
    password: "",
    role: "waiter",
    status: "active",
  });
  const [saving, setSaving] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getUsersApi({
        branchId,
        page: query.page,
        limit: query.pageSize,
        search: searchState.debouncedSearch.trim() || undefined,
        role: roleFilter || undefined,
        status: (statusFilter || undefined) as StaffStatus | undefined,
        sort: isStaffSortField(query.sortBy) ? query.sortBy : undefined,
        order: query.sortOrder,
      });
      setUsers(data.users);
      setPagination(data.pagination ?? EMPTY_PAGINATION);
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } } };
      setError(e?.response?.data?.error || "Failed to load staff");
    } finally {
      setLoading(false);
    }
  }, [branchId, query.page, query.pageSize, query.sortBy, query.sortOrder, roleFilter, statusFilter, searchState.debouncedSearch]);

  useEffect(() => {
    const request = window.setTimeout(() => void fetchUsers(), 0);
    return () => window.clearTimeout(request);
  }, [fetchUsers]);

  useEffect(() => {
    updateQuery({ search: searchState.debouncedSearch || undefined, page: 1 });
  }, [searchState.debouncedSearch, updateQuery]);
  useEffect(() => {
    updateQuery({ sortBy: sortingState.sortBy, sortOrder: sortingState.sortOrder, page: 1 });
  }, [sortingState.sortBy, sortingState.sortOrder, updateQuery]);
  useEffect(() => {
    updateQuery({ filters: filterState.filters, page: 1 });
  }, [filterState.filters, updateQuery]);
  useEffect(() => {
    updateQuery({ page: paginationState.page, pageSize: paginationState.pageSize });
  }, [paginationState.page, paginationState.pageSize, updateQuery]);

  const handleRetry = () => { void fetchUsers(); };

  const handleOpenModal = (u?: StaffUser) => {
    setEditingUser(u || null);
    setFormData(u
      ? { username: u.username, password: "", role: u.role, status: u.status }
      : { username: "", password: "", role: "waiter", status: "active" });
    setFormErrors({});
    setShowModal(true);
  };
  const handleCloseModal = () => { setShowModal(false); setEditingUser(null); setFormErrors({}); };
  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors((prev) => ({ ...prev, [field]: undefined as unknown as string }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    if (requiresBranchSelection && !branchId) {
      toast.error("Select a branch before adding staff");
      return;
    }
    const errors = validateStaff(formData, !!editingUser);
    if (hasErrors(errors)) { setFormErrors(errors); return; }
    try {
      setSaving(true);
      if (editingUser) {
        await updateUserRoleApi(editingUser._id, formData.role);
        setUsers((current) => current.map((u) => u._id === editingUser._id ? { ...u, role: formData.role } : u));
      } else {
        const { data } = await createUserApi(formData, branchId);
        setUsers((current) => [...current, data.user]);
      }
      handleCloseModal();
      toast.success(editingUser ? "Role updated!" : "Staff added!");
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } } };
      toast.error(e?.response?.data?.error || "Failed to save user");
    } finally {
      setSaving(false);
    }
  };
  const handleDelete = async (u: StaffUser) => {
    if (!window.confirm(`Delete "${u.username}"?`)) return;
    try {
      await deleteUserApi(u._id);
      setUsers((current) => current.filter((x) => x._id !== u._id));
      toast.success(`"${u.username}" deleted!`);
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } } };
      toast.error(e?.response?.data?.error || "Failed to delete user");
    }
  };

  return (
    <StaffManagementPresenter
      users={users}
      pagination={pagination}
      activeCount={users.filter((u) => u.status === "active").length}
      lockedCount={users.filter((u) => u.status === "locked").length}
      rolesActive={ALLOWED_ROLES.filter((r) => users.some((u) => u.role === r)).length}
      loading={loading}
      error={error}
      search={searchState.search}
      roleFilter={roleFilter}
      statusFilter={statusFilter}
      sortBy={sortBy}
      sortOrder={sortOrder}
      showModal={showModal}
      editingUser={editingUser}
      formData={formData}
      formErrors={formErrors}
      saving={saving}
      isAdmin={isAdmin}
      onSearchChange={(value) => { searchState.onSearchChange(value); paginationState.setPage(1); }}
      onRoleChange={(value) => { filterState.setFilter("role", value || undefined); paginationState.setPage(1); }}
      onStatusChange={(value) => { filterState.setFilter("status", value || undefined); paginationState.setPage(1); }}
      onSortChange={(value) => { sortingState.setSort((value || undefined) as StaffSortField | undefined, sortOrder); paginationState.setPage(1); }}
      onSortOrderChange={() => { if (sortBy) sortingState.setSort(sortBy, sortOrder === "asc" ? "desc" : "asc"); }}
      onPageChange={paginationState.setPage}
      onOpenModal={handleOpenModal}
      onCloseModal={handleCloseModal}
      onFieldChange={handleFieldChange}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
      onRetry={handleRetry}
    />
  );
}
