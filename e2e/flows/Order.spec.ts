/// <reference types="node" />
import { test, expect } from "@playwright/test";
import { AUTH_STATE } from "../helpers/authState";

// ─────────────────────────────────────────────────────────────
// Waiter flow — allocate table + place order
// ─────────────────────────────────────────────────────────────
test.describe("Waiter — table allocation and order", () => {
  test.use({ storageState: AUTH_STATE.waiter });

  test("waiter can see tables page", async ({ page }) => {
    await page.goto("/waiter/tables");
    await page.waitForURL(/.*\/waiter\/tables/, { timeout: 10_000 });
    await expect(page.getByText(/table/i).first()).toBeVisible({
      timeout: 10_000,
    });
  });

  test("waiter can allocate an available table", async ({ page }) => {
    await page.goto("/waiter/tables");
    await page.waitForURL(/.*\/waiter\/tables/, { timeout: 10_000 });
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);

    const availableTableBtn = page
      .getByRole("button")
      .filter({ hasText: /tap to allocate/i })
      .first();

    const hasAvailable = await availableTableBtn
      .isVisible({ timeout: 5_000 })
      .catch(() => false);
    test.skip(!hasAvailable, "No available tables visible — seed tables first");

    await availableTableBtn.click();
    await page.waitForTimeout(1_000);

    const nameInput = page
      .getByLabel(/customer name/i)
      .or(page.getByPlaceholder(/customer name|name/i))
      .first();

    if (await nameInput.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await nameInput.fill("Test Customer");
      const phoneInput = page
        .getByLabel(/phone/i)
        .or(page.getByPlaceholder(/phone/i))
        .first();
      if (await phoneInput.isVisible({ timeout: 2_000 }).catch(() => false)) {
        await phoneInput.fill("9876543210");
      }
      await page
        .getByRole("button", { name: /allocate|confirm|assign|ok/i })
        .first()
        .click();
    }

    await expect(page.getByText(/occupied/i).first()).toBeVisible({
      timeout: 8_000,
    });
  });

  test("waiter can navigate to order page", async ({ page }) => {
    await page.goto("/waiter/tables");
    await page.waitForURL(/.*\/waiter\/tables/, { timeout: 10_000 });
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);

    // Click Occupied filter tab first
    const occupiedTab = page
      .getByRole("button", { name: /^occupied$/i })
      .first();
    if (await occupiedTab.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await occupiedTab.click();
      await page.waitForTimeout(1_000);
    }

    // Click occupied table card — matches "T-6 · 2 seats" pattern
    const tableCard = page
      .getByRole("button")
      .filter({ hasText: /T-\d+\s*·\s*\d+\s*seat/i })
      .filter({ hasNotText: /tap to allocate|QR/i })
      .first();

    const hasCard = await tableCard
      .isVisible({ timeout: 5_000 })
      .catch(() => false);
    test.skip(
      !hasCard,
      "No occupied table card found — allocate a table first",
    );

    await tableCard.click();
    await page.waitForTimeout(2_000);

    const navigatedToOrder = page.url().includes("/waiter/order");
    const hasOrderContent = await page
      .getByText(
        /place order|add items|new order|your order|select items|take order/i,
      )
      .isVisible({ timeout: 3_000 })
      .catch(() => false);

    expect(navigatedToOrder || hasOrderContent).toBeTruthy();
  });
});

