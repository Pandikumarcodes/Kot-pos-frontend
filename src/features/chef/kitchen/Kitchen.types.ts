import type { BaseListQuery, PaginationMeta } from "../../../types/query";
import type { Kot, KotStatus } from "../../../services/chef/chef.api";

export type { Kot, KotStatus };
export type KitchenActiveStatus = "pending" | "preparing" | "ready";
export type KitchenSort = "createdAt" | "status";
export type TabFilter = KitchenActiveStatus | "all" | "served";

export interface KitchenQuery extends BaseListQuery {
  status?: KitchenActiveStatus;
  sort?: KitchenSort;
}

export interface KitchenResponse {
  KotOrders: Kot[];
  pagination?: PaginationMeta;
}

export interface KotCounts {
  page: number;
  pending: number;
  preparing: number;
  ready: number;
}

export interface KitchenPresenterProps {
  kots: Kot[];
  counts: KotCounts;
  pagination: PaginationMeta;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  isConnected: boolean;
  activeTab: TabFilter;
  updatingId: string | null;
  onTabChange: (t: TabFilter) => void;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onRefresh: () => void;
  onRetry: () => void;
  onStart: (id: string) => void;
  onReady: (id: string) => void;
  onCancel: (id: string) => void;
}
