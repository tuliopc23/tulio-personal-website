import { afterEach, beforeEach, vi } from "vitest";

beforeEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.useRealTimers();
  if (typeof document !== "undefined") {
    document.head.innerHTML = "";
    document.body.innerHTML = "";
    document.documentElement.className = "";
    document.documentElement.removeAttribute("data-theme");
    document.documentElement.removeAttribute("data-motion");
  }
  if (typeof localStorage !== "undefined" && typeof localStorage.clear === "function") {
    localStorage.clear();
  }
  if (
    typeof sessionStorage !== "undefined" &&
    typeof sessionStorage.clear === "function"
  ) {
    sessionStorage.clear();
  }
});
