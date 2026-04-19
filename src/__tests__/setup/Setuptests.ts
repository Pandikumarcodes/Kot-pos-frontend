/**
 * setupTests.ts
 *
 * Runs once before every test file.
 * Place global mocks and polyfills here.
 */
import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Automatically unmount React trees after each test to prevent memory leaks
afterEach(() => {
  cleanup();
});

// ─── Global Mocks ────────────────────────────────────────────────────────────

// Mock IntersectionObserver (not available in jsdom)
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock ResizeObserver (not available in jsdom)
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock window.matchMedia (used by PWA / responsive logic)
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock Socket.io client so KOT/real-time tests don't open real connections
vi.mock("socket.io-client", () => ({
  default: vi.fn(() => ({
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
    disconnect: vi.fn(),
    connect: vi.fn(),
    connected: false,
  })),
  io: vi.fn(),
}));

// Mock DOMPurify (receipt sanitisation) — returns input unchanged in test env
vi.mock("dompurify", () => ({
  default: {
    sanitize: vi.fn((dirty: string) => dirty),
  },
}));
