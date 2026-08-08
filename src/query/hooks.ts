import { useCallback, useEffect, useMemo, useState } from "react";
import type { FilterState, PaginationState, QueryParams, QueryStateOptions, SortDirection, SortState } from "./types";
import { buildQueryString, debounce, parseQuery, resetFilters, syncUrlQuery } from "./utilities";

export const usePagination = (initial: PaginationState = { page: 1, pageSize: 20 }) => {
  const [pagination, setPagination] = useState(initial);
  const setPage = useCallback((page: number) => setPagination((current) => ({ ...current, page: Math.max(1, page) })), []);
  const setPageSize = useCallback((pageSize: number) => setPagination({ page: 1, pageSize: Math.max(1, pageSize) }), []);
  return { ...pagination, pagination, setPagination, setPage, setPageSize };
};

export const useSearch = (initial = "", debounceMs = 300) => {
  const [search, setSearch] = useState(initial);
  const [debouncedSearch, setDebouncedSearch] = useState(initial);
  const update = useMemo(() => debounce((value: string) => setDebouncedSearch(value), debounceMs), [debounceMs]);
  useEffect(() => () => update.cancel(), [update]);
  const onSearchChange = useCallback((value: string) => { setSearch(value); update(value); }, [update]);
  return { search, debouncedSearch, setSearch: onSearchChange, onSearchChange, isSearching: search !== debouncedSearch };
};

export const useSorting = (initial: SortState = {}) => {
  const [sorting, setSorting] = useState(initial);
  const setSort = useCallback((sortBy?: string, sortOrder: SortDirection = "asc") => setSorting(sortBy ? { sortBy, sortOrder } : {}), []);
  const toggleSort = useCallback((sortBy: string) => setSorting((current) => ({ sortBy, sortOrder: current.sortBy === sortBy && current.sortOrder === "asc" ? "desc" : "asc" })), []);
  return { ...sorting, sorting, setSorting, setSort, toggleSort };
};

export const useFilters = (initial: FilterState = {}) => {
  const [filters, setFilters] = useState(initial);
  const setFilter = useCallback((key: string, value: FilterState[string]) => setFilters((current) => ({ ...current, [key]: value })), []);
  const clearFilter = useCallback((key: string) => setFilters((current) => { const next = { ...current }; delete next[key]; return next; }), []);
  const clearFilters = useCallback(() => setFilters({}), []);
  return { filters, setFilters, setFilter, clearFilter, clearFilters, hasFilters: Object.values(filters).some((value) => value !== undefined && value !== null && value !== "") };
};

export const useQueryState = (options: QueryStateOptions = {}) => {
  const defaults: QueryParams = { page: 1, pageSize: 20, ...options.initialState };
  const [query, setQuery] = useState<QueryParams>(() => options.syncUrl === false ? defaults : parseQuery(window.location.search, defaults));
  const updateQuery = useCallback((patch: Partial<QueryParams>) => setQuery((current) => {
    const changed = Object.entries(patch).some(([key, value]) => !Object.is(current[key as keyof QueryParams], value));
    return changed ? { ...current, ...patch } : current;
  }), []);
  const updateFilters = useCallback((filters: FilterState) => updateQuery({ filters, page: 1 }), [updateQuery]);
  const clearAllFilters = useCallback(() => setQuery((current) => resetFilters(current)), []);
  useEffect(() => { if (options.syncUrl !== false) syncUrlQuery(query, options.url); }, [options.syncUrl, options.url, query]);
  return { query, params: query, queryString: buildQueryString(query), setQuery, updateQuery, updateFilters, resetFilters: clearAllFilters };
};
