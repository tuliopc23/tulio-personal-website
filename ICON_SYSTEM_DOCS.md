# Personal Icon System Documentation

## Overview

A reusable icon component system following Apple Human Interface Guidelines (HIG) with 4-layer shadow composition, theme-aware cross-fading, and spring-based animations.

## Design Principles

### Apple HIG Compliance

Based on **Tahoe 26** design system:
- **4-layer shadow composition** for realistic elevation
- **Spring physics** for natural motion (cubic-bezier(0.22, 0.94, 0.38, 1.12))
- **Dynamic Type sizing** aligned with HIG typography scale
- **Accessibility** with focus rings and reduced motion support

### Shadow System

#### Light Mode (4 layers)
```css
/* Contact shadow */
drop-shadow(0 0.5px 1px rgba(0, 0, 0, 0.08))
/* Ambient shadow */
drop-shadow(0 1px 2px rgba(0, 0, 0, 0.06))
/* Diffuse shadow */
drop-shadow(0 4px 8px rgba(0, 0, 0, 0.04))
/* Key light shadow */
drop-shadow(0 8px 16px rgba(0, 0, 0, 0.03))
```

#### Dark Mode (inverted)
```css
/* White glow instead of black shadow */
drop-shadow(0 0.5px 1px rgba(255, 255, 255, 0.08))
drop-shadow(0 1px 2px rgba(255, 255, 255, 0.06))
drop-shadow(0 4px 8px rgba(255, 255, 255, 0.04))
drop-shadow(0 8px 16px rgba(255, 255, 255, 0.03))
```

#### Hover State (enhanced elevation)
```css
drop-shadow(0 1px 1.5px rgba(0, 0, 0, 0.10))
drop-shadow(0 2px 4px rgba(0, 0, 0, 0.08))
drop-shadow(0 8px 16px rgba(0, 0, 0, 0.06))
drop-shadow(0 16px 32px rgba(0, 0, 0, 0.05))
```

## File Structure

```
src/
├── components/
│   └── icons/
│       ├── PersonalIcon.tsx       # React/TSX component
│       └── personal-icon.html     # Vanilla HTML version
└── styles/
    └── icons.css                  # Utility classes & components

public/
└── icons/
    ├── IconLightMode.svg          # ⚠️ Replace with clean vector
    └── IconDarkMode.svg           # ⚠️ Replace with clean vector
```

## Usage

### React/TSX Version

```tsx
import { PersonalIcon } from "@/components/icons/PersonalIcon";

// In ProfileCard (40px)
<PersonalIcon size="profile" onClick={handleThemeToggle} />

// In Navbar (32px)
<PersonalIcon size="nav" onClick={handleThemeToggle} />

// In Footer (24px)
<PersonalIcon size="footer" onClick={handleThemeToggle} />

// Custom size
<PersonalIcon size={48} onClick={handleThemeToggle} />

// With additional classes
<PersonalIcon 
  size="nav" 
  className="mr-2"
  onClick={handleThemeToggle} 
/>
```

### Vanilla HTML/CSS Version

```html
<!-- Import the CSS utilities -->
<link rel="stylesheet" href="/styles/icons.css">

<!-- Use in your HTML -->
<button
  class="personal-icon"
  data-size="nav"
  aria-label="Toggle theme"
  onclick="toggleTheme()"
>
  <img src="/icons/IconLightMode.svg" class="personal-icon-light" aria-hidden="true" />
  <img src="/icons/IconDarkMode.svg" class="personal-icon-dark" aria-hidden="true" />
</button>
```

### CSS Utility Classes

```html
<!-- Using utility classes directly -->
<button class="icon-nav icon-interactive">
  <img src="/icons/IconLightMode.svg" class="icon-elevated icon-light-mode" />
  <img src="/icons/IconDarkMode.svg" class="icon-elevated-dark icon-dark-mode" />
</button>
```

## Size Specifications

Following Apple HIG typography scale:

| Context | Size | Usage |
|---------|------|-------|
| `profile` | 40px | ProfileCard header, matches tech stack icons |
| `nav` | 32px | Navbar/topbar, matches sidebar icon tiles |
| `footer` | 24px | Footer branding area |

## Interactive States

### Scale Transforms
- **Resting**: `scale(1)`
- **Hover**: `scale(1.03)` - subtle lift
- **Active**: `scale(0.96)` - press-down feedback

### Transitions
- **Duration**: 200ms (hover), 100ms (active)
- **Easing**: `cubic-bezier(0.22, 0.94, 0.38, 1.12)` (spring responsive)

### Reduced Motion
Automatically disables animations when `prefers-reduced-motion: reduce` is detected.

## Theme Switching

### Cross-fade Behavior
- **Duration**: 300ms
- **Easing**: `cubic-bezier(0.2, 0.68, 0.32, 1)` (ease-out)
- **Method**: Opacity transition between stacked images

### Implementation
```css
/* Light mode visible in light theme */
.icon-light-mode {
  opacity: 1;
}
.dark .icon-light-mode {
  opacity: 0;
}

/* Dark mode visible in dark theme */
.icon-dark-mode {
  opacity: 0;
}
.dark .icon-dark-mode {
  opacity: 1;
}
```

