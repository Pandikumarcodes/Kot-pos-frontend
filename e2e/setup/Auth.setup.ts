/// <reference types="node" />
import { test as setup, expect } from "@playwright/test";
import { AUTH_STATE } from "../helpers/authState";
import fs from "fs";

// ─────────────────────────────────────────────────────────────
// CREDENTIALS — must match your seeded DB exactly
// ─────────────────────────────────────────────────────────────
const CREDENTIALS: Record<
  keyof typeof AUTH_STATE,
  { username: string; password: string }
> = {
  admin: { username: "admin", password: "Admin@1234" },
  manager: { username: "manager", password: "Manager@1234" },
  waiter: { username: "waiter", password: "Waiter@1234" },
  cashier: { username: "cashier", password: "Cashier@1234" },
  chef: { username: "chef", password: "Chef@1234" },
};

// ─────────────────────────────────────────────────────────────
// Role → expected landing URL after login
// ─────────────────────────────────────────────────────────────
const EXPECTED_URL: Record<keyof typeof AUTH_STATE, string> = {
  admin: "/admin/dashboard",
  manager: "/admin/dashboard",
  waiter: "/waiter/tables",
  cashier: "/cashier/billing",
  chef: "/chef/kot",
};

// ─────────────────────────────────────────────────────────────
// Ensure .auth/ directory exists before saving storage state
// ─────────────────────────────────────────────────────────────
function ensureAuthDir(): void {
  if (!fs.existsSync(".auth")) {
    fs.mkdirSync(".auth", { recursive: true });
    console.log("[auth.setup] Created .auth/ directory");
  }
}

// ─────────────────────────────────────────────────────────────
// Core login helper
// ─────────────────────────────────────────────────────────────
async function loginAs(
  page: import("@playwright/test").Page,
  role: keyof typeof CREDENTIALS,
  statePath: string,
): Promise<void> {
  console.log(`\n[auth.setup] Logging in as: ${role}`);

  // Step 1 — Go to landing page
  await page.goto("/login");
  await expect(page.getByText("Sign In").first()).toBeVisible({
    timeout: 10_000,
  });

  // Step 2 — Click Sign In card → /signin
  await page.getByText("Sign In").first().click();
  await page.waitForURL("**/signin", { timeout: 10_000 });

  // Step 3 — Fill credentials
  const usernameInput = page.getByPlaceholder("Enter your username");
  const passwordInput = page.getByPlaceholder("••••••••");

  await expect(usernameInput).toBeVisible({ timeout: 5_000 });
  await expect(passwordInput).toBeVisible({ timeout: 5_000 });

  await usernameInput.fill(CREDENTIALS[role].username);
  await passwordInput.fill(CREDENTIALS[role].password);

  // Step 4 — Submit
  await page.getByRole("button", { name: "Sign In" }).click();

  // Step 5 — Wait for successful redirect away from login pages
  try {
    await page.waitForURL(
      (url) =>
        !url.pathname.includes("/signin") && !url.pathname.includes("/login"),
      { timeout: 15_000 },
    );
  } catch {
    const currentUrl = page.url();
    const errorText = await page
      .getByText(/invalid credentials|incorrect|wrong|error/i)
      .textContent({ timeout: 2_000 })
      .catch(() => null);

    throw new Error(
      `[auth.setup] Login FAILED for role "${role}".\n` +
        `  Username : ${CREDENTIALS[role].username}\n` +
        `  Password : ${CREDENTIALS[role].password}\n` +
        `  Still on : ${currentUrl}\n` +
        `  Page says: ${errorText ?? "(no error text visible)"}\n\n` +
        `  → Make sure your DB is seeded with the credentials above.\n` +
        `  → Run: node backend/seed/seed.js --clean`,
    );
  }

  // Step 6 — Verify landing URL
  const expectedPath = EXPECTED_URL[role];
  const landed = page.url();
  if (!landed.includes(expectedPath)) {
    console.warn(
      `[auth.setup] WARNING: ${role} expected "${expectedPath}" but landed on "${landed}". Saving state anyway.`,
    );
  } else {
    console.log(`[auth.setup] ✓ ${role} landed on: ${landed}`);
  }

  // Step 7 — Verify at least one auth cookie was set
  const cookies = await page.context().cookies();
  const authCookie = cookies.find(
    (c) =>
      c.name.toLowerCase().includes("token") ||
      c.name.toLowerCase().includes("auth") ||
      c.name.toLowerCase().includes("session") ||
      c.name.toLowerCase().includes("jwt"),
  );

  if (!authCookie) {
    console.warn(
      `[auth.setup] WARNING: No auth cookie found for "${role}".\n` +
        `  Cookies present: ${cookies.map((c) => c.name).join(", ") || "(none)"}\n` +
        `  → Ensure your backend sets cookies with domain "localhost" and path "/"\n` +
        `  → Ensure playwright.config.ts baseURL is http://localhost:5173`,
    );
  } else {
    console.log(`[auth.setup] ✓ Auth cookie: "${authCookie.name}" for ${role}`);
  }

  // Step 8 — Save storage state (cookies + localStorage)
  ensureAuthDir();
  await page.context().storageState({ path: statePath });
  console.log(`[auth.setup] ✓ Saved: ${statePath}`);
}

// ─────────────────────────────────────────────────────────────
// Setup tests — Playwright runs these before all spec files
// ─────────────────────────────────────────────────────────────
setup("authenticate as admin", async ({ page }) =>
  loginAs(page, "admin", AUTH_STATE.admin),
);

setup("authenticate as manager", async ({ page }) =>
  loginAs(page, "manager", AUTH_STATE.manager),
);

setup("authenticate as waiter", async ({ page }) =>
  loginAs(page, "waiter", AUTH_STATE.waiter),
);

setup("authenticate as cashier", async ({ page }) =>
  loginAs(page, "cashier", AUTH_STATE.cashier),
);

setup("authenticate as chef", async ({ page }) =>
  loginAs(page, "chef", AUTH_STATE.chef),
);