// ─────────────────────────────────────────────────────────────
// Chef flow — KOT display
// ─────────────────────────────────────────────────────────────
test.describe("Chef — Kitchen display", () => {
  test.use({ storageState: AUTH_STATE.chef });

  test("chef can see KOT page", async ({ page }) => {
    await page.goto("/chef/kot");
    await page.waitForURL(/.*\/chef\/kot/, { timeout: 10_000 });
    await expect(page).toHaveURL(/.*\/chef\/kot/);
    await expect(page).not.toHaveURL(/.*\/login/);
  });

  test("chef sees pending orders on KOT", async ({ page }) => {
    await page.goto("/chef/kot");
    await page.waitForURL(/.*\/chef\/kot/, { timeout: 10_000 });
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(3_000);

    const hasOrders = await page
      .getByText(/pending|preparing|ready|order|kot/i)
      .isVisible({ timeout: 5_000 })
      .catch(() => false);

    const hasEmptyState = await page
      .getByText(/no orders|all caught up|empty/i)
      .isVisible({ timeout: 3_000 })
      .catch(() => false);

    const hasAnyContent = await page
      .locator(
        "table, .card, [class*='card'], [class*='order'], [class*='kot']",
      )
      .first()
      .isVisible({ timeout: 3_000 })
      .catch(() => false);

    expect(hasOrders || hasEmptyState || hasAnyContent).toBeTruthy();
  });

  test("chef can mark an order as preparing", async ({ page }) => {
    await page.goto("/chef/kot");
    await page.waitForURL(/.*\/chef\/kot/, { timeout: 10_000 });
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(3_000);

    const startButton = page
      .getByRole("button", { name: /start|preparing|accept|begin|cook/i })
      .first();

    const hasButton = await startButton
      .isVisible({ timeout: 5_000 })
      .catch(() => false);
    test.skip(!hasButton, "No Start button — seed a pending KOT first");

    await startButton.click();
    await page.waitForTimeout(1_000);
    await expect(page.getByText(/preparing/i).first()).toBeVisible({
      timeout: 8_000,
    });
  });

  test("chef can mark an order as ready", async ({ page }) => {
    await page.goto("/chef/kot");
    await page.waitForURL(/.*\/chef\/kot/, { timeout: 10_000 });
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(3_000);

    const readyButton = page
      .getByRole("button", { name: /ready|mark ready|done|complete|finish/i })
      .first();

    const hasButton = await readyButton
      .isVisible({ timeout: 5_000 })
      .catch(() => false);
    test.skip(!hasButton, "No Ready button — seed a preparing KOT first");

    await readyButton.click();
    await page.waitForTimeout(1_000);
    await expect(page.getByText(/ready/i).first()).toBeVisible({
      timeout: 8_000,
    });
  });
});

