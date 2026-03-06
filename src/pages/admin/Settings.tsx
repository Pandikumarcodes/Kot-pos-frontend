// src/pages/admin/SettingsPage.tsx
import { useState, useEffect } from "react";
import { Save, RefreshCw } from "lucide-react";
import { useAppSelector } from "../../Store/hooks";
import {
  getSettingsApi,
  updateSettingsApi,
} from "../../services/adminApi/Settings.api";
import type { Settings } from "../../services/adminApi/Settings.api";

type SettingsTab = "general" | "restaurant" | "billing" | "notifications";

const TABS: { id: SettingsTab; label: string; icon: string }[] = [
  { id: "general", label: "General", icon: "⚙️" },
  { id: "restaurant", label: "Restaurant", icon: "🏪" },
  { id: "billing", label: "Billing & Tax", icon: "💰" },
  { id: "notifications", label: "Notifications", icon: "🔔" },
];

const inputClass =
  "w-full px-3 py-2.5 border-2 border-kot-chart rounded-lg focus:outline-none focus:border-kot-dark bg-kot-white text-kot-darker placeholder:text-kot-text/50 text-sm";
const labelClass = "block text-sm font-semibold text-kot-darker mb-1";

export default function SettingsPage() {
  const { user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";

  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<Partial<Settings>>({});

  // ── Fetch settings ─────────────────────────────────────────
  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data } = await getSettingsApi();
      setSettings(data.settings);
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } } };
      setError(e?.response?.data?.error || "Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // ── Save settings ──────────────────────────────────────────
  const handleSave = async () => {
    try {
      setSaving(true);
      await updateSettingsApi(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } } };
      alert(e?.response?.data?.error || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const update = (key: string, value: unknown) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const updatePayment = (key: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      paymentMethods: {
        ...prev.paymentMethods,
        [key]: value,
      } as Settings["paymentMethods"],
    }));
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-kot-primary">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-kot-dark border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-kot-text">Loading settings...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="h-screen flex items-center justify-center bg-kot-primary">
        <div className="text-center">
          <p className="text-red-600 font-medium mb-3">{error}</p>
          <button
            onClick={fetchSettings}
            className="px-4 py-2 bg-kot-dark text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-kot-primary">
      <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-kot-darker">Settings</h1>
            <p className="text-sm text-kot-text mt-0.5">
              Manage your restaurant configuration
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchSettings}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-kot-chart text-kot-dark bg-kot-white hover:bg-kot-light transition-all"
            >
              <RefreshCw size={16} /> Reset
            </button>
            {isAdmin && (
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-kot-dark hover:bg-kot-darker text-white font-semibold rounded-xl transition-colors disabled:opacity-60"
              >
                <Save size={16} />
                {saving ? "Saving..." : saved ? "Saved ✓" : "Save Changes"}
              </button>
            )}
          </div>
        </div>

        {!isAdmin && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl px-4 py-3 text-sm text-yellow-700 font-medium">
            ⚠️ You can view settings but only Admin can save changes.
          </div>
        )}

        {saved && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 text-sm text-emerald-700 font-medium">
            ✅ Settings saved successfully!
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-kot-white rounded-2xl shadow-kot p-2 space-y-1">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-colors flex items-center gap-3 text-sm font-medium ${
                    activeTab === tab.id
                      ? "bg-kot-dark text-white"
                      : "text-kot-text hover:bg-kot-light"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3 space-y-4">
            {/* ── GENERAL ───────────────────────────────────── */}
            {activeTab === "general" && (
              <>
                <div className="bg-kot-white rounded-2xl shadow-kot p-6 space-y-4">
                  <h2 className="text-lg font-bold text-kot-darker border-b border-kot-chart pb-3">
                    🏪 Business Information
                  </h2>
                  <div>
                    <label className={labelClass}>Business Name</label>
                    <input
                      type="text"
                      value={settings.businessName || ""}
                      onChange={(e) => update("businessName", e.target.value)}
                      className={inputClass}
                      placeholder="My Restaurant"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Email</label>
                      <input
                        type="email"
                        value={settings.email || ""}
                        onChange={(e) => update("email", e.target.value)}
                        className={inputClass}
                        placeholder="contact@restaurant.com"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Phone</label>
                      <input
                        type="tel"
                        value={settings.phone || ""}
                        onChange={(e) => update("phone", e.target.value)}
                        className={inputClass}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Address</label>
                    <input
                      type="text"
                      value={settings.address || ""}
                      onChange={(e) => update("address", e.target.value)}
                      className={inputClass}
                      placeholder="123 MG Road, Bangalore"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>GSTIN</label>
                    <input
                      type="text"
                      value={settings.gstin || ""}
                      onChange={(e) => update("gstin", e.target.value)}
                      className={inputClass}
                      placeholder="29ABCDE1234F1Z5"
                    />
                    <p className="text-xs text-kot-text mt-1">
                      Goods and Services Tax Identification Number
                    </p>
                  </div>
                </div>

                <div className="bg-kot-white rounded-2xl shadow-kot p-6 space-y-4">
                  <h2 className="text-lg font-bold text-kot-darker border-b border-kot-chart pb-3">
                    🌍 Regional Settings
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Currency</label>
                      <select
                        value={settings.currency || "INR"}
                        onChange={(e) => update("currency", e.target.value)}
                        className={inputClass}
                      >
                        <option value="INR">INR - Indian Rupee (₹)</option>
                        <option value="USD">USD - US Dollar ($)</option>
                        <option value="EUR">EUR - Euro (€)</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Timezone</label>
                      <select
                        value={settings.timezone || "Asia/Kolkata"}
                        onChange={(e) => update("timezone", e.target.value)}
                        className={inputClass}
                      >
                        <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                        <option value="America/New_York">
                          America/New_York (EST)
                        </option>
                        <option value="Europe/London">
                          Europe/London (GMT)
                        </option>
                        <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ── RESTAURANT ────────────────────────────────── */}
            {activeTab === "restaurant" && (
              <>
                <div className="bg-kot-white rounded-2xl shadow-kot p-6 space-y-4">
                  <h2 className="text-lg font-bold text-kot-darker border-b border-kot-chart pb-3">
                    ⏰ Operating Hours
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Opening Time</label>
                      <input
                        type="time"
                        value={settings.openTime || "09:00"}
                        onChange={(e) => update("openTime", e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Closing Time</label>
                      <input
                        type="time"
                        value={settings.closeTime || "23:00"}
                        onChange={(e) => update("closeTime", e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-kot-white rounded-2xl shadow-kot p-6 space-y-4">
                  <h2 className="text-lg font-bold text-kot-darker border-b border-kot-chart pb-3">
                    🪑 Capacity & Service
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Max Capacity</label>
                      <input
                        type="number"
                        min="1"
                        value={settings.maxCapacity || 100}
                        onChange={(e) =>
                          update("maxCapacity", parseInt(e.target.value))
                        }
                        className={inputClass}
                      />
                      <p className="text-xs text-kot-text mt-1">Total guests</p>
                    </div>
                    <div>
                      <label className={labelClass}>Avg Service Time</label>
                      <input
                        type="number"
                        min="1"
                        value={settings.avgServiceTime || 45}
                        onChange={(e) =>
                          update("avgServiceTime", parseInt(e.target.value))
                        }
                        className={inputClass}
                      />
                      <p className="text-xs text-kot-text mt-1">
                        Minutes per table
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3 pt-3 border-t border-kot-chart">
                    {[
                      {
                        key: "takeawayEnabled",
                        label: "Enable Takeaway Orders",
                        desc: "Allow cashier to place takeaway orders",
                      },
                      {
                        key: "deliveryEnabled",
                        label: "Enable Delivery Service",
                        desc: "Offer home delivery to customers",
                      },
                    ].map((item) => (
                      <label
                        key={item.key}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={!!settings[item.key as keyof Settings]}
                          onChange={(e) => update(item.key, e.target.checked)}
                          className="w-5 h-5 rounded accent-kot-dark"
                        />
                        <div>
                          <p className="font-medium text-kot-darker text-sm">
                            {item.label}
                          </p>
                          <p className="text-xs text-kot-text">{item.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ── BILLING ───────────────────────────────────── */}
            {activeTab === "billing" && (
              <>
                <div className="bg-kot-white rounded-2xl shadow-kot p-6 space-y-4">
                  <h2 className="text-lg font-bold text-kot-darker border-b border-kot-chart pb-3">
                    🧾 Tax & Charges
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Tax Rate (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.5"
                        value={settings.taxRate ?? 5}
                        onChange={(e) =>
                          update("taxRate", parseFloat(e.target.value))
                        }
                        className={inputClass}
                      />
                      <p className="text-xs text-kot-text mt-1">GST/VAT rate</p>
                    </div>
                    <div>
                      <label className={labelClass}>Service Charge (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.5"
                        value={settings.serviceCharge ?? 0}
                        onChange={(e) =>
                          update("serviceCharge", parseFloat(e.target.value))
                        }
                        className={inputClass}
                      />
                      <p className="text-xs text-kot-text mt-1">
                        Optional service fee
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3 pt-3 border-t border-kot-chart">
                    {[
                      {
                        key: "autoRoundOff",
                        label: "Auto Round Off",
                        desc: "Round bill to nearest rupee",
                      },
                      {
                        key: "printReceipt",
                        label: "Print Receipt by Default",
                        desc: "Auto print receipt after payment",
                      },
                    ].map((item) => (
                      <label
                        key={item.key}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={!!settings[item.key as keyof Settings]}
                          onChange={(e) => update(item.key, e.target.checked)}
                          className="w-5 h-5 rounded accent-kot-dark"
                        />
                        <div>
                          <p className="font-medium text-kot-darker text-sm">
                            {item.label}
                          </p>
                          <p className="text-xs text-kot-text">{item.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-kot-white rounded-2xl shadow-kot p-6 space-y-4">
                  <h2 className="text-lg font-bold text-kot-darker border-b border-kot-chart pb-3">
                    💳 Payment Methods
                  </h2>
                  <div className="space-y-3">
                    {[
                      {
                        key: "cash",
                        label: "Cash",
                        desc: "Accept cash payments",
                        emoji: "💵",
                      },
                      {
                        key: "card",
                        label: "Credit/Debit Card",
                        desc: "Accept card payments via POS",
                        emoji: "💳",
                      },
                      {
                        key: "upi",
                        label: "UPI",
                        desc: "PhonePe, GPay, Paytm",
                        emoji: "📱",
                      },
                    ].map((item) => (
                      <label
                        key={item.key}
                        className="flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-kot-light"
                      >
                        <input
                          type="checkbox"
                          checked={
                            !!settings.paymentMethods?.[
                              item.key as keyof Settings["paymentMethods"]
                            ]
                          }
                          onChange={(e) =>
                            updatePayment(item.key, e.target.checked)
                          }
                          className="w-5 h-5 rounded accent-kot-dark"
                        />
                        <span className="text-xl">{item.emoji}</span>
                        <div>
                          <p className="font-medium text-kot-darker text-sm">
                            {item.label}
                          </p>
                          <p className="text-xs text-kot-text">{item.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ── NOTIFICATIONS ─────────────────────────────── */}
            {activeTab === "notifications" && (
              <div className="bg-kot-white rounded-2xl shadow-kot p-6 space-y-4">
                <h2 className="text-lg font-bold text-kot-darker border-b border-kot-chart pb-3">
                  🔔 Notification Preferences
                </h2>
                <div className="space-y-3">
                  {[
                    {
                      key: "orderAlerts",
                      label: "New Order Alerts",
                      desc: "Get notified when orders are placed",
                    },
                    {
                      key: "lowStockAlerts",
                      label: "Low Stock Alerts",
                      desc: "Alert when inventory runs low",
                    },
                    {
                      key: "emailNotifications",
                      label: "Email Notifications",
                      desc: "Receive alerts via email",
                    },
                  ].map((item) => (
                    <label
                      key={item.key}
                      className="flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-kot-light"
                    >
                      <input
                        type="checkbox"
                        checked={!!settings[item.key as keyof Settings]}
                        onChange={(e) => update(item.key, e.target.checked)}
                        className="w-5 h-5 rounded accent-kot-dark"
                      />
                      <div>
                        <p className="font-medium text-kot-darker text-sm">
                          {item.label}
                        </p>
                        <p className="text-xs text-kot-text">{item.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
