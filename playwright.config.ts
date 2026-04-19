/// <reference types="node" />
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [["html", { outputFolder: "playwright-report" }], ["list"]],

  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "on-first-retry",
  },

  projects: [
    // ── 1. Auth setup — runs first, sequentially ─────────────
    {
      name: "setup",
      testMatch: /.*\.setup\.ts/,
      fullyParallel: false, // logins must not run concurrently
      use: {
        // Run setup in headed-friendly mode — no stored state yet
        ...devices["Desktop Chrome"],
      },
    },

    // ── 2. Main test suite — depends on setup ────────────────
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // CRITICAL: point each test at the correct storageState.
        // Individual spec files override this via test.use({ storageState })
        // so this default only applies to tests that don't specify a role.
      },
      dependencies: ["setup"],
    },
  ],

  // ── Dev server ────────────────────────────────────────────
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    // Ensures the server is fully up before any test or setup runs
    stdout: "pipe",
    stderr: "pipe",
  },
});
