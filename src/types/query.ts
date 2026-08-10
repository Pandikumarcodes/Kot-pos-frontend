export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export type SortOrder = "asc" | "desc";

/**
 * Query parameters shared by server-backed lists.
 *
 * Every field is optional so modules that support legacy, unpaginated requests
 * can continue to omit query parameters entirely.
 */
export interface BaseListQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: SortOrder;
}