## Accessibility

### ARIA Attributes
```html
<button aria-label="Toggle theme" type="button">
  <img aria-hidden="true" />  <!-- Decorative, hidden from screen readers -->
</button>
```

### Focus Ring
HIG-compliant 2-layer focus ring:
```css
focus-visible:ring-2
focus-visible:ring-ring
focus-visible:ring-offset-2
focus-visible:ring-offset-background
```

### Keyboard Navigation
- **Tab**: Focus the button
- **Enter/Space**: Activate theme toggle
- **Visible focus ring** only on keyboard interaction

## Integration Examples

### ProfileCard Integration
```tsx
<div className="flex items-center gap-3">
  <PersonalIcon size="profile" onClick={toggleTheme} />
  <h1 className="text-2xl font-medium">Your Name</h1>
</div>
```

### Navbar Integration
```tsx
<nav className="flex items-center gap-4">
  <PersonalIcon size="nav" onClick={toggleTheme} />
  <span className="font-medium">Brand Name</span>
</nav>
```

### Footer Integration
```tsx
<footer className="flex items-center gap-2 text-sm">
  <PersonalIcon size="footer" onClick={toggleTheme} />
  <span>© 2025 Your Name</span>
</footer>
```

## Critical: SVG Assets

### Current Issue
⚠️ **The current SVG files contain embedded PNG bitmaps with backgrounds**

### What's Needed
Clean vector SVG files without:
- Embedded bitmap images
- Background rectangles
- Square frames

### How to Create
1. **Export from design tool** (Figma, Illustrator):
   - Select artwork only (not artboard)
   - Remove background layers
   - Export as SVG with "Outline Strokes"
   - Disable "Include Images"

2. **Expected file size**: <10KB each (currently 916KB and 1.1MB)

3. **Expected structure**:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <path d="M..." fill="currentColor"/>
</svg>
```

### Testing Checklist
After replacing SVGs:
- [ ] File sizes under 10KB
- [ ] No visible backgrounds
- [ ] Clean rounded corners only
- [ ] Crisp at all sizes
- [ ] Smooth theme transitions
- [ ] Hover effects work
- [ ] Focus ring visible on keyboard nav
- [ ] Works with reduced motion enabled

## Performance Considerations

### Optimizations
- **No JavaScript** for basic display (CSS-only theme switching)
- **Minimal repaints** (opacity transitions only)
- **Hardware acceleration** (transform animations)
- **Single layout layer** (absolute positioning)

### Bundle Size
- **TSX Component**: ~1.5KB (minified + gzipped)
- **CSS Utilities**: ~800 bytes (minified + gzipped)
- **Total overhead**: <2.5KB

## Browser Support

### Minimum Requirements
- CSS `drop-shadow()` filter
- CSS transitions
- CSS custom properties (--variables)
- `prefers-reduced-motion` media query

### Supported Browsers
- Chrome/Edge 51+
- Firefox 52+
- Safari 9.1+
- iOS Safari 9.3+

## Maintenance

### Updating Sizes
Edit size constants in:
```tsx
const sizeMap = {
  profile: 40,  // Change here
  nav: 32,
  footer: 24,
};
```

Or in CSS:
```css
.icon-profile { width: 40px; height: 40px; }
.icon-nav { width: 32px; height: 32px; }
.icon-footer { width: 24px; height: 24px; }
```

### Customizing Shadows
Adjust shadow layers in `icons.css`:
```css
.icon-elevated {
  filter: drop-shadow(...)  /* Contact shadow */
    drop-shadow(...)         /* Ambient shadow */
    drop-shadow(...)         /* Diffuse shadow */
    drop-shadow(...);        /* Key light shadow */
}
```

### Adding New Contexts
```tsx
// In sizeMap
const sizeMap = {
  profile: 40,
  nav: 32,
  footer: 24,
  hero: 64,  // Add new size
};
```

```css
/* In icons.css */
.icon-hero {
  width: 64px;
  height: 64px;
}
```

## Design Tokens

Extracted from your CSS system:

```css
--color-ring: var(--ring);                    /* Focus ring color */
--color-background: var(--background);        /* Offset background */
--radius: 0.625rem;                          /* Border radius */
--font-weight-medium: 500;                   /* Button text weight */
```

## Next Steps

1. ✅ **Component created** with HIG-compliant shadows
2. ✅ **CSS utilities created** for reusability
3. ✅ **Documentation complete**
4. ⚠️ **Waiting for clean SVG assets** - see `ICON_FIX_NEEDED.md`
5. 🔄 **Integration** - ready to use once SVGs are replaced

## References

- [Apple HIG Typography](https://developer.apple.com/design/human-interface-guidelines/typography)
- [Tahoe 26 Design System](https://developer.apple.com/design/human-interface-guidelines/)
- [SF Symbols](https://developer.apple.com/design/human-interface-guidelines/sf-symbols)
- [Dynamic Type](https://developer.apple.com/design/human-interface-guidelines/accessibility#Supporting-Dynamic-Type)
