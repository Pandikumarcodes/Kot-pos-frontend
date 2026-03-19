import type {
  Branch,
  BranchSummary,
} from "../../../services/adminApi/Branch.api";

export type { Branch, BranchSummary };

export interface BranchFormData {
  name: string;
  address: string;
  phone: string;
  email: string;
  gstin: string;
}

export interface StaffUser {
  _id: string;
  username: string;
  role: string;
  status: string;
}

// ── Container → Presenter props ───────────────────────────────
export interface BranchPresenterProps {
  // Branch list
  branches: Branch[];
  loading: boolean;

  // Create / Edit modal
  showModal: boolean;
  editingBranch: Branch | null;
  formData: BranchFormData;
  saving: boolean;
  onOpenCreate: () => void;
  onOpenEdit: (branch: Branch) => void;
  onCloseModal: () => void;
  onFormChange: (field: keyof BranchFormData, value: string) => void;
  onSave: (e: React.FormEvent) => void;

  // Toggle active/inactive
  onToggle: (branch: Branch) => void;

  // Staff panel
  selectedBranch: Branch | null;
  branchStaff: StaffUser[];
  unassignedUsers: StaffUser[];
  summary: BranchSummary | null;
  staffLoading: boolean;
  assigningId: string | null;
  onOpenStaff: (branch: Branch) => void;
  onCloseStaff: () => void;
  onAssign: (userId: string) => void;
}
