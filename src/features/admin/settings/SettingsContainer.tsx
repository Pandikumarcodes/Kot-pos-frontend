import { useState, useEffect, useCallback } from "react";
import { useAppSelector } from "../../../state/hooks";
import { resolveOperationalBranchId } from "../../../state/branchContext";
import {
  getSettingsApi,
  updateSettingsApi,
} from "../../../services/admin/settings.api";
import type { Settings } from "../../../services/admin/settings.api";
import { useToast } from "../../../contexts/toastContext";
import { SettingsPresenter } from "./SettingsPresenter";
import type { SettingsTab } from "./settings.types";

export default function SettingsContainer() {
  const { user } = useAppSelector((state) => state.auth);
  const selectedBranchId = useAppSelector((state) => state.ui.selectedBranchId);
  const isAdmin = user?.role === "admin";
  const requiresBranchSelection = isAdmin && !user?.branchId;
  const branchId = resolveOperationalBranchId(user?.branchId, selectedBranchId);
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<Partial<Settings>>({});

  const fetchSettings = useCallback(async () => {
    if (requiresBranchSelection && !branchId) {
      setSettings({});
      setError("Select a branch to view settings");
      setLoading(false);
      return;
    }
    try {
      const { data } = await getSettingsApi(branchId);
      setSettings(data.settings);
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } } };
      setError(e?.response?.data?.error || "Failed to load settings");
    } finally {
      setLoading(false);
    }
  }, [branchId, requiresBranchSelection]);

  useEffect(() => {
    let ignore = false;
    if (requiresBranchSelection && !branchId) {
      setSettings({});
      setError("Select a branch to view settings");
      setLoading(false);
      return;
    }
    getSettingsApi(branchId)
      .then(({ data }) => {
        if (!ignore) setSettings(data.settings);
      })
      .catch((err) => {
        if (ignore) return;
        const e = err as { response?: { data?: { error?: string } } };
        setError(e?.response?.data?.error || "Failed to load settings");
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [branchId, requiresBranchSelection]);

  const handleReload = () => {
    setLoading(true);
    setError(null);
    void fetchSettings();
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateSettingsApi(settings, branchId);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } } };
      toast.error(e?.response?.data?.error || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = (key: string, value: unknown) =>
    setSettings((prev) => ({ ...prev, [key]: value }));

  const handleUpdatePayment = (key: string, value: boolean) =>
    setSettings((prev) => ({
      ...prev,
      paymentMethods: {
        ...prev.paymentMethods,
        [key]: value,
      } as Settings["paymentMethods"],
    }));

  return (
    <SettingsPresenter
      settings={settings}
      loading={loading}
      saving={saving}
      saved={saved}
      error={error}
      activeTab={activeTab}
      isAdmin={isAdmin}
      onTabChange={setActiveTab}
      onUpdate={handleUpdate}
      onUpdatePayment={handleUpdatePayment}
      onSave={handleSave}
      onRetry={handleReload}
      onReset={handleReload}
    />
  );
}
