if (typeof window !== "undefined") {
  const init = () => {
    const controller = (window as unknown as Record<string, unknown>).themeController as
      | undefined
      | { init?: () => unknown };
    controller?.init?.();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
}
