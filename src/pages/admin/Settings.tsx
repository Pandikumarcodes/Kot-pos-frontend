// import { useState, useEffect } from "react";
// import { Save, RefreshCw } from "lucide-react";
// import { useAppSelector } from "../../Store/hooks";
// import {
//   getSettingsApi,
//   updateSettingsApi,
// } from "../../services/adminApi/Settings.api";
// import type { Settings } from "../../services/adminApi/Settings.api";
// import { useToast } from "../../Context/ToastContext";

// type SettingsTab = "general" | "restaurant" | "billing" | "notifications";
// const TABS: { id: SettingsTab; label: string; icon: string }[] = [
//   { id: "general", label: "General", icon: "⚙️" },
//   { id: "restaurant", label: "Restaurant", icon: "🏪" },
//   { id: "billing", label: "Billing & Tax", icon: "💰" },
//   { id: "notifications", label: "Notifications", icon: "🔔" },
// ];

// const inputCls =
//   "w-full px-3 py-2.5 border-2 border-kot-chart rounded-lg focus:outline-none focus:border-kot-dark bg-kot-white text-kot-darker placeholder:text-kot-text/50 text-sm";
// const labelCls = "block text-sm font-semibold text-kot-darker mb-1";

// const Toggle = ({
//   checked,
//   onChange,
//   label,
//   desc,
// }: {
//   checked: boolean;
//   onChange: (v: boolean) => void;
//   label: string;
//   desc?: string;
// }) => (
//   <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-kot-light">
//     <input
//       type="checkbox"
//       checked={checked}
//       onChange={(e) => onChange(e.target.checked)}
//       className="w-5 h-5 rounded accent-kot-dark flex-shrink-0"
//     />
//     <div>
//       <p className="font-medium text-kot-darker text-sm">{label}</p>
//       {desc && <p className="text-xs text-kot-text">{desc}</p>}
//     </div>
//   </label>
// );

// export default function SettingsPage() {
//   const { user } = useAppSelector((state) => state.auth);
//   const isAdmin = user?.role === "admin";
//   const toast = useToast();

//   const [activeTab, setActiveTab] = useState<SettingsTab>("general");
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [saved, setSaved] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [settings, setSettings] = useState<Partial<Settings>>({});

//   const fetchSettings = async () => {
//     try {
//       setLoading(true);
//       const { data } = await getSettingsApi();
//       setSettings(data.settings);
//     } catch (err) {
//       const e = err as { response?: { data?: { error?: string } } };
//       setError(e?.response?.data?.error || "Failed to load settings");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSettings();
//   }, []);

//   const handleSave = async () => {
//     try {
//       setSaving(true);
//       await updateSettingsApi(settings);
//       setSaved(true);
//       setTimeout(() => setSaved(false), 3000);
//     } catch (err) {
//       const e = err as { response?: { data?: { error?: string } } };
//       toast.error(e?.response?.data?.error || "Failed to save settings");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const update = (key: string, value: unknown) =>
//     setSettings((prev) => ({ ...prev, [key]: value }));
//   const updatePayment = (key: string, value: boolean) =>
//     setSettings((prev) => ({
//       ...prev,
//       paymentMethods: {
//         ...prev.paymentMethods,
//         [key]: value,
//       } as Settings["paymentMethods"],
//     }));

//   if (loading)
//     return (
//       <div className="h-screen flex items-center justify-center bg-kot-primary">
//         <div className="text-center">
//           <div className="w-14 h-14 border-4 border-kot-dark border-t-transparent rounded-full animate-spin mx-auto mb-3" />
//           <p className="text-kot-text">Loading settings...</p>
//         </div>
//       </div>
//     );

//   if (error)
//     return (
//       <div className="h-screen flex items-center justify-center bg-kot-primary px-4">
//         <div className="text-center">
//           <p className="text-red-600 font-medium mb-3">{error}</p>
//           <button
//             onClick={fetchSettings}
//             className="px-4 py-2 bg-kot-dark text-white rounded-lg"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-kot-primary">
//       <div className="p-3 sm:p-4 md:p-6 max-w-[2400px] mx-auto space-y-4">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-lg sm:text-2xl font-bold text-kot-darker">
//               Settings
//             </h1>
//             <p className="text-xs sm:text-sm text-kot-text mt-0.5">
//               Manage your restaurant configuration
//             </p>
//           </div>
//           <div className="flex gap-2">
//             <button
//               onClick={fetchSettings}
//               className="flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 border-kot-chart text-kot-dark bg-kot-white hover:bg-kot-light text-sm"
//             >
//               <RefreshCw size={14} />{" "}
//               <span className="hidden sm:inline">Reset</span>
//             </button>
//             {isAdmin && (
//               <button
//                 onClick={handleSave}
//                 disabled={saving}
//                 className="flex items-center gap-1.5 px-3 py-2 sm:px-4 bg-kot-dark hover:bg-kot-darker text-white font-semibold rounded-xl text-sm disabled:opacity-60"
//               >
//                 <Save size={14} />{" "}
//                 {saving ? "Saving..." : saved ? "Saved ✓" : "Save"}
//               </button>
//             )}
//           </div>
//         </div>

