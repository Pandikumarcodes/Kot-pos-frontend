import { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, X } from "lucide-react";
import { useAppSelector } from "../../Store/hooks";
import {
  getUsersApi,
  createUserApi,
  updateUserRoleApi,
  deleteUserApi,
} from "../../services/adminApi/Staff.api";
import type {
  StaffUser,
  CreateUserPayload,
} from "../../services/adminApi/Staff.api";
import { useToast } from "../../Context/ToastContext";
import {
  validateStaff,
  hasErrors,
  type ValidationErrors,
} from "../../utils/validation";

const ALLOWED_ROLES = ["admin", "chef", "waiter", "cashier", "manager"];
const ROLE_EMOJI: Record<string, string> = {
  admin: "⚙️",
  chef: "👨‍🍳",
  waiter: "🍽️",
  cashier: "💳",
  manager: "📋",
};
const STATUS_STYLES: Record<string, string> = {
  active: "bg-kot-stats text-kot-darker",
  locked: "bg-red-100 text-red-700",
};

const Pulse = ({ className }: { className: string }) => (
  <div className={`bg-kot-chart rounded animate-pulse ${className}`} />
);

function SkeletonRow() {
  return (
    <tr className="border-b border-kot-chart">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Pulse className="w-9 h-9 rounded-full" />
          <Pulse className="h-4 w-28" />
        </div>
      </td>
      <td className="px-4 py-3 hidden sm:table-cell">
        <Pulse className="h-5 w-20 rounded-full" />
      </td>
      <td className="px-4 py-3 hidden md:table-cell">
        <Pulse className="h-5 w-16 rounded-full" />
      </td>
      <td className="px-4 py-3">
        <Pulse className="h-7 w-16 ml-auto" />
      </td>
    </tr>
  );
}

