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
  TableWrapper,
  Thead,
  Th,
  Tbody,
  Tr,
  Td,
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
        <PageHeader
          title="Staff Management"
          sub={`${users.length} staff members`}
          actions={
            isAdmin && (
              <Button
                size="sm"
                onClick={() => onOpenModal()}
                className="flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Add Staff
              </Button>
            )
          }
        />

        {/* Error banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between">
            <p className="text-sm text-red-600">{error}</p>
            <Button variant="secondary" size="sm" onClick={onRetry}>
              Retry
            </Button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            label="Total Staff"
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

        {/* Search */}
        <SearchInput
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Search by username or role…"
        />

        {/* Table */}
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
                <Pulse className="h-8 w-20 rounded-lg" />
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
          <TableWrapper>
            <Thead>
              <tr>
                <Th>Username</Th>
                <Th>Role</Th>
                <Th>Status</Th>
                {isAdmin && <Th>Actions</Th>}
              </tr>
            </Thead>
            <Tbody>
              {filteredUsers.map((user) => (
                <Tr key={user._id}>
                  <Td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-kot-light flex items-center justify-center text-base flex-shrink-0">
                        {ROLE_EMOJI[user.role] ?? "👤"}
                      </div>
                      <span className="font-mono text-sm text-kot-darker">
                        @{user.username}
                      </span>
                    </div>
                  </Td>
                  <Td>
                    <Badge variant="neutral" className="capitalize">
                      {user.role}
                    </Badge>
                  </Td>
                  <Td>
                    <StatusBadge status={user.status} />
                  </Td>
                  {isAdmin && (
                    <Td>
                      <div className="flex gap-1">
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
                    </Td>
                  )}
                </Tr>
              ))}
            </Tbody>
          </TableWrapper>
        )}

        {/* Modal */}
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
