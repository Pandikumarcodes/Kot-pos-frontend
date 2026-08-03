import type { PaginationState } from "./sharedTypes";

export interface QueryState<T> {
  data: T[];
  isLoading: boolean;
  error?: string | null;
}

export const getPageCount = ({ pageSize, total }: PaginationState) =>
  Math.max(1, Math.ceil(total / Math.max(1, pageSize)));

export const getPageStart = ({ page, pageSize, total }: PaginationState) =>
  total === 0 ? 0 : (page - 1) * pageSize + 1;

export const getPageEnd = ({ page, pageSize, total }: PaginationState) =>
  Math.min(page * pageSize, total);

export const clampPage = (page: number, pageCount: number) =>
  Math.min(Math.max(1, page), Math.max(1, pageCount));
