import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, X } from "lucide-react";
import { useAppSelector } from "../../Store/hooks";
import { useToast } from "../../Context/ToastContext";
import {
  getTablesApi,
  createTableApi,
  deleteTableApi,
  allocateTableApi,
} from "../../services/waiterApi/Table.api";
import type { Table, TableStatus } from "../../services/waiterApi/Table.api";

const STATUS_CONFIG: Record<
  TableStatus,
  { bg: string; text: string; border: string; label: string; dot: string }
> = {
  available: {
    bg: "bg-kot-stats",
    text: "text-kot-darker",
    border: "border-kot-dark",
    label: "Available",
    dot: "bg-kot-dark",
  },
  occupied: {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    border: "border-yellow-400",
    label: "Occupied",
    dot: "bg-yellow-400",
  },
  billing: {
    bg: "bg-red-100",
    text: "text-red-800",
    border: "border-red-400",
    label: "Billing",
    dot: "bg-red-500",
  },
  reserved: {
    bg: "bg-blue-100",
    text: "text-blue-800",
    border: "border-blue-400",
    label: "Reserved",
    dot: "bg-blue-400",
  },
  cleaning: {
    bg: "bg-purple-100",
    text: "text-purple-800",
    border: "border-purple-400",
    label: "Cleaning",
    dot: "bg-purple-400",
  },
};

const ALL_FILTERS = [
  "all",
  "available",
  "occupied",
  "billing",
  "reserved",
] as const;

