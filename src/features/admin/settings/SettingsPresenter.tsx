import { Save, RefreshCw } from "lucide-react";
import {
  Card,
  Button,
  Input,
  Pulse,
  PageHeader,
  Toggle,
} from "../../../UiComponents/Index";
import type {
  SettingsPresenterProps,
  SettingsTab,
  Settings,
} from "./settings.types";

const TABS: { key: SettingsTab; label: string; icon: string }[] = [
  { key: "general", label: "General", icon: "⚙️" },
  { key: "restaurant", label: "Restaurant", icon: "🏪" },
  { key: "billing", label: "Billing", icon: "🧾" },
  { key: "notifications", label: "Notifications", icon: "🔔" },
];

export function SettingsPresenter({
  settings,
  loading,
  saving,
  saved,
  error,
  activeTab,
  isAdmin,
  onTabChange,
  onUpdate,
  onUpdatePayment,
  onSave,
  onRetry,
  onReset,
}: SettingsPresenterProps) {
  if (loading) {
    return (
      <div className="min-h-screen bg-kot-primary p-4 space-y-4">
        <Pulse className="h-8 w-48" />
        <div className="flex gap-2 overflow-x-auto">
          {TABS.map((t) => (
            <Pulse key={t.key} className="h-10 w-28 rounded-xl flex-shrink-0" />
          ))}
        </div>
        <Card className="p-5 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-1">
              <Pulse className="h-3 w-24" />
              <Pulse className="h-10 w-full rounded-lg" />
            </div>
          ))}
        </Card>
      </div>
    );
  }

  const s = settings as Partial<Settings>;

  return (
    <div className="min-h-screen bg-kot-primary">
      <main className="p-3 sm:p-4 lg:p-6 max-w-3xl mx-auto space-y-4">
        {/* ── Header ── */}
        <PageHeader
          title="Settings"
          sub="Configure your restaurant"
          actions={
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={onReset}
                className="flex items-center gap-1.5"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Reset</span>
              </Button>
              {isAdmin && (
                <Button
                  size="sm"
                  onClick={onSave}
                  disabled={saving}
                  className="flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Saving…" : saved ? "Saved ✓" : "Save"}
                </Button>
              )}
            </div>
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

        {/* ── Tab bar — scrollable on mobile ── */}
        <div className="overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0 scrollbar-none">
          <div className="flex gap-1.5 w-max sm:w-auto">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                  activeTab === tab.key
                    ? "bg-kot-dark text-white"
                    : "bg-kot-white text-kot-text hover:bg-kot-light border border-kot-chart"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── General ── */}
        {activeTab === "general" && (
          <Card className="p-4 sm:p-5 space-y-3 sm:space-y-4">
            <h2 className="text-sm sm:text-base font-bold text-kot-darker">
              General Settings
            </h2>
            <Input
              label="Business Name"
              value={s?.businessName ?? ""}
              onChange={(e) => onUpdate("businessName", e.target.value)}
            />
            <Input
              label="Email"
              type="email"
              value={s?.email ?? ""}
              onChange={(e) => onUpdate("email", e.target.value)}
            />
            <Input
              label="Phone"
              value={s?.phone ?? ""}
              onChange={(e) => onUpdate("phone", e.target.value)}
            />
            <Input
              label="Address"
              value={s?.address ?? ""}
              onChange={(e) => onUpdate("address", e.target.value)}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Currency"
                value={s?.currency ?? "INR"}
                onChange={(e) => onUpdate("currency", e.target.value)}
              />
              <Input
                label="Timezone"
                value={s?.timezone ?? ""}
                onChange={(e) => onUpdate("timezone", e.target.value)}
                placeholder="e.g. Asia/Kolkata"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Opening Time"
                type="time"
                value={s?.openTime ?? "09:00"}
                onChange={(e) => onUpdate("openTime", e.target.value)}
              />
              <Input
                label="Closing Time"
                type="time"
                value={s?.closeTime ?? "22:00"}
                onChange={(e) => onUpdate("closeTime", e.target.value)}
              />
            </div>
          </Card>
        )}

        {/* ── Restaurant ── */}
        {activeTab === "restaurant" && (
          <Card className="p-4 sm:p-5 space-y-3 sm:space-y-4">
            <h2 className="text-sm sm:text-base font-bold text-kot-darker">
              Restaurant Settings
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Max Capacity"
                type="number"
                value={s?.maxCapacity ?? 0}
                onChange={(e) =>
                  onUpdate("maxCapacity", Number(e.target.value))
                }
              />
              <Input
                label="Avg Service (mins)"
                type="number"
                value={s?.avgServiceTime ?? 0}
                onChange={(e) =>
                  onUpdate("avgServiceTime", Number(e.target.value))
                }
              />
            </div>
            <Toggle
              checked={s?.takeawayEnabled ?? false}
              onChange={(v) => onUpdate("takeawayEnabled", v)}
              label="Takeaway Enabled"
              desc="Allow takeaway orders"
            />
            <Toggle
              checked={s?.deliveryEnabled ?? false}
              onChange={(v) => onUpdate("deliveryEnabled", v)}
              label="Delivery Enabled"
              desc="Allow delivery orders"
            />
          </Card>
        )}

        {/* ── Billing ── */}
        {activeTab === "billing" && (
          <Card className="p-4 sm:p-5 space-y-3 sm:space-y-4">
            <h2 className="text-sm sm:text-base font-bold text-kot-darker">
              Billing Settings
            </h2>
            <Input
              label="GSTIN"
              value={s?.gstin ?? ""}
              onChange={(e) => onUpdate("gstin", e.target.value)}
              placeholder="22AAAAA0000A1Z5"
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Tax Rate (%)"
                type="number"
                value={s?.taxRate ?? 0}
                onChange={(e) => onUpdate("taxRate", Number(e.target.value))}
              />
              <Input
                label="Service Charge (%)"
                type="number"
                value={s?.serviceCharge ?? 0}
                onChange={(e) =>
                  onUpdate("serviceCharge", Number(e.target.value))
                }
              />
            </div>
            <Toggle
              checked={s?.autoRoundOff ?? false}
              onChange={(v) => onUpdate("autoRoundOff", v)}
              label="Auto Round Off"
              desc="Round off bill total"
            />
            <Toggle
              checked={s?.printReceipt ?? false}
              onChange={(v) => onUpdate("printReceipt", v)}
              label="Auto Print Receipt"
              desc="Print after billing"
            />
            <div className="pt-2 border-t border-kot-chart">
              <h3 className="text-sm font-bold text-kot-darker mb-3">
                Payment Methods
              </h3>
              <div className="space-y-2">
                {(["cash", "card", "upi"] as const).map((method) => (
                  <Toggle
                    key={method}
                    checked={s?.paymentMethods?.[method] ?? false}
                    onChange={(v) => onUpdatePayment(method, v)}
                    label={method.toUpperCase()}
                  />
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* ── Notifications ── */}
        {activeTab === "notifications" && (
          <Card className="p-4 sm:p-5 space-y-3 sm:space-y-4">
            <h2 className="text-sm sm:text-base font-bold text-kot-darker">
              Notification Settings
            </h2>
            <Toggle
              checked={s?.orderAlerts ?? false}
              onChange={(v) => onUpdate("orderAlerts", v)}
              label="Order Alerts"
              desc="Get notified when new orders arrive"
            />
            <Toggle
              checked={s?.lowStockAlerts ?? false}
              onChange={(v) => onUpdate("lowStockAlerts", v)}
              label="Low Stock Alerts"
              desc="Get notified when items are low"
            />
            <Toggle
              checked={s?.emailNotifications ?? false}
              onChange={(v) => onUpdate("emailNotifications", v)}
              label="Email Notifications"
              desc="Send notifications via email"
            />
          </Card>
        )}

        {/* ── Save reminder on mobile ── */}
        {isAdmin && (
          <div className="sm:hidden pb-4">
            <Button
              size="md"
              onClick={onSave}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving…" : saved ? "Saved ✓" : "Save Changes"}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
