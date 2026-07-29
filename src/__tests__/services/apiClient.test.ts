import { describe, expect, it } from "vitest";
import { shouldAttemptTokenRefresh } from "../../services/apiClient";

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
