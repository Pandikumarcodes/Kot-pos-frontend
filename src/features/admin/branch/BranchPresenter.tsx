import {
  Plus,
  Edit2,
  X,
  Users,
  Building2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import type { BranchPresenterProps } from "./Branch.types";

// ── Skeleton ──────────────────────────────────────────────────
const Pulse = ({ className }: { className: string }) => (
  <div className={`bg-kot-chart rounded animate-pulse ${className}`} />
);

function SkeletonBranchCard() {
  return (
    <div className="bg-kot-white rounded-2xl p-5 shadow-kot space-y-3">
      <Pulse className="h-5 w-40" />
      <Pulse className="h-3 w-56" />
      <Pulse className="h-3 w-32" />
      <div className="flex gap-2 pt-2">
        <Pulse className="h-8 flex-1 rounded-xl" />
        <Pulse className="h-8 flex-1 rounded-xl" />
        <Pulse className="h-8 w-8 rounded-xl" />
      </div>
    </div>
  );
}

// ── Shared input class ────────────────────────────────────────
const inputClass =
  "w-full px-3 py-2.5 border-2 border-kot-chart rounded-lg focus:outline-none focus:border-kot-dark bg-kot-white text-kot-darker placeholder:text-kot-text/50 text-sm";

// ── Form fields config ────────────────────────────────────────
const FORM_FIELDS = [
  {
    key: "name",
    label: "Branch Name *",
    placeholder: "e.g. Koramangala",
    type: "text",
    required: true,
  },
  {
    key: "address",
    label: "Address",
    placeholder: "123 MG Road, Bangalore",
    type: "text",
    required: false,
  },
  {
    key: "phone",
    label: "Phone",
    placeholder: "+91 8838781206",
    type: "tel",
    required: false,
  },
  {
    key: "email",
    label: "Email",
    placeholder: "branch@restaurant.com",
    type: "email",
    required: false,
  },
  {
    key: "gstin",
    label: "GSTIN",
    placeholder: "29ABCDE1234F1Z5",
    type: "text",
    required: false,
  },
] as const;

// ── Presenter ─────────────────────────────────────────────────
export function BranchPresenter({
  branches,
  loading,
  showModal,
  editingBranch,
  formData,
  saving,
  onOpenCreate,
  onOpenEdit,
  onCloseModal,
  onFormChange,
  onSave,
  onToggle,
  selectedBranch,
  branchStaff,
  unassignedUsers,
  summary,
  staffLoading,
  assigningId,
  onOpenStaff,
  onCloseStaff,
  onAssign,
}: BranchPresenterProps) {
  return (
    <div className="min-h-screen bg-kot-primary">
      <div className="p-3 sm:p-4 lg:p-6 max-w-[2400px] mx-auto space-y-4 sm:space-y-5">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-kot-darker">
              Branch Management
            </h1>
            <p className="text-xs sm:text-sm text-kot-text mt-0.5">
              {branches.length} {branches.length === 1 ? "branch" : "branches"}{" "}
              · Super-admin view
            </p>
          </div>
          <button
            onClick={onOpenCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-kot-dark hover:bg-kot-darker text-white font-semibold rounded-xl transition-colors self-start sm:self-auto text-sm"
          >
            <Plus size={16} /> New Branch
          </button>
        </div>

        {/* ── Branch cards ── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <SkeletonBranchCard key={i} />
            ))}
          </div>
        ) : branches.length === 0 ? (
          <div className="bg-kot-white rounded-2xl p-12 text-center shadow-kot">
            <Building2 className="w-12 h-12 text-kot-chart mx-auto mb-3" />
            <p className="font-semibold text-kot-darker">No branches yet</p>
            <p className="text-sm text-kot-text mt-1">
              Create your first branch to get started
            </p>
            <button
              onClick={onOpenCreate}
              className="mt-4 px-5 py-2.5 bg-kot-dark text-white rounded-xl text-sm font-semibold hover:bg-kot-darker"
            >
              Create Branch
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {branches.map((branch) => (
              <div
                key={branch._id}
                className={`bg-kot-white rounded-2xl p-5 shadow-kot border-2 transition-all ${
                  branch.isActive
                    ? "border-transparent hover:border-kot-chart"
                    : "border-red-100 opacity-70"
                }`}
              >
                {/* Card header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-kot-darker text-base truncate">
                      {branch.name}
                    </h3>
                    {branch.address && (
                      <p className="text-xs text-kot-text mt-0.5 truncate">
                        {branch.address}
                      </p>
                    )}
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ml-2 ${
                      branch.isActive
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {branch.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Card details */}
                <div className="space-y-1 mb-4">
                  {branch.phone && (
                    <p className="text-xs text-kot-text">📞 {branch.phone}</p>
                  )}
                  {branch.gstin && (
                    <p className="text-xs text-kot-text">GST: {branch.gstin}</p>
                  )}
                  <p className="text-xs text-kot-text">
                    Created{" "}
                    {new Date(branch.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>

                {/* Card actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => onOpenStaff(branch)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 border-2 border-kot-chart text-kot-darker rounded-xl hover:bg-kot-light transition-colors text-xs font-medium"
                  >
                    <Users size={13} /> Staff
                  </button>
                  <button
                    onClick={() => onOpenEdit(branch)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 border-2 border-kot-chart text-kot-darker rounded-xl hover:bg-kot-light transition-colors text-xs font-medium"
                  >
                    <Edit2 size={13} /> Edit
                  </button>
                  <button
                    onClick={() => onToggle(branch)}
                    title={branch.isActive ? "Deactivate" : "Activate"}
                    className={`p-2 rounded-xl border-2 transition-colors ${
                      branch.isActive
                        ? "border-red-200 text-red-500 hover:bg-red-50"
                        : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                    }`}
                  >
                    {branch.isActive ? (
                      <ToggleRight size={16} />
                    ) : (
                      <ToggleLeft size={16} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Create / Edit Modal ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-kot-white rounded-t-3xl sm:rounded-2xl shadow-kot-lg w-full sm:max-w-md">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-kot-chart">
              <h2 className="text-lg font-bold text-kot-darker">
                {editingBranch ? "Edit Branch" : "New Branch"}
              </h2>
              <button
                onClick={onCloseModal}
                className="text-kot-text hover:text-kot-darker p-1"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={onSave} className="p-4 sm:p-6 space-y-3">
              {FORM_FIELDS.map((f) => (
                <div key={f.key}>
                  <label className="block text-sm font-semibold text-kot-darker mb-1">
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    value={formData[f.key]}
                    onChange={(e) => onFormChange(f.key, e.target.value)}
                    className={inputClass}
                    placeholder={f.placeholder}
                    required={f.required}
                  />
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onCloseModal}
                  className="flex-1 py-2.5 border-2 border-kot-chart text-kot-darker font-semibold rounded-xl hover:bg-kot-light text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 bg-kot-dark hover:bg-kot-darker text-white font-semibold rounded-xl disabled:opacity-60 text-sm transition-colors"
                >
                  {saving ? "Saving..." : editingBranch ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Staff Side Panel ── */}
      {selectedBranch && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onCloseStaff}
          />
          <div className="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-96 bg-kot-white shadow-kot-lg flex flex-col">
            {/* Panel header */}
            <div className="flex items-center justify-between p-4 border-b border-kot-chart">
              <div>
                <h3 className="font-bold text-kot-darker">
                  {selectedBranch.name}
                </h3>
                <p className="text-xs text-kot-text mt-0.5">Staff Management</p>
              </div>
              <button
                onClick={onCloseStaff}
                className="text-kot-text hover:text-kot-darker p-1"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {/* Summary stats */}
              {summary && (
                <div className="grid grid-cols-3 gap-2">
                  {[
                    {
                      label: "Today's Orders",
                      value: summary.totalOrders,
                      color: "bg-blue-50",
                    },
                    {
                      label: "Active Orders",
                      value: summary.activeOrders,
                      color: "bg-yellow-50",
                    },
                    {
                      label: "Staff",
                      value: summary.staffCount,
                      color: "bg-kot-stats",
                    },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className={`${s.color} rounded-xl p-2.5 text-center`}
                    >
                      <p className="text-lg font-bold text-kot-darker">
                        {s.value}
                      </p>
                      <p className="text-[10px] text-kot-text leading-tight">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Current staff */}
              <div>
                <h4 className="font-semibold text-kot-darker text-sm mb-2">
                  Current Staff ({branchStaff.length})
                </h4>
                {staffLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <Pulse key={i} className="h-12 w-full rounded-xl" />
                    ))}
                  </div>
                ) : branchStaff.length === 0 ? (
                  <p className="text-sm text-kot-text bg-kot-light rounded-xl p-3">
                    No staff assigned yet
                  </p>
                ) : (
                  <div className="space-y-2">
                    {branchStaff.map((u) => (
                      <div
                        key={u._id}
                        className="flex items-center justify-between bg-kot-light rounded-xl p-3"
                      >
                        <div>
                          <p className="text-sm font-semibold text-kot-darker">
                            {u.username}
                          </p>
                          <p className="text-xs text-kot-text capitalize">
                            {u.role}
                          </p>
                        </div>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                            u.status === "active"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {u.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Assign new staff */}
              {!staffLoading && unassignedUsers.length > 0 && (
                <div>
                  <h4 className="font-semibold text-kot-darker text-sm mb-2">
                    Assign Staff
                  </h4>
                  <div className="space-y-2">
                    {unassignedUsers.map((u) => (
                      <div
                        key={u._id}
                        className="flex items-center justify-between bg-kot-white border border-kot-chart rounded-xl p-3"
                      >
                        <div>
                          <p className="text-sm font-semibold text-kot-darker">
                            {u.username}
                          </p>
                          <p className="text-xs text-kot-text capitalize">
                            {u.role}
                          </p>
                        </div>
                        <button
                          onClick={() => onAssign(u._id)}
                          disabled={assigningId === u._id}
                          className="px-3 py-1.5 bg-kot-dark text-white rounded-lg text-xs font-medium hover:bg-kot-darker disabled:opacity-60 transition-colors"
                        >
                          {assigningId === u._id ? "..." : "Assign"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
