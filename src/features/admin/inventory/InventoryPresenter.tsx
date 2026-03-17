import {
  Plus,
  Search,
  X,
  RefreshCw,
  AlertTriangle,
  Package,
  ChevronDown,
  History,
  Edit2,
  Trash2,
} from "lucide-react";
import type { InventoryPresenterProps } from "./Inventory.types";
import { UNITS, CATEGORIES, LOG_TYPE_CONFIG } from "./Inventory.types";
import type { InventoryUnit, InventoryCategory } from "./Inventory.types";

// ── Shared ────────────────────────────────────────────────────
const Pulse = ({ className }: { className: string }) => (
  <div className={`bg-kot-chart rounded animate-pulse ${className}`} />
);

const inputClass =
  "w-full px-3 py-2.5 border-2 border-kot-chart rounded-lg focus:outline-none focus:border-kot-dark bg-kot-white text-kot-darker placeholder:text-kot-text/50 text-sm";

// ─────────────────────────────────────────────────────────────
export function InventoryPresenter({
  items,
  loading,
  lowStockCount,
  search,
  filterLow,
  filterCat,
  onSearchChange,
  onFilterLowToggle,
  onFilterCatChange,
  onRefresh,
  showModal,
  editingItem,
  formData,
  saving,
  onOpenCreate,
  onOpenEdit,
  onCloseModal,
  onFormChange,
  onSave,
  restockItem,
  restockQty,
  restockNote,
  restocking,
  onOpenRestock,
  onCloseRestock,
  onRestockQtyChange,
  onRestockNoteChange,
  onRestock,
  adjustItem,
  adjustQty,
  adjustNote,
  adjusting,
  onOpenAdjust,
  onCloseAdjust,
  onAdjustQtyChange,
  onAdjustNoteChange,
  onAdjust,
  logsItem,
  logs,
  logsLoading,
  onOpenLogs,
  onCloseLogs,
  onDelete,
}: InventoryPresenterProps) {
  return (
    <div className="min-h-screen bg-kot-primary">
      <div className="max-w-[2400px] mx-auto p-3 sm:p-4 lg:p-6 space-y-4">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-2xl font-bold text-kot-darker">
              Inventory
            </h1>
            <p className="text-xs sm:text-sm text-kot-text mt-0.5">
              {items.length} items
              {lowStockCount > 0 && (
                <span className="ml-2 text-red-600 font-semibold">
                  · {lowStockCount} low stock
                </span>
              )}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={onRefresh}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 border-kot-chart text-kot-dark bg-kot-white hover:bg-kot-light text-sm transition-colors"
            >
              <RefreshCw size={14} />
            </button>
            <button
              onClick={onFilterLowToggle}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 text-sm font-medium transition-colors ${
                filterLow
                  ? "border-red-400 bg-red-50 text-red-700"
                  : "border-kot-chart text-kot-darker bg-kot-white hover:bg-kot-light"
              }`}
            >
              <AlertTriangle size={14} />
              Low Stock {lowStockCount > 0 && `(${lowStockCount})`}
            </button>
            <button
              onClick={onOpenCreate}
              className="flex items-center gap-1.5 px-4 py-2 bg-kot-dark hover:bg-kot-darker text-white font-semibold rounded-xl text-sm transition-colors"
            >
              <Plus size={15} /> Add Item
            </button>
          </div>
        </div>

        {/* ── Filters ── */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-kot-text"
              size={15}
            />
            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 border-2 border-kot-chart rounded-xl bg-kot-white text-kot-darker text-sm focus:outline-none focus:border-kot-dark placeholder:text-kot-text/50"
            />
            {search && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-kot-text"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <div className="relative">
            <select
              value={filterCat}
              onChange={(e) =>
                onFilterCatChange(e.target.value as InventoryCategory | "")
              }
              className="appearance-none pl-3 pr-8 py-2.5 border-2 border-kot-chart rounded-xl bg-kot-white text-kot-darker text-sm focus:outline-none focus:border-kot-dark"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-kot-text pointer-events-none"
            />
          </div>
        </div>

        {/* ── Items Grid ── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-kot-white rounded-2xl p-4 shadow-kot space-y-3"
              >
                <Pulse className="h-4 w-32" />
                <Pulse className="h-8 w-20" />
                <Pulse className="h-3 w-24" />
                <div className="flex gap-2">
                  <Pulse className="h-8 flex-1 rounded-xl" />
                  <Pulse className="h-8 flex-1 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="bg-kot-white rounded-2xl p-12 text-center shadow-kot">
            <Package className="w-12 h-12 text-kot-chart mx-auto mb-3" />
            <p className="font-semibold text-kot-darker">No inventory items</p>
            <p className="text-sm text-kot-text mt-1">
              Add items to start tracking stock
            </p>
            <button
              onClick={onOpenCreate}
              className="mt-4 px-5 py-2.5 bg-kot-dark text-white rounded-xl text-sm font-semibold hover:bg-kot-darker"
            >
              Add First Item
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {items.map((item) => (
              <div
                key={item._id}
                className={`bg-kot-white rounded-2xl p-4 shadow-kot border-2 transition-all ${
                  item.isLowStock
                    ? "border-red-200 bg-red-50/30"
                    : "border-transparent"
                }`}
              >
                {/* Card header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-kot-darker text-sm truncate">
                      {item.name}
                    </h3>
                    <p className="text-xs text-kot-text mt-0.5 capitalize">
                      {CATEGORIES.find((c) => c.value === item.category)?.label}
                    </p>
                  </div>
                  {item.isLowStock && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded-full flex-shrink-0 ml-1">
                      <AlertTriangle size={10} /> Low
                    </span>
                  )}
                </div>
                {/* Stock display */}
                <div className="mb-3">
                  <p
                    className={`text-3xl font-bold ${item.isLowStock ? "text-red-600" : "text-kot-darker"}`}
                  >
                    {item.currentStock}
                    <span className="text-base font-medium text-kot-text ml-1">
                      {item.unit}
                    </span>
                  </p>
                  <p className="text-xs text-kot-text mt-0.5">
                    Alert below:{" "}
                    <span className="font-medium">
                      {item.lowStockThreshold} {item.unit}
                    </span>
                  </p>
                  {item.menuItemId && (
                    <p className="text-xs text-kot-text mt-0.5 truncate">
                      🔗 {item.menuItemId.ItemName}
                    </p>
                  )}
                </div>
                {/* Stock bar */}
                <div className="h-1.5 bg-kot-chart rounded-full mb-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${item.isLowStock ? "bg-red-400" : "bg-kot-dark"}`}
                    style={{
                      width: `${Math.min(100, (item.currentStock / Math.max(item.lowStockThreshold * 3, 1)) * 100)}%`,
                    }}
                  />
                </div>
                {/* Actions */}
                <div className="flex gap-1.5">
                  <button
                    onClick={() => onOpenRestock(item)}
                    className="flex-1 py-1.5 bg-kot-dark hover:bg-kot-darker text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    + Restock
                  </button>
                  <button
                    onClick={() => onOpenAdjust(item)}
                    title="Adjust"
                    className="px-2.5 py-1.5 border border-kot-chart text-kot-text hover:bg-kot-light rounded-lg text-xs transition-colors"
                  >
                    ±
                  </button>
                  <button
                    onClick={() => onOpenLogs(item)}
                    title="History"
                    className="px-2.5 py-1.5 border border-kot-chart text-kot-text hover:bg-kot-light rounded-lg text-xs transition-colors"
                  >
                    <History size={13} />
                  </button>
                  <button
                    onClick={() => onOpenEdit(item)}
                    title="Edit"
                    className="px-2.5 py-1.5 border border-kot-chart text-kot-text hover:bg-kot-light rounded-lg text-xs transition-colors"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => onDelete(item)}
                    title="Remove"
                    className="px-2.5 py-1.5 border border-red-200 text-red-500 hover:bg-red-50 rounded-lg text-xs transition-colors"
                  >
                    <Trash2 size={13} />
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
          <div className="bg-kot-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-kot-chart sticky top-0 bg-kot-white rounded-t-3xl sm:rounded-t-2xl">
              <h2 className="text-base font-bold text-kot-darker">
                {editingItem ? "Edit Item" : "Add Inventory Item"}
              </h2>
              <button
                onClick={onCloseModal}
                className="text-kot-text hover:text-kot-darker p-1"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={onSave} className="p-4 sm:p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-kot-darker mb-1">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => onFormChange("name", e.target.value)}
                    className={inputClass}
                    placeholder="e.g. Paneer"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-kot-darker mb-1">
                    Unit
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) =>
                      onFormChange("unit", e.target.value as InventoryUnit)
                    }
                    className={inputClass}
                  >
                    {UNITS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-kot-darker mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      onFormChange(
                        "category",
                        e.target.value as InventoryCategory,
                      )
                    }
                    className={inputClass}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                {!editingItem && (
                  <div>
                    <label className="block text-xs font-semibold text-kot-darker mb-1">
                      Opening Stock
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.currentStock}
                      onChange={(e) =>
                        onFormChange("currentStock", Number(e.target.value))
                      }
                      className={inputClass}
                    />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold text-kot-darker mb-1">
                    Low Stock Alert At
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.lowStockThreshold}
                    onChange={(e) =>
                      onFormChange("lowStockThreshold", Number(e.target.value))
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-kot-darker mb-1">
                    Cost / Unit (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.costPerUnit}
                    onChange={(e) =>
                      onFormChange("costPerUnit", Number(e.target.value))
                    }
                    className={inputClass}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-kot-darker mb-1">
                    Supplier
                  </label>
                  <input
                    type="text"
                    value={formData.supplier}
                    onChange={(e) => onFormChange("supplier", e.target.value)}
                    className={inputClass}
                    placeholder="Supplier name (optional)"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-kot-darker mb-1">
                    Linked MenuItem ID
                    <span className="text-kot-text font-normal ml-1">
                      (optional — auto-disables when stock = 0)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={formData.menuItemId}
                    onChange={(e) => onFormChange("menuItemId", e.target.value)}
                    className={inputClass}
                    placeholder="MongoDB _id of the menu item"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-1">
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
                  className="flex-1 py-2.5 bg-kot-dark hover:bg-kot-darker text-white font-semibold rounded-xl disabled:opacity-60 text-sm"
                >
                  {saving ? "Saving..." : editingItem ? "Update" : "Add Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Restock Modal ── */}
      {restockItem && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-kot-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-sm">
            <div className="flex items-center justify-between p-4 border-b border-kot-chart">
              <div>
                <h2 className="text-base font-bold text-kot-darker">Restock</h2>
                <p className="text-xs text-kot-text mt-0.5">
                  {restockItem.name} · Current: {restockItem.currentStock}{" "}
                  {restockItem.unit}
                </p>
              </div>
              <button
                onClick={onCloseRestock}
                className="text-kot-text hover:text-kot-darker p-1"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={onRestock} className="p-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-kot-darker mb-1">
                  Quantity to Add ({restockItem.unit})
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={restockQty}
                  onChange={(e) => onRestockQtyChange(e.target.value)}
                  className={inputClass}
                  placeholder="0"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-kot-darker mb-1">
                  Note (optional)
                </label>
                <input
                  type="text"
                  value={restockNote}
                  onChange={(e) => onRestockNoteChange(e.target.value)}
                  className={inputClass}
                  placeholder="e.g. Weekly delivery"
                />
              </div>
              {restockQty && (
                <div className="bg-emerald-50 rounded-xl p-3 text-sm">
                  <p className="text-emerald-700 font-medium">
                    New stock:{" "}
                    <span className="font-bold">
                      {restockItem.currentStock + Number(restockQty)}{" "}
                      {restockItem.unit}
                    </span>
                  </p>
                </div>
              )}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={onCloseRestock}
                  className="flex-1 py-2.5 border-2 border-kot-chart text-kot-darker font-semibold rounded-xl hover:bg-kot-light text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={restocking}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl disabled:opacity-60 text-sm"
                >
                  {restocking ? "Adding..." : "Add Stock"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Adjust Modal ── */}
      {adjustItem && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-kot-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-sm">
            <div className="flex items-center justify-between p-4 border-b border-kot-chart">
              <div>
                <h2 className="text-base font-bold text-kot-darker">
                  Adjust Stock
                </h2>
                <p className="text-xs text-kot-text mt-0.5">
                  {adjustItem.name} · Current: {adjustItem.currentStock}{" "}
                  {adjustItem.unit}
                </p>
              </div>
              <button
                onClick={onCloseAdjust}
                className="text-kot-text hover:text-kot-darker p-1"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={onAdjust} className="p-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-kot-darker mb-1">
                  Quantity{" "}
                  <span className="text-kot-text font-normal">
                    (use negative to remove, e.g. -5)
                  </span>
                </label>
                <input
                  type="number"
                  required
                  value={adjustQty}
                  onChange={(e) => onAdjustQtyChange(e.target.value)}
                  className={inputClass}
                  placeholder="-5 or +10"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-kot-darker mb-1">
                  Reason *
                </label>
                <input
                  type="text"
                  required
                  value={adjustNote}
                  onChange={(e) => onAdjustNoteChange(e.target.value)}
                  className={inputClass}
                  placeholder="e.g. Wastage, spillage, count correction"
                />
              </div>
              {adjustQty && (
                <div
                  className={`rounded-xl p-3 text-sm ${Number(adjustQty) < 0 ? "bg-red-50" : "bg-blue-50"}`}
                >
                  <p
                    className={`font-medium ${Number(adjustQty) < 0 ? "text-red-700" : "text-blue-700"}`}
                  >
                    New stock:{" "}
                    <span className="font-bold">
                      {Math.max(0, adjustItem.currentStock + Number(adjustQty))}{" "}
                      {adjustItem.unit}
                    </span>
                  </p>
                </div>
              )}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={onCloseAdjust}
                  className="flex-1 py-2.5 border-2 border-kot-chart text-kot-darker font-semibold rounded-xl hover:bg-kot-light text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adjusting}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl disabled:opacity-60 text-sm"
                >
                  {adjusting ? "Saving..." : "Apply"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Stock Logs Panel ── */}
      {logsItem && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onCloseLogs}
          />
          <div className="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-96 bg-kot-white shadow-kot-lg flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-kot-chart">
              <div>
                <h3 className="font-bold text-kot-darker">{logsItem.name}</h3>
                <p className="text-xs text-kot-text mt-0.5">Stock history</p>
              </div>
              <button
                onClick={onCloseLogs}
                className="text-kot-text hover:text-kot-darker p-1"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {logsLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-kot-light rounded-xl p-3 space-y-2"
                  >
                    <Pulse className="h-3 w-24" />
                    <Pulse className="h-4 w-32" />
                  </div>
                ))
              ) : logs.length === 0 ? (
                <div className="text-center py-10">
                  <History className="w-8 h-8 text-kot-chart mx-auto mb-2" />
                  <p className="text-sm text-kot-text">No history yet</p>
                </div>
              ) : (
                logs.map((log) => {
                  const cfg =
                    LOG_TYPE_CONFIG[log.type] ?? LOG_TYPE_CONFIG.adjustment;
                  return (
                    <div key={log._id} className="bg-kot-light rounded-xl p-3">
                      <div className="flex items-start justify-between mb-1">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-semibold ${cfg.bg} ${cfg.color}`}
                        >
                          {cfg.label}
                        </span>
                        <span
                          className={`text-sm font-bold ${log.quantity >= 0 ? "text-emerald-600" : "text-red-600"}`}
                        >
                          {log.quantity >= 0 ? "+" : ""}
                          {log.quantity} {logsItem.unit}
                        </span>
                      </div>
                      <p className="text-xs text-kot-text">
                        {log.stockBefore} →{" "}
                        <span className="font-semibold text-kot-darker">
                          {log.stockAfter}
                        </span>{" "}
                        {logsItem.unit}
                      </p>
                      {log.note && (
                        <p className="text-xs text-kot-text mt-0.5 italic">
                          "{log.note}"
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-1.5">
                        <p className="text-[10px] text-kot-text">
                          by {log.doneBy?.username ?? "system"}
                        </p>
                        <p className="text-[10px] text-kot-text">
                          {new Date(log.createdAt).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
