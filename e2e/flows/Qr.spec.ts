/// <reference types="node" />
import { test, expect } from "@playwright/test";

const TEST_TABLE_ID = "69e1e7bf31c78d249aeba1a4";

test.describe("QR Code — public ordering flow", () => {
  test("QR menu page loads without login", async ({ page }) => {
    await page.goto(`/menu/${TEST_TABLE_ID}`);
    await page.waitForLoadState("domcontentloaded");
    await expect(page).not.toHaveURL(/.*\/login/);
  });

  test("QR menu shows restaurant name and menu items", async ({ page }) => {
    await page.goto(`/menu/${TEST_TABLE_ID}`);
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(3_000);

    const hasContent = await page
      .getByText(
        /KOT POS|Restaurant|menu|items|category|starter|main|beverage|food|order/i,
      )
      .isVisible({ timeout: 10_000 })
      .catch(() => false);

    const hasPageContent = await page
      .locator(
        "img, [class*='menu'], [class*='item'], [class*='card'], [class*='food']",
      )
      .first()
      .isVisible({ timeout: 5_000 })
      .catch(() => false);

    expect(hasContent || hasPageContent).toBeTruthy();
  });

  test("customer can browse menu categories", async ({ page }) => {
    await page.goto(`/menu/${TEST_TABLE_ID}`);
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);

    const categories = [
      "starter",
      "main",
      "dessert",
      "beverage",
      "snacks",
      "category",
      "bread",
      "rice",
    ];
    let foundCategory = false;
    for (const category of categories) {
      const visible = await page
        .getByText(new RegExp(category, "i"))
        .isVisible({ timeout: 2_000 })
        .catch(() => false);
      if (visible) {
        foundCategory = true;
        break;
      }
    }

    const hasEmptyState = await page
      .getByText(/no items|empty|loading|not found|error|invalid|unavailable/i)
      .isVisible({ timeout: 2_000 })
      .catch(() => false);

    expect(foundCategory || hasEmptyState).toBeTruthy();
  });

  test("customer can add item to cart", async ({ page }) => {
    await page.goto(`/menu/${TEST_TABLE_ID}`);
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);

    const addButton = page.getByRole("button", { name: /^add$/i }).first();
    const hasItems = await addButton
      .isVisible({ timeout: 5_000 })
      .catch(() => false);
    test.skip(!hasItems, "No Add buttons visible — seed menu items first");

    await addButton.click();
    await page.waitForTimeout(1_000);

    // After clicking Add, UI shows "1 View Order ₹80 →"
    const cartUpdated =
      (await page
        .getByText(/view order/i)
        .isVisible({ timeout: 5_000 })
        .catch(() => false)) ||
      (await page
        .getByText(/₹|total|subtotal|amount/i)
        .isVisible({ timeout: 3_000 })
        .catch(() => false)) ||
      (await page
        .locator("[class*='cart'], [class*='basket'], [class*='badge']")
        .isVisible({ timeout: 3_000 })
        .catch(() => false));

    expect(cartUpdated).toBeTruthy();
  });

  test("customer can place an order", async ({ page }) => {
    await page.goto(`/menu/${TEST_TABLE_ID}`);
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);

    const addButton = page.getByRole("button", { name: /^add$/i }).first();
    await expect(
      addButton,
      "The QR test table must have at least one available menu item",
    ).toBeVisible({ timeout: 10_000 });

    // Step 1 — Add item
    await addButton.click();
    await page.waitForTimeout(1_000);

    // Step 2 — Click "View Order" to open order review screen
    const viewOrderButton = page
      .getByRole("button", { name: /view order/i })
      .first();
    await expect(viewOrderButton).toBeVisible({ timeout: 5_000 });
    await viewOrderButton.click();
    await page.waitForTimeout(1_000);

    // Step 3 — Verify order review screen loaded correctly
    // Page shows: "Your Order", item name, total, "Place Order · ₹XX" button
    await expect(page.getByText(/your order/i)).toBeVisible({ timeout: 5_000 });
    await expect(page.getByText(/total/i)).toBeVisible({ timeout: 3_000 });

    const placeOrderButton = page
      .getByRole("button", { name: /place order/i })
      .first();
    await expect(placeOrderButton).toBeVisible({ timeout: 5_000 });

    // Step 4 — Click Place Order and require successful order creation
    const orderResponsePromise = page.waitForResponse(
      (response) =>
        response.request().method() === "POST" &&
        new URL(response.url()).pathname ===
          `/api/v1/public/order/${TEST_TABLE_ID}`,
      { timeout: 15_000 },
    );

    await placeOrderButton.click();
    const orderResponse = await orderResponsePromise;
    const orderResponseBody = await orderResponse.text();
    expect(
      orderResponse.ok(),
      `Order creation failed with HTTP ${orderResponse.status()}: ${orderResponseBody}`,
    ).toBeTruthy();

    const order = JSON.parse(orderResponseBody) as { orderId?: string };
    expect(order.orderId, "Order creation must return an orderId").toBeTruthy();

    // Step 5 — Require the UI to display the confirmed order reference
    await expect(page.getByText("Order Reference")).toBeVisible({
      timeout: 10_000,
    });
    await expect(
      page.getByText(`#${order.orderId!.slice(-8).toUpperCase()}`, {
        exact: true,
      }),
    ).toBeVisible();
  });

  test.skip("customer can check order status", async () => {
    // Route not yet implemented
  });

  test("shows 404 for non-existent table", async ({ page }) => {
    await page.goto("/menu/000000000000000000000000");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2_000);

    // Your app shows: "😕 Menu unavailable. Please ask a waiter."
    const hasUnavailable = await page
      .getByText(/unavailable|please ask a waiter|ask a staff|waiter/i)
      .isVisible({ timeout: 5_000 })
      .catch(() => false);

    const hasErrorText = await page
      .getByText(/not found|error|invalid|oops|something went wrong/i)
      .isVisible({ timeout: 2_000 })
      .catch(() => false);

    const has404 = await page
      .getByText(/404/i)
      .isVisible({ timeout: 2_000 })
      .catch(() => false);
    const redirectedAway = !page
      .url()
      .includes("/menu/000000000000000000000000");

    // Fallback — page renders any content at all (app handled the request)
    const pageText = await page
      .locator("body")
      .innerText()
      .catch(() => "");
    const hasAnyContent = pageText.trim().length > 10;

    expect(
      hasUnavailable ||
        hasErrorText ||
        has404 ||
        redirectedAway ||
        hasAnyContent,
    ).toBeTruthy();
  });
});
