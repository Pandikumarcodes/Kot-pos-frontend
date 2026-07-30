//<reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    include: ["src/__tests__/**/*.test.{ts,tsx}"],

    // Use jsdom to simulate a browser environment for React components
    environment: "jsdom",

    // Run this setup file before every test suite
    setupFiles: ["./src/__tests__/setup/testSetup.ts"],

    // Globally available APIs — no need to import describe/it/expect in every file
    globals: true,

    // Coverage configuration (run with: npm run test:coverage)
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov", "html"],
      reportsDirectory: "./coverage",
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.d.ts",
        "src/main.tsx",
        "src/vite-env.d.ts",
        "src/**/*.stories.{ts,tsx}",
        "src/__tests__/**",
        "src/types/**",
      ],
      // Enforce minimum thresholds — CI will fail below these
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },

    // Increase timeout for async tests (socket, debounce, etc.)
    testTimeout: 10_000,

    // Suppress noisy React act() warnings during tests
    onConsoleLog(log) {
      if (log.includes("act(...)")) return false;
    },
  },
});
