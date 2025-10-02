/**
 * Web Vitals Monitoring
 * Lightweight script to track Core Web Vitals in development
 */

// Only run in development
if (window.location.hostname === "localhost") {
  // Track LCP (Largest Contentful Paint)
  if ("PerformanceObserver" in window) {
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log(
          `%c⚡ LCP: ${Math.round(lastEntry.renderTime || lastEntry.loadTime)}ms`,
          "color: #0ea5e9; font-weight: bold"
        );
      });
      lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });

      // Track CLS (Cumulative Layout Shift)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        console.log(
          `%c📐 CLS: ${clsValue.toFixed(3)}`,
          "color: #f59e0b; font-weight: bold"
        );
      });
      clsObserver.observe({ type: "layout-shift", buffered: true });

      // Track FID (First Input Delay)
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log(
            `%c⌨️  FID: ${Math.round(entry.processingStart - entry.startTime)}ms`,
            "color: #10b981; font-weight: bold"
          );
        }
      });
      fidObserver.observe({ type: "first-input", buffered: true });

      // Track FCP (First Contentful Paint)
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcp = entries.find((entry) => entry.name === "first-contentful-paint");
        if (fcp) {
          console.log(
            `%c🎨 FCP: ${Math.round(fcp.startTime)}ms`,
            "color: #8b5cf6; font-weight: bold"
          );
        }
      });
      fcpObserver.observe({ type: "paint", buffered: true });

      // Track TTFB (Time to First Byte)
      window.addEventListener("load", () => {
        const navTiming = performance.getEntriesByType("navigation")[0];
        if (navTiming) {
          const ttfb = navTiming.responseStart - navTiming.requestStart;
          console.log(
            `%c🌐 TTFB: ${Math.round(ttfb)}ms`,
            "color: #ec4899; font-weight: bold"
          );
        }
      });
    } catch {
      // Silently fail if PerformanceObserver is not supported
    }
  }

  // Overall page load time
  window.addEventListener("load", () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType("navigation")[0];
      if (perfData) {
        console.log(
          `%c⏱️  Page Load: ${Math.round(perfData.loadEventEnd - perfData.fetchStart)}ms`,
          "color: #6366f1; font-weight: bold; font-size: 14px"
        );
      }
    }, 0);
  });
}