export default function StaffPage() {
  const toast = useToast();
  const { user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";

  const [users, setUsers] = useState<StaffUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await getUsersApi();
      setUsers(data.users);
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } } };
      setError(e?.response?.data?.error || "Failed to load staff");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = searchQuery
    ? users.filter(
        (u) =>
          u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.role.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : users;

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
        setUsers(
          users.map((u) =>
            u._id === editingUser._id ? { ...u, role: formData.role } : u,
          ),
        );
      } else {
        const { data } = await createUserApi(formData);
        setUsers([...users, data.user]);
      }
      handleCloseModal();
      toast.success(editingUser ? "Role updated!" : "Staff added!");
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } } };
      toast.error(e?.response?.data?.error || "Failed to save user");
    }
  };

  const handleDelete = async (u: StaffUser) => {
    if (!window.confirm(`Delete "${u.username}"?`)) return;
    try {
      await deleteUserApi(u._id);
      setUsers(users.filter((x) => x._id !== u._id));
      toast.success(`"${u.username}" deleted!`);
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } } };
      toast.error(e?.response?.data?.error || "Failed to delete user");
    }
  };

  const inputCls = (field: string) =>
    `w-full px-3 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-kot-dark focus:border-kot-dark bg-kot-white text-kot-darker placeholder:text-kot-text/50 text-sm transition-colors ${formErrors[field] ? "border-red-500" : "border-kot-chart"}`;

  const activeCount = users.filter((u) => u.status === "active").length;
  const lockedCount = users.filter((u) => u.status === "locked").length;
  const rolesActive = ALLOWED_ROLES.filter((r) =>
    users.some((u) => u.role === r),
  ).length;

  if (error)
    return (
      <div className="h-screen flex items-center justify-center bg-kot-primary px-4">
        <div className="text-center">
          <p className="text-red-600 font-medium mb-3">{error}</p>
          <button
            onClick={fetchUsers}
            className="px-4 py-2 bg-kot-dark text-white rounded-lg hover:bg-kot-darker"
          >
            Retry
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col bg-kot-primary">
      {/* ── Sticky Header ── */}
      <div className="bg-kot-white border-b border-kot-chart shadow-kot sticky top-0 z-10">
        <div className="p-3 sm:p-4 md:p-6 max-w-[2400px] mx-auto">
          {/* Title + Add */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-kot-darker">
                Staff Management
              </h1>
              <p className="text-xs sm:text-sm text-kot-text mt-0.5">
                {users.length} staff members
              </p>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-1.5 bg-kot-dark hover:bg-kot-darker text-white font-semibold px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg text-sm transition-colors"
            >
              <Plus size={16} />{" "}
              <span className="hidden xs:inline">Add Staff</span>
              <span className="xs:hidden">Add</span>
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-kot-text"
              size={16}
            />
            <input
              type="text"
              placeholder="Search by name or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border-2 border-kot-chart rounded-lg focus:outline-none focus:border-kot-dark bg-kot-white text-kot-darker text-sm placeholder:text-kot-text/50"
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "Total", value: users.length, cls: "bg-kot-light" },
              { label: "Active", value: activeCount, cls: "bg-kot-stats" },
              { label: "Locked", value: lockedCount, cls: "bg-red-50" },
              { label: "Roles", value: rolesActive, cls: "bg-kot-light" },
            ].map((s) => (
              <div
                key={s.label}
                className={`${s.cls} rounded-xl p-2 sm:p-3 text-center`}
              >
                <p className="text-xs text-kot-text font-medium hidden sm:block">
                  {s.label}
                </p>
                <p className="text-lg sm:text-2xl font-bold text-kot-darker">
                  {s.value}
                </p>
                <p className="text-[10px] text-kot-text sm:hidden">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 max-w-[2400px] mx-auto w-full">
        {loading ? (
          <div className="bg-kot-white rounded-xl shadow-kot border border-kot-chart overflow-hidden">
            <table className="w-full">
              <thead className="bg-kot-light border-b border-kot-chart">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-kot-text uppercase">
                    Staff
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-kot-text uppercase hidden sm:table-cell">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-kot-text uppercase hidden md:table-cell">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-kot-text uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, i) => (
                  <SkeletonRow key={i} />
                ))}
              </tbody>
            </table>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-kot-text">
            <Search size={48} className="mb-4 text-kot-chart" />
            <p className="text-lg font-medium">No staff found</p>
            <p className="text-sm mt-1">Try adjusting your search</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block bg-kot-white rounded-xl shadow-kot border border-kot-chart overflow-hidden">
              <table className="w-full">
                <thead className="bg-kot-light border-b border-kot-chart">
                  <tr>
                    {["Staff Member", "Role", "Status", "Actions"].map(
                      (h, i) => (
                        <th
                          key={h}
                          className={`px-4 py-3 text-xs font-semibold text-kot-text uppercase ${i === 3 ? "text-right" : "text-left"}`}
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-kot-chart">
                  {filteredUsers.map((u) => (
                    <tr
                      key={u._id}
                      className="hover:bg-kot-primary transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-kot-stats flex items-center justify-center text-kot-darker font-bold text-sm flex-shrink-0">
                            {u.username.charAt(0).toUpperCase()}
                          </div>
                          <p className="font-semibold text-kot-darker">
                            {u.username}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-kot-light text-kot-darker">
                          {ROLE_EMOJI[u.role] ?? "👤"} {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${STATUS_STYLES[u.status] ?? "bg-kot-light text-kot-text"}`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenModal(u)}
                            className="p-2 text-kot-dark hover:bg-kot-light rounded-lg transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          {isAdmin && (
                            <button
                              onClick={() => handleDelete(u)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden space-y-2">
              {filteredUsers.map((u) => (
                <div
                  key={u._id}
                  className="bg-kot-white rounded-xl shadow-kot p-3 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-kot-stats flex items-center justify-center text-kot-darker font-bold flex-shrink-0">
                    {u.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-kot-darker truncate">
                      {u.username}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs">
                        {ROLE_EMOJI[u.role]} {u.role}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${STATUS_STYLES[u.status] ?? "bg-kot-light text-kot-text"}`}
                      >
                        {u.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleOpenModal(u)}
                      className="p-1.5 text-kot-dark hover:bg-kot-light rounded-lg"
                    >
                      <Edit2 size={14} />
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(u)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Modal ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-kot-white rounded-t-3xl sm:rounded-xl shadow-kot-lg w-full sm:max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-kot-chart">
              <h2 className="text-lg font-bold text-kot-darker">
                {editingUser
                  ? `Edit: ${editingUser.username}`
                  : "Add New Staff"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-kot-text hover:text-kot-darker"
              >
                <X size={22} />
              </button>
            </div>
            <form
              onSubmit={handleSubmit}
              className="p-5 space-y-4 max-h-[80vh] overflow-y-auto"
            >
              {!editingUser && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-kot-darker mb-1">
                      Username *
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) =>
                        handleFieldChange("username", e.target.value)
                      }
                      className={inputCls("username")}
                      placeholder="e.g. john_waiter"
                    />
                    {formErrors.username && (
                      <p className="mt-1 text-xs text-red-500">
                        {formErrors.username}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-kot-darker mb-1">
                      Password *
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        handleFieldChange("password", e.target.value)
                      }
                      className={inputCls("password")}
                      placeholder="Min 8 chars, uppercase, number"
                    />
                    {formErrors.password && (
                      <p className="mt-1 text-xs text-red-500">
                        {formErrors.password}
                      </p>
                    )}
                  </div>
                </>
              )}
              <div>
                <label className="block text-sm font-semibold text-kot-darker mb-1">
                  Role *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => handleFieldChange("role", e.target.value)}
                  className={inputCls("role")}
                >
                  {ALLOWED_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {ROLE_EMOJI[r]} {r.charAt(0).toUpperCase() + r.slice(1)}
                    </option>
                  ))}
                </select>
                {formErrors.role && (
                  <p className="mt-1 text-xs text-red-500">{formErrors.role}</p>
                )}
              </div>
              {!editingUser && (
                <div>
                  <label className="block text-sm font-semibold text-kot-darker mb-1">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      handleFieldChange("status", e.target.value)
                    }
                    className={inputCls("status")}
                  >
                    <option value="active">Active</option>
                    <option value="locked">Locked</option>
                  </select>
                </div>
              )}
              {editingUser && (
                <p className="text-xs text-kot-text bg-kot-light px-3 py-2 rounded-lg">
                  ℹ️ Only role can be updated.
                </p>
              )}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2.5 border-2 border-kot-chart text-kot-darker font-semibold rounded-lg hover:bg-kot-light"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-kot-dark hover:bg-kot-darker text-white font-semibold rounded-lg"
                >
                  {editingUser ? "Update Role" : "Add Staff"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
