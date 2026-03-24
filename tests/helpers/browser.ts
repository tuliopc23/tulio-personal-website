import { vi } from "vite-plus/test";

export function installMatchMediaStub(
  options: {
    light?: boolean;
    reducedMotion?: boolean;
    hover?: boolean;
  } = {},
) {
  const { light = false, reducedMotion = false, hover = true } = options;

  const listeners = new Map<string, Set<(event: MediaQueryListEvent) => void>>();
  const state = new Map<string, boolean>([
    ["(prefers-color-scheme: light)", light],
    ["(prefers-reduced-motion: reduce)", reducedMotion],
    ["(hover: hover) and (pointer: fine)", hover],
    ["(max-width: 1024px)", true],
  ]);

  const matchMedia = (query: string) => ({
    media: query,
    matches: state.get(query) ?? false,
    onchange: null,
    addEventListener: (_type: string, callback: (event: MediaQueryListEvent) => void) => {
      const set = listeners.get(query) ?? new Set();
      set.add(callback);
      listeners.set(query, set);
    },
    removeEventListener: (_type: string, callback: (event: MediaQueryListEvent) => void) => {
      listeners.get(query)?.delete(callback);
    },
    addListener: (callback: (event: MediaQueryListEvent) => void) => {
      const set = listeners.get(query) ?? new Set();
      set.add(callback);
      listeners.set(query, set);
    },
    removeListener: (callback: (event: MediaQueryListEvent) => void) => {
      listeners.get(query)?.delete(callback);
    },
    dispatchEvent: vi.fn(),
  });

  vi.stubGlobal("matchMedia", matchMedia);
  if (typeof window !== "undefined") {
    Object.defineProperty(window, "matchMedia", {
      value: matchMedia,
      writable: true,
      configurable: true,
    });
  }

  return {
    setMatches(query: string, matches: boolean) {
      state.set(query, matches);
      const event = { matches, media: query } as MediaQueryListEvent;
      listeners.get(query)?.forEach((listener) => listener(event));
    },
  };
}

export function installStorageStub() {
  const createStore = () => {
    const store = new Map<string, string>();
    return {
      getItem: vi.fn((key: string) => store.get(key) ?? null),
      setItem: vi.fn((key: string, value: string) => {
        store.set(key, value);
      }),
      removeItem: vi.fn((key: string) => {
        store.delete(key);
      }),
      clear: vi.fn(() => {
        store.clear();
      }),
    };
  };

  const local = createStore();
  const session = createStore();

  vi.stubGlobal("localStorage", local);
  vi.stubGlobal("sessionStorage", session);

  if (typeof window !== "undefined") {
    Object.defineProperty(window, "localStorage", {
      value: local,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(window, "sessionStorage", {
      value: session,
      writable: true,
      configurable: true,
    });
  }

  return { local, session };
}

export function installObserverStubs() {
  class MockIntersectionObserver {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
    takeRecords = vi.fn(() => []);
  }

  class MockMutationObserver {
    constructor(private readonly callback: MutationCallback) {}
    observe = vi.fn();
    disconnect = vi.fn();
    takeRecords = vi.fn(() => []);
    trigger(records: MutationRecord[] = []) {
      this.callback(records, this as unknown as MutationObserver);
    }
  }

  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
  vi.stubGlobal("MutationObserver", MockMutationObserver as unknown as typeof MutationObserver);
}

export function installAnimationStubs() {
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    callback(0);
    return 1;
  });
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
}
