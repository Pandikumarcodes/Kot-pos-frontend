// import { useState, useEffect } from "react";
// import { Plus, Search, Edit2, Trash2, X } from "lucide-react";
// import { useAppSelector } from "../../Store/hooks";
// import {
//   getMenuItemsApi,
//   createMenuItemApi,
//   updateMenuItemApi,
//   deleteMenuItemApi,
// } from "../../services/adminApi/Menu.api";
// import type {
//   MenuItem,
//   CreateMenuPayload,
// } from "../../services/adminApi/Menu.api";
// import { useToast } from "../../Context/ToastContext";
// import {
//   validateMenuItem,
//   hasErrors,
//   type ValidationErrors,
// } from "../../utils/validation";

// const CATEGORIES = [
//   { key: "starter", label: "Starter" },
//   { key: "main_course", label: "Main Course" },
//   { key: "dessert", label: "Dessert" },
//   { key: "beverage", label: "Beverage" },
//   { key: "snacks", label: "Snacks" },
//   { key: "side_dish", label: "Side Dish" },
//   { key: "bread", label: "Bread" },
//   { key: "rice", label: "Rice" },
//   { key: "combo", label: "Combo" },
//   { key: "special", label: "Special" },
// ];

// const getCategoryLabel = (key: string) =>
//   CATEGORIES.find((c) => c.key === key)?.label ?? key;

// // ── Skeleton ──────────────────────────────────────────────────
// const Pulse = ({ className }: { className: string }) => (
//   <div className={`bg-kot-chart rounded animate-pulse ${className}`} />
// );

// function SkeletonRow() {
//   return (
//     <tr className="border-b border-kot-chart">
//       <td className="px-4 py-3">
//         <Pulse className="h-4 w-32" />
//       </td>
//       <td className="px-4 py-3 hidden sm:table-cell">
//         <Pulse className="h-5 w-20 rounded-full" />
//       </td>
//       <td className="px-4 py-3">
//         <Pulse className="h-4 w-12" />
//       </td>
//       <td className="px-4 py-3 hidden md:table-cell">
//         <Pulse className="h-6 w-20 rounded-full" />
//       </td>
//       <td className="px-4 py-3">
//         <Pulse className="h-7 w-16 ml-auto" />
//       </td>
//     </tr>
//   );
// }

// export default function MenuManagementPage() {
//   const { user } = useAppSelector((state) => state.auth);
//   const toast = useToast();
//   const isAdmin = user?.role === "admin";

//   const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [showModal, setShowModal] = useState(false);
//   const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
//   const [formErrors, setFormErrors] = useState<ValidationErrors>({});
//   const [formData, setFormData] = useState<CreateMenuPayload>({
//     ItemName: "",
//     price: 0,
//     category: "starter",
//     available: true,
//   });

//   useEffect(() => {
//     fetchMenuItems();
//   }, []);

//   const fetchMenuItems = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const { data } = await getMenuItemsApi();
//       setMenuItems(data.menuItems);
//     } catch (err) {
//       const e = err as { response?: { data?: { error?: string } } };
//       setError(e?.response?.data?.error || "Failed to load menu items");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredItems = (
//     selectedCategory === "all"
//       ? menuItems
//       : menuItems.filter((i) => i.category === selectedCategory)
//   ).filter(
//     (i) =>
//       !searchQuery ||
//       i.ItemName.toLowerCase().includes(searchQuery.toLowerCase()),
//   );

//   const handleOpenModal = (item?: MenuItem) => {
//     setEditingItem(item || null);
//     setFormData(
//       item
//         ? {
//             ItemName: item.ItemName,
//             price: item.price,
//             category: item.category,
//             available: item.available,
//           }
//         : { ItemName: "", price: 0, category: "starter", available: true },
//     );
//     setFormErrors({});
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setEditingItem(null);
//     setFormErrors({});
//   };

