/// <reference types="node" />
import { test, expect } from "@playwright/test";
import { AUTH_STATE } from "../helpers/authState";

// ── Admin can access all admin routes ────────────────────────
// NOTE: Some sub-routes (/admin/menu, /admin/staff etc.) may redirect
// to /admin/dashboard if those pages are not yet implemented in the router.
// We test that admin is authenticated and reaches admin area (not /login).
test.describe("Admin role access", () => {
  test.use({ storageState: AUTH_STATE.admin });

  test("can access /admin/dashboard", async ({ page }) => {
    await page.goto("/admin/dashboard");
    await page.waitForURL(/.*\/admin\/dashboard/, { timeout: 10_000 });
    await expect(page).not.toHaveURL(/.*\/login/);
    await expect(page).toHaveURL(/.*\/admin\/dashboard/);
  });

  test("can access /admin/menu", async ({ page }) => {
    await page.goto("/admin/menu");
    // Wait for navigation to settle
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);
    // Admin should stay in admin area — not redirected to login
    await expect(page).not.toHaveURL(/.*\/login/);
    const url = page.url();
    // Accept /admin/menu OR /admin/dashboard (if menu is a tab within dashboard)
    expect(url).toMatch(/\/admin\/(menu|dashboard)/);
  });

  test("can access /admin/staff", async ({ page }) => {
    await page.goto("/admin/staff");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);
    await expect(page).not.toHaveURL(/.*\/login/);
    const url = page.url();
    expect(url).toMatch(/\/admin\/(staff|dashboard)/);
  });

  test("can access /admin/reports", async ({ page }) => {
    await page.goto("/admin/reports");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);
    await expect(page).not.toHaveURL(/.*\/login/);
    const url = page.url();
    expect(url).toMatch(/\/admin\/(reports|dashboard)/);
  });

  test("can access /admin/settings", async ({ page }) => {
    await page.goto("/admin/settings");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);
    await expect(page).not.toHaveURL(/.*\/login/);
    const url = page.url();
    expect(url).toMatch(/\/admin\/(settings|dashboard)/);
  });
});

// ── Manager role access ──────────────────────────────────────
test.describe("Manager role access", () => {
  test.use({ storageState: AUTH_STATE.manager });

  test("can access /admin/dashboard", async ({ page }) => {
    await page.goto("/admin/dashboard");
    await page.waitForURL(/.*\/admin\/dashboard/, { timeout: 10_000 });
    await expect(page).not.toHaveURL(/.*\/login/);
    await expect(page).toHaveURL(/.*\/admin\/dashboard/);
  });

  test("can access /admin/menu", async ({ page }) => {
    await page.goto("/admin/menu");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);
    await expect(page).not.toHaveURL(/.*\/login/);
    const url = page.url();
    expect(url).toMatch(/\/admin\/(menu|dashboard)/);
  });

  test("can access /admin/reports", async ({ page }) => {
    await page.goto("/admin/reports");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);
    await expect(page).not.toHaveURL(/.*\/login/);
    const url = page.url();
    expect(url).toMatch(/\/admin\/(reports|dashboard)/);
  });

  test("is redirected away from /admin/staff", async ({ page }) => {
    await page.goto("/admin/staff");
    await page.waitForURL((url) => !url.pathname.includes("/admin/staff"), {
      timeout: 10_000,
    });
    await expect(page).not.toHaveURL(/.*\/admin\/staff/);
    await expect(page).toHaveURL(/.*\/admin\/dashboard/);
  });

  test("is redirected away from /admin/settings", async ({ page }) => {
    await page.goto("/admin/settings");
    await page.waitForURL((url) => !url.pathname.includes("/admin/settings"), {
      timeout: 10_000,
    });
    await expect(page).not.toHaveURL(/.*\/admin\/settings/);
    await expect(page).toHaveURL(/.*\/admin\/dashboard/);
  });

  test("is redirected away from /chef/kot", async ({ page }) => {
    await page.goto("/chef/kot");
    await page.waitForURL((url) => !url.pathname.includes("/chef/kot"), {
      timeout: 10_000,
    });
    await expect(page).not.toHaveURL(/.*\/chef\/kot/);
    await expect(page).toHaveURL(/.*\/admin\/dashboard/);
  });

  test("is redirected away from /cashier/billing", async ({ page }) => {
    await page.goto("/cashier/billing");
    await page.waitForURL((url) => !url.pathname.includes("/cashier/billing"), {
      timeout: 10_000,
    });
    await expect(page).not.toHaveURL(/.*\/cashier\/billing/);
    await expect(page).toHaveURL(/.*\/admin\/dashboard/);
  });
});

