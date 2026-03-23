import { Plus, Edit2, Trash2 } from "lucide-react";
import {
  Button,
  IconButton,
  Input,
  Select,
  Pulse,
  PageHeader,
  SearchInput,
  EmptyState,
  Modal,
  Badge,
  StatCard,
  StatusBadge,
} from "../../../UiComponents/Index";
import {
  ALLOWED_ROLES,
  ROLE_EMOJI,
  type StaffPresenterProps,
} from "./staff.types";

export function StaffPresenter({
  users,
  filteredUsers,
  activeCount,
  lockedCount,
  rolesActive,
  loading,
  error,
  searchQuery,
  showModal,
  editingUser,
  formData,
  formErrors,
  isAdmin,
  onSearchChange,
  onOpenModal,
  onCloseModal,
  onFieldChange,
  onSubmit,
  onDelete,
  onRetry,
}: StaffPresenterProps) {
  return (
    <div className="min-h-screen bg-kot-primary">
      <main className="p-3 sm:p-4 lg:p-6 max-w-[2400px] mx-auto space-y-4">
        {/* ── Header ── */}
        <PageHeader
          title="Staff"
          sub={`${users.length} members`}
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
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4 flex items-center justify-between gap-3">
            <p className="text-sm text-red-600">{error}</p>
            <Button variant="secondary" size="sm" onClick={onRetry}>
              Retry
            </Button>
          </div>
        )}

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <StatCard
            label="Total"
            value={users.length}
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
        <SearchInput
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Search by username or role…"
        />

        {/* ── Content ── */}
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="bg-kot-white rounded-xl p-4 flex gap-4 items-center"
              >
                <Pulse className="w-10 h-10 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Pulse className="h-4 w-32" />
                  <Pulse className="h-3 w-24" />
                </div>
                <Pulse className="h-6 w-16 rounded-full" />
              </div>
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <EmptyState
            icon="👥"
            title="No staff found"
            sub={
              searchQuery
                ? "Try a different search"
                : "Add your first staff member"
            }
            action={
              !searchQuery &&
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
              {filteredUsers.map((user) => (
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
                  {filteredUsers.map((user) => (
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
              <Button size="md" type="submit" className="flex-1">
                {editingUser ? "Update Role" : "Add Staff"}
              </Button>
            </div>
          </form>
        </Modal>
      </main>
    </div>
  );
}
