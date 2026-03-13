import { useState, useEffect } from "react";
import { useAppSelector } from "../../../Store/hooks";
import {
  getMenuItemsApi,
  createMenuItemApi,
  updateMenuItemApi,
  deleteMenuItemApi,
} from "../../../services/adminApi/Menu.api";
import type {
  MenuItem,
  CreateMenuPayload,
} from "../../../services/adminApi/Menu.api";
import { useToast } from "../../../Context/ToastContext";
import {
  validateMenuItem,
  hasErrors,
  type ValidationErrors,
} from "../../../utils/validation";
import { MenuManagementPresenter } from "./MenuManagementPresenter";

export default function MenuManagementContainer() {
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
  const [formErrors, setFormErrors] = useState<ValidationErrors>({});
  const [formData, setFormData] = useState<CreateMenuPayload>({
    ItemName: "",
    price: 0,
    category: "starter",
    available: true,
  });

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await getMenuItemsApi();
      setMenuItems(data.menuItems);
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } } };
      setError(e?.response?.data?.error || "Failed to load menu items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  // Derived — computed in container
  const filteredItems = (
    selectedCategory === "all"
      ? menuItems
      : menuItems.filter((i) => i.category === selectedCategory)
  ).filter(
    (i) =>
      !searchQuery ||
      i.ItemName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleOpenModal = (item?: MenuItem) => {
    setEditingItem(item || null);
    setFormData(
      item
        ? {
            ItemName: item.ItemName,
            price: item.price,
            category: item.category,
            available: item.available,
          }
        : { ItemName: "", price: 0, category: "starter", available: true },
    );
    setFormErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormErrors({});
  };

  const handleFieldChange = (
    field: string,
    value: string | number | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field])
      setFormErrors((prev) => ({
        ...prev,
        [field]: undefined as unknown as string,
      }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateMenuItem(formData);
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
      const e = err as { response?: { data?: { error?: string } } };
      toast.error(e?.response?.data?.error || "Failed to save item");
    }
  };

  const handleDelete = async (item: MenuItem) => {
    if (!window.confirm(`Delete "${item.ItemName}"?`)) return;
    try {
      await deleteMenuItemApi(item._id);
      setMenuItems(menuItems.filter((i) => i._id !== item._id));
      toast.success(`"${item.ItemName}" deleted!`);
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } } };
      toast.error(e?.response?.data?.error || "Failed to delete item");
    }
  };

  const handleToggle = async (item: MenuItem) => {
    try {
      await updateMenuItemApi(item._id, { available: !item.available });
      setMenuItems(
        menuItems.map((i) =>
          i._id === item._id ? { ...i, available: !i.available } : i,
        ),
      );
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } } };
      toast.error(e?.response?.data?.error || "Failed to update availability");
    }
  };

  return (
    <MenuManagementPresenter
      menuItems={menuItems}
      filteredItems={filteredItems}
      loading={loading}
      error={error}
      selectedCategory={selectedCategory}
      searchQuery={searchQuery}
      showModal={showModal}
      editingItem={editingItem}
      formData={formData}
      formErrors={formErrors}
      isAdmin={isAdmin}
      onCategoryChange={setSelectedCategory}
      onSearchChange={setSearchQuery}
      onOpenModal={handleOpenModal}
      onCloseModal={handleCloseModal}
      onFieldChange={handleFieldChange}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
      onToggle={handleToggle}
      onRetry={fetchMenuItems}
    />
  );
}
