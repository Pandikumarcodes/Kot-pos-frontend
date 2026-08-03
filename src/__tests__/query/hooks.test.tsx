import { act, renderHook } from "@testing-library/react";
import { useFilters, usePagination, useQueryState, useSearch, useSorting } from "../../query";
import { describe, expect, it, vi } from "vitest";

describe("query hooks", () => {
  it("manages pagination", () => {
    const { result } = renderHook(() => usePagination({ page: 2, pageSize: 10 }));
    act(() => result.current.setPage(0));
    expect(result.current.pagination).toEqual({ page: 1, pageSize: 10 });
    act(() => result.current.setPageSize(50));
    expect(result.current.pagination).toEqual({ page: 1, pageSize: 50 });
  });

  it("debounces search", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useSearch("", 200));
    act(() => result.current.setSearch("rice"));
    expect(result.current.debouncedSearch).toBe("");
    act(() => vi.advanceTimersByTime(200));
    expect(result.current.debouncedSearch).toBe("rice");
    vi.useRealTimers();
  });

  it("manages sorting and filters", () => {
    const sorting = renderHook(() => useSorting());
    act(() => sorting.result.current.toggleSort("name"));
    expect(sorting.result.current.sorting).toEqual({ sortBy: "name", sortOrder: "asc" });
    act(() => sorting.result.current.toggleSort("name"));
    expect(sorting.result.current.sorting.sortOrder).toBe("desc");

    const filters = renderHook(() => useFilters());
    act(() => filters.result.current.setFilter("status", "active"));
    expect(filters.result.current.hasFilters).toBe(true);
    act(() => filters.result.current.clearFilters());
    expect(filters.result.current.filters).toEqual({});
  });

  it("reads, updates, and resets URL-backed query state", () => {
    window.history.replaceState({}, "", "/items?page=3&limit=5&status=active");
    const { result } = renderHook(() => useQueryState());
    expect(result.current.query).toMatchObject({ page: 3, pageSize: 5, filters: { status: "active" } });
    act(() => result.current.updateQuery({ search: "rice" }));
    expect(window.location.search).toContain("search=rice");
    act(() => result.current.resetFilters());
    expect(result.current.query).toMatchObject({ page: 1, filters: {} });
  });
});
