import {
  hasStableSafariChromeFlag,
  isIOSSafariBrowser,
  markBrowserEnvironment,
  shouldIsolateSafariChrome,
} from "../../src/lib/browser-environment";

function mockNavigator(overrides: {
  userAgent: string;
  vendor?: string;
  platform?: string;
  maxTouchPoints?: number;
}): void {
  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: {
      userAgent: overrides.userAgent,
      vendor: overrides.vendor ?? "",
      platform: overrides.platform ?? "",
      maxTouchPoints: overrides.maxTouchPoints ?? 0,
    },
  });
}

describe("browser-environment", () => {
  const originalNavigator = globalThis.navigator;
  const originalLocation = globalThis.location;

  afterEach(() => {
    Object.defineProperty(globalThis, "navigator", {
      configurable: true,
      value: originalNavigator,
    });
    Object.defineProperty(globalThis, "location", {
      configurable: true,
      value: originalLocation,
    });
    delete document.documentElement.dataset.iosSafari;
  });

  test("detects iPhone Safari", () => {
    mockNavigator({
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1",
      vendor: "Apple Computer, Inc.",
      platform: "iPhone",
      maxTouchPoints: 5,
    });

    expect(isIOSSafariBrowser()).toBe(true);
    expect(shouldIsolateSafariChrome()).toBe(true);
  });

  test("detects iPadOS Safari via MacIntel platform", () => {
    mockNavigator({
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15",
      vendor: "Apple Computer, Inc.",
      platform: "MacIntel",
      maxTouchPoints: 5,
    });

    expect(isIOSSafariBrowser()).toBe(true);
  });

  test("rejects Chrome on iOS", () => {
    mockNavigator({
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/131.0.6778.73 Mobile/15E148 Safari/604.1",
      vendor: "Apple Computer, Inc.",
      platform: "iPhone",
      maxTouchPoints: 5,
    });

    expect(isIOSSafariBrowser()).toBe(false);
  });

  test("rejects desktop Safari", () => {
    mockNavigator({
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15",
      vendor: "Apple Computer, Inc.",
      platform: "MacIntel",
      maxTouchPoints: 0,
    });

    expect(isIOSSafariBrowser()).toBe(false);
    expect(shouldIsolateSafariChrome()).toBe(false);
  });

  test("stableSafariChrome query flag enables isolation on non-iOS", () => {
    mockNavigator({
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0.0.0",
      vendor: "Google Inc.",
      platform: "Win32",
    });

    Object.defineProperty(globalThis, "location", {
      configurable: true,
      value: {
        search: "?stableSafariChrome",
      },
    });

    expect(isIOSSafariBrowser()).toBe(false);
    expect(hasStableSafariChromeFlag()).toBe(true);
    expect(shouldIsolateSafariChrome()).toBe(true);
  });

  test("markBrowserEnvironment sets data-ios-safari when isolation is active", () => {
    mockNavigator({
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1",
      vendor: "Apple Computer, Inc.",
      platform: "iPhone",
      maxTouchPoints: 5,
    });

    markBrowserEnvironment();
    expect(document.documentElement.dataset.iosSafari).toBe("true");

    mockNavigator({
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0.0.0",
      vendor: "Google Inc.",
      platform: "Win32",
    });

    Object.defineProperty(globalThis, "location", {
      configurable: true,
      value: { search: "" },
    });

    markBrowserEnvironment();
    expect(document.documentElement.dataset.iosSafari).toBeUndefined();
  });
});
