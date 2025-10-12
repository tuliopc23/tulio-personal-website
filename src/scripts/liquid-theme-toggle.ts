import {
  getTheme,
  initThemeController,
  prefersReducedMotion,
  setTheme,
  subscribeToTheme,
  type Theme,
  toggleTheme,
} from "./theme-controller";

type PointerMode = "idle" | "tap" | "drag";

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

export const initLiquidThemeToggle = (root: HTMLElement | null): void => {
  if (typeof window === "undefined" || !root) {
    return;
  }

  initThemeController();

  const button = root.matches("button")
    ? (root as HTMLButtonElement)
    : (root.querySelector("button") as HTMLButtonElement | null);

  if (!(button instanceof HTMLButtonElement)) {
    return;
  }

  button.type = "button";
  button.setAttribute("aria-pressed", getTheme() === "light" ? "true" : "false");

  let currentComplete = getTheme() === "light" ? 100 : 0;
  let pointerMode: PointerMode = "idle";
  let pointerId: number | null = null;
  let startX = 0;
  let skipClick = false;

  const updateMotionPreference = (): void => {
    button.dataset.motion = prefersReducedMotion() ? "reduced" : "normal";
  };

  const setComplete = (value: number, instant = false): void => {
    currentComplete = clamp(value, 0, 100);
    if (instant) {
      button.dataset.instant = "true";
    }
    button.style.setProperty("--complete", currentComplete.toFixed(2));
    if (instant) {
      requestAnimationFrame(() => {
        button.dataset.instant = "false";
      });
    }
  };

  const themeToComplete = (theme: Theme): number => (theme === "light" ? 100 : 0);

  const updateFromTheme = (theme: Theme): void => {
    button.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
    if (pointerMode === "drag") {
      return;
    }
    setComplete(themeToComplete(theme), true);
  };

  const rectComplete = (clientX: number): number => {
    const rect = button.getBoundingClientRect();
    const percent = ((clientX - rect.left) / rect.width) * 100;
    return clamp(percent, 0, 100);
  };

  const releasePointer = (): void => {
    if (pointerId !== null) {
      try {
        button.releasePointerCapture(pointerId);
      } catch {
        /* ignore release errors */
      }
    }
    pointerId = null;
    pointerMode = "idle";
    button.dataset.dragging = "false";
  };

  const handlePointerDown = (event: PointerEvent): void => {
    if (event.button !== 0) {
      return;
    }

    pointerMode = "tap";
    pointerId = event.pointerId;
    startX = event.clientX;
    skipClick = false;

    button.dataset.dragging = "true";
    button.setPointerCapture(event.pointerId);

    if (prefersReducedMotion()) {
      return;
    }

    const percent = rectComplete(event.clientX);
    setComplete(percent);
  };

  const handlePointerMove = (event: PointerEvent): void => {
    if (pointerMode === "idle" || event.pointerId !== pointerId) {
      return;
    }

    const distance = Math.abs(event.clientX - startX);
    if (pointerMode === "tap" && distance > 4) {
      pointerMode = "drag";
    }

    if (pointerMode !== "drag") {
      return;
    }

    const percent = rectComplete(event.clientX);
    setComplete(percent);
  };

  const handlePointerUp = (event: PointerEvent): void => {
    if (pointerMode === "idle" || event.pointerId !== pointerId) {
      return;
    }

    const wasDrag = pointerMode === "drag";
    const targetTheme = currentComplete >= 50 ? ("light" as Theme) : ("dark" as Theme);

    releasePointer();

    if (wasDrag) {
      skipClick = true;
      setTheme(targetTheme, { persist: true });
      return;
    }

    // tap interactions fall through to click handler
    setComplete(themeToComplete(getTheme()), true);
  };

  const handlePointerCancel = (event: PointerEvent): void => {
    if (pointerMode === "idle" || event.pointerId !== pointerId) {
      return;
    }

    releasePointer();
    setComplete(themeToComplete(getTheme()), true);
  };

  const handleClick = (event: MouseEvent): void => {
    if (skipClick) {
      skipClick = false;
      event.preventDefault();
      return;
    }

    toggleTheme({ persist: true });
  };

  const handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === " ") {
      event.preventDefault();
    }

    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  const handleKeyUp = (event: KeyboardEvent): void => {
    if (event.key !== " " && event.key !== "Enter") {
      return;
    }
    event.preventDefault();
    skipClick = true;
    toggleTheme({ persist: true });
  };

  updateMotionPreference();

  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const motionListener = () => updateMotionPreference();
  if (typeof motionQuery.addEventListener === "function") {
    motionQuery.addEventListener("change", motionListener);
  } else if (typeof motionQuery.addListener === "function") {
    motionQuery.addListener(motionListener);
  }

  button.addEventListener("pointerdown", handlePointerDown);
  button.addEventListener("pointermove", handlePointerMove);
  button.addEventListener("pointerup", handlePointerUp);
  button.addEventListener("pointercancel", handlePointerCancel);
  button.addEventListener("click", handleClick);
  button.addEventListener("keydown", handleKeyDown);
  button.addEventListener("keyup", handleKeyUp);

  subscribeToTheme(updateFromTheme);

  setComplete(themeToComplete(getTheme()), true);
};
