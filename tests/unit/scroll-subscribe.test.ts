import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getScrollY,
  resetScrollSubscribeForTests,
  setScrollEngine,
  subscribeScroll,
} from "../../src/lib/scroll-subscribe";

describe("scroll-subscribe", () => {
  beforeEach(() => {
    resetScrollSubscribeForTests();
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 0,
      writable: true,
    });
  });

  afterEach(() => {
    resetScrollSubscribeForTests();
  });

  it("falls back to native scrollY when no engine is set", () => {
    Object.defineProperty(window, "scrollY", { configurable: true, value: 42 });
    expect(getScrollY()).toBe(42);
  });

  it("coalesces subscriber callbacks to one rAF per burst", () => {
    const callback = vi.fn();
    subscribeScroll(callback);

    window.dispatchEvent(new Event("scroll"));
    window.dispatchEvent(new Event("scroll"));
    window.dispatchEvent(new Event("scroll"));

    expect(callback).not.toHaveBeenCalled();

    return new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        expect(callback).toHaveBeenCalledTimes(1);
        resolve();
      });
    });
  });

  it("uses Lenis scroll when the engine is wired", () => {
    const lenis = {
      scroll: 128,
      on: vi.fn(),
      off: vi.fn(),
    };

    setScrollEngine(lenis as never);
    expect(getScrollY()).toBe(128);
    expect(lenis.on).toHaveBeenCalledWith("scroll", expect.any(Function));
  });

  it("unsubscribes cleanly", () => {
    const callback = vi.fn();
    const unsubscribe = subscribeScroll(callback);

    unsubscribe();
    window.dispatchEvent(new Event("scroll"));

    return new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        expect(callback).not.toHaveBeenCalled();
        resolve();
      });
    });
  });
});
