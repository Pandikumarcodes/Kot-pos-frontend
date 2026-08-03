import {
  buildQueryString,
  parseQuery,
  resetFilters,
  serializeQuery,
  syncUrlQuery,
} from "../../query";
import { describe, expect, it } from "vitest";

describe("query utilities", () => {
  it("builds backend-compatible query parameters", () => {
    expect(buildQueryString({
      page: 2,
      pageSize: 25,
      search: "  rice ",
      sortBy: "name",
      sortOrder: "desc",
      filters: { category: "produce", active: true, tags: ["fresh", "local"] },
    })).toBe("page=2&limit=25&search=rice&sortBy=name&sortOrder=desc&active=true&category=produce&tags=fresh&tags=local");
  });

  it("parses pagination, sorting, search, and repeated filters", () => {
    expect(parseQuery("page=3&limit=10&search=milk&sortBy=cost&sortOrder=asc&active=false&tag=a&tag=b"))
      .toEqual({ page: 3, pageSize: 10, search: "milk", sortBy: "cost", sortOrder: "asc", filters: { active: false, tag: ["a", "b"] } });
  });

  it("serializes query parameters for API clients", () => {
    expect(serializeQuery({ page: 1, pageSize: 20, filters: { status: "open" } }))
      .toEqual({ page: "1", limit: "20", status: "open" });
  });

  it("resets filters and returns pagination to the first page", () => {
    expect(resetFilters({ page: 4, pageSize: 10, search: "tea", filters: { status: "open" } }))
      .toEqual({ page: 1, pageSize: 10, search: "tea", filters: {} });
  });

  it("synchronizes the current query without changing the route", () => {
    window.history.replaceState({}, "", "/inventory?old=value");
    const result = syncUrlQuery({ page: 2, pageSize: 10, search: "rice" });
    expect(new URL(result).pathname).toBe("/inventory");
    expect(window.location.search).toBe("?page=2&limit=10&search=rice");
  });
});
