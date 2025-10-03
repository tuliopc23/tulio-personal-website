if (window.location !== window.parent.location) {
  const loadOverlays = async () => {
    const { enableOverlays } = await import("@sanity/visual-editing");
    enableOverlays({ zIndex: 999999 });
  };

  loadOverlays();
}
