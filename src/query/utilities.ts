import type { FilterState, QueryParams, QueryValue, SortDirection } from "./types";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;

const isQueryValue = (value: unknown): value is QueryValue =>
  typeof value === "string" || typeof value === "number" || typeof value === "boolean";

const appendValue = (params: URLSearchParams, key: string, value: unknown) => {
  if (value === null || value === undefined || value === "") return;

  if (Array.isArray(value)) {
    value.filter(isQueryValue).forEach((item) => params.append(key, String(item)));
    return;
  }

  if (isQueryValue(value)) params.set(key, String(value));
};

export const buildQueryString = (query: QueryParams = {} as QueryParams): string => {
  const params = new URLSearchParams();
  params.set("page", String(Math.max(DEFAULT_PAGE, query.page ?? DEFAULT_PAGE)));
  params.set("limit", String(Math.max(1, query.pageSize ?? DEFAULT_PAGE_SIZE)));

  appendValue(params, "search", query.search?.trim());
  appendValue(params, "sortBy", query.sortBy);
  appendValue(params, "sortOrder", query.sortOrder);

  Object.entries(query.filters ?? {})
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([key, value]) => appendValue(params, key, value));

  return params.toString();
};

const parseScalar = (value: string): QueryValue => {
  if (value === "true") return true;
  if (value === "false") return false;
  if (value !== "" && !Number.isNaN(Number(value))) return Number(value);
  return value;
};

export const parseQuery = (
  input: string | URLSearchParams = "",
  defaults: Partial<QueryParams> = {},
): QueryParams => {
  const params = typeof input === "string" ? new URLSearchParams(input.replace(/^\?/, "")) : input;
  const filters: FilterState = { ...(defaults.filters ?? {}) };
  let search = defaults.search;
  let sortBy = defaults.sortBy;
  let sortOrder = defaults.sortOrder;

  params.forEach((value, key) => {
    if (key === "search") search = value;
    else if (key === "sortBy") sortBy = value;
    else if (key === "sortOrder" && (value === "asc" || value === "desc")) sortOrder = value;
    else if (key !== "page" && key !== "limit" && key !== "pageSize") {
      const previous = filters[key];
      if (previous === undefined || previous === null) filters[key] = parseScalar(value);
      else {
        const previousValues = Array.isArray(previous) ? previous : [previous];
        filters[key] = [...previousValues, parseScalar(value)];
      }
    }
  });

  const pageValue = Number(params.get("page"));
  const pageSizeValue = Number(params.get("limit") ?? params.get("pageSize"));
  return {
    page: Number.isFinite(pageValue) && pageValue > 0 ? Math.floor(pageValue) : defaults.page ?? DEFAULT_PAGE,
    pageSize: Number.isFinite(pageSizeValue) && pageSizeValue > 0
      ? Math.floor(pageSizeValue)
      : defaults.pageSize ?? DEFAULT_PAGE_SIZE,
    ...(search ? { search } : {}),
    ...(sortBy ? { sortBy } : {}),
    ...(sortOrder ? { sortOrder } : {}),
    ...(Object.keys(filters).length > 0 ? { filters } : {}),
  };
};

export const serializeQuery = (query: QueryParams): Record<string, string | string[]> => {
  const params = new URLSearchParams(buildQueryString(query));
  const serialized: Record<string, string | string[]> = {};
  params.forEach((value, key) => {
    const previous = serialized[key];
    serialized[key] = previous === undefined
      ? value
      : [...(Array.isArray(previous) ? previous : [previous]), value];
  });
  return serialized;
};

export const syncUrlQuery = (query: QueryParams, url = window.location.href): string => {
  const nextUrl = new URL(url, window.location.origin);
  nextUrl.search = buildQueryString(query);
  window.history.replaceState(window.history.state, "", nextUrl.toString());
  return nextUrl.toString();
};

export const resetFilters = (query: QueryParams): QueryParams => ({
  ...query,
  page: DEFAULT_PAGE,
  filters: {},
});

export const debounce = <T extends (...args: never[]) => void>(fn: T, delay: number) => {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  const debounced = (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
  debounced.cancel = () => { if (timeout) clearTimeout(timeout); };
  return debounced;
};

export type { SortDirection };
