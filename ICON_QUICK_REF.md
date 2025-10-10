# Personal Icon - Quick Reference

## 🚀 Quick Start

### TSX/React
```tsx
import { PersonalIcon } from "@/components/icons/PersonalIcon";

<PersonalIcon size="nav" onClick={toggleTheme} />
```

### HTML/CSS
```html
<button class="personal-icon" data-size="nav" onclick="toggleTheme()">
  <img src="/icons/IconLightMode.svg" class="personal-icon-light" aria-hidden="true" />
  <img src="/icons/IconDarkMode.svg" class="personal-icon-dark" aria-hidden="true" />
</button>
```

## 📏 Sizes

| Size | Pixels | Context |
|------|--------|---------|
| `profile` | 40px | ProfileCard header |
| `nav` | 32px | Navbar/Topbar |
| `footer` | 24px | Footer area |

## 🎨 Shadow System (HIG Tahoe 26)

### Light Mode
```css
drop-shadow(0 0.5px 1px rgba(0,0,0,0.08))   /* Contact */
drop-shadow(0 1px 2px rgba(0,0,0,0.06))     /* Ambient */
drop-shadow(0 4px 8px rgba(0,0,0,0.04))     /* Diffuse */
drop-shadow(0 8px 16px rgba(0,0,0,0.03))    /* Key light */
```

### Hover (Enhanced)
```css
drop-shadow(0 1px 1.5px rgba(0,0,0,0.10))
drop-shadow(0 2px 4px rgba(0,0,0,0.08))
drop-shadow(0 8px 16px rgba(0,0,0,0.06))
drop-shadow(0 16px 32px rgba(0,0,0,0.05))
```

## 🎯 Interactive States

- **Hover**: `scale(1.03)` + enhanced shadow
- **Active**: `scale(0.96)` (press feedback)
- **Duration**: 200ms (hover), 100ms (active)
- **Easing**: `cubic-bezier(0.22, 0.94, 0.38, 1.12)` (spring)

## 🌗 Theme Switching

- **Cross-fade**: 300ms opacity transition
- **Light → Dark**: Light icon fades out, dark fades in
- **No layout shift**: Absolute positioning, stacked images

## ♿ Accessibility

- ✅ Focus ring on keyboard navigation
- ✅ `aria-label="Toggle theme"`
- ✅ Images are `aria-hidden="true"` (decorative)
- ✅ Reduced motion support

## ⚠️ Critical: SVG Files

**Current Problem**: Files contain embedded PNG bitmaps (916KB, 1.1MB)

**Need**: Clean vector SVGs (<10KB each) with:
- ✅ Pure `<path>` elements (no embedded images)
- ✅ No background rectangles
- ✅ Rounded corners only

See `ICON_FIX_NEEDED.md` for export instructions.

## 📦 Files

```
src/components/icons/PersonalIcon.tsx  # React component
src/styles/icons.css                   # Utility classes
ICON_SYSTEM_DOCS.md                    # Full documentation
ICON_FIX_NEEDED.md                     # SVG replacement guide
```

## 🔗 Integration

### ProfileCard
```tsx
<div className="flex items-center gap-3">
  <PersonalIcon size="profile" />
  <h1>Name</h1>
</div>
```

### Navbar
```tsx
<nav className="flex items-center gap-4">
  <PersonalIcon size="nav" />
  <span>Brand</span>
</nav>
```

### Footer
```tsx
<footer className="flex items-center gap-2">
  <PersonalIcon size="footer" />
  <span>© 2025</span>
</footer>
```

## 🛠️ Customization

### Change Sizes
```tsx
// In PersonalIcon.tsx
const sizeMap = {
  profile: 40,  // Edit here
  nav: 32,
  footer: 24,
};
```

### Add New Size
```tsx
const sizeMap = {
  // ...existing
  hero: 64,  // New!
};
```

```css
/* In icons.css */
.icon-hero {
  width: 64px;
  height: 64px;
}
```

## 📊 Performance

- **Bundle impact**: <2.5KB (minified + gzipped)
- **Runtime cost**: Minimal (CSS-only transitions)
- **Repaints**: Opacity changes only (GPU accelerated)

## 🌐 Browser Support

- Chrome/Edge 51+
- Firefox 52+
- Safari 9.1+
- iOS Safari 9.3+

---

**Status**: ✅ Component ready | ⚠️ Waiting for clean SVG files

For full documentation, see `ICON_SYSTEM_DOCS.md`
