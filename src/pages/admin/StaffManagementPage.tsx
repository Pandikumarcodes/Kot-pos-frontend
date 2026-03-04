// src/pages/admin/StaffPage.tsx
import { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, X } from "lucide-react";
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

export default function StaffPage() {
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<StaffUser | null>(null);
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
      const error = err as { response?: { data?: { error?: string } } };
      setError(error?.response?.data?.error || "Failed to load staff");
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

  const handleOpenModal = (user?: StaffUser) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username,
        password: "",
        role: user.role,
        status: user.status,
      });
    } else {
      setEditingUser(null);
      setFormData({
        username: "",
        password: "",
        role: "waiter",
        status: "active",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        // Only role can be updated per backend
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
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      alert(error?.response?.data?.error || "Failed to save user");
    }
  };

  const handleDelete = async (user: StaffUser) => {
    if (!window.confirm(`Delete "${user.username}"?`)) return;
    try {
      await deleteUserApi(user._id);
      setUsers(users.filter((u) => u._id !== user._id));
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      alert(error?.response?.data?.error || "Failed to delete user");
    }
  };

  const inputClass =
    "w-full px-3 py-2.5 border-2 border-kot-chart rounded-lg focus:outline-none focus:ring-2 focus:ring-kot-dark focus:border-kot-dark bg-kot-white text-kot-darker placeholder:text-kot-text/50 text-sm";

  // ── Stats ──
  const totalByRole = ALLOWED_ROLES.map((role) => ({
    role,
    count: users.filter((u) => u.role === role).length,
  })).filter((r) => r.count > 0);

  const activeCount = users.filter((u) => u.status === "active").length;
  const lockedCount = users.filter((u) => u.status === "locked").length;

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-kot-primary">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-kot-dark border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-kot-text">Loading staff...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-kot-primary">
        <div className="text-center">
          <p className="text-red-600 font-medium mb-3">{error}</p>
          <button
            onClick={fetchUsers}
            className="px-4 py-2 bg-kot-dark text-white rounded-lg hover:bg-kot-darker transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-kot-primary">
      {/* Header */}
      <div className="bg-kot-white border-b border-kot-chart shadow-kot">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-kot-darker">
                Staff Management
              </h1>
              <p className="text-sm text-kot-text mt-1">
                {users.length} staff members registered
              </p>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 bg-kot-dark hover:bg-kot-darker text-white font-semibold px-4 py-2.5 rounded-lg transition-colors"
            >
              <Plus size={20} />
              Add Staff
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-kot-text"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by name or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border-2 border-kot-chart rounded-lg focus:outline-none focus:ring-2 focus:ring-kot-dark bg-kot-white text-kot-darker placeholder:text-kot-text/50"
            />
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-kot-light rounded-xl p-4 border border-kot-chart">
              <p className="text-xs text-kot-text font-medium">Total Staff</p>
              <p className="text-2xl font-bold text-kot-darker mt-1">
                {users.length}
              </p>
            </div>
            <div className="bg-kot-stats rounded-xl p-4 border border-kot-chart">
              <p className="text-xs text-kot-dark font-medium">Active</p>
              <p className="text-2xl font-bold text-kot-darker mt-1">
                {activeCount}
              </p>
            </div>
            <div className="bg-red-50 rounded-xl p-4 border border-red-200">
              <p className="text-xs text-red-600 font-medium">Locked</p>
              <p className="text-2xl font-bold text-red-700 mt-1">
                {lockedCount}
              </p>
            </div>
            <div className="bg-kot-light rounded-xl p-4 border border-kot-chart">
              <p className="text-xs text-kot-text font-medium">Roles Active</p>
              <p className="text-2xl font-bold text-kot-darker mt-1">
                {totalByRole.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Staff Table */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-kot-text">
            <Search size={64} className="mb-4 text-kot-chart" />
            <p className="text-xl font-medium">No staff found</p>
            <p className="text-sm mt-2">Try adjusting your search</p>
          </div>
        ) : (
          <div className="bg-kot-white rounded-xl shadow-kot border border-kot-chart overflow-hidden">
            <table className="w-full">
              <thead className="bg-kot-light border-b border-kot-chart">
                <tr>
                  {["Staff Member", "Role", "Status", "Actions"].map((h, i) => (
                    <th
                      key={h}
                      className={`px-6 py-3 text-xs font-semibold text-kot-text uppercase tracking-wide ${i === 3 ? "text-right" : "text-left"}`}
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
                    {/* Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-kot-stats flex items-center justify-center text-kot-darker font-bold text-sm">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <p className="font-semibold text-kot-darker">
                          {user.username}
                        </p>
                      </div>
                    </td>
                    {/* Role */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-kot-light text-kot-darker">
                        {ROLE_EMOJI[user.role] ?? "👤"} {user.role}
                      </span>
                    </td>
                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${STATUS_STYLES[user.status] ?? "bg-kot-light text-kot-text"}`}
                      >
                        {user.status}
                      </span>
                    </td>
                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(user)}
                          className="p-2 text-kot-dark hover:bg-kot-light rounded-lg transition-colors"
                          title="Edit role"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete user"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-kot-white rounded-xl shadow-kot-lg max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-kot-chart">
              <h2 className="text-xl font-bold text-kot-darker">
                {editingUser
                  ? `Edit: ${editingUser.username}`
                  : "Add New Staff"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-kot-text hover:text-kot-darker transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Username — new only */}
              {!editingUser && (
                <div>
                  <label className="block text-sm font-semibold text-kot-darker mb-1">
                    Username *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    className={inputClass}
                    placeholder="e.g. john_waiter"
                  />
                </div>
              )}

              {/* Password — new only */}
              {!editingUser && (
                <div>
                  <label className="block text-sm font-semibold text-kot-darker mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className={inputClass}
                    placeholder="Min 8 chars, uppercase, number"
                  />
                </div>
              )}

              {/* Role */}
              <div>
                <label className="block text-sm font-semibold text-kot-darker mb-1">
                  Role *
                </label>
                <select
                  required
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className={inputClass}
                >
                  {ALLOWED_ROLES.map((role) => (
                    <option key={role} value={role}>
                      {ROLE_EMOJI[role]}{" "}
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status — new only */}
              {!editingUser && (
                <div>
                  <label className="block text-sm font-semibold text-kot-darker mb-1">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className={inputClass}
                  >
                    <option value="active">Active</option>
                    <option value="locked">Locked</option>
                  </select>
                </div>
              )}

              {editingUser && (
                <p className="text-xs text-kot-text bg-kot-light px-3 py-2 rounded-lg">
                  ℹ️ Only role can be updated. To change status, contact system
                  admin.
                </p>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2.5 border-2 border-kot-chart text-kot-darker font-semibold rounded-lg hover:bg-kot-light transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-kot-dark hover:bg-kot-darker text-white font-semibold rounded-lg transition-colors"
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
