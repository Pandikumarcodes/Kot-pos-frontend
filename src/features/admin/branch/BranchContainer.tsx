import { useState, useEffect } from "react";
import { useToast } from "../../../Context/ToastContext";
import {
  getBranchesApi,
  createBranchApi,
  updateBranchApi,
  deactivateBranchApi,
  getBranchStaffApi,
  getBranchSummaryApi,
  assignStaffToBranchApi,
} from "../../../services/adminApi/Branch.api";
import type {
  Branch,
  BranchSummary,
} from "../../../services/adminApi/Branch.api";
import { getUsersApi } from "../../../services/adminApi/Staff.api";
import { BranchPresenter } from "./BranchPresenter";
import type { BranchFormData, StaffUser } from "./Branch.types";

const EMPTY_FORM: BranchFormData = {
  name: "",
  address: "",
  phone: "",
  email: "",
  gstin: "",
};

export default function BranchContainer() {
  const toast = useToast();

  // ── Branch list ───────────────────────────────────────────
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  // ── Modal ─────────────────────────────────────────────────
  const [showModal, setShowModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [formData, setFormData] = useState<BranchFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  // ── Staff panel ───────────────────────────────────────────
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [branchStaff, setBranchStaff] = useState<StaffUser[]>([]);
  const [allUsers, setAllUsers] = useState<StaffUser[]>([]);
  const [summary, setSummary] = useState<BranchSummary | null>(null);
  const [staffLoading, setStaffLoading] = useState(false);
  const [assigningId, setAssigningId] = useState<string | null>(null);

  // ── Fetch branches on mount ───────────────────────────────
  const fetchBranches = async () => {
    try {
      setLoading(true);
      const { data } = await getBranchesApi();
      setBranches(data.branches);
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } } };
      toast.error(e?.response?.data?.error || "Failed to load branches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  // ── Modal handlers ────────────────────────────────────────
  const handleOpenCreate = () => {
    setEditingBranch(null);
    setFormData(EMPTY_FORM);
    setShowModal(true);
  };

  const handleOpenEdit = (branch: Branch) => {
    setEditingBranch(branch);
    setFormData({
      name: branch.name,
      address: branch.address,
      phone: branch.phone,
      email: branch.email,
      gstin: branch.gstin,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBranch(null);
    setFormData(EMPTY_FORM);
  };

  const handleFormChange = (field: keyof BranchFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ── Create / Update ───────────────────────────────────────
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.warning("Branch name is required");
      return;
    }
    try {
      setSaving(true);
      if (editingBranch) {
        const { data } = await updateBranchApi(editingBranch._id, formData);
        setBranches((prev) =>
          prev.map((b) => (b._id === editingBranch._id ? data.branch : b)),
        );
        toast.success("Branch updated!");
      } else {
        const { data } = await createBranchApi(formData);
        setBranches((prev) => [data.branch, ...prev]);
        toast.success("Branch created!");
      }
      handleCloseModal();
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } } };
      toast.error(e?.response?.data?.error || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  // ── Toggle active/inactive ────────────────────────────────
  const handleToggle = async (branch: Branch) => {
    try {
      if (branch.isActive) {
        await deactivateBranchApi(branch._id);
        setBranches((prev) =>
          prev.map((b) =>
            b._id === branch._id ? { ...b, isActive: false } : b,
          ),
        );
        toast.info(`${branch.name} deactivated`);
      } else {
        const { data } = await updateBranchApi(branch._id, { isActive: true });
        setBranches((prev) =>
          prev.map((b) => (b._id === branch._id ? data.branch : b)),
        );
        toast.success(`${branch.name} activated`);
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  // ── Staff panel ───────────────────────────────────────────
  const handleOpenStaff = async (branch: Branch) => {
    setSelectedBranch(branch);
    setStaffLoading(true);
    try {
      const [staffRes, usersRes, summaryRes] = await Promise.all([
        getBranchStaffApi(branch._id),
        getUsersApi(),
        getBranchSummaryApi(branch._id),
      ]);
      setBranchStaff(staffRes.data.users);
      setAllUsers(usersRes.data.users);
      setSummary(summaryRes.data);
    } catch {
      toast.error("Failed to load branch details");
    } finally {
      setStaffLoading(false);
    }
  };

  const handleCloseStaff = () => {
    setSelectedBranch(null);
    setBranchStaff([]);
    setAllUsers([]);
    setSummary(null);
  };

  const handleAssign = async (userId: string) => {
    if (!selectedBranch) return;
    try {
      setAssigningId(userId);
      await assignStaffToBranchApi(selectedBranch._id, userId);
      toast.success("Staff assigned!");
      handleOpenStaff(selectedBranch); // refresh
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } } };
      toast.error(e?.response?.data?.error || "Failed to assign");
    } finally {
      setAssigningId(null);
    }
  };

  // ── Derived ───────────────────────────────────────────────
  const unassignedUsers = allUsers.filter(
    (u) => !branchStaff.some((s) => s._id === u._id),
  );

  return (
    <BranchPresenter
      // Branch list
      branches={branches}
      loading={loading}
      // Modal
      showModal={showModal}
      editingBranch={editingBranch}
      formData={formData}
      saving={saving}
      onOpenCreate={handleOpenCreate}
      onOpenEdit={handleOpenEdit}
      onCloseModal={handleCloseModal}
      onFormChange={handleFormChange}
      onSave={handleSave}
      // Toggle
      onToggle={handleToggle}
      // Staff panel
      selectedBranch={selectedBranch}
      branchStaff={branchStaff}
      unassignedUsers={unassignedUsers}
      summary={summary}
      staffLoading={staffLoading}
      assigningId={assigningId}
      onOpenStaff={handleOpenStaff}
      onCloseStaff={handleCloseStaff}
      onAssign={handleAssign}
    />
  );
}
