import { Plus, Trash2, X } from "lucide-react";
import type {
  TablesPresenterProps,
  FilterValue,
  TableStatus,
} from "./Table.types";
import { TableQrCode } from "../../../UiComponents/TableQrCode";

const STATUS_CONFIG: Record<
  TableStatus,
  {
    bg: string;
    text: string;
    border: string;
    label: string;
    dot: string;
    pill: string;
  }
> = {
  available: {
    bg: "bg-kot-stats",
    text: "text-kot-darker",
    border: "border-kot-dark",
    label: "Available",
    dot: "bg-kot-dark",
    pill: "bg-emerald-100 text-emerald-700",
  },
  occupied: {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    border: "border-yellow-400",
    label: "Occupied",
    dot: "bg-yellow-400",
    pill: "bg-yellow-100 text-yellow-700",
  },
  billing: {
    bg: "bg-red-100",
    text: "text-red-800",
    border: "border-red-400",
    label: "Billing",
    dot: "bg-red-500",
    pill: "bg-red-100 text-red-700",
  },
  reserved: {
    bg: "bg-blue-100",
    text: "text-blue-800",
    border: "border-blue-400",
    label: "Reserved",
    dot: "bg-blue-400",
    pill: "bg-blue-100 text-blue-700",
  },
  cleaning: {
    bg: "bg-purple-100",
    text: "text-purple-800",
    border: "border-purple-400",
    label: "Cleaning",
    dot: "bg-purple-400",
    pill: "bg-purple-100 text-purple-700",
  },
};

const ALL_FILTERS: FilterValue[] = [
  "all",
  "available",
  "occupied",
  "billing",
  "reserved",
];

