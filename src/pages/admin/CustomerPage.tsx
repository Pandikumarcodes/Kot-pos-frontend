// import { useState, useEffect } from "react";
// import {
//   Plus,
//   Search,
//   Edit2,
//   Trash2,
//   X,
//   Phone,
//   Mail,
//   MapPin,
//   Calendar,
// } from "lucide-react";
// import { useAppSelector } from "../../Store/hooks";
// import {
//   getCustomersApi,
//   createCustomerApi,
//   updateCustomerApi,
//   deleteCustomerApi,
// } from "../../services/adminApi/Customer.api";
// import type {
//   Customer,
//   CreateCustomerPayload,
// } from "../../services/adminApi/Customer.api";
// import { useToast } from "../../Context/ToastContext";

// const Pulse = ({ className }: { className: string }) => (
//   <div className={`bg-kot-chart rounded animate-pulse ${className}`} />
// );

// function SkeletonCard() {
//   return (
//     <div className="bg-kot-white rounded-2xl shadow-kot p-4">
//       <div className="flex items-start justify-between mb-3">
//         <div className="flex items-center gap-3">
//           <Pulse className="w-11 h-11 rounded-full flex-shrink-0" />
//           <div>
//             <Pulse className="h-4 w-28 mb-1.5" />
//             <Pulse className="h-3 w-20" />
//           </div>
//         </div>
//         <div className="flex gap-1">
//           <Pulse className="w-7 h-7 rounded-lg" />
//           <Pulse className="w-7 h-7 rounded-lg" />
//         </div>
//       </div>
//       <div className="space-y-1.5 mb-3">
//         <Pulse className="h-3 w-36" />
//         <Pulse className="h-3 w-28" />
//       </div>
//       <div className="grid grid-cols-2 gap-2 mb-3">
//         <Pulse className="h-14 rounded-xl" />
//         <Pulse className="h-14 rounded-xl" />
//       </div>
//       <Pulse className="h-3 w-full mt-3" />
//     </div>
//   );
// }

// const inputCls =
//   "w-full px-3 py-2.5 border-2 border-kot-chart rounded-lg focus:outline-none focus:ring-2 focus:ring-kot-dark focus:border-kot-dark bg-kot-white text-kot-darker placeholder:text-kot-text/50 text-sm";

// export default function CustomersPage() {
//   const { user } = useAppSelector((state) => state.auth);
//   const isAdmin = user?.role === "admin";
//   const toast = useToast();

//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [showModal, setShowModal] = useState(false);
//   const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
//   const [formData, setFormData] = useState<CreateCustomerPayload>({
//     name: "",
//     phone: "",
//     email: "",
//     address: "",
//   });

//   const fetchCustomers = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const { data } = await getCustomersApi();
//       setCustomers(data.customers);
//     } catch (err) {
//       const e = err as { response?: { data?: { error?: string } } };
//       setError(e?.response?.data?.error || "Failed to load customers");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCustomers();
//   }, []);

//   const filteredCustomers = searchQuery
//     ? customers.filter(
//         (c) =>
//           c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           c.phone.includes(searchQuery) ||
//           c.email?.toLowerCase().includes(searchQuery.toLowerCase()),
//       )
//     : customers;

