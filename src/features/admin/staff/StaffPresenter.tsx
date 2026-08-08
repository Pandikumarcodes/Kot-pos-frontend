import { Plus, Edit2, Trash2 } from "lucide-react";
import {
  Button,
  IconButton,
  Input,
  Select,
  PageHeader,
  SearchBar,
  FilterBar,
  FilterDropdown,
  SortDropdown,
  ActiveFilterChips,
  Pagination,
  LoadingSkeleton,
  RetryPanel,
  Toolbar,
  PageContainer,
  EmptyState,
  Modal,
  Badge,
  StatCard,
  StatusBadge,
} from "../../../components/ui/index";
import {
  ALLOWED_ROLES,
  ROLE_EMOJI,
  type StaffPresenterProps,
} from "./staff.types";

export function StaffPresenter({
  users,
  pagination,
  activeCount,
  lockedCount,
  rolesActive,
  loading,
  error,
  search,
  roleFilter,
  statusFilter,
  sortBy,
  sortOrder,
  showModal,
  editingUser,
  formData,
  formErrors,
  saving,
  isAdmin,
  onSearchChange,
  onRoleChange,
  onStatusChange,
  onSortChange,
  onSortOrderChange,
  onPageChange,
  onOpenModal,
  onCloseModal,
  onFieldChange,
  onSubmit,
  onDelete,
  onRetry,
}: StaffPresenterProps) {
  return (
    <PageContainer>
      <div className="space-y-4">
        {/* ── Header ── */}
        <PageHeader
          title="Staff"
          sub={`${pagination.total} members`}
          actions={
            isAdmin && (
              <Button
                size="sm"
                onClick={() => onOpenModal()}
                className="flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Staff</span>
                <span className="sm:hidden">Add</span>
              </Button>
            )
          }
        />

        {/* ── Error ── */}
        {error && <RetryPanel onRetry={onRetry} title="Staff unavailable" message={error} />}

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <StatCard
            label="Total"
            value={pagination.total}
            bg="bg-kot-white"
            loading={loading}
          />
          <StatCard
            label="Active"
            value={activeCount}
            bg="bg-kot-stats"
            loading={loading}
          />
          <StatCard
            label="Locked"
            value={lockedCount}
            bg="bg-red-50"
            loading={loading}
          />
          <StatCard
            label="Active Roles"
            value={rolesActive}
            bg="bg-blue-50"
            loading={loading}
          />
        </div>

        {/* ── Search ── */}
        <SearchBar
          value={search}
          onChange={onSearchChange}
          placeholder="Search by username"
        />
        <Toolbar>
          <FilterBar>
            <FilterDropdown label="Role" value={roleFilter} options={ALLOWED_ROLES.map((role) => ({ value: role, label: role.charAt(0).toUpperCase() + role.slice(1) }))} onChange={onRoleChange} />
            <FilterDropdown label="Status" value={statusFilter} options={[{ value: "active", label: "Active" }, { value: "locked", label: "Locked" }, { value: "accepted", label: "Accepted" }]} onChange={onStatusChange} />
            <SortDropdown label="Sort by" value={sortBy} options={[{ value: "name", label: "Username" }, { value: "createdAt", label: "Date created" }]} onChange={onSortChange} />
            {sortBy && <Button type="button" variant="secondary" size="sm" onClick={onSortOrderChange}>{sortOrder === "asc" ? "Ascending" : "Descending"}</Button>}
          </FilterBar>
        </Toolbar>
        <ActiveFilterChips
          filters={[
            ...(roleFilter ? [{ key: "role", label: "Role", value: roleFilter }] : []),
            ...(statusFilter ? [{ key: "status", label: "Status", value: statusFilter }] : []),
          ]}
          onRemove={(key) => key === "role" ? onRoleChange("") : onStatusChange("")}
          onClear={() => { onRoleChange(""); onStatusChange(""); }}
        />

        {/* ── Content ── */}
        {loading ? (
          <LoadingSkeleton rows={6} className="rounded-xl bg-kot-white p-4" />
        ) : users.length === 0 ? (
          <EmptyState
            icon="👥"
            title="No staff found"
            sub={
              search
                ? "Try a different search"
                : "Add your first staff member"
            }
            action={
              !search &&
              isAdmin && (
                <Button size="sm" onClick={() => onOpenModal()}>
                  Add Staff
                </Button>
              )
            }
          />
        ) : (
          <>
            {/* ── Mobile: card list ── */}
            <div className="sm:hidden space-y-2">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="bg-kot-white rounded-2xl p-4 shadow-kot"
                >
                  <div className="flex items-center justify-between gap-3">
                    {/* Left: avatar + info */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-kot-light flex items-center justify-center text-lg flex-shrink-0">
                        {ROLE_EMOJI[user.role] ?? "👤"}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-kot-darker text-sm truncate">
                          @{user.username}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge
                            variant="neutral"
                            className="capitalize text-xs"
                          >
                            {user.role}
                          </Badge>
                          <StatusBadge status={user.status} />
                        </div>
                      </div>
                    </div>

                    {/* Right: actions */}
                    {isAdmin && (
                      <div className="flex gap-1 flex-shrink-0">
                        <IconButton
                          onClick={() => onOpenModal(user)}
                          title="Edit Role"
                        >
                          <Edit2 className="w-4 h-4" />
                        </IconButton>
                        <IconButton
                          variant="danger"
                          onClick={() => onDelete(user)}
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </IconButton>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* ── Desktop: table ── */}
            <div className="hidden sm:block overflow-hidden rounded-xl border border-kot-chart bg-kot-white shadow-kot">
              <table className="w-full">
                <thead className="bg-kot-light border-b border-kot-chart">
                  <tr>
                    {[
                      "Username",
                      "Role",
                      "Status",
                      ...(isAdmin ? ["Actions"] : []),
                    ].map((h, i) => (
                      <th
                        key={h}
                        className={`px-4 py-3 text-xs font-semibold text-kot-text uppercase tracking-wide ${i === 3 ? "text-right" : "text-left"}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-kot-chart">
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-kot-primary transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-kot-light flex items-center justify-center text-base flex-shrink-0">
                            {ROLE_EMOJI[user.role] ?? "👤"}
                          </div>
                          <span className="font-mono text-sm text-kot-darker">
                            @{user.username}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="neutral" className="capitalize">
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={user.status} />
                      </td>
                      {isAdmin && (
                        <td className="px-4 py-3">
                          <div className="flex gap-1 justify-end">
                            <IconButton
                              onClick={() => onOpenModal(user)}
                              title="Edit Role"
                            >
                              <Edit2 className="w-4 h-4" />
                            </IconButton>
                            <IconButton
                              variant="danger"
                              onClick={() => onDelete(user)}
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </IconButton>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ── Modal ── */}
        {!loading && !error && pagination.total > 0 && (
          <Pagination
            state={{ page: pagination.page, pageSize: pagination.limit, total: pagination.total }}
            onPageChange={onPageChange}
          />
        )}

        <Modal
          open={showModal}
          title={editingUser ? "Edit Staff Role" : "Add Staff Member"}
          onClose={onCloseModal}
        >
          <form onSubmit={onSubmit} className="space-y-3">
            {!editingUser && (
              <>
                <Input
                  label="Username *"
                  value={formData.username}
                  onChange={(e) => onFieldChange("username", e.target.value)}
                  error={formErrors.username}
                  placeholder="johndoe"
                />
                <Input
                  label="Password *"
                  type="password"
                  value={formData.password}
                  onChange={(e) => onFieldChange("password", e.target.value)}
                  error={formErrors.password}
                  placeholder="Min 6 characters"
                />
              </>
            )}
            <Select
              label="Role *"
              value={formData.role}
              onChange={(e) => onFieldChange("role", e.target.value)}
              error={formErrors.role}
            >
              <option value="">Select role</option>
              {ALLOWED_ROLES.map((r) => (
                <option key={r} value={r}>
                  {ROLE_EMOJI[r] ?? ""} {r.charAt(0).toUpperCase() + r.slice(1)}
                </option>
              ))}
            </Select>
            <div className="flex gap-3 pt-2">
              <Button
                variant="secondary"
                size="md"
                type="button"
                onClick={onCloseModal}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button size="md" type="submit" className="flex-1" disabled={saving}>
                {saving ? "Saving..." : editingUser ? "Update Role" : "Add Staff"}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </PageContainer>
  );
}