function formatDuration(isoStart: string): string {
  const diff = Math.floor((Date.now() - new Date(isoStart).getTime()) / 1000);
  const h = Math.floor(diff / 3600);
  const m = Math.floor((diff % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

const Pulse = ({ className }: { className: string }) => (
  <div className={`bg-kot-chart rounded animate-pulse ${className}`} />
);

function SkeletonTableCard() {
  return (
    <div className="bg-kot-white rounded-2xl shadow-kot border-2 border-transparent flex flex-col">
      <div className="p-3 sm:p-4 space-y-3 flex-1">
        <div className="flex items-start justify-between">
          <Pulse className="w-10 h-10 rounded-xl" />
          <Pulse className="h-5 w-16 rounded-full" />
        </div>
        <Pulse className="h-3 w-20" />
        <Pulse className="h-3 w-16" />
      </div>
      <div className="px-3 pb-3 flex items-center justify-between gap-2 border-t border-kot-chart pt-2">
        <Pulse className="h-7 w-14 rounded-lg" />
        <Pulse className="h-7 w-7 rounded-lg" />
      </div>
    </div>
  );
}

const inputClass =
  "w-full px-3 py-2.5 border-2 border-kot-chart rounded-lg focus:outline-none focus:ring-2 focus:ring-kot-dark bg-kot-white text-kot-darker placeholder:text-kot-text/50 text-sm";

export function TablesPresenter({
  tables,
  filtered,
  counts,
  filter,
  loading,
  isAdmin,
  canDelete,
  showAddModal,
  addForm,
  onOpenAddModal,
  onCloseAddModal,
  onAddFormChange,
  onAddTable,
  showAllocateModal,
  selectedTable,
  allocateForm,
  onCloseAllocateModal,
  onAllocateFormChange,
  onAllocate,
  onFilterChange,
  onTableClick,
  onDeleteTable,
  onRefresh,
}: TablesPresenterProps) {
  return (
    <div className="min-h-screen bg-kot-primary">
      <div className="p-3 sm:p-4 lg:p-6 xl:p-8 max-w-[2400px] mx-auto space-y-4 sm:space-y-5">
        {/* ── Header ── */}
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-kot-darker">
              Tables
            </h1>
            <p className="text-xs sm:text-sm text-kot-text mt-0.5">
              {tables.length} total ·{" "}
              {isAdmin ? "manage tables" : "allocate to start order"}
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            {isAdmin && (
              <button
                onClick={onOpenAddModal}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-white bg-kot-dark hover:bg-kot-darker transition-colors"
              >
                <Plus size={14} />
                <span className="hidden sm:inline">Add Table</span>
                <span className="sm:hidden">Add</span>
              </button>
            )}
            <button
              onClick={onRefresh}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium border-2 border-kot-chart text-kot-dark bg-kot-white hover:bg-kot-light transition-colors"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* ── Stats ── */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-kot-white rounded-2xl p-4 flex items-center gap-3 shadow-kot"
              >
                <Pulse className="w-3 h-3 rounded-full flex-shrink-0" />
                <div className="space-y-1.5">
                  <Pulse className="h-6 w-8" />
                  <Pulse className="h-2.5 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {(
              [
                { key: "available", label: "Available", dot: "bg-kot-dark" },
                { key: "occupied", label: "Occupied", dot: "bg-yellow-400" },
                { key: "billing", label: "Billing", dot: "bg-red-500" },
                { key: "reserved", label: "Reserved", dot: "bg-blue-400" },
              ] as const
            ).map((s) => (
              <div
                key={s.key}
                className="bg-kot-white rounded-2xl px-4 py-4 sm:px-5 sm:py-5 flex items-center gap-3 shadow-kot"
              >
                <div
                  className={`w-3 h-3 rounded-full flex-shrink-0 ${s.dot}`}
                />
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-kot-darker">
                    {counts[s.key]}
                  </p>
                  <p className="text-[10px] sm:text-xs text-kot-text">
                    {s.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Filter tabs ── */}
        <div className="bg-kot-white rounded-2xl p-1.5 flex gap-1 shadow-kot overflow-x-auto">
          {ALL_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => onFilterChange(f)}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium capitalize transition-all whitespace-nowrap flex-shrink-0 ${
                filter === f
                  ? "bg-kot-dark text-white shadow-sm"
                  : "text-kot-text hover:bg-kot-light hover:text-kot-darker"
              }`}
            >
              {f === "all" ? `All (${tables.length})` : f}
            </button>
          ))}
        </div>

        {/* ── Table Grid ── */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <SkeletonTableCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3">
            {filtered.map((table) => {
              const cfg = STATUS_CONFIG[table.status as TableStatus];
              const isClickable =
                table.status !== "reserved" && table.status !== "cleaning";

              return (
                <div
                  key={table._id}
                  className={`bg-kot-white rounded-2xl shadow-kot border-2 transition-all duration-200 flex flex-col ${
                    isClickable
                      ? "hover:shadow-kot-lg hover:border-kot-chart"
                      : "opacity-70"
                  } border-transparent`}
                >
                  {/* ── Clickable top section ── */}
                  <button
                    onClick={() => onTableClick(table)}
                    disabled={!isClickable}
                    className="text-left p-3 sm:p-4 flex-1 disabled:cursor-default rounded-t-2xl"
                  >
                    {/* Number + status pill */}
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center font-bold text-sm sm:text-base flex-shrink-0 ${cfg.bg} ${cfg.text}`}
                      >
                        {table.tableNumber}
                      </div>
                      <span
                        className={`text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full font-semibold ${cfg.pill}`}
                      >
                        {cfg.label}
                      </span>
                    </div>

                    {/* Capacity */}
                    <p className="text-[10px] sm:text-xs text-kot-text">
                      <span className="font-semibold text-kot-darker">
                        T-{table.tableNumber}
                      </span>{" "}
                      · {table.capacity} seats
                    </p>

                    {/* Occupied/Billing details */}
                    {(table.status === "occupied" ||
                      table.status === "billing") && (
                      <div className="mt-2 pt-2 space-y-0.5 border-t border-kot-chart">
                        {table.waiterName && (
                          <p className="text-[10px] sm:text-xs text-kot-text">
                            👤{" "}
                            <span className="font-semibold text-kot-darker">
                              {table.waiterName}
                            </span>
                          </p>
                        )}
                        {table.orderAmount !== undefined && (
                          <p className="text-xs sm:text-sm font-bold text-kot-dark">
                            ₹{table.orderAmount.toLocaleString()}
                          </p>
                        )}
                        {table.sessionStart && (
                          <p className="text-[9px] sm:text-[10px] text-kot-text">
                            ⏱ {formatDuration(table.sessionStart)}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Available CTA */}
                    {table.status === "available" && (
                      <p className="mt-2 pt-2 text-[10px] sm:text-xs font-medium text-kot-dark border-t border-kot-chart">
                        {isAdmin ? "Tap to manage →" : "Tap to allocate →"}
                      </p>
                    )}
                  </button>

                  {/* ── Action bar: QR + delete ── */}
                  <div className="flex items-center justify-between px-3 pb-3 pt-2 gap-2 border-t border-kot-chart">
                    {/* QR — always visible */}
                    <TableQrCode
                      tableId={table._id}
                      tableNumber={table.tableNumber}
                    />

                    {/* Delete — admin only */}
                    {canDelete && (
                      <button
                        onClick={(e) => onDeleteTable(table, e)}
                        title="Delete table"
                        className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors flex-shrink-0"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="bg-kot-white rounded-2xl p-10 sm:p-14 text-center shadow-kot">
            <p className="text-3xl mb-2">🪑</p>
            <p className="text-base sm:text-lg font-semibold text-kot-darker">
              No {filter} tables
            </p>
            <p className="text-xs sm:text-sm mt-1 text-kot-text">
              {isAdmin
                ? "Add a table using the button above"
                : "Try a different filter"}
            </p>
          </div>
        )}

        {/* ── Legend ── */}
        <div className="flex flex-wrap gap-3 sm:gap-4 pt-1">
          {(
            Object.entries(STATUS_CONFIG) as [
              TableStatus,
              (typeof STATUS_CONFIG)[TableStatus],
            ][]
          ).map(([key, cfg]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div
                className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${cfg.dot}`}
              />
              <span className="text-[10px] sm:text-xs text-kot-text">
                {cfg.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Add Table Modal ── */}
      {isAdmin && showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-kot-white rounded-t-3xl sm:rounded-2xl shadow-kot-lg w-full sm:max-w-sm">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-kot-chart">
              <h2 className="text-lg font-bold text-kot-darker">
                Add New Table
              </h2>
              <button
                onClick={onCloseAddModal}
                className="text-kot-text hover:text-kot-darker p-1"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={onAddTable} className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-kot-darker mb-1">
                  Table Number *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={addForm.tableNumber}
                  onChange={(e) =>
                    onAddFormChange("tableNumber", e.target.value)
                  }
                  className={inputClass}
                  placeholder="e.g. 7"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-kot-darker mb-1">
                  Capacity *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="20"
                  value={addForm.capacity}
                  onChange={(e) => onAddFormChange("capacity", e.target.value)}
                  className={inputClass}
                  placeholder="e.g. 4"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onCloseAddModal}
                  className="flex-1 py-2.5 border-2 border-kot-chart text-kot-darker font-semibold rounded-xl hover:bg-kot-light text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-kot-dark hover:bg-kot-darker text-white font-semibold rounded-xl text-sm"
                >
                  Add Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Allocate Modal ── */}
      {!isAdmin && showAllocateModal && selectedTable && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-kot-white rounded-t-3xl sm:rounded-2xl shadow-kot-lg w-full sm:max-w-sm">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-kot-chart">
              <div>
                <h2 className="text-lg font-bold text-kot-darker">
                  Allocate Table {selectedTable.tableNumber}
                </h2>
                <p className="text-xs text-kot-text mt-0.5">
                  {selectedTable.capacity} seats
                </p>
              </div>
              <button
                onClick={onCloseAllocateModal}
                className="text-kot-text hover:text-kot-darker p-1"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={onAllocate} className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-kot-darker mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={allocateForm.name}
                  onChange={(e) => onAllocateFormChange("name", e.target.value)}
                  className={inputClass}
                  placeholder="e.g. Rahul Kumar"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-kot-darker mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={allocateForm.phone}
                  onChange={(e) =>
                    onAllocateFormChange("phone", e.target.value)
                  }
                  className={inputClass}
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onCloseAllocateModal}
                  className="flex-1 py-2.5 border-2 border-kot-chart text-kot-darker font-semibold rounded-xl hover:bg-kot-light text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-kot-dark hover:bg-kot-darker text-white font-semibold rounded-xl text-sm"
                >
                  Allocate & Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
