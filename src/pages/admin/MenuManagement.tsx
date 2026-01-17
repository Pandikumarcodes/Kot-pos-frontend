import { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, X } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  image?: string;
  isAvailable: boolean;
}

// Mock data - replace with API call
const MOCK_MENU_ITEMS: MenuItem[] = [
  {
    id: "1",
    name: "Paneer Butter Masala",
    price: 220,
    category: "Main Course",
    description: "Rich and creamy curry",
    isAvailable: true,
  },
  {
    id: "2",
    name: "Veg Fried Rice",
    price: 180,
    category: "Main Course",
    description: "Indo-Chinese favorite",
    isAvailable: true,
  },
  {
    id: "3",
    name: "Garlic Naan",
    price: 45,
    category: "Breads",
    description: "Soft tandoori bread",
    isAvailable: true,
  },
  {
    id: "4",
    name: "Spring Rolls",
    price: 120,
    category: "Starters",
    description: "Crispy vegetable rolls",
    isAvailable: true,
  },
  {
    id: "5",
    name: "Dal Makhani",
    price: 180,
    category: "Main Course",
    description: "Black lentils in butter",
    isAvailable: true,
  },
  {
    id: "6",
    name: "Gulab Jamun",
    price: 80,
    category: "Desserts",
    description: "Sweet milk dumplings",
    isAvailable: true,
  },
  {
    id: "7",
    name: "Tandoori Roti",
    price: 30,
    category: "Breads",
    description: "Whole wheat bread",
    isAvailable: true,
  },
  {
    id: "8",
    name: "Paneer Tikka",
    price: 200,
    category: "Starters",
    description: "Grilled cottage cheese",
    isAvailable: true,
  },
  {
    id: "9",
    name: "Biryani",
    price: 250,
    category: "Main Course",
    description: "Aromatic rice dish",
    isAvailable: false,
  },
  {
    id: "10",
    name: "Raita",
    price: 60,
    category: "Sides",
    description: "Yogurt with cucumber",
    isAvailable: true,
  },
];

const CATEGORIES = [
  "All",
  "Starters",
  "Main Course",
  "Breads",
  "Sides",
  "Desserts",
];

export default function MenuManagementPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: "",
    price: 0,
    category: "Main Course",
    description: "",
    isAvailable: true,
  });

  // Fetch menu items on mount
  useEffect(() => {
    // TODO: Replace with actual API call
    setTimeout(() => {
      setMenuItems(MOCK_MENU_ITEMS);
      setLoading(false);
    }, 500);
  }, []);

  // Filter items
  const filteredByCategory =
    selectedCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  const filteredItems = searchQuery
    ? filteredByCategory.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredByCategory;

  // Open modal for add/edit
  const handleOpenModal = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        name: "",
        price: 0,
        category: "Main Course",
        description: "",
        isAvailable: true,
      });
    }
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingItem) {
      // Update existing item
      // TODO: API call - updateMenuItem(editingItem.id, formData)
      setMenuItems(
        menuItems.map((item) =>
          item.id === editingItem.id ? { ...item, ...formData } : item
        )
      );
      alert(`"${formData.name}" updated successfully!`);
    } else {
      // Add new item
      // TODO: API call - createMenuItem(formData)
      const newItem: MenuItem = {
        // id: Date.now().toString(),
        ...(formData as MenuItem),
      };
      setMenuItems([...menuItems, newItem]);
      alert(`"${formData.name}" added successfully!`);
    }

    handleCloseModal();
  };

  // Delete item
  const handleDelete = async (item: MenuItem) => {
    const confirm = window.confirm(
      `Are you sure you want to delete "${item.name}"?`
    );
    if (!confirm) return;

    // TODO: API call - deleteMenuItem(item.id)
    setMenuItems(menuItems.filter((i) => i.id !== item.id));
    alert(`"${item.name}" deleted successfully!`);
  };

  // Toggle availability
  const handleToggleAvailability = async (item: MenuItem) => {
    // TODO: API call - updateMenuItem(item.id, { isAvailable: !item.isAvailable })
    setMenuItems(
      menuItems.map((i) =>
        i.id === item.id ? { ...i, isAvailable: !i.isAvailable } : i
      )
    );
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Menu Management
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Add, edit, or remove menu items
              </p>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-lg transition-colors"
            >
              <Plus size={20} />
              Add Item
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items Table */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Search size={64} className="mb-4 text-gray-300" />
            <p className="text-xl font-medium">No items found</p>
            <p className="text-sm mt-2">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        {item.description && (
                          <p className="text-sm text-gray-500">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">
                        ₹{item.price}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleAvailability(item)}
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          item.isAvailable
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                        }`}
                      >
                        {item.isAvailable ? "Available" : "Unavailable"}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingItem ? "Edit Item" : "Add New Item"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Item Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter item name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: parseFloat(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter item description"
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isAvailable"
                  checked={formData.isAvailable}
                  onChange={(e) =>
                    setFormData({ ...formData, isAvailable: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label
                  htmlFor="isAvailable"
                  className="text-sm font-medium text-gray-700"
                >
                  Available for ordering
                </label>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingItem ? "Update" : "Add"} Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