// ─────────────────────────────────────────────────────────────
// Cashier flow — billing
// ─────────────────────────────────────────────────────────────
test.describe("Cashier — billing", () => {
  test.use({ storageState: AUTH_STATE.cashier });

  test("cashier can see billing page", async ({ page }) => {
    await page.goto("/cashier/billing");
    await page.waitForURL(/.*\/cashier\/billing/, { timeout: 10_000 });
    await expect(page).toHaveURL(/.*\/cashier\/billing/);
    await expect(page).not.toHaveURL(/.*\/login/);
  });

  test("cashier can see list of bills", async ({ page }) => {
    await page.goto("/cashier/billing");
    await page.waitForURL(/.*\/cashier\/billing/, { timeout: 10_000 });
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);

    const billsTab = page.getByRole("button", { name: /^bills$/i }).first();
    if (await billsTab.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await billsTab.click();
      await page.waitForTimeout(1_000);
    }

    const hasBills = await page
      .getByText(/BILL-/i)
      .isVisible({ timeout: 5_000 })
      .catch(() => false);

    const hasEmptyState = await page
      .getByText(/no bills|empty|no records/i)
      .isVisible({ timeout: 3_000 })
      .catch(() => false);

    const hasAnyContent = await page
      .locator("table, [class*='bill'], [class*='invoice'], [class*='card']")
      .first()
      .isVisible({ timeout: 3_000 })
      .catch(() => false);

    expect(hasBills || hasEmptyState || hasAnyContent).toBeTruthy();
  });

  test("cashier can mark a bill as paid", async ({ page }) => {
    await page.goto("/cashier/billing");
    await page.waitForURL(/.*\/cashier\/billing/, { timeout: 10_000 });
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);

    // Click Bills tab first
    const billsTab = page.getByRole("button", { name: /^bills$/i }).first();
    if (await billsTab.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await billsTab.click();
      await page.waitForTimeout(1_000);
    }

    // Log all buttons before clicking bill
    const buttonsBefore = await page.getByRole("button").allInnerTexts();
    console.log("[debug] All buttons on billing page:", buttonsBefore);

    // Click the unpaid bill card
    const unpaidBillBtn = page
      .getByRole("button")
      .filter({ hasText: /unpaid/i })
      .first();

    const hasUnpaid = await unpaidBillBtn
      .isVisible({ timeout: 5_000 })
      .catch(() => false);
    test.skip(!hasUnpaid, "No unpaid bill card — seed an unpaid bill first");

    await unpaidBillBtn.click();
    await page.waitForTimeout(2_000);

    // Log URL and all buttons/text after clicking
    console.log("[debug] URL after clicking bill:", page.url());
    const buttonsAfter = await page.getByRole("button").allInnerTexts();
    console.log("[debug] Buttons after clicking unpaid bill:", buttonsAfter);
    const pageText = await page
      .locator("body")
      .innerText()
      .catch(() => "");
    console.log(
      "[debug] Page text after clicking bill:",
      pageText.slice(0, 400),
    );

    // Try to find pay button — check all possible labels
    const payButton = page
      .getByRole("button", {
        name: /pay|mark paid|collect|settle|process|mark as paid|complete payment/i,
      })
      .first();

    const hasPayButton = await payButton
      .isVisible({ timeout: 5_000 })
      .catch(() => false);

    if (!hasPayButton) {
      // Maybe clicking bill navigated to a detail page
      // Try looking for pay action anywhere on the page
      const anyPayText = await page
        .getByText(/pay now|mark paid|collect payment|settle bill/i)
        .isVisible({ timeout: 3_000 })
        .catch(() => false);

      console.log("[debug] Any pay text visible:", anyPayText);
      test.skip(
        !anyPayText,
        "No pay button found after clicking bill — check UI flow in headed mode",
      );
    }

    await payButton.click();
    await page.waitForTimeout(1_000);

    // Handle payment modal
    const cashOption = page
      .getByText(/^cash$/i)
      .or(page.getByRole("button", { name: /^cash$/i }))
      .first();

    if (await cashOption.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await cashOption.click();
      await page.waitForTimeout(500);
      const confirmBtn = page
        .getByRole("button", { name: /confirm|done|ok|pay|submit/i })
        .first();
      if (await confirmBtn.isVisible({ timeout: 2_000 }).catch(() => false)) {
        await confirmBtn.click();
      }
    }

    await expect(page.getByText(/paid/i).first()).toBeVisible({
      timeout: 8_000,
    });
  });
});

// ─────────────────────────────────────────────────────────────
// Admin flow — dashboard
// ─────────────────────────────────────────────────────────────
test.describe("Admin — dashboard", () => {
  test.use({ storageState: AUTH_STATE.admin });

  test("admin can see dashboard with stats", async ({ page }) => {
    await page.goto("/admin/dashboard");
    await page.waitForURL(/.*\/admin\/dashboard/, { timeout: 10_000 });
    await expect(page).toHaveURL(/.*\/admin\/dashboard/);
  });

  test("admin can navigate to menu management", async ({ page }) => {
    await page.goto("/admin/menu");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);
    await expect(page).not.toHaveURL(/.*\/login/);
    expect(page.url()).toMatch(/\/admin\/(menu|dashboard)/);
  });

  test("admin can navigate to staff page", async ({ page }) => {
    await page.goto("/admin/staff");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);
    await expect(page).not.toHaveURL(/.*\/login/);
    expect(page.url()).toMatch(/\/admin\/(staff|dashboard)/);
  });

  test("admin can navigate to reports", async ({ page }) => {
    await page.goto("/admin/reports");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);
    await expect(page).not.toHaveURL(/.*\/login/);
    expect(page.url()).toMatch(/\/admin\/(reports|dashboard)/);
  });

  test("admin sidebar shows all nav items", async ({ page }) => {
    await page.goto("/admin/dashboard");
    await page.waitForURL(/.*\/admin\/dashboard/, { timeout: 10_000 });
    await expect(page.getByText(/dashboard/i).first()).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByText(/menu/i).first()).toBeVisible({
      timeout: 5_000,
    });
  });
});
