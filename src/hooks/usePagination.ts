import { useState, useCallback } from "react";

export interface PaginationMeta {
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface UsePaginationOptions {
  initialPage?: number;
  initialLimit?: number;
}

export function usePagination(options: UsePaginationOptions = {}) {
  const { initialPage = 1, initialLimit = 20 } = options;

  const [page, setPage] = useState(initialPage);
  const [limit] = useState(initialLimit);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);

  const goTo = useCallback((p: number) => {
    setPage(Math.max(1, p));
  }, []);

  const next = useCallback(() => {
    if (pagination?.hasNextPage) setPage((p) => p + 1);
  }, [pagination]);

  const prev = useCallback(() => {
    if (pagination?.hasPrevPage) setPage((p) => p - 1);
  }, [pagination]);

  const reset = useCallback(() => {
    setPage(1);
    setPagination(null);
  }, []);

  return {
    page,
    limit,
    pagination,
    setPagination,
    goTo,
    next,
    prev,
    reset,
  };
}
