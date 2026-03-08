// src/pages/admin/MenuManagement.tsx
import { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, X } from "lucide-react";
import { useAppSelector } from "../../Store/hooks";
import {
  getMenuItemsApi,
  createMenuItemApi,
  updateMenuItemApi,
  deleteMenuItemApi,
} from "../../services/adminApi/Menu.api";
import type {
  MenuItem,
  CreateMenuPayload,
} from "../../services/adminApi/Menu.api";
import { useToast } from "../../Context/ToastContext";
import {
  validateMenuItem,
  hasErrors,
  type ValidationErrors,
} from "../../utils/validation";

const CATEGORIES: { key: string; label: string }[] = [
  { key: "starter", label: "Starter" },
  { key: "main_course", label: "Main Course" },
  { key: "dessert", label: "Dessert" },
  { key: "beverage", label: "Beverage" },
  { key: "snacks", label: "Snacks" },
  { key: "side_dish", label: "Side Dish" },
  { key: "bread", label: "Bread" },
  { key: "rice", label: "Rice" },
  { key: "combo", label: "Combo" },
  { key: "special", label: "Special" },
];

const getCategoryLabel = (key: string) =>
  CATEGORIES.find((c) => c.key === key)?.label ?? key;

export default function MenuManagementPage() {
  const { user } = useAppSelector((state) => state.auth);
  const toast = useToast();
  const isAdmin = user?.role === "admin";
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formErrors, setFormErrors] = useState<ValidationErrors>({}); // ✅
  const [formData, setFormData] = useState<CreateMenuPayload>({
    ItemName: "",
    price: 0,
    category: "starter",
    available: true,
  });

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await getMenuItemsApi();
      setMenuItems(data.menuItems);
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error?.response?.data?.error || "Failed to load menu items");
    } finally {
      setLoading(false);
    }
  };

  const filteredByCategory =
    selectedCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  const filteredItems = searchQuery
    ? filteredByCategory.filter((item) =>
        item.ItemName.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : filteredByCategory;

  const handleOpenModal = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        ItemName: item.ItemName,
        price: item.price,
        category: item.category,
        available: item.available,
      });
    } else {
      setEditingItem(null);
      setFormData({
        ItemName: "",
        price: 0,
        category: "starter",
        available: true,
      });
    }
    setFormErrors({}); // ✅ clear errors on open
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormErrors({});
  };

  // ✅ Clear field error on change
  const handleFieldChange = (
    field: string,
    value: string | number | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: undefined as unknown as string,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Validate before submit
    const errors = validateMenuItem(formData, !!editingItem);
    if (hasErrors(errors)) {
      setFormErrors(errors);
      return;
    }

    try {
      if (editingItem) {
        await updateMenuItemApi(editingItem._id, {
          price: formData.price,
          available: formData.available,
        });
        setMenuItems(
          menuItems.map((i) =>
            i._id === editingItem._id
              ? { ...i, price: formData.price, available: formData.available }
              : i,
          ),
        );
      } else {
        const { data } = await createMenuItemApi(formData);
        setMenuItems([...menuItems, data.menuItem]);
      }
      handleCloseModal();
      toast.success(editingItem ? "Item updated!" : "Item added!");
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(error?.response?.data?.error || "Failed to save item");
    }
  };

  const handleDelete = async (item: MenuItem) => {
    if (!window.confirm(`Delete "${item.ItemName}"?`)) return;
    try {
      await deleteMenuItemApi(item._id);
      setMenuItems(menuItems.filter((i) => i._id !== item._id));
      toast.success(`"${item.ItemName}" deleted!`);
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(error?.response?.data?.error || "Failed to delete item");
    }
  };

  const handleToggleAvailability = async (item: MenuItem) => {
    try {
      await updateMenuItemApi(item._id, { available: !item.available });
      setMenuItems(
        menuItems.map((i) =>
          i._id === item._id ? { ...i, available: !i.available } : i,
        ),
      );
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(
        error?.response?.data?.error || "Failed to update availability",
      );
    }
  };

  const inputClass = (field: string) =>
    `w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-kot-dark focus:border-kot-dark bg-kot-white text-kot-darker placeholder:text-kot-text/50 text-sm transition-colors ${
      formErrors[field] ? "border-red-500" : "border-kot-chart"
    }`;

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-kot-primary">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-kot-dark border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-kot-text">Loading menu...</p>
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
            onClick={fetchMenuItems}
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
                Menu Management
              </h1>
              <p className="text-sm text-kot-text mt-1">
                {menuItems.length} items total
              </p>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 bg-kot-dark hover:bg-kot-darker text-white font-semibold px-4 py-2.5 rounded-lg transition-colors"
            >
              <Plus size={20} /> Add Item
            </button>
          </div>

          <div className="relative mb-4">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-kot-text"
              size={20}
            />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border-2 border-kot-chart rounded-lg focus:outline-none focus:ring-2 focus:ring-kot-dark bg-kot-white text-kot-darker placeholder:text-kot-text/50"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedCategory === "all" ? "bg-kot-dark text-white" : "bg-kot-light text-kot-text hover:bg-kot-stats hover:text-kot-darker"}`}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedCategory === cat.key ? "bg-kot-dark text-white" : "bg-kot-light text-kot-text hover:bg-kot-stats hover:text-kot-darker"}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-kot-text">
            <Search size={64} className="mb-4 text-kot-chart" />
            <p className="text-xl font-medium">No items found</p>
            <p className="text-sm mt-2">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="bg-kot-white rounded-lg shadow-kot border border-kot-chart overflow-hidden">
            <table className="w-full">
              <thead className="bg-kot-light border-b border-kot-chart">
                <tr>
                  {["Name", "Category", "Price", "Status", "Actions"].map(
                    (h, i) => (
                      <th
                        key={h}
                        className={`px-6 py-3 text-xs font-semibold text-kot-text uppercase tracking-wide ${i === 4 ? "text-right" : "text-left"}`}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-kot-chart">
                {filteredItems.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-kot-primary transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-kot-darker">
                        {item.ItemName}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-kot-light text-kot-dark font-medium">
                        {getCategoryLabel(item.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-kot-darker">
                        ₹{item.price}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleAvailability(item)}
                        className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors ${item.available ? "bg-kot-stats text-kot-darker hover:bg-kot-chart" : "bg-red-100 text-red-700 hover:bg-red-200"}`}
                      >
                        {item.available ? "Available" : "Unavailable"}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(item)}
                          className="p-2 text-kot-dark hover:bg-kot-light rounded-lg transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => handleDelete(item)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
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
                {editingItem ? `Edit: ${editingItem.ItemName}` : "Add New Item"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-kot-text hover:text-kot-darker"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {!editingItem && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-kot-darker mb-1">
                      Item Name *
                    </label>
                    <input
                      type="text"
                      value={formData.ItemName}
                      onChange={(e) =>
                        handleFieldChange("ItemName", e.target.value)
                      }
                      className={inputClass("ItemName")}
                      placeholder="e.g. Paneer Butter Masala"
                    />
                    {formErrors.ItemName && (
                      <p className="mt-1 text-xs text-red-500">
                        {formErrors.ItemName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-kot-darker mb-1">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        handleFieldChange("category", e.target.value)
                      }
                      className={inputClass("category")}
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat.key} value={cat.key}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                    {formErrors.category && (
                      <p className="mt-1 text-xs text-red-500">
                        {formErrors.category}
                      </p>
                    )}
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-semibold text-kot-darker mb-1">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={formData.price || ""}
                  onChange={(e) =>
                    handleFieldChange("price", parseFloat(e.target.value) || 0)
                  }
                  className={inputClass("price")}
                  placeholder="0.00"
                />
                {formErrors.price && (
                  <p className="mt-1 text-xs text-red-500">
                    {formErrors.price}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="available"
                  checked={formData.available}
                  onChange={(e) =>
                    handleFieldChange("available", e.target.checked)
                  }
                  className="w-4 h-4 rounded accent-kot-dark"
                />
                <label
                  htmlFor="available"
                  className="text-sm font-medium text-kot-darker"
                >
                  Available for ordering
                </label>
              </div>

              {editingItem && (
                <p className="text-xs text-kot-text bg-kot-light px-3 py-2 rounded-lg">
                  ℹ️ Only price and availability can be updated.
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
                  {editingItem ? "Update Item" : "Add Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