//   const handleFieldChange = (
//     field: string,
//     value: string | number | boolean,
//   ) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//     if (formErrors[field])
//       setFormErrors((prev) => ({
//         ...prev,
//         [field]: undefined as unknown as string,
//       }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const errors = validateMenuItem(formData, !!editingItem);
//     if (hasErrors(errors)) {
//       setFormErrors(errors);
//       return;
//     }
//     try {
//       if (editingItem) {
//         await updateMenuItemApi(editingItem._id, {
//           price: formData.price,
//           available: formData.available,
//         });
//         setMenuItems(
//           menuItems.map((i) =>
//             i._id === editingItem._id
//               ? { ...i, price: formData.price, available: formData.available }
//               : i,
//           ),
//         );
//       } else {
//         const { data } = await createMenuItemApi(formData);
//         setMenuItems([...menuItems, data.menuItem]);
//       }
//       handleCloseModal();
//       toast.success(editingItem ? "Item updated!" : "Item added!");
//     } catch (err) {
//       const e = err as { response?: { data?: { error?: string } } };
//       toast.error(e?.response?.data?.error || "Failed to save item");
//     }
//   };

//   const handleDelete = async (item: MenuItem) => {
//     if (!window.confirm(`Delete "${item.ItemName}"?`)) return;
//     try {
//       await deleteMenuItemApi(item._id);
//       setMenuItems(menuItems.filter((i) => i._id !== item._id));
//       toast.success(`"${item.ItemName}" deleted!`);
//     } catch (err) {
//       const e = err as { response?: { data?: { error?: string } } };
//       toast.error(e?.response?.data?.error || "Failed to delete item");
//     }
//   };

//   const handleToggle = async (item: MenuItem) => {
//     try {
//       await updateMenuItemApi(item._id, { available: !item.available });
//       setMenuItems(
//         menuItems.map((i) =>
//           i._id === item._id ? { ...i, available: !i.available } : i,
//         ),
//       );
//     } catch (err) {
//       const e = err as { response?: { data?: { error?: string } } };
//       toast.error(e?.response?.data?.error || "Failed to update availability");
//     }
//   };

//   const inputCls = (field: string) =>
//     `w-full px-3 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-kot-dark focus:border-kot-dark bg-kot-white text-kot-darker placeholder:text-kot-text/50 text-sm transition-colors ${formErrors[field] ? "border-red-500" : "border-kot-chart"}`;

//   if (error)
//     return (
//       <div className="h-screen flex items-center justify-center bg-kot-primary">
//         <div className="text-center px-4">
//           <p className="text-red-600 font-medium mb-3">{error}</p>
//           <button
//             onClick={fetchMenuItems}
//             className="px-4 py-2 bg-kot-dark text-white rounded-lg hover:bg-kot-darker"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );

//   return (
//     <div className="min-h-screen flex flex-col bg-kot-primary">
//       {/* ── Header ── */}
//       <div className="bg-kot-white border-b border-kot-chart shadow-kot sticky top-0 z-10">
//         <div className="p-3 sm:p-4 md:p-6 max-w-[2400px] mx-auto">
//           {/* Title + Add */}
//           <div className="flex items-center justify-between mb-3">
//             <div>
//               <h1 className="text-lg sm:text-2xl font-bold text-kot-darker">
//                 Menu Management
//               </h1>
//               <p className="text-xs sm:text-sm text-kot-text mt-0.5">
//                 {menuItems.length} items total
//               </p>
//             </div>
//             <button
//               onClick={() => handleOpenModal()}
//               className="flex items-center gap-1.5 sm:gap-2 bg-kot-dark hover:bg-kot-darker text-white font-semibold px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg transition-colors text-sm"
//             >
//               <Plus size={16} />{" "}
//               <span className="hidden xs:inline">Add Item</span>
//               <span className="xs:hidden">Add</span>
//             </button>
//           </div>

//           {/* Search */}
//           <div className="relative mb-3">
//             <Search
//               className="absolute left-3 top-1/2 -translate-y-1/2 text-kot-text"
//               size={16}
//             />
//             <input
//               type="text"
//               placeholder="Search menu items..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full pl-9 pr-4 py-2.5 border-2 border-kot-chart rounded-lg focus:outline-none focus:border-kot-dark bg-kot-white text-kot-darker text-sm placeholder:text-kot-text/50"
//             />
//           </div>

