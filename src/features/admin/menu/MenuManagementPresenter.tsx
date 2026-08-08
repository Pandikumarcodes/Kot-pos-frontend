import { Plus, Edit2, Trash2 } from "lucide-react";
import { Card, Button, IconButton, Input, Select, PageHeader, EmptyState, Modal, Badge, PageContainer, Toolbar, SearchBar, FilterBar, FilterDropdown, SortDropdown, ActiveFilterChips, Pagination, LoadingSkeleton, RetryPanel } from "../../../components/ui";
import { CATEGORIES, type MenuPresenterProps } from "./menu.types";

const getCategoryLabel = (key: string) => CATEGORIES.find((c) => c.key === key)?.label ?? key;

export function MenuManagementPresenter({
  menuItems, pagination, loading, error, search, filterCat, filterAvailability, sortBy, sortOrder, activeFilters,
  showModal, editingItem, formData, formErrors, isAdmin, onSearchChange, onFilterCatChange, onFilterAvailabilityChange,
  onSortChange, onSortOrderChange, onRemoveFilter, onClearFilters, onPageChange, onOpenModal, onCloseModal,
  onFieldChange, onSubmit, onDelete, onToggle, onRetry,
}: MenuPresenterProps) {
  return <PageContainer>
    <div className="space-y-4">
      <PageHeader title="Menu" sub={`${pagination.total} items`} actions={isAdmin && <Button size="sm" onClick={() => onOpenModal()} className="flex items-center gap-1.5"><Plus className="w-4 h-4" /><span className="hidden sm:inline">Add Item</span><span className="sm:hidden">Add</span></Button>} />

      <Toolbar>
        <SearchBar value={search} onChange={onSearchChange} placeholder="Search menu items…" />
        <FilterBar>
          <FilterDropdown label="Category" value={filterCat} options={CATEGORIES.map((c) => ({ value: c.key, label: c.label }))} onChange={onFilterCatChange} />
          <FilterDropdown label="Availability" value={filterAvailability} options={[{ value: "true", label: "Available" }, { value: "false", label: "Unavailable" }]} onChange={onFilterAvailabilityChange} />
          <SortDropdown label="Sort by" value={sortBy} options={[{ value: "name", label: "Name" }, { value: "price", label: "Price" }, { value: "category", label: "Category" }]} onChange={onSortChange} />
          {sortBy && <Button type="button" variant="secondary" size="sm" onClick={() => onSortOrderChange(sortOrder === "asc" ? "desc" : "asc")}>{sortOrder === "asc" ? "A–Z / Low" : "Z–A / High"}</Button>}
        </FilterBar>
      </Toolbar>
      <ActiveFilterChips filters={activeFilters} onRemove={onRemoveFilter} onClear={onClearFilters} />

      {error && <RetryPanel onRetry={onRetry} title="Unable to load menu" message={error} />}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {[{ label: "Total", value: pagination.total }, { label: "Available", value: menuItems.filter((i) => i.available).length }, { label: "Unavailable", value: menuItems.filter((i) => !i.available).length }, { label: "Categories", value: new Set(menuItems.map((i) => i.category)).size }].map((stat) => <Card key={stat.label} className="p-3 sm:p-4"><p className="text-[10px] sm:text-xs text-kot-text font-medium">{stat.label}</p>{loading ? <LoadingSkeleton rows={1} className="mt-2" /> : <p className="text-xl sm:text-2xl font-bold text-kot-darker mt-0.5">{stat.value}</p>}</Card>)}
      </div>

      {loading ? <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4"><LoadingSkeleton rows={8} className="col-span-full" /></div> : menuItems.length === 0 ? <EmptyState icon="🍽️" title="No items found" sub={search || activeFilters.length ? "Try different search or filters" : "Add your first menu item"} action={!search && activeFilters.length === 0 && isAdmin && <Button size="sm" onClick={() => onOpenModal()}>Add Item</Button>} /> : <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">{menuItems.map((item) => <Card key={item._id} className="overflow-hidden flex flex-col"><div className="w-full h-28 sm:h-40 bg-kot-light flex items-center justify-center text-3xl sm:text-4xl flex-shrink-0">🍽️</div><div className="p-3 sm:p-4 flex-1 flex flex-col gap-1.5 sm:gap-2"><div className="flex justify-between items-start gap-1.5"><h3 className="font-bold text-kot-darker text-xs sm:text-sm leading-tight line-clamp-2">{item.ItemName}</h3><Badge variant={item.available ? "success" : "danger"} className="flex-shrink-0 text-[9px] sm:text-xs">{item.available ? "✓" : "✕"}</Badge></div><p className="text-[10px] sm:text-xs text-kot-text">{getCategoryLabel(item.category)}</p><div className="flex items-center justify-between mt-auto pt-2 border-t border-kot-chart"><span className="text-sm sm:text-base font-bold text-kot-darker">₹{item.price.toLocaleString("en-IN")}</span>{isAdmin && <div className="flex gap-0.5 sm:gap-1"><IconButton onClick={() => onToggle(item)} title={item.available ? "Disable" : "Enable"} className="w-7 h-7 sm:w-8 sm:h-8"><span className="text-xs">{item.available ? "🔴" : "🟢"}</span></IconButton><IconButton onClick={() => onOpenModal(item)} className="w-7 h-7 sm:w-8 sm:h-8"><Edit2 className="w-3 h-3 sm:w-4 sm:h-4" /></IconButton><IconButton variant="danger" onClick={() => onDelete(item)} className="w-7 h-7 sm:w-8 sm:h-8"><Trash2 className="w-3 h-3 sm:w-4 sm:h-4" /></IconButton></div>}</div></div></Card>)}</div>}

      {!loading && pagination.total > 0 && <Pagination state={{ page: pagination.page, pageSize: pagination.limit, total: pagination.total }} onPageChange={onPageChange} />}

      <Modal open={showModal} title={editingItem ? "Edit Menu Item" : "Add Menu Item"} onClose={onCloseModal}><form onSubmit={onSubmit} className="space-y-3"><Input label="Item Name *" value={formData.ItemName} onChange={(e) => onFieldChange("ItemName", e.target.value)} error={formErrors.ItemName} placeholder="e.g. Butter Chicken" /><Select label="Category *" value={formData.category} onChange={(e) => onFieldChange("category", e.target.value)} error={formErrors.category}><option value="">Select category</option>{CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}</Select><Input label="Price (₹) *" type="number" value={formData.price} onChange={(e) => onFieldChange("price", Number(e.target.value))} error={formErrors.price} placeholder="0" /><label className="flex items-center gap-3 p-3 rounded-xl bg-kot-light cursor-pointer"><input type="checkbox" checked={formData.available} onChange={(e) => onFieldChange("available", e.target.checked)} className="w-5 h-5 rounded accent-kot-dark flex-shrink-0" /><div><p className="font-medium text-kot-darker text-sm">Available</p><p className="text-xs text-kot-text">Show this item to customers</p></div></label><div className="flex gap-3 pt-2"><Button variant="secondary" size="md" type="button" onClick={onCloseModal} className="flex-1">Cancel</Button><Button size="md" type="submit" className="flex-1">{editingItem ? "Update" : "Add Item"}</Button></div></form></Modal>
    </div>
  </PageContainer>;
}