//   const handleOpenModal = (customer?: Customer) => {
//     setEditingCustomer(customer || null);
//     setFormData(
//       customer
//         ? {
//             name: customer.name,
//             phone: customer.phone,
//             email: customer.email,
//             address: customer.address,
//           }
//         : { name: "", phone: "", email: "", address: "" },
//     );
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setEditingCustomer(null);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       if (editingCustomer) {
//         const { data } = await updateCustomerApi(editingCustomer._id, formData);
//         setCustomers(
//           customers.map((c) =>
//             c._id === editingCustomer._id ? data.customer : c,
//           ),
//         );
//       } else {
//         const { data } = await createCustomerApi(formData);
//         setCustomers([data.customer, ...customers]);
//       }
//       handleCloseModal();
//       toast.success(editingCustomer ? "Customer updated!" : "Customer added!");
//     } catch (err) {
//       const e = err as { response?: { data?: { error?: string } } };
//       toast.error(e?.response?.data?.error || "Failed to save customer");
//     }
//   };

//   const handleDelete = async (customer: Customer) => {
//     if (!window.confirm(`Delete "${customer.name}"?`)) return;
//     try {
//       await deleteCustomerApi(customer._id);
//       setCustomers(customers.filter((c) => c._id !== customer._id));
//       toast.success("Customer deleted!");
//     } catch (err) {
//       const e = err as { response?: { data?: { error?: string } } };
//       toast.error(e?.response?.data?.error || "Failed to delete customer");
//     }
//   };

//   const totalOrders = customers.reduce((s, c) => s + c.totalOrders, 0);
//   const totalSpent = customers.reduce((s, c) => s + c.totalSpent, 0);
//   const avgOrderValue =
//     totalOrders > 0 ? Math.round(totalSpent / totalOrders) : 0;

//   if (error)
//     return (
//       <div className="h-screen flex items-center justify-center bg-kot-primary px-4">
//         <div className="text-center">
//           <p className="text-red-600 font-medium mb-3">{error}</p>
//           <button
//             onClick={fetchCustomers}
//             className="px-4 py-2 bg-kot-dark text-white rounded-lg"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-kot-primary">
//       <div className="p-3 sm:p-4 md:p-6 max-w-[2400px] mx-auto space-y-3 sm:space-y-4">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-lg sm:text-2xl font-bold text-kot-darker">
//               Customers
//             </h1>
//             <p className="text-xs sm:text-sm text-kot-text mt-0.5">
//               {customers.length} customers registered
//             </p>
//           </div>
//           <button
//             onClick={() => handleOpenModal()}
//             className="flex items-center gap-1.5 px-3 py-2 sm:px-4 bg-kot-dark hover:bg-kot-darker text-white font-semibold rounded-xl text-sm transition-colors"
//           >
//             <Plus size={16} />{" "}
//             <span className="hidden xs:inline">Add Customer</span>
//             <span className="xs:hidden">Add</span>
//           </button>
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
//           {[
//             { label: "Customers", value: customers.length, bg: "bg-kot-stats" },
//             { label: "Total Orders", value: totalOrders, bg: "bg-blue-50" },
//             {
//               label: "Total Revenue",
//               value: `₹${totalSpent.toLocaleString()}`,
//               bg: "bg-emerald-50",
//             },
//             {
//               label: "Avg Order Value",
//               value: `₹${avgOrderValue}`,
//               bg: "bg-purple-50",
//             },
//           ].map((s) => (
//             <div
//               key={s.label}
//               className={`${s.bg} rounded-2xl p-3 sm:p-4 shadow-kot`}
//             >
//               <p className="text-xs text-kot-text font-medium">{s.label}</p>
//               {loading ? (
//                 <Pulse className="h-7 w-16 mt-1" />
//               ) : (
//                 <p className="text-xl sm:text-2xl font-bold text-kot-darker mt-1">
//                   {s.value}
//                 </p>
//               )}
//             </div>
//           ))}
//         </div>

//         {/* Search */}
//         <div className="relative">
//           <Search
//             className="absolute left-3 top-1/2 -translate-y-1/2 text-kot-text"
//             size={16}
//           />
//           <input
//             type="text"
//             placeholder="Search by name, phone or email..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full pl-9 pr-4 py-2.5 border-2 border-kot-chart rounded-xl bg-kot-white text-kot-darker text-sm focus:outline-none focus:border-kot-dark placeholder:text-kot-text/50"
//           />
//         </div>

//         {/* Customer Grid */}
//         {loading ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
//             {[...Array(6)].map((_, i) => (
//               <SkeletonCard key={i} />
//             ))}
//           </div>
//         ) : filteredCustomers.length === 0 ? (
//           <div className="bg-kot-white rounded-2xl p-10 sm:p-16 text-center shadow-kot">
//             <p className="text-4xl mb-3">👥</p>
//             <p className="text-base sm:text-lg font-bold text-kot-darker">
//               No customers found
//             </p>
//             <p className="text-sm text-kot-text mt-1">
//               {searchQuery
//                 ? "Try a different search"
//                 : "Customers appear automatically when orders are placed"}
//             </p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
//             {filteredCustomers.map((customer) => (
//               <div
//                 key={customer._id}
//                 className="bg-kot-white rounded-2xl shadow-kot p-4 hover:shadow-kot-lg transition-all"
//               >
//                 {/* Card Header */}
//                 <div className="flex items-start justify-between mb-3">
//                   <div className="flex items-center gap-2.5 min-w-0">
//                     <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-kot-stats flex items-center justify-center text-kot-darker font-bold text-base flex-shrink-0">
//                       {customer.name.charAt(0).toUpperCase()}
//                     </div>
//                     <div className="min-w-0">
//                       <p className="font-bold text-sm text-kot-darker truncate">
//                         {customer.name}
//                       </p>
//                       <div className="flex items-center gap-1 text-xs text-kot-text mt-0.5">
//                         <Phone size={10} />{" "}
//                         <span className="truncate">{customer.phone}</span>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex gap-1 flex-shrink-0 ml-1">
//                     <button
//                       onClick={() => handleOpenModal(customer)}
//                       className="p-1.5 text-kot-dark hover:bg-kot-light rounded-lg transition-colors"
//                     >
//                       <Edit2 size={14} />
//                     </button>
//                     {isAdmin && (
//                       <button
//                         onClick={() => handleDelete(customer)}
//                         className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
//                       >
//                         <Trash2 size={14} />
//                       </button>
//                     )}
//                   </div>
//                 </div>

//                 {/* Contact */}
//                 <div className="space-y-1 mb-3">
//                   {customer.email && (
//                     <div className="flex items-center gap-1.5 text-xs text-kot-text">
//                       <Mail size={10} />{" "}
//                       <span className="truncate">{customer.email}</span>
//                     </div>
//                   )}
//                   {customer.address && (
//                     <div className="flex items-center gap-1.5 text-xs text-kot-text">
//                       <MapPin size={10} />{" "}
//                       <span className="truncate">{customer.address}</span>
//                     </div>
//                   )}
//                 </div>

//                 {/* Stats */}
//                 <div className="grid grid-cols-2 gap-2 mb-3">
//                   <div className="bg-kot-light rounded-xl p-2.5">
//                     <p className="text-xs text-kot-text">Orders</p>
//                     <p className="text-lg font-bold text-kot-darker">
//                       {customer.totalOrders}
//                     </p>
//                   </div>
//                   <div className="bg-kot-stats rounded-xl p-2.5">
//                     <p className="text-xs text-kot-text">Spent</p>
//                     <p className="text-lg font-bold text-kot-darker">
//                       ₹{customer.totalSpent.toLocaleString()}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Footer */}
//                 <div className="flex items-center justify-between text-xs text-kot-text pt-2.5 border-t border-kot-chart">
//                   <div className="flex items-center gap-1">
//                     <Calendar size={10} /> Last:{" "}
//                     {new Date(customer.lastVisit).toLocaleDateString("en-IN")}
//                   </div>
//                   <div>
//                     Joined:{" "}
//                     {new Date(customer.createdAt).toLocaleDateString("en-IN")}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* ── Modal — bottom sheet on mobile, centered on sm+ ── */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
//           <div className="bg-kot-white rounded-t-3xl sm:rounded-2xl shadow-kot-lg w-full sm:max-w-md">
//             {/* Drag handle (mobile) */}
//             <div className="flex justify-center pt-3 pb-1 sm:hidden">
//               <div className="w-10 h-1 rounded-full bg-kot-chart" />
//             </div>
//             <div className="flex items-center justify-between px-5 py-4 border-b border-kot-chart">
//               <h2 className="text-lg font-bold text-kot-darker">
//                 {editingCustomer
//                   ? `Edit: ${editingCustomer.name}`
//                   : "Add New Customer"}
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
//               className="p-5 space-y-3 max-h-[75vh] overflow-y-auto"
//             >
//               <div>
//                 <label className="block text-sm font-semibold text-kot-darker mb-1">
//                   Full Name *
//                 </label>
//                 <input
//                   type="text"
//                   required
//                   value={formData.name}
//                   onChange={(e) =>
//                     setFormData({ ...formData, name: e.target.value })
//                   }
//                   className={inputCls}
//                   placeholder="e.g. Rahul Kumar"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold text-kot-darker mb-1">
//                   Phone Number *
//                 </label>
//                 <input
//                   type="tel"
//                   required
//                   value={formData.phone}
//                   onChange={(e) =>
//                     setFormData({ ...formData, phone: e.target.value })
//                   }
//                   className={inputCls}
//                   placeholder="e.g. 9876543210"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold text-kot-darker mb-1">
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   value={formData.email || ""}
//                   onChange={(e) =>
//                     setFormData({ ...formData, email: e.target.value })
//                   }
//                   className={inputCls}
//                   placeholder="email@example.com"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold text-kot-darker mb-1">
//                   Address
//                 </label>
//                 <textarea
//                   value={formData.address || ""}
//                   onChange={(e) =>
//                     setFormData({ ...formData, address: e.target.value })
//                   }
//                   className={inputCls}
//                   placeholder="Enter address"
//                   rows={2}
//                 />
//               </div>
//               <div className="flex gap-3 pt-1">
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
//                   {editingCustomer ? "Update" : "Add Customer"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