//         {!isAdmin && (
//           <div className="bg-yellow-50 border border-yellow-200 rounded-2xl px-4 py-3 text-sm text-yellow-700 font-medium">
//             ⚠️ View only — Admin can save changes.
//           </div>
//         )}
//         {saved && (
//           <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 text-sm text-emerald-700 font-medium">
//             ✅ Settings saved successfully!
//           </div>
//         )}

//         {/* Mobile: horizontal scrollable tabs */}
//         <div className="lg:hidden bg-kot-white rounded-2xl shadow-kot p-1.5">
//           <div className="flex gap-1 overflow-x-auto scrollbar-hide">
//             {TABS.map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap flex-shrink-0 transition-colors ${activeTab === tab.id ? "bg-kot-dark text-white" : "text-kot-text hover:bg-kot-light"}`}
//               >
//                 <span>{tab.icon}</span>
//                 <span>{tab.label}</span>
//               </button>
//             ))}
//           </div>
//         </div>

//         <div className="flex gap-4 sm:gap-5 items-start">
//           {/* Desktop sidebar */}
//           <div className="hidden lg:block w-48 xl:w-56 flex-shrink-0">
//             <div className="bg-kot-white rounded-2xl shadow-kot p-2 space-y-1 sticky top-4">
//               {TABS.map((tab) => (
//                 <button
//                   key={tab.id}
//                   onClick={() => setActiveTab(tab.id)}
//                   className={`w-full text-left px-4 py-3 rounded-xl transition-colors flex items-center gap-3 text-sm font-medium ${activeTab === tab.id ? "bg-kot-dark text-white" : "text-kot-text hover:bg-kot-light"}`}
//                 >
//                   <span>{tab.icon}</span>
//                   <span>{tab.label}</span>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Content */}
//           <div className="flex-1 min-w-0 space-y-4">
//             {/* ── GENERAL ── */}
//             {activeTab === "general" && (
//               <>
//                 <div className="bg-kot-white rounded-2xl shadow-kot p-4 sm:p-6 space-y-4">
//                   <h2 className="text-base sm:text-lg font-bold text-kot-darker border-b border-kot-chart pb-3">
//                     🏪 Business Information
//                   </h2>
//                   <div>
//                     <label className={labelCls}>Business Name</label>
//                     <input
//                       type="text"
//                       value={settings.businessName || ""}
//                       onChange={(e) => update("businessName", e.target.value)}
//                       className={inputCls}
//                       placeholder="My Restaurant"
//                     />
//                   </div>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <div>
//                       <label className={labelCls}>Email</label>
//                       <input
//                         type="email"
//                         value={settings.email || ""}
//                         onChange={(e) => update("email", e.target.value)}
//                         className={inputCls}
//                         placeholder="contact@restaurant.com"
//                       />
//                     </div>
//                     <div>
//                       <label className={labelCls}>Phone</label>
//                       <input
//                         type="tel"
//                         value={settings.phone || ""}
//                         onChange={(e) => update("phone", e.target.value)}
//                         className={inputCls}
//                         placeholder="+91 98765 43210"
//                       />
//                     </div>
//                   </div>
//                   <div>
//                     <label className={labelCls}>Address</label>
//                     <input
//                       type="text"
//                       value={settings.address || ""}
//                       onChange={(e) => update("address", e.target.value)}
//                       className={inputCls}
//                       placeholder="123 MG Road, Bangalore"
//                     />
//                   </div>
//                   <div>
//                     <label className={labelCls}>GSTIN</label>
//                     <input
//                       type="text"
//                       value={settings.gstin || ""}
//                       onChange={(e) => update("gstin", e.target.value)}
//                       className={inputCls}
//                       placeholder="29ABCDE1234F1Z5"
//                     />
//                     <p className="text-xs text-kot-text mt-1">
//                       Goods and Services Tax Identification Number
//                     </p>
//                   </div>
//                 </div>
//                 <div className="bg-kot-white rounded-2xl shadow-kot p-4 sm:p-6 space-y-4">
//                   <h2 className="text-base sm:text-lg font-bold text-kot-darker border-b border-kot-chart pb-3">
//                     🌍 Regional Settings
//                   </h2>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <div>
//                       <label className={labelCls}>Currency</label>
//                       <select
//                         value={settings.currency || "INR"}
//                         onChange={(e) => update("currency", e.target.value)}
//                         className={inputCls}
//                       >
//                         <option value="INR">INR - Indian Rupee (₹)</option>
//                         <option value="USD">USD - US Dollar ($)</option>
//                         <option value="EUR">EUR - Euro (€)</option>
//                       </select>
//                     </div>
//                     <div>
//                       <label className={labelCls}>Timezone</label>
//                       <select
//                         value={settings.timezone || "Asia/Kolkata"}
//                         onChange={(e) => update("timezone", e.target.value)}
//                         className={inputCls}
//                       >
//                         <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
//                         <option value="America/New_York">
//                           America/New_York (EST)
//                         </option>
//                         <option value="Europe/London">
//                           Europe/London (GMT)
//                         </option>
//                         <option value="Asia/Dubai">Asia/Dubai (GST)</option>
//                       </select>
//                     </div>
//                   </div>
//                 </div>
//               </>
//             )}

