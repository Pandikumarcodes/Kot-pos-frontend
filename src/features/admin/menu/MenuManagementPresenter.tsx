import { Plus, Edit2, Trash2 } from "lucide-react";
import {
  Card,
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
} from "../../../UiComponents/Index";
import { CATEGORIES, type MenuPresenterProps } from "./menu.types";

const getCategoryLabel = (key: string) =>
  CATEGORIES.find((c) => c.key === key)?.label ?? key;

export function MenuManagementPresenter({
  menuItems,
  filteredItems,
  loading,
  error,
  selectedCategory,
  searchQuery,
  showModal,
  editingItem,
  formData,
  formErrors,
  isAdmin,
  onCategoryChange,
  onSearchChange,
  onOpenModal,
  onCloseModal,
  onFieldChange,
  onSubmit,
  onDelete,
  onToggle,
  onRetry,
}: MenuPresenterProps) {
  const tabs = [
    { key: "all", label: "All" },
    ...CATEGORIES.map((c) => ({ key: c.key, label: c.label })),
  ];

  return (
    <div className="min-h-screen bg-kot-primary">
      <main className="p-3 sm:p-4 lg:p-6 max-w-[2400px] mx-auto space-y-4">
        {/* ── Header ── */}
        <PageHeader
          title="Menu"
          sub={`${menuItems.length} items`}
          actions={
            isAdmin && (
              <Button
                size="sm"
                onClick={() => onOpenModal()}
                className="flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Item</span>
                <span className="sm:hidden">Add</span>
              </Button>
            )
          }
        />

        {/* ── Error ── */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4 flex items-center justify-between gap-3">
            <p className="text-sm text-red-600">{error}</p>
            <Button variant="secondary" size="sm" onClick={onRetry}>
              Retry
            </Button>
          </div>
        )}

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {[
            { label: "Total", value: menuItems.length },
            {
              label: "Available",
              value: menuItems.filter((i) => i.available).length,
            },
            {
              label: "Unavailable",
              value: menuItems.filter((i) => !i.available).length,
            },
            {
              label: "Categories",
              value: new Set(menuItems.map((i) => i.category)).size,
            },
          ].map((s) => (
            <Card key={s.label} className="p-3 sm:p-4">
              <p className="text-[10px] sm:text-xs text-kot-text font-medium">
                {s.label}
              </p>
              {loading ? (
                <Pulse className="h-6 w-10 mt-1" />
              ) : (
                <p className="text-xl sm:text-2xl font-bold text-kot-darker mt-0.5">
                  {s.value}
                </p>
              )}
            </Card>
          ))}
        </div>

        {/* ── Search ── */}
        <SearchInput
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Search menu items…"
        />

        {/* ── Category tabs — horizontal scroll on mobile ── */}
        <div className="overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0 scrollbar-none">
          <div className="flex gap-1.5 w-max sm:w-auto sm:flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => onCategoryChange(tab.key)}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                  selectedCategory === tab.key
                    ? "bg-kot-dark text-white"
                    : "bg-kot-white text-kot-text hover:bg-kot-light border border-kot-chart"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Grid ── */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Pulse className="w-full h-28 sm:h-40" />
                <div className="p-3 sm:p-4 space-y-2">
                  <Pulse className="h-4 w-3/4" />
                  <Pulse className="h-3 w-1/2" />
                  <Pulse className="h-3 w-full" />
                </div>
              </Card>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <EmptyState
            icon="🍽️"
            title="No items found"
            sub={
              searchQuery
                ? "Try a different search"
                : "Add your first menu item"
            }
            action={
              !searchQuery &&
              isAdmin && (
                <Button size="sm" onClick={() => onOpenModal()}>
                  Add Item
                </Button>
              )
            }
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {filteredItems.map((item) => (
              <Card key={item._id} className="overflow-hidden flex flex-col">
                {/* Image placeholder */}
                <div className="w-full h-28 sm:h-40 bg-kot-light flex items-center justify-center text-3xl sm:text-4xl flex-shrink-0">
                  🍽️
                </div>

                <div className="p-3 sm:p-4 flex-1 flex flex-col gap-1.5 sm:gap-2">
                  {/* Name + badge */}
                  <div className="flex justify-between items-start gap-1.5">
                    <h3 className="font-bold text-kot-darker text-xs sm:text-sm leading-tight line-clamp-2">
                      {item.ItemName}
                    </h3>
                    <Badge
                      variant={item.available ? "success" : "danger"}
                      className="flex-shrink-0 text-[9px] sm:text-xs"
                    >
                      {item.available ? "✓" : "✕"}
                    </Badge>
                  </div>

                  {/* Category */}
                  <p className="text-[10px] sm:text-xs text-kot-text">
                    {getCategoryLabel(item.category)}
                  </p>

                  {/* Price + actions */}
                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-kot-chart">
                    <span className="text-sm sm:text-base font-bold text-kot-darker">
                      ₹{item.price.toLocaleString("en-IN")}
                    </span>
                    {isAdmin && (
                      <div className="flex gap-0.5 sm:gap-1">
                        <IconButton
                          onClick={() => onToggle(item)}
                          title={item.available ? "Disable" : "Enable"}
                          className="w-7 h-7 sm:w-8 sm:h-8"
                        >
                          <span className="text-xs">
                            {item.available ? "🔴" : "🟢"}
                          </span>
                        </IconButton>
                        <IconButton
                          onClick={() => onOpenModal(item)}
                          className="w-7 h-7 sm:w-8 sm:h-8"
                        >
                          <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        </IconButton>
                        <IconButton
                          variant="danger"
                          onClick={() => onDelete(item)}
                          className="w-7 h-7 sm:w-8 sm:h-8"
                        >
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        </IconButton>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* ── Modal ── */}
        <Modal
          open={showModal}
          title={editingItem ? "Edit Menu Item" : "Add Menu Item"}
          onClose={onCloseModal}
        >
          <form onSubmit={onSubmit} className="space-y-3">
            <Input
              label="Item Name *"
              value={formData.ItemName}
              onChange={(e) => onFieldChange("ItemName", e.target.value)}
              error={formErrors.ItemName}
              placeholder="e.g. Butter Chicken"
            />
            <Select
              label="Category *"
              value={formData.category}
              onChange={(e) => onFieldChange("category", e.target.value)}
              error={formErrors.category}
            >
              <option value="">Select category</option>
              {CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </Select>
            <Input
              label="Price (₹) *"
              type="number"
              value={formData.price}
              onChange={(e) => onFieldChange("price", Number(e.target.value))}
              error={formErrors.price}
              placeholder="0"
            />

            <label className="flex items-center gap-3 p-3 rounded-xl bg-kot-light cursor-pointer">
              <input
                type="checkbox"
                checked={formData.available}
                onChange={(e) => onFieldChange("available", e.target.checked)}
                className="w-5 h-5 rounded accent-kot-dark flex-shrink-0"
              />
              <div>
                <p className="font-medium text-kot-darker text-sm">Available</p>
                <p className="text-xs text-kot-text">
                  Show this item to customers
                </p>
              </div>
            </label>
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
                {editingItem ? "Update" : "Add Item"}
              </Button>
            </div>
          </form>
        </Modal>
      </main>
    </div>
  );
}
