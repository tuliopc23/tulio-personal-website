if (window.location !== window.parent.location) {
  const loadOverlays = async (): Promise<void> => {
    // Dynamic import with type assertion since @sanity/visual-editing
    // may have exports not fully typed in the declaration file
    const module = await import("@sanity/visual-editing");

    // Type assertion for enableOverlays which exists at runtime
    const enableOverlays = (module as { enableOverlays?: (options: { zIndex: number }) => void })
      .enableOverlays;

    if (enableOverlays) {
      enableOverlays({ zIndex: 999999 });
    }
  };

  void loadOverlays();
}
