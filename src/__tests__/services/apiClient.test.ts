import type { AxiosAdapter, InternalAxiosRequestConfig } from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import api, {
  isOperationalBranchRequest,
  shouldAttemptTokenRefresh,
} from "../../services/apiClient";
import { getBranchesApi } from "../../services/admin/branch.api";
import { getInventoryApi } from "../../services/admin/inventory.api";
import { getUsersApi } from "../../services/admin/staff.api";
import { getBillsApi } from "../../services/cashier/cashier.api";
import { getTablesApi } from "../../services/waiter/table.api";
import { store } from "../../state";
import {
  clearCredentials,
  setCredentials,
  type UserRole,
} from "../../state/slices/authSlice";
import { setSelectedBranchId } from "../../state/slices/uiSlice";

const baseDecision = {
  status: 401,
  url: "/orders",
  isRetry: false,
  isAuthPage: false,
  skipRefresh: false,
};

describe("shouldAttemptTokenRefresh", () => {
  it("refreshes an initial protected request that receives 401", () => {
    expect(shouldAttemptTokenRefresh(baseDecision)).toBe(true);
  });

  it("never refreshes the refresh endpoint itself", () => {
    expect(
      shouldAttemptTokenRefresh({
        ...baseDecision,
        url: "/auth/refresh",
      }),
    ).toBe(false);
  });

  it("recognizes absolute refresh URLs with query strings", () => {
    expect(
      shouldAttemptTokenRefresh({
        ...baseDecision,
        url: "https://api.example.com/api/v1/auth/refresh?source=retry",
      }),
    ).toBe(false);
  });

  it("does not retry requests that already retried or explicitly opt out", () => {
    expect(
      shouldAttemptTokenRefresh({ ...baseDecision, isRetry: true }),
    ).toBe(false);
    expect(
      shouldAttemptTokenRefresh({ ...baseDecision, skipRefresh: true }),
    ).toBe(false);
  });
});

describe("Global Admin operational branch propagation", () => {
  const originalAdapter = api.defaults.adapter;
  let requests: InternalAxiosRequestConfig[];

  beforeEach(() => {
    requests = [];
    const adapter: AxiosAdapter = vi.fn(async (config) => {
      requests.push(config);
      return {
        data: {},
        status: 200,
        statusText: "OK",
        headers: {},
        config,
      };
    });
    api.defaults.adapter = adapter;
    store.dispatch(
      setCredentials({
        id: "global-admin",
        name: "Global Admin",
        email: "admin@example.com",
        role: "admin",
        branchId: null,
      }),
    );
    store.dispatch(setSelectedBranchId("branch-a"));
  });

  afterEach(() => {
    api.defaults.adapter = originalAdapter;
    store.dispatch(setSelectedBranchId(null));
    store.dispatch(clearCredentials());
  });

  it("classifies backend branchScope routes but excludes global routes", () => {
    expect(isOperationalBranchRequest("/admin/inventory")).toBe(true);
    expect(isOperationalBranchRequest("/cashier/bills?status=paid")).toBe(true);
    expect(isOperationalBranchRequest("/admin/branches")).toBe(false);
    expect(isOperationalBranchRequest("/auth/me")).toBe(false);
    expect(isOperationalBranchRequest("/public/menu/table-id")).toBe(false);
  });

  it("adds the selected branch to Inventory, Staff, Tables, and Billing", async () => {
    await getInventoryApi({ page: 2 });
    await getUsersApi({ search: "chef" });
    await getTablesApi();
    await getBillsApi({ status: "paid" });

    expect(requests).toHaveLength(4);
    expect(requests.map((request) => request.params)).toEqual([
      { page: 2, branchId: "branch-a" },
      { search: "chef", branchId: "branch-a" },
      { branchId: "branch-a" },
      { status: "paid", branchId: "branch-a" },
    ]);
  });

  it("uses a changed selection for subsequent operational requests", async () => {
    await getInventoryApi();
    store.dispatch(setSelectedBranchId("branch-b"));
    await getInventoryApi();

    expect(requests.map((request) => request.params?.branchId)).toEqual([
      "branch-a",
      "branch-b",
    ]);
  });

  it("does not scope branch-list global administration requests", async () => {
    await getBranchesApi();

    expect(requests[0].url).toBe("/admin/branches");
    expect(requests[0].params).toBeUndefined();
  });

  it("does not silently choose a branch when none is selected", async () => {
    store.dispatch(setSelectedBranchId(null));
    await getInventoryApi();

    expect(requests[0].params).toEqual({});
  });

  it.each<UserRole>(["manager", "waiter", "chef", "cashier"])(
    "does not send the Global Admin selection for %s",
    async (role) => {
      store.dispatch(
        setCredentials({
          id: role,
          name: role,
          email: `${role}@example.com`,
          role,
          branchId: `${role}-assigned-branch`,
        }),
      );

      await getTablesApi();

      expect(requests[0].params).toBeUndefined();
    },
  );
});
