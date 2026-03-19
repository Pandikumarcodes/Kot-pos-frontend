import type { Kot, KotStatus } from "../../../services/chefApi/chef.api";

export type { Kot, KotStatus };
export type TabFilter = KotStatus | "all";

export interface KotCounts {
  all: number;
  pending: number;
  preparing: number;
  ready: number;
  served: number;
  cancelled: number;
}

export interface KitchenPresenterProps {
  kots: Kot[];
  sorted: Kot[];
  counts: KotCounts;
  loading: boolean;
  refreshing: boolean;
  isConnected: boolean;
  activeTab: TabFilter;
  updatingId: string | null;
  onTabChange: (t: TabFilter) => void;
  onRefresh: () => void;
  onStart: (id: string) => void;
  onReady: (id: string) => void;
  onCancel: (id: string) => void;
}
