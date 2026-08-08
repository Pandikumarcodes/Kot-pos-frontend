import type {
  KitchenPagination,
  KitchenSortField,
  KitchenSortOrder,
  Kot,
  KotStatus,
} from "../../../services/chef/chef.api";

export type { Kot, KotStatus };
export type TabFilter = KotStatus | "all";
export type KitchenTabFilter = "all" | "pending" | "preparing" | "ready";

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
  counts: KotCounts;
  loading: boolean;
  refreshing: boolean;
  isConnected: boolean;
  activeTab: KitchenTabFilter;
  sortBy: KitchenSortField;
  sortOrder: KitchenSortOrder;
  pagination: KitchenPagination;
  updatingId: string | null;
  onTabChange: (t: KitchenTabFilter) => void;
  onSortChange: (value: string) => void;
  onSortOrderChange: (value: KitchenSortOrder) => void;
  onPageChange: (page: number) => void;
  onRetry: () => void;
  error: string | null;
  onRefresh: () => void;
  onStart: (id: string) => void;
  onReady: (id: string) => void;
  onServe: (id: string) => void;
  onCancel: (id: string) => void;
}