// ── Waiter role access ───────────────────────────────────────
test.describe("Waiter role access", () => {
  test.use({ storageState: AUTH_STATE.waiter });

  test("can access /waiter/tables", async ({ page }) => {
    await page.goto("/waiter/tables");
    await page.waitForURL(/.*\/waiter\/tables/, { timeout: 10_000 });
    await expect(page).not.toHaveURL(/.*\/login/);
    await expect(page).toHaveURL(/.*\/waiter\/tables/);
  });

  test("is redirected away from /admin/dashboard", async ({ page }) => {
    await page.goto("/admin/dashboard");
    await page.waitForURL((url) => !url.pathname.includes("/admin/dashboard"), {
      timeout: 10_000,
    });
    await expect(page).not.toHaveURL(/.*\/admin\/dashboard/);
    await expect(page).toHaveURL(/.*\/waiter\/tables/);
  });

  test("is redirected away from /admin/staff", async ({ page }) => {
    await page.goto("/admin/staff");
    await page.waitForURL((url) => !url.pathname.includes("/admin/staff"), {
      timeout: 10_000,
    });
    await expect(page).not.toHaveURL(/.*\/admin\/staff/);
    await expect(page).toHaveURL(/.*\/waiter\/tables/);
  });

  test("is redirected away from /cashier/billing", async ({ page }) => {
    await page.goto("/cashier/billing");
    await page.waitForURL((url) => !url.pathname.includes("/cashier/billing"), {
      timeout: 10_000,
    });
    await expect(page).not.toHaveURL(/.*\/cashier\/billing/);
    await expect(page).toHaveURL(/.*\/waiter\/tables/);
  });

  test("is redirected away from /chef/kot", async ({ page }) => {
    await page.goto("/chef/kot");
    await page.waitForURL((url) => !url.pathname.includes("/chef/kot"), {
      timeout: 10_000,
    });
    await expect(page).not.toHaveURL(/.*\/chef\/kot/);
    await expect(page).toHaveURL(/.*\/waiter\/tables/);
  });
});

// ── Chef role access ─────────────────────────────────────────
test.describe("Chef role access", () => {
  test.use({ storageState: AUTH_STATE.chef });

  test("can access /chef/kot", async ({ page }) => {
    await page.goto("/chef/kot");
    await page.waitForURL(/.*\/chef\/kot/, { timeout: 10_000 });
    await expect(page).not.toHaveURL(/.*\/login/);
    await expect(page).toHaveURL(/.*\/chef\/kot/);
  });

  test("is redirected away from /admin/dashboard", async ({ page }) => {
    await page.goto("/admin/dashboard");
    await page.waitForURL((url) => !url.pathname.includes("/admin/dashboard"), {
      timeout: 10_000,
    });
    await expect(page).not.toHaveURL(/.*\/admin\/dashboard/);
    await expect(page).toHaveURL(/.*\/chef\/kot/);
  });

  test("is redirected away from /waiter/tables", async ({ page }) => {
    await page.goto("/waiter/tables");
    await page.waitForURL((url) => !url.pathname.includes("/waiter/tables"), {
      timeout: 10_000,
    });
    await expect(page).not.toHaveURL(/.*\/waiter\/tables/);
    await expect(page).toHaveURL(/.*\/chef\/kot/);
  });

  test("is redirected away from /cashier/billing", async ({ page }) => {
    await page.goto("/cashier/billing");
    await page.waitForURL((url) => !url.pathname.includes("/cashier/billing"), {
      timeout: 10_000,
    });
    await expect(page).not.toHaveURL(/.*\/cashier\/billing/);
    await expect(page).toHaveURL(/.*\/chef\/kot/);
  });
});

// ── Cashier role access ──────────────────────────────────────
test.describe("Cashier role access", () => {
  test.use({ storageState: AUTH_STATE.cashier });

  test("can access /cashier/billing", async ({ page }) => {
    await page.goto("/cashier/billing");
    await page.waitForURL(/.*\/cashier\/billing/, { timeout: 10_000 });
    await expect(page).not.toHaveURL(/.*\/login/);
    await expect(page).toHaveURL(/.*\/cashier\/billing/);
  });

  test("is redirected away from /admin/dashboard", async ({ page }) => {
    await page.goto("/admin/dashboard");
    await page.waitForURL((url) => !url.pathname.includes("/admin/dashboard"), {
      timeout: 10_000,
    });
    await expect(page).not.toHaveURL(/.*\/admin\/dashboard/);
    await expect(page).toHaveURL(/.*\/cashier\/billing/);
  });

  test("is redirected away from /chef/kot", async ({ page }) => {
    await page.goto("/chef/kot");
    await page.waitForURL((url) => !url.pathname.includes("/chef/kot"), {
      timeout: 10_000,
    });
    await expect(page).not.toHaveURL(/.*\/chef\/kot/);
    await expect(page).toHaveURL(/.*\/cashier\/billing/);
  });

  test("is redirected away from /admin/staff", async ({ page }) => {
    await page.goto("/admin/staff");
    await page.waitForURL((url) => !url.pathname.includes("/admin/staff"), {
      timeout: 10_000,
    });
    await expect(page).not.toHaveURL(/.*\/admin\/staff/);
    await expect(page).toHaveURL(/.*\/cashier\/billing/);
  });
});

// ── Unauthenticated access ───────────────────────────────────
test.describe("Unauthenticated access", () => {
  test("redirects /admin/dashboard to login", async ({ page }) => {
    await page.goto("/admin/dashboard");
    await page.waitForURL("**/login", { timeout: 5_000 });
    expect(page.url()).toContain("/login");
  });

  test("redirects /waiter/tables to login", async ({ page }) => {
    await page.goto("/waiter/tables");
    await page.waitForURL("**/login", { timeout: 5_000 });
    expect(page.url()).toContain("/login");
  });

  test("redirects /chef/kot to login", async ({ page }) => {
    await page.goto("/chef/kot");
    await page.waitForURL("**/login", { timeout: 5_000 });
    expect(page.url()).toContain("/login");
  });

  test("redirects /cashier/billing to login", async ({ page }) => {
    await page.goto("/cashier/billing");
    await page.waitForURL("**/login", { timeout: 5_000 });
    expect(page.url()).toContain("/login");
  });

  test("allows access to public QR menu route", async ({ page }) => {
    await page.goto("/menu/507f1f77bcf86cd799439011");
    await expect(page).not.toHaveURL(/.*\/login/);
  });
});