//             {/* ── RESTAURANT ── */}
//             {activeTab === "restaurant" && (
//               <>
//                 <div className="bg-kot-white rounded-2xl shadow-kot p-4 sm:p-6 space-y-4">
//                   <h2 className="text-base sm:text-lg font-bold text-kot-darker border-b border-kot-chart pb-3">
//                     ⏰ Operating Hours
//                   </h2>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className={labelCls}>Opening Time</label>
//                       <input
//                         type="time"
//                         value={settings.openTime || "09:00"}
//                         onChange={(e) => update("openTime", e.target.value)}
//                         className={inputCls}
//                       />
//                     </div>
//                     <div>
//                       <label className={labelCls}>Closing Time</label>
//                       <input
//                         type="time"
//                         value={settings.closeTime || "23:00"}
//                         onChange={(e) => update("closeTime", e.target.value)}
//                         className={inputCls}
//                       />
//                     </div>
//                   </div>
//                 </div>
//                 <div className="bg-kot-white rounded-2xl shadow-kot p-4 sm:p-6 space-y-4">
//                   <h2 className="text-base sm:text-lg font-bold text-kot-darker border-b border-kot-chart pb-3">
//                     🪑 Capacity & Service
//                   </h2>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className={labelCls}>Max Capacity</label>
//                       <input
//                         type="number"
//                         min="1"
//                         value={settings.maxCapacity || 100}
//                         onChange={(e) =>
//                           update("maxCapacity", parseInt(e.target.value))
//                         }
//                         className={inputCls}
//                       />
//                       <p className="text-xs text-kot-text mt-1">Total guests</p>
//                     </div>
//                     <div>
//                       <label className={labelCls}>Avg Service Time</label>
//                       <input
//                         type="number"
//                         min="1"
//                         value={settings.avgServiceTime || 45}
//                         onChange={(e) =>
//                           update("avgServiceTime", parseInt(e.target.value))
//                         }
//                         className={inputCls}
//                       />
//                       <p className="text-xs text-kot-text mt-1">
//                         Minutes per table
//                       </p>
//                     </div>
//                   </div>
//                   <div className="space-y-2 pt-3 border-t border-kot-chart">
//                     {[
//                       {
//                         key: "takeawayEnabled",
//                         label: "Enable Takeaway Orders",
//                         desc: "Allow cashier to place takeaway orders",
//                       },
//                       {
//                         key: "deliveryEnabled",
//                         label: "Enable Delivery Service",
//                         desc: "Offer home delivery to customers",
//                       },
//                     ].map((item) => (
//                       <Toggle
//                         key={item.key}
//                         checked={!!settings[item.key as keyof Settings]}
//                         onChange={(v) => update(item.key, v)}
//                         label={item.label}
//                         desc={item.desc}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               </>
//             )}