//           {/* Category tabs — scrollable */}
//           <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
//             <button
//               onClick={() => setSelectedCategory("all")}
//               className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${selectedCategory === "all" ? "bg-kot-dark text-white" : "bg-kot-light text-kot-text hover:bg-kot-stats"}`}
//             >
//               All
//             </button>
//             {CATEGORIES.map((cat) => (
//               <button
//                 key={cat.key}
//                 onClick={() => setSelectedCategory(cat.key)}
//                 className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${selectedCategory === cat.key ? "bg-kot-dark text-white" : "bg-kot-light text-kot-text hover:bg-kot-stats"}`}
//               >
//                 {cat.label}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ── Table / Cards ── */}
//       <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 max-w-[2400px] mx-auto w-full">
//         {loading ? (
//           <div className="bg-kot-white rounded-xl shadow-kot border border-kot-chart overflow-hidden">
//             <table className="w-full">
//               <thead className="bg-kot-light border-b border-kot-chart">
//                 <tr>
//                   <th className="px-4 py-3 text-left text-xs font-semibold text-kot-text uppercase">
//                     Name
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-semibold text-kot-text uppercase hidden sm:table-cell">
//                     Category
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-semibold text-kot-text uppercase">
//                     Price
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-semibold text-kot-text uppercase hidden md:table-cell">
//                     Status
//                   </th>
//                   <th className="px-4 py-3 text-right text-xs font-semibold text-kot-text uppercase">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {[...Array(6)].map((_, i) => (
//                   <SkeletonRow key={i} />
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : filteredItems.length === 0 ? (
//           <div className="flex flex-col items-center justify-center py-20 text-kot-text">
//             <Search size={48} className="mb-4 text-kot-chart" />
//             <p className="text-lg font-medium">No items found</p>
//             <p className="text-sm mt-1">Try adjusting your search or filters</p>
//           </div>
//         ) : (
//           <>
//             {/* Desktop table — hidden on mobile */}
//             <div className="hidden sm:block bg-kot-white rounded-xl shadow-kot border border-kot-chart overflow-hidden">
//               <table className="w-full">
//                 <thead className="bg-kot-light border-b border-kot-chart">
//                   <tr>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-kot-text uppercase">
//                       Name
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-kot-text uppercase">
//                       Category
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-kot-text uppercase">
//                       Price
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-kot-text uppercase">
//                       Status
//                     </th>
//                     <th className="px-4 py-3 text-right text-xs font-semibold text-kot-text uppercase">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-kot-chart">
//                   {filteredItems.map((item) => (
//                     <tr
//                       key={item._id}
//                       className="hover:bg-kot-primary transition-colors"
//                     >
//                       <td className="px-4 py-3 font-medium text-kot-darker">
//                         {item.ItemName}
//                       </td>
//                       <td className="px-4 py-3">
//                         <span className="text-xs px-2.5 py-1 rounded-full bg-kot-light text-kot-dark font-medium">
//                           {getCategoryLabel(item.category)}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3 font-semibold text-kot-darker">
//                         ₹{item.price}
//                       </td>
//                       <td className="px-4 py-3">
//                         <button
//                           onClick={() => handleToggle(item)}
//                           className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors ${item.available ? "bg-kot-stats text-kot-darker hover:bg-kot-chart" : "bg-red-100 text-red-700 hover:bg-red-200"}`}
//                         >
//                           {item.available ? "Available" : "Unavailable"}
//                         </button>
//                       </td>
//                       <td className="px-4 py-3">
//                         <div className="flex items-center justify-end gap-1">
//                           <button
//                             onClick={() => handleOpenModal(item)}
//                             className="p-2 text-kot-dark hover:bg-kot-light rounded-lg transition-colors"
//                           >
//                             <Edit2 size={16} />
//                           </button>
//                           {isAdmin && (
//                             <button
//                               onClick={() => handleDelete(item)}
//                               className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                             >
//                               <Trash2 size={16} />
//                             </button>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Mobile cards — shown only on mobile */}
//             <div className="sm:hidden space-y-2">
//               {filteredItems.map((item) => (
//                 <div
//                   key={item._id}
//                   className="bg-kot-white rounded-xl shadow-kot p-3 flex items-center gap-3"
//                 >
//                   <div className="flex-1 min-w-0">
//                     <p className="font-semibold text-sm text-kot-darker truncate">
//                       {item.ItemName}
//                     </p>
//                     <div className="flex items-center gap-2 mt-1">
//                       <span className="text-xs px-2 py-0.5 rounded-full bg-kot-light text-kot-dark">
//                         {getCategoryLabel(item.category)}
//                       </span>
//                       <span className="text-xs font-bold text-kot-darker">
//                         ₹{item.price}
//                       </span>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => handleToggle(item)}
//                     className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${item.available ? "bg-kot-stats text-kot-darker" : "bg-red-100 text-red-700"}`}
//                   >
//                     {item.available ? "✓ Avail" : "✗ Off"}
//                   </button>
//                   <div className="flex gap-1 flex-shrink-0">
//                     <button
//                       onClick={() => handleOpenModal(item)}
//                       className="p-1.5 text-kot-dark hover:bg-kot-light rounded-lg"
//                     >
//                       <Edit2 size={14} />
//                     </button>
//                     {isAdmin && (
//                       <button
//                         onClick={() => handleDelete(item)}
//                         className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
//                       >
//                         <Trash2 size={14} />
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </>
//         )}
//       </div>

//       {/* ── Modal ── */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
//           <div className="bg-kot-white rounded-t-3xl sm:rounded-xl shadow-kot-lg w-full sm:max-w-md">
//             <div className="flex items-center justify-between p-5 border-b border-kot-chart">
//               <h2 className="text-lg font-bold text-kot-darker">
//                 {editingItem ? `Edit: ${editingItem.ItemName}` : "Add New Item"}
//               </h2>
//               <button
//                 onClick={handleCloseModal}
//                 className="text-kot-text hover:text-kot-darker"
//               >
//                 <X size={22} />
//               </button>
//             </div>
//             <form
//               onSubmit={handleSubmit}
//               className="p-5 space-y-4 max-h-[80vh] overflow-y-auto"
//             >
//               {!editingItem && (
//                 <>
//                   <div>
//                     <label className="block text-sm font-semibold text-kot-darker mb-1">
//                       Item Name *
//                     </label>
//                     <input
//                       type="text"
//                       value={formData.ItemName}
//                       onChange={(e) =>
//                         handleFieldChange("ItemName", e.target.value)
//                       }
//                       className={inputCls("ItemName")}
//                       placeholder="e.g. Paneer Butter Masala"
//                     />
//                     {formErrors.ItemName && (
//                       <p className="mt-1 text-xs text-red-500">
//                         {formErrors.ItemName}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-kot-darker mb-1">
//                       Category *
//                     </label>
//                     <select
//                       value={formData.category}
//                       onChange={(e) =>
//                         handleFieldChange("category", e.target.value)
//                       }
//                       className={inputCls("category")}
//                     >
//                       {CATEGORIES.map((cat) => (
//                         <option key={cat.key} value={cat.key}>
//                           {cat.label}
//                         </option>
//                       ))}
//                     </select>
//                     {formErrors.category && (
//                       <p className="mt-1 text-xs text-red-500">
//                         {formErrors.category}
//                       </p>
//                     )}
//                   </div>
//                 </>
//               )}
//               <div>
//                 <label className="block text-sm font-semibold text-kot-darker mb-1">
//                   Price (₹) *
//                 </label>
//                 <input
//                   type="number"
//                   min="1"
//                   step="0.01"
//                   value={formData.price || ""}
//                   onChange={(e) =>
//                     handleFieldChange("price", parseFloat(e.target.value) || 0)
//                   }
//                   className={inputCls("price")}
//                   placeholder="0.00"
//                 />
//                 {formErrors.price && (
//                   <p className="mt-1 text-xs text-red-500">
//                     {formErrors.price}
//                   </p>
//                 )}
//               </div>
//               <label className="flex items-center gap-2 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={formData.available}
//                   onChange={(e) =>
//                     handleFieldChange("available", e.target.checked)
//                   }
//                   className="w-4 h-4 rounded accent-kot-dark"
//                 />
//                 <span className="text-sm font-medium text-kot-darker">
//                   Available for ordering
//                 </span>
//               </label>
//               {editingItem && (
//                 <p className="text-xs text-kot-text bg-kot-light px-3 py-2 rounded-lg">
//                   ℹ️ Only price and availability can be updated.
//                 </p>
//               )}
//               <div className="flex gap-3 pt-2">
//                 <button
//                   type="button"
//                   onClick={handleCloseModal}
//                   className="flex-1 px-4 py-2.5 border-2 border-kot-chart text-kot-darker font-semibold rounded-lg hover:bg-kot-light"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="flex-1 px-4 py-2.5 bg-kot-dark hover:bg-kot-darker text-white font-semibold rounded-lg"
//                 >
//                   {editingItem ? "Update Item" : "Add Item"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
