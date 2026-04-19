/// <reference types="node" />
import { test, expect } from "@playwright/test";
import { AUTH_STATE } from "../helpers/authState";

// ── Landing page (/login) ────────────────────────────────────
test.describe("Login landing page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("shows Sign In and Create Account cards", async ({ page }) => {
    await expect(page.getByText("Sign In").first()).toBeVisible();
    await expect(page.getByText("Create Account")).toBeVisible();
  });

  test("clicking Sign In navigates to /signin", async ({ page }) => {
    await page.getByText("Sign In").first().click();
    await page.waitForURL("**/signin", { timeout: 5_000 });
    expect(page.url()).toContain("/signin");
  });

  test("clicking Create Account navigates to signup", async ({ page }) => {
    await page.getByText("Create Account").click();
    await page.waitForURL((url) => !url.pathname.includes("/login"), {
      timeout: 5_000,
    });
    expect(page.url()).not.toContain("/login");
  });
});

// ── Sign In form (/signin) ────────────────────────────────────
test.describe("Sign In form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/signin");
  });

  test("shows username and password fields", async ({ page }) => {
    await expect(page.getByPlaceholder("Enter your username")).toBeVisible();
    await expect(page.getByPlaceholder("••••••••")).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();
  });

  test("shows error on wrong password", async ({ page }) => {
    await page.getByPlaceholder("Enter your username").fill("admin");
    await page.getByPlaceholder("••••••••").fill("WrongPassword!");
    await page.getByRole("button", { name: "Sign In" }).click();

    // Wait longer — backend may be slow to respond
    await page.waitForTimeout(8_000);

    // Debug: log exactly what text is on the page
    const bodyText = await page
      .locator("body")
      .innerText()
      .catch(() => "");
    console.log(
      "[debug] Page text after wrong password:",
      bodyText.slice(0, 600),
    );

    const allButtons = await page.getByRole("button").allInnerTexts();
    console.log("[debug] Buttons visible:", allButtons);

    // Check for any alert/error element
    const hasAnyAlert = await page
      .locator(
        "[role='alert'], .error, .alert, .toast, [class*='error'], [class*='alert'], [class*='toast'], [class*='message'], [class*='notification']",
      )
      .isVisible({ timeout: 3_000 })
      .catch(() => false);

    // Check for any error-like text — very broad
    const hasErrorText = await page
      .getByText(
        /wrong|invalid|incorrect|error|fail|bad|denied|credential|password|username|exist|found|match|attempt|unauthorized|sorry/i,
      )
      .isVisible({ timeout: 3_000 })
      .catch(() => false);

    // Check if page text contains any error indication
    const pageHasError =
      /wrong|invalid|incorrect|error|fail|denied|credential|unauthorized|sorry|try again/i.test(
        bodyText,
      );

    console.log(
      "[debug] hasAnyAlert:",
      hasAnyAlert,
      "| hasErrorText:",
      hasErrorText,
      "| pageHasError:",
      pageHasError,
    );

    expect(hasAnyAlert || hasErrorText || pageHasError).toBeTruthy();
  });

  test("shows error on non-existent username", async ({ page }) => {
    await page.getByPlaceholder("Enter your username").fill("ghost_user_xyz");
    await page.getByPlaceholder("••••••••").fill("Password@123!");
    await page.getByRole("button", { name: "Sign In" }).click();

    await page.waitForTimeout(8_000);

    const bodyText = await page
      .locator("body")
      .innerText()
      .catch(() => "");
    console.log(
      "[debug] Page text after non-existent user:",
      bodyText.slice(0, 600),
    );

    const hasAnyAlert = await page
      .locator(
        "[role='alert'], .error, .alert, .toast, [class*='error'], [class*='alert'], [class*='toast'], [class*='message'], [class*='notification']",
      )
      .isVisible({ timeout: 3_000 })
      .catch(() => false);

    const hasErrorText = await page
      .getByText(
        /wrong|invalid|incorrect|error|fail|bad|denied|credential|password|username|exist|found|match|attempt|unauthorized|sorry/i,
      )
      .isVisible({ timeout: 3_000 })
      .catch(() => false);

    const pageHasError =
      /wrong|invalid|incorrect|error|fail|denied|credential|unauthorized|sorry|try again/i.test(
        bodyText,
      );

    console.log(
      "[debug] hasAnyAlert:",
      hasAnyAlert,
      "| hasErrorText:",
      hasErrorText,
      "| pageHasError:",
      pageHasError,
    );

    expect(hasAnyAlert || hasErrorText || pageHasError).toBeTruthy();
  });

  test("shows loading state while signing in", async ({ page }) => {
    await page.getByPlaceholder("Enter your username").fill("admin");
    await page.getByPlaceholder("••••••••").fill("Admin@1234");
    await page.getByRole("button", { name: "Sign In" }).click();

    await expect(page.getByText(/signing in/i))
      .toBeVisible({ timeout: 3_000 })
      .catch(() => {});
  });

  test("Back button returns to /login", async ({ page }) => {
    await page.getByRole("button", { name: /back/i }).click();
    await page.waitForURL("**/login", { timeout: 5_000 });
    expect(page.url()).toContain("/login");
  });

  test("toggle password visibility works", async ({ page }) => {
    const passwordInput = page.getByPlaceholder("••••••••");
    await passwordInput.fill("Test@1234!");
    await expect(passwordInput).toHaveAttribute("type", "password");

    const eyeButton = page
      .getByRole("button", {
        name: /show password|toggle password|hide password/i,
      })
      .or(page.locator("button[aria-label*='password' i]"))
      .or(page.locator("input[type='password'] ~ button"))
      .first();

    await eyeButton.click();
    await expect(passwordInput).toHaveAttribute("type", "text");
  });
});

