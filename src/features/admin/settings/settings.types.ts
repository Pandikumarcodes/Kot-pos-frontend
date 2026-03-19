import type { Settings } from "../../../services/adminApi/Settings.api";

export type { Settings };
export type SettingsTab =
  | "general"
  | "restaurant"
  | "billing"
  | "notifications";

export interface SettingsPresenterProps {
  // data
  settings: Partial<Settings>;
  // ui state
  loading: boolean;
  saving: boolean;
  saved: boolean;
  error: string | null;
  activeTab: SettingsTab;
  isAdmin: boolean;
  // actions
  onTabChange: (tab: SettingsTab) => void;
  onUpdate: (key: string, value: unknown) => void;
  onUpdatePayment: (key: string, value: boolean) => void;
  onSave: () => void;
  onRetry: () => void;
  onReset: () => void;
}
