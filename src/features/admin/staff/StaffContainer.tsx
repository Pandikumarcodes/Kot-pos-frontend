import { useState, useEffect } from "react";
import { useAppSelector } from "../../../Store/hooks";
import {
  getUsersApi,
  createUserApi,
  updateUserRoleApi,
  deleteUserApi,
} from "../../../services/adminApi/Staff.api";
import type {
  StaffUser,
  CreateUserPayload,
} from "../../../services/adminApi/Staff.api";
import { useToast } from "../../../Context/ToastContext";
import {
  validateStaff,
  hasErrors,
  type ValidationErrors,
} from "../../../utils/validation";
import { StaffPresenter as StaffManagementPresenter } from "./StaffPresenter";
import { ALLOWED_ROLES } from "./staff.types";

export default function StaffManagementContainer() {
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

  useEffect(() => {
    fetchUsers();
  }, []);

  // Derived
  const filteredUsers = searchQuery
    ? users.filter(
        (u) =>
          u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.role.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : users;

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
    const errors = validateStaff(
      {
        name: formData.username,
        username: formData.username,
        password: formData.password,
        role: formData.role,
      },
      !!editingUser,
    );
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

  return (
    <StaffManagementPresenter
      users={users}
      filteredUsers={filteredUsers}
      activeCount={activeCount}
      lockedCount={lockedCount}
      rolesActive={rolesActive}
      loading={loading}
      error={error}
      searchQuery={searchQuery}
      showModal={showModal}
      editingUser={editingUser}
      formData={formData}
      formErrors={formErrors}
      isAdmin={isAdmin}
      onSearchChange={setSearchQuery}
      onOpenModal={handleOpenModal}
      onCloseModal={handleCloseModal}
      onFieldChange={handleFieldChange}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
      onRetry={fetchUsers}
    />
  );
}