function formatDuration(isoStart: string): string {
  const diff = Math.floor((Date.now() - new Date(isoStart).getTime()) / 1000);
  const h = Math.floor(diff / 3600);
  const m = Math.floor((diff % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export default function TablesPage() {
  const toast = useToast();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  // ✅ manager gets same access as admin
  const isAdmin = user?.role === "admin" || user?.role === "manager";
  const canDelete = user?.role === "admin";
  const [tables, setTables] = useState<Table[]>([]);
  const [filter, setFilter] = useState<(typeof ALL_FILTERS)[number]>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ tableNumber: "", capacity: "" });

  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [allocateForm, setAllocateForm] = useState({ name: "", phone: "" });

  const fetchTables = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await getTablesApi();
      setTables(data.tables);
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } } };
      setError(e?.response?.data?.error || "Failed to load tables");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  const filtered =
    filter === "all" ? tables : tables.filter((t) => t.status === filter);
  const counts = {
    available: tables.filter((t) => t.status === "available").length,
    occupied: tables.filter((t) => t.status === "occupied").length,
    billing: tables.filter((t) => t.status === "billing").length,
    reserved: tables.filter((t) => t.status === "reserved").length,
  };

  const handleAddTable = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await createTableApi({
        tableNumber: parseInt(addForm.tableNumber),
        capacity: parseInt(addForm.capacity),
      });
      setTables([...tables, data.table]);
      setShowAddModal(false);
      setAddForm({ tableNumber: "", capacity: "" });
      toast.success("Table added successfully!");
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } } };
      toast.error(e?.response?.data?.error || "Failed to add table");
    }
  };

  const handleDeleteTable = async (table: Table, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(`Delete Table ${table.tableNumber}?`)) return;
    try {
      await deleteTableApi(table._id);
      setTables(tables.filter((t) => t._id !== table._id));
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } } };
      toast.error(e?.response?.data?.error || "Failed to delete table");
    }
  };

  const handleTableClick = (table: Table) => {
    if (table.status === "reserved" || table.status === "cleaning") return;

    if (table.status === "available" && !isAdmin) {
      // Waiter: available table → enter customer name first
      setSelectedTable(table);
      setAllocateForm({ name: "", phone: "" });
      setShowAllocateModal(true);
    } else if (table.status === "available" && isAdmin) {
      // Admin/Manager: available table → go directly to order page
      navigate(`/waiter/order/${table._id}`);
    } else {
      // ✅ ALL roles (waiter, admin, manager): occupied/billing table → go to order page
      navigate(`/waiter/order/${table._id}`);
    }
  };

  const handleAllocate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTable) return;
    try {
      const { data } = await allocateTableApi(selectedTable._id, allocateForm);
      setTables(
        tables.map((t) => (t._id === selectedTable._id ? data.table : t)),
      );
      setShowAllocateModal(false);
      // ✅ Pass customerName to OrderPage via router state
      navigate(`/waiter/order/${selectedTable._id}`, {
        state: {
          customerName: allocateForm.name,
          customerPhone: allocateForm.phone,
        },
      });
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } } };
      toast.error(e?.response?.data?.error || "Failed to allocate table");
    }
  };

  const inputClass =
    "w-full px-3 py-2.5 border-2 border-kot-chart rounded-lg focus:outline-none focus:ring-2 focus:ring-kot-dark bg-kot-white text-kot-darker placeholder:text-kot-text/50 text-sm";

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-kot-primary">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-kot-dark border-t-transparent animate-spin mx-auto mb-3" />
          <p className="text-sm text-kot-text">Loading tables…</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="h-screen flex items-center justify-center bg-kot-primary">
        <div className="text-center">
          <p className="text-red-600 font-medium mb-3">{error}</p>
          <button
            onClick={fetchTables}
            className="px-4 py-2 bg-kot-dark text-white rounded-lg hover:bg-kot-darker"
          >
            Retry
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-kot-primary">
      <div className="p-4 md:p-6 max-w-[1400px] mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-kot-darker">Tables</h1>
            <p className="text-sm mt-0.5 text-kot-text">
              {tables.length} total ·{" "}
              {isAdmin ? "manage tables" : "allocate a table to start an order"}
            </p>
          </div>
          <div className="flex gap-2">
            {isAdmin && (
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-kot-dark hover:bg-kot-darker transition-all"
              >
                <Plus size={16} /> Add Table
              </button>
            )}
            <button
              onClick={fetchTables}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border-2 border-kot-chart text-kot-dark bg-kot-white hover:bg-kot-light transition-all"
            >
              <svg
                className="w-4 h-4"
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
              Refresh
            </button>
          </div>
        </div>

        {/* Stat strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
              className="bg-kot-white rounded-2xl px-5 py-4 flex items-center gap-3 shadow-kot"
            >
              <div className={`w-3 h-3 rounded-full flex-shrink-0 ${s.dot}`} />
              <div>
                <p className="text-xl font-bold text-kot-darker">
                  {counts[s.key]}
                </p>
                <p className="text-xs text-kot-text">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="bg-kot-white rounded-2xl p-1.5 flex gap-1 w-fit shadow-kot">
          {ALL_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all duration-200 ${
                filter === f
                  ? "bg-kot-dark text-white"
                  : "text-kot-text hover:bg-kot-light hover:text-kot-darker"
              }`}
            >
              {f === "all" ? `All (${tables.length})` : f}
            </button>
          ))}
        </div>

        {/* Table grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filtered.map((table) => {
            const cfg = STATUS_CONFIG[table.status];
            const isClickable =
              table.status !== "reserved" && table.status !== "cleaning";
            return (
              <div key={table._id} className="relative group">
                <button
                  onClick={() => handleTableClick(table)}
                  disabled={!isClickable}
                  className={`text-left rounded-2xl p-4 border-l-4 transition-all duration-200 w-full bg-kot-white shadow-kot hover:shadow-kot-lg ${cfg.border} ${!isClickable ? "opacity-70 cursor-default" : "cursor-pointer"}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-base ${cfg.bg} ${cfg.text}`}
                    >
                      {table.tableNumber}
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${cfg.bg} ${cfg.text}`}
                    >
                      {cfg.label}
                    </span>
                  </div>
                  <p className="text-xs mb-1 text-kot-text">
                    <span className="text-kot-darker font-semibold">
                      T-{table.tableNumber}
                    </span>
                    {" · "}
                    {table.capacity} seats
                  </p>
                  {(table.status === "occupied" ||
                    table.status === "billing") && (
                    <div className="mt-2 pt-2 space-y-1 border-t border-kot-chart">
                      {table.waiterName && (
                        <p className="text-xs text-kot-text">
                          Waiter:{" "}
                          <span className="text-kot-darker font-semibold">
                            {table.waiterName}
                          </span>
                        </p>
                      )}
                      {table.orderAmount !== undefined && (
                        <p className="text-sm font-bold text-kot-dark">
                          ₹{table.orderAmount.toLocaleString()}
                        </p>
                      )}
                      {table.sessionStart && (
                        <p className="text-[10px] text-kot-text">
                          {formatDuration(table.sessionStart)}
                        </p>
                      )}
                    </div>
                  )}
                  {table.status === "available" && (
                    <div className="mt-2 pt-2 text-xs font-medium text-kot-dark border-t border-kot-chart">
                      {isAdmin ? "Tap to manage →" : "Tap to allocate →"}
                    </div>
                  )}
                </button>

                {canDelete && (
                  <button
                    onClick={(e) => handleDeleteTable(table, e)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="bg-kot-white rounded-2xl p-12 text-center shadow-kot">
            <p className="text-lg font-semibold text-kot-darker">
              No {filter} tables
            </p>
            <p className="text-sm mt-1 text-kot-text">
              {isAdmin
                ? "Add a table using the button above"
                : "Try a different filter"}
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-4 pt-1">
          {(
            Object.entries(STATUS_CONFIG) as [
              TableStatus,
              (typeof STATUS_CONFIG)[TableStatus],
            ][]
          ).map(([key, cfg]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
              <span className="text-xs text-kot-text">{cfg.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Admin: Add Table Modal */}
      {isAdmin && showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-kot-white rounded-xl shadow-kot-lg max-w-sm w-full">
            <div className="flex items-center justify-between p-6 border-b border-kot-chart">
              <h2 className="text-xl font-bold text-kot-darker">
                Add New Table
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-kot-text hover:text-kot-darker"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddTable} className="p-6 space-y-4">
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
                    setAddForm({ ...addForm, tableNumber: e.target.value })
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
                  onChange={(e) =>
                    setAddForm({ ...addForm, capacity: e.target.value })
                  }
                  className={inputClass}
                  placeholder="e.g. 4"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2.5 border-2 border-kot-chart text-kot-darker font-semibold rounded-lg hover:bg-kot-light"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-kot-dark hover:bg-kot-darker text-white font-semibold rounded-lg"
                >
                  Add Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Waiter: Allocate Table Modal */}
      {!isAdmin && showAllocateModal && selectedTable && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-kot-white rounded-xl shadow-kot-lg max-w-sm w-full">
            <div className="flex items-center justify-between p-6 border-b border-kot-chart">
              <div>
                <h2 className="text-xl font-bold text-kot-darker">
                  Allocate Table {selectedTable.tableNumber}
                </h2>
                <p className="text-xs text-kot-text mt-0.5">
                  {selectedTable.capacity} seats
                </p>
              </div>
              <button
                onClick={() => setShowAllocateModal(false)}
                className="text-kot-text hover:text-kot-darker"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAllocate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-kot-darker mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={allocateForm.name}
                  onChange={(e) =>
                    setAllocateForm({ ...allocateForm, name: e.target.value })
                  }
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
                    setAllocateForm({ ...allocateForm, phone: e.target.value })
                  }
                  className={inputClass}
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAllocateModal(false)}
                  className="flex-1 px-4 py-2.5 border-2 border-kot-chart text-kot-darker font-semibold rounded-lg hover:bg-kot-light"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-kot-dark hover:bg-kot-darker text-white font-semibold rounded-lg"
                >
                  Allocate & Take Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