//             {/* ── BILLING ── */}
//             {activeTab === "billing" && (
//               <>
//                 <div className="bg-kot-white rounded-2xl shadow-kot p-4 sm:p-6 space-y-4">
//                   <h2 className="text-base sm:text-lg font-bold text-kot-darker border-b border-kot-chart pb-3">
//                     🧾 Tax & Charges
//                   </h2>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className={labelCls}>Tax Rate (%)</label>
//                       <input
//                         type="number"
//                         min="0"
//                         max="100"
//                         step="0.5"
//                         value={settings.taxRate ?? 5}
//                         onChange={(e) =>
//                           update("taxRate", parseFloat(e.target.value))
//                         }
//                         className={inputCls}
//                       />
//                       <p className="text-xs text-kot-text mt-1">GST/VAT rate</p>
//                     </div>
//                     <div>
//                       <label className={labelCls}>Service Charge (%)</label>
//                       <input
//                         type="number"
//                         min="0"
//                         max="100"
//                         step="0.5"
//                         value={settings.serviceCharge ?? 0}
//                         onChange={(e) =>
//                           update("serviceCharge", parseFloat(e.target.value))
//                         }
//                         className={inputCls}
//                       />
//                       <p className="text-xs text-kot-text mt-1">
//                         Optional service fee
//                       </p>
//                     </div>
//                   </div>
//                   <div className="space-y-2 pt-3 border-t border-kot-chart">
//                     {[
//                       {
//                         key: "autoRoundOff",
//                         label: "Auto Round Off",
//                         desc: "Round bill to nearest rupee",
//                       },
//                       {
//                         key: "printReceipt",
//                         label: "Print Receipt by Default",
//                         desc: "Auto print receipt after payment",
//                       },
//                     ].map((item) => (
//                       <Toggle
//                         key={item.key}
//                         checked={!!settings[item.key as keyof Settings]}
//                         onChange={(v) => update(item.key, v)}
//                         label={item.label}
//                         desc={item.desc}
//                       />
//                     ))}
//                   </div>
//                 </div>
//                 <div className="bg-kot-white rounded-2xl shadow-kot p-4 sm:p-6 space-y-3">
//                   <h2 className="text-base sm:text-lg font-bold text-kot-darker border-b border-kot-chart pb-3">
//                     💳 Payment Methods
//                   </h2>
//                   {[
//                     {
//                       key: "cash",
//                       label: "Cash",
//                       desc: "Accept cash payments",
//                       emoji: "💵",
//                     },
//                     {
//                       key: "card",
//                       label: "Credit/Debit Card",
//                       desc: "Accept card payments via POS",
//                       emoji: "💳",
//                     },
//                     {
//                       key: "upi",
//                       label: "UPI",
//                       desc: "PhonePe, GPay, Paytm",
//                       emoji: "📱",
//                     },
//                   ].map((item) => (
//                     <label
//                       key={item.key}
//                       className="flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-kot-light"
//                     >
//                       <input
//                         type="checkbox"
//                         checked={
//                           !!settings.paymentMethods?.[
//                             item.key as keyof Settings["paymentMethods"]
//                           ]
//                         }
//                         onChange={(e) =>
//                           updatePayment(item.key, e.target.checked)
//                         }
//                         className="w-5 h-5 rounded accent-kot-dark flex-shrink-0"
//                       />
//                       <span className="text-xl flex-shrink-0">
//                         {item.emoji}
//                       </span>
//                       <div>
//                         <p className="font-medium text-kot-darker text-sm">
//                           {item.label}
//                         </p>
//                         <p className="text-xs text-kot-text">{item.desc}</p>
//                       </div>
//                     </label>
//                   ))}
//                 </div>
//               </>
//             )}

//             {/* ── NOTIFICATIONS ── */}
//             {activeTab === "notifications" && (
//               <div className="bg-kot-white rounded-2xl shadow-kot p-4 sm:p-6 space-y-3">
//                 <h2 className="text-base sm:text-lg font-bold text-kot-darker border-b border-kot-chart pb-3">
//                   🔔 Notification Preferences
//                 </h2>
//                 {[
//                   {
//                     key: "orderAlerts",
//                     label: "New Order Alerts",
//                     desc: "Get notified when orders are placed",
//                   },
//                   {
//                     key: "lowStockAlerts",
//                     label: "Low Stock Alerts",
//                     desc: "Alert when inventory runs low",
//                   },
//                   {
//                     key: "emailNotifications",
//                     label: "Email Notifications",
//                     desc: "Receive alerts via email",
//                   },
//                 ].map((item) => (
//                   <Toggle
//                     key={item.key}
//                     checked={!!settings[item.key as keyof Settings]}
//                     onChange={(v) => update(item.key, v)}
//                     label={item.label}
//                     desc={item.desc}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