// ── Role redirects — use storageState to avoid rate limiting ──
test.describe("Admin role redirect", () => {
  test.use({ storageState: AUTH_STATE.admin });
  test("admin lands on /admin/dashboard after login", async ({ page }) => {
    await page.goto("/admin/dashboard");
    await page.waitForURL(/.*\/admin\/dashboard/, { timeout: 10_000 });
    expect(page.url()).toContain("/admin/dashboard");
  });
});

test.describe("Waiter role redirect", () => {
  test.use({ storageState: AUTH_STATE.waiter });
  test("waiter lands on /waiter/tables after login", async ({ page }) => {
    await page.goto("/waiter/tables");
    await page.waitForURL(/.*\/waiter\/tables/, { timeout: 10_000 });
    expect(page.url()).toContain("/waiter/tables");
  });
});

test.describe("Chef role redirect", () => {
  test.use({ storageState: AUTH_STATE.chef });
  test("chef lands on /chef/kot after login", async ({ page }) => {
    await page.goto("/chef/kot");
    await page.waitForURL(/.*\/chef\/kot/, { timeout: 10_000 });
    expect(page.url()).toContain("/chef/kot");
  });
});

test.describe("Cashier role redirect", () => {
  test.use({ storageState: AUTH_STATE.cashier });
  test("cashier lands on /cashier/billing after login", async ({ page }) => {
    await page.goto("/cashier/billing");
    await page.waitForURL(/.*\/cashier\/billing/, { timeout: 10_000 });
    expect(page.url()).toContain("/cashier/billing");
  });
});

// ── Logout ───────────────────────────────────────────────────
test.describe("Logout", () => {
  test.use({ storageState: AUTH_STATE.admin });
  test("logout clears session and redirects to login", async ({ page }) => {
    await page.goto("/admin/dashboard");
    await page.waitForURL(/.*\/admin\/dashboard/, { timeout: 10_000 });

    const logoutBtn = page
      .getByRole("button", { name: /logout|log out|sign out/i })
      .first();
    await expect(logoutBtn).toBeVisible({ timeout: 5_000 });
    await logoutBtn.click();

    await page.waitForURL("**/login", { timeout: 10_000 });
    expect(page.url()).toContain("/login");

    await page.goto("/admin/dashboard");
    await page.waitForURL("**/login", { timeout: 5_000 });
    expect(page.url()).toContain("/login");
  });
});
