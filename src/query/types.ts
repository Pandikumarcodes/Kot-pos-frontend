export type QueryValue = string | number | boolean;

export type FilterValue = QueryValue | null | undefined | QueryValue[];

export type FilterState = Record<string, FilterValue>;

export interface PaginationState {
  page: number;
  pageSize: number;
}

export type SortDirection = "asc" | "desc";

export interface SortState {
  sortBy?: string;
  sortOrder?: SortDirection;
}

export interface QueryParams extends PaginationState, SortState {
  search?: string;
  filters?: FilterState;
}

export interface QueryResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface QueryStateOptions {
  initialState?: Partial<QueryParams>;
  syncUrl?: boolean;
  debounceMs?: number;
  url?: string;
}

