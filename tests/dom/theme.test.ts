import {
  installAnimationStubs,
  installMatchMediaStub,
  installStorageStub,
} from "../helpers/browser";

const dispatchPointer = (
  target: EventTarget,
  type: string,
  init: Partial<PointerEvent> & { pointerId?: number; clientX?: number } = {},
) => {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.assign(event, {
    button: 0,
    pointerId: 1,
    pointerType: "mouse",
    clientX: 0,
    ...init,
  });
  target.dispatchEvent(event);
};

describe("theme controller script", () => {
  test("initializes using system theme and updates document state", async () => {
    installAnimationStubs();
    installMatchMediaStub({ light: true, reducedMotion: false });
    installStorageStub();

    document.head.innerHTML =
      '<link rel="icon" href="/brand-icon-light.png"><meta id="theme-color-meta" content="#f6f7fb">';
    vi.resetModules();

    await import("../../src/scripts/theme");

    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(document.documentElement.classList.contains("light")).toBe(true);
    expect((document.querySelector('link[rel="icon"]') as HTMLLinkElement).href).toContain(
      "/brand-icon-light.png",
    );
  });

  test("toggles theme without persistence, and can return to system sync", async () => {
    installAnimationStubs();
    const media = installMatchMediaStub({ light: false, reducedMotion: false });
    installStorageStub();

    document.head.innerHTML =
      '<link rel="icon" href="/brand-icon-dark.png"><meta id="theme-color-meta" content="#050506">';

    vi.useFakeTimers();
    vi.resetModules();
    await import("../../src/scripts/theme");

    expect(window.themeController?.getTheme()).toBe("dark");
    window.themeController?.toggleTheme({ persist: false });
    expect(window.themeController?.getTheme()).toBe("light");
    expect(window.themeController?.getPreference()).toBe("light");
    expect(document.documentElement.classList.contains("theme-transition")).toBe(true);

    vi.runAllTimers();
    expect(document.documentElement.classList.contains("theme-transition")).toBe(false);

    // While explicitly overridden, OS changes should not affect the theme.
    media.setMatches("(prefers-color-scheme: light)", false);
    expect(window.themeController?.getTheme()).toBe("light");

    window.themeController?.setSystem({ persist: false });
    expect(window.themeController?.getPreference()).toBe("system");
    expect(window.themeController?.getTheme()).toBe("dark");
    media.setMatches("(prefers-color-scheme: light)", true);
    expect(window.themeController?.getTheme()).toBe("light");

    const listener = vi.fn();
    const unsubscribe = window.themeController?.subscribeMotionPreference(listener);
    media.setMatches("(prefers-reduced-motion: reduce)", true);
    expect(document.documentElement.dataset.motion).toBe("reduced");
    expect(listener).toHaveBeenCalled();
    unsubscribe?.();
  });

  test("reacts to system theme changes when preference is system", async () => {
    installAnimationStubs();
    const media = installMatchMediaStub({ light: false, reducedMotion: false });
    installStorageStub();

    document.head.innerHTML =
      '<link rel="icon" href="/brand-icon-dark.png"><meta id="theme-color-meta" content="#050506">';

    vi.resetModules();
    await import("../../src/scripts/theme");

    expect(window.themeController?.getTheme()).toBe("dark");
    expect(window.themeController?.getPreference()).toBe("system");
    media.setMatches("(prefers-color-scheme: light)", true);
    expect(window.themeController?.getTheme()).toBe("light");
  });

  test("binds and drives the liquid toggle with click, keyboard, and drag", async () => {
    installAnimationStubs();
    installMatchMediaStub({ light: false, reducedMotion: false });
    installStorageStub();

    document.head.innerHTML =
      '<link rel="icon" href="/brand-icon-dark.png"><meta id="theme-color-meta" content="#050506">';
    document.body.innerHTML = `
      <div data-theme-toggle-root>
        <button data-dragging="false" data-motion="normal" data-instant="false" aria-pressed="false" style="--complete: 0"></button>
      </div>
    `;

    const button = document.querySelector("[data-theme-toggle-root] button") as HTMLButtonElement;
    Object.defineProperty(button, "getBoundingClientRect", {
      value: () => ({ left: 0, width: 100 }),
    });
    button.setPointerCapture = vi.fn();
    button.releasePointerCapture = vi.fn();

    vi.resetModules();
    await import("../../src/scripts/theme");

    expect(button.type).toBe("button");
    button.click();
    expect(window.themeController?.getPreference()).toBe("dark");
    expect(window.themeController?.getTheme()).toBe("dark");

    button.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }),
    );
    button.dispatchEvent(
      new KeyboardEvent("keyup", { key: "Enter", bubbles: true, cancelable: true }),
    );
    expect(window.themeController?.getPreference()).toBe("light");
    expect(window.themeController?.getTheme()).toBe("light");

    dispatchPointer(button, "pointerdown", { clientX: 10 });
    dispatchPointer(button, "pointermove", { clientX: 90 });
    dispatchPointer(button, "pointerup", { clientX: 90 });
    expect(window.themeController?.getPreference()).toBe("dark");
    expect(window.themeController?.getTheme()).toBe("dark");
    expect(button.getAttribute("data-dragging")).toBe("false");

    dispatchPointer(button, "pointercancel", { clientX: 20 });
    expect(button.style.getPropertyValue("--complete")).toBeTruthy();
  });
});
