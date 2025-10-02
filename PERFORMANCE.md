# Performance Optimizations

This document outlines the performance optimizations implemented in the Tulio Cunha personal website.

## Image Optimization

### Sanity CDN Integration

- **Automatic format selection**: WebP/AVIF for modern browsers via `auto("format")`
- **Responsive srcsets**: Multiple image sizes (320w, 640w, 768w, 1024w, 1280w, 1920w)
- **LQIP (Low Quality Image Placeholder)**: Blur-up effect for progressive loading
- **Optimized quality**: 80% quality setting for optimal size/quality balance
- **Lazy loading**: `loading="lazy"` for below-fold images
- **Eager loading**: `loading="eager"` with `fetchpriority="high"` for hero images

### Implementation

```typescript
// src/sanity/lib/image.ts
export function generateSrcset(source, widths = [320, 640, 768, 1024, 1280, 1920]) {
  return widths
    .map(
      (width) =>
        `${urlFor(source).width(width).auto("format").quality(80).url()} ${width}w`
    )
    .join(", ");
}
```

## Resource Hints

### DNS Prefetch & Preconnect

Reduces latency for Sanity CDN requests:

```html
<link rel="dns-prefetch" href="https://cdn.sanity.io" />
<link rel="preconnect" href="https://cdn.sanity.io" crossorigin />
```

### Font Preloading

Critical font files are preloaded to prevent FOIT (Flash of Invisible Text):

```html
<link
  rel="preload"
  href="/fonts/SF-Mono-Powerline-Regular.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>
```

## Font Loading Strategy

### Display Swap

All fonts use `font-display: swap` to show fallback fonts immediately:

```css
@font-face {
  font-family: "SF Mono";
  src: url("/fonts/SF-Mono-Powerline-Regular.woff2") format("woff2");
  font-display: swap;
}
```

### Format Priority

WOFF2 is prioritized for maximum compression (~30% smaller than WOFF).

## Code Syntax Highlighting

### Build-time Highlighting

Shiki generates syntax-highlighted HTML at build time (no client-side JS):

```typescript
// src/lib/shiki.ts
export async function highlightCode(code: string, lang: string) {
  return await codeToHtml(code, {
    lang,
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
  });
}
```

Benefits:

- Zero client-side JavaScript for highlighting
- Instant rendering (no layout shift)
- Dual theme support (light/dark) with CSS media queries

## Core Web Vitals Monitoring

### Development Mode

Web Vitals are tracked in `localhost` for development monitoring:

- **LCP** (Largest Contentful Paint): Target < 2.5s
- **FID** (First Input Delay): Target < 100ms
- **CLS** (Cumulative Layout Shift): Target < 0.1
- **FCP** (First Contentful Paint)
- **TTFB** (Time to First Byte)

View metrics in browser console during development.

## Best Practices Implemented

### Images

✅ Explicit width/height to prevent CLS
✅ Responsive srcset with appropriate sizes
✅ Modern formats (WebP/AVIF) with fallbacks
✅ Lazy loading for below-fold content
✅ Fetchpriority="high" for LCP images

### Fonts

✅ Preload critical fonts
✅ Font-display: swap
✅ WOFF2 format for compression
✅ System font fallbacks

### Third-party Resources

✅ DNS prefetch for external domains
✅ Preconnect for critical origins
✅ Async/defer for non-critical scripts

### Code

✅ Build-time syntax highlighting
✅ CSS-based theme switching
✅ Minimal client-side JavaScript

## Performance Budgets

Target metrics:

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.5s
- **Total Bundle Size**: < 200KB (gzipped)
- **Image Sizes**: < 200KB per image (optimized)

## Testing Performance

### Local Testing

1. Start dev server: `bun run dev`
2. Open browser DevTools Console
3. Navigate to any page
4. View Web Vitals metrics in console

### Production Testing

Use Lighthouse in Chrome DevTools:

```bash
bun run build
bun run preview
# Open Chrome DevTools > Lighthouse > Run audit
```

### Recommended Tools

- [PageSpeed Insights](https://pagespeed.web.dev/)
- Chrome DevTools Lighthouse
- [WebPageTest](https://www.webpagetest.org/)

## Future Optimizations

Potential improvements:

- [ ] Service Worker for offline support
- [ ] Image CDN with edge caching
- [ ] Critical CSS extraction
- [ ] Route-based code splitting
- [ ] Prefetch links on hover
- [ ] HTTP/2 Server Push for critical assets
