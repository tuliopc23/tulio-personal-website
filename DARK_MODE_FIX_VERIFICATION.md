# Dark Mode Fix Verification

## CSS Rules Currently in theme.css

### 1. Card CTAs - Blue Accents (Lines 1835-1852)

```css
/* Dark mode: bright blue accent */
[data-theme="dark"] .card__cta {
  color: var(--blue) !important;
}

[data-theme="dark"] .card:hover .card__cta,
[data-theme="dark"] .card:focus-visible .card__cta {
  color: color-mix(in oklch, var(--blue) 100%, white 15%) !important;
}

/* Light mode: standard blue */
[data-theme="light"] .card__cta {
  color: var(--blue) !important;
}

[data-theme="light"] .card:hover .card__cta,
[data-theme="light"] .card:focus-visible .card__cta {
  color: color-mix(in oklch, var(--blue) 85%, black 15%) !important;
}
```

### 2. Project Card CTAs (Lines 2251-2268)

```css
/* Dark mode: bright blue accent */
[data-theme="dark"] .projectCard__cta {
  color: var(--blue) !important;
}

[data-theme="dark"] .projectCard:hover .projectCard__cta,
[data-theme="dark"] .projectCard:focus-visible .projectCard__cta {
  color: color-mix(in oklch, var(--blue) 100%, white 15%) !important;
}

/* Light mode: standard blue */
[data-theme="light"] .projectCard__cta {
  color: var(--blue) !important;
}

[data-theme="light"] .projectCard:hover .projectCard__cta,
[data-theme="light"] .projectCard:focus-visible .projectCard__cta {
  color: color-mix(in oklch, var(--blue) 85%, black 15%) !important;
}
```

### 3. Article Card CTAs - "Read article" links (Lines 3684-3701)

```css
/* Dark mode: brighter blue accent - higher specificity */
[data-theme="dark"] .articleCard__cta {
  color: var(--blue) !important;
}

[data-theme="dark"] .articleCard:hover .articleCard__cta,
[data-theme="dark"] .articleCard:focus-within .articleCard__cta {
  color: color-mix(in oklch, var(--blue) 100%, white 15%) !important;
}

/* Light mode: standard blue link color */
[data-theme="light"] .articleCard__cta {
  color: var(--blue) !important;
}

[data-theme="light"] .articleCard:hover .articleCard__cta,
[data-theme="light"] .articleCard:focus-within .articleCard__cta {
  color: color-mix(in oklch, var(--blue) 85%, black 15%) !important;
}
```

### 4. Blog Hero Title - Dark Mode Visibility (Lines 3192-3201)

```css
/* Dark mode: ensure title is visible - use solid gradient without transparency issues */
[data-theme="dark"] .blogHero__title {
  background: linear-gradient(
    130deg,
    var(--text),
    color-mix(in oklch, var(--text) 90%, var(--indigo) 10%)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

## TO FIX THE ISSUE:

1. **Stop dev server** (already done above)
2. **Clear browser cache completely:**
   - Chrome/Edge: Cmd+Shift+Delete (Mac) or Ctrl+Shift+Delete (Windows)
   - Select "Cached images and files"
   - Click "Clear data"
3. **Restart dev server:**
   ```bash
   npm run dev
   ```
4. **Hard refresh browser:**
   - Mac: Cmd+Shift+R
   - Windows: Ctrl+Shift+F5
5. **Check browser DevTools:**
   - Right-click on a "Read article" link
   - Select "Inspect"
   - Check the "Computed" tab to see if `color: #0a84ff` (blue) is applied
   - If not, check the "Styles" tab to see what's overriding it

## Expected Results:

- **Dark mode "Read article" links**: Bright blue (#0a84ff)
- **Dark mode "Read article" links on hover**: Even brighter blue
- **Blog hero title in dark mode**: White to indigo gradient (VISIBLE)
- **All interactive elements**: Blue accents in both light and dark mode

## If still not working:

Check if there are inline styles or other CSS files overriding these rules. The `!important` declarations should override everything except other `!important` rules.
