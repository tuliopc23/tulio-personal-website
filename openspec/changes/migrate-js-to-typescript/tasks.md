# Implementation Tasks

## 1. Preparation
- [x] Audit all JavaScript files and categorize by priority
- [x] Review existing TypeScript configuration
- [ ] Create this change proposal
- [ ] Validate proposal with `openspec validate migrate-js-to-typescript --strict`

## 2. Phase 1: Production Scripts (Priority 1 - Ordered by Complexity)

### 2.1 Migrate visual-editing.js (⭐ SIMPLEST - 8 lines)
- [ ] Rename `src/scripts/visual-editing.js` → `visual-editing.ts`
- [ ] Add `Promise<void>` return type to async function
- [ ] Add Window type extensions for iframe detection
- [ ] Use `void` operator for fire-and-forget async call
- [ ] Run `biome check --write .` to auto-fix formatting
- [ ] Run `biome lint .` to verify no linting errors
- [ ] Test in development mode with Sanity Studio
- [ ] Verify visual editing overlays still work

### 2.2 Migrate scroll-indicators.js (⭐ EASY - 57 lines)
- [ ] Rename `src/scripts/scroll-indicators.js` → `scroll-indicators.ts`
- [ ] Type scroll event handlers
- [ ] Add types for edge fade state calculations (boolean)
- [ ] Type querySelector results with proper HTMLElement types
- [ ] Type destructured properties: `scrollLeft`, `scrollWidth`, `clientWidth`
- [ ] Run `biome check --write .` to auto-fix formatting
- [ ] Run `biome lint .` to verify compliance
- [ ] Test article carousel edge fades
- [ ] Test card rail scroll indicators

### 2.3 Migrate theme.js (⭐⭐ MEDIUM - 84 lines)
- [ ] Rename `src/scripts/theme.js` → `theme.ts`
- [ ] Replace JSDoc with TypeScript: `type Theme = "light" | "dark"`
- [ ] Add `type ThemeStorage = Theme | null`
- [ ] Type `readStoredTheme()` return value
- [ ] Type `applyTheme()` parameters and return
- [ ] Type localStorage access with error handling
- [ ] Add types for media query matching (`MediaQueryListEvent`)
- [ ] Type HTMLInputElement for checkbox toggle (already uses `instanceof`)
- [ ] Use `const` instead of `let` where possible (Biome rule)
- [ ] Run `biome check --write .` to auto-fix formatting
- [ ] Run `biome lint .` to verify compliance
- [ ] Test theme switching in browser
- [ ] Test localStorage persistence
- [ ] Test light/dark mode classes on root element
- [ ] Verify console logging still works

### 2.4 Migrate web-vitals.js (⭐⭐ MEDIUM - 88 lines)
- [ ] Rename `public/web-vitals.js` → `web-vitals.ts`
- [ ] Add types for PerformanceObserver entries
- [ ] Type `PerformanceObserverEntryList` in callbacks
- [ ] Type performance navigation timing (`PerformanceNavigationTiming`)
- [ ] Type cast entries: `as PerformancePaintTiming`, etc.
- [ ] Add interface for custom performance metrics if needed
- [ ] Run `biome check --write .` to auto-fix formatting
- [ ] Run `biome lint .` to verify compliance
- [ ] Test performance logging in development
- [ ] Ensure it only runs on localhost

### 2.5 Migrate sidebar.js (⭐⭐⭐ COMPLEX - 132 lines, HAS BUG)
- [ ] Rename `src/scripts/sidebar.js` → `sidebar.ts`
- [ ] **FIX BUG**: Line 31 - Change `style.display = "block !important"` to `style.setProperty("display", "block", "important")`
- [ ] Add type: `type SidebarState = "open" | "closed"`
- [ ] Type all DOM query selectors with proper HTMLElement types:
  - [ ] `body` - HTMLBodyElement
  - [ ] `filter` - HTMLInputElement
  - [ ] `links` - HTMLAnchorElement[]
  - [ ] `groups` - HTMLElement[]
  - [ ] `sidebar` - HTMLElement
  - [ ] `toggle` - HTMLButtonElement
  - [ ] `backdrop` - HTMLDivElement (dynamically created)
- [ ] Type `apply()` function parameter as `string | null`
- [ ] Add types for event handlers:
  - [ ] `InputEvent` for filter input
  - [ ] `MouseEvent` for click events
  - [ ] `KeyboardEvent` for keydown events
- [ ] Type dataset access with proper string literal types
- [ ] Use `import type` for type-only imports (Biome rule)
- [ ] Ensure no unused variables or imports (Biome rule)
- [ ] Run `biome check --write .` to auto-fix formatting
- [ ] Run `biome lint .` to verify compliance
- [ ] Test mobile navigation toggle
- [ ] Test filter functionality (verify site group always visible)
- [ ] Test keyboard shortcuts (Escape, /)
- [ ] Test backdrop creation and removal

### 2.6 Migrate motion.js (⭐⭐⭐ MOST COMPLEX - 191 lines)
- [ ] Rename `src/scripts/motion.js` → `motion.ts`
- [ ] Add types for page state: `type PageState = "entering" | "ready" | "leaving"`
- [ ] Add types for glass state: `type GlassState = "rest" | "scrolled"`
- [ ] Create interface for BodyDataset:
  ```typescript
  interface BodyDataset extends DOMStringMap {
    pageState?: PageState;
    glassState?: GlassState;
  }
  ```
- [ ] Type IntersectionObserver callbacks (`IntersectionObserverEntry[]`)
- [ ] Add interface for reveal element dataset properties:
  ```typescript
  interface RevealDataset extends DOMStringMap {
    reveal?: string;
    revealDelay?: string;
    revealOrder?: string;
    revealGroup?: string;
  }
  ```
- [ ] Type Map for reveal groups: `Map<string, number>`
- [ ] Type all function returns (most are `void`)
- [ ] Type event handlers (scroll, load, change)
- [ ] Use strict equality (`===`) instead of `==` (Biome rule)
- [ ] Remove any unused variables or imports (Biome rule)
- [ ] Use `const` for observer and linkHandler where appropriate
- [ ] Run `biome check --write .` to auto-fix formatting
- [ ] Run `biome lint .` to verify compliance
- [ ] Test page transitions (entering → ready → leaving)
- [ ] Test reveal animations with IntersectionObserver
- [ ] Test reduced motion preference
- [ ] Test glass morphism state changes on scroll
- [ ] Test internal link interception

## 3. Phase 2: Utilities (Priority 2)

### 3.1 Migrate web-vitals.js
- [ ] Rename `public/web-vitals.js` → `web-vitals.ts`
- [ ] Add types for PerformanceObserver entries
- [ ] Type performance navigation timing
- [ ] Add interface for custom performance metrics
- [ ] Test performance logging in development
- [ ] Ensure it only runs on localhost

### 3.2 Handle refresh.js
- [ ] Remove `refresh.js` (trivial 2-line debug utility)
- [ ] Update documentation if referenced anywhere

## 4. Phase 3: Config Files (Priority 3)

### 4.1 Migrate astro.config.mjs
- [ ] Rename `astro.config.mjs` → `astro.config.ts`
- [ ] Import types from Astro: `import type { AstroUserConfig } from "astro/config"`
- [ ] Type environment variables properly
- [ ] Type Sanity configuration object
- [ ] Verify build still works
- [ ] Verify dev server still works
- [ ] Test Sanity integration

### 4.2 Migrate eslint.config.mjs
- [ ] Rename `eslint.config.mjs` → `eslint.config.ts`
- [ ] Import ESLint types: `import type { Linter } from "eslint"`
- [ ] Type configuration arrays properly
- [ ] Verify linting still works: `bun run lint`

### 4.3 Migrate prettier.config.mjs
- [ ] Rename `prettier.config.mjs` → `prettier.config.ts`
- [ ] Import Prettier types: `import type { Options } from "prettier"`
- [ ] Type configuration object
- [ ] Verify formatting still works: `bun run format:check`

## 5. Phase 4: Debug Files (Priority 4 - Optional)

### 5.1 Decision on debug files
- [ ] Review all 12 debug files to determine if still needed
- [ ] Option A: Delete all (likely temporary/obsolete)
- [ ] Option B: Migrate essential ones to TypeScript
- [ ] Option C: Move to separate `debug/` folder and add to `.gitignore`
- [ ] Document decision in `openspec/project.md`

### 5.2 Handle debug files
- [ ] If keeping: Add to `.gitignore` or separate `debug/` folder
- [ ] If migrating: Follow same pattern as production scripts
- [ ] If deleting: Remove all debug-*.js and fix-sidebar-group.js files

## 6. TypeScript Configuration Updates

### 6.1 Update tsconfig.json
- [ ] Ensure `include` array covers all script locations
- [ ] Verify `src/scripts/**/*.ts` is included
- [ ] Verify `public/**/*.ts` is included (if web-vitals.ts)
- [ ] Verify `*.config.ts` is included
- [ ] Test: `bun run typecheck` passes

### 6.2 Update Astro build configuration
- [ ] Verify Astro handles `.ts` script imports
- [ ] Test script tags in Astro components: `<script src="../scripts/theme.ts">`
- [ ] Ensure Vite compiles TypeScript scripts correctly
- [ ] Check bundled output in `dist/`

## 7. Testing & Validation

### 7.1 Type Checking
- [ ] Run `bun run typecheck` - must pass with 0 errors
- [ ] Fix any type errors that surface
- [ ] Ensure strict mode compliance

### 7.2 Build Testing
- [ ] Run `bun run build` - must succeed
- [ ] Check `dist/` for compiled scripts
- [ ] Verify scripts are properly bundled

### 7.3 Runtime Testing
- [ ] Test in development: `bun run dev`
- [ ] Test theme switcher (light/dark mode)
- [ ] Test sidebar navigation (open/close, filter, keyboard shortcuts)
- [ ] Test page transitions and reveal animations
- [ ] Test scroll indicators on carousels and card rails
- [ ] Test reduced motion preference
- [ ] Test Sanity visual editing (if enabled)
- [ ] Test web vitals logging in localhost

### 7.4 Browser Testing
- [ ] Test in Chrome/Chromium
- [ ] Test in Safari (Apple ecosystem focus)
- [ ] Test in Firefox
- [ ] Test mobile responsive (iOS Safari, Chrome Android)

### 7.5 Biome Linting & Formatting
- [ ] Run `biome lint .` or `bun run lint` - must pass with 0 errors
- [ ] Run `biome format .` or `bun run format:check` - must pass
- [ ] Run `biome check .` or `bun run biome:check` - must pass
- [ ] Verify no unused variables (Biome correctness.noUnusedVariables)
- [ ] Verify no unused imports (Biome correctness.noUnusedImports)
- [ ] Verify no explicit `any` types (Biome suspicious.noExplicitAny)
- [ ] Verify `import type` used for type-only imports (Biome style.useImportType)
- [ ] Verify `const` used where applicable (Biome style.useConst)
- [ ] Run full check: `bun run check` - must pass
- [ ] Run CI check: `bun run check:ci` - must pass

## 8. Documentation

### 8.1 Update project documentation
- [ ] Update `openspec/project.md` if script patterns change
- [ ] Document TypeScript patterns for client scripts
- [ ] Note that debug files are excluded or removed

### 8.2 Update README
- [ ] Update tech stack section if needed
- [ ] Confirm "100% TypeScript" claim is accurate

## 9. Completion

### 9.1 Final validation
- [ ] Run `openspec validate migrate-js-to-typescript --strict`
- [ ] Review all checklist items are completed
- [ ] Confirm no regressions in functionality

### 9.2 Archive preparation
- [ ] Mark all tasks as `[x]` completed
- [ ] Update proposal status to "completed"
- [ ] Ready for archival after deployment

## Notes

- **Estimated Time**: 2-3 hours for full migration
- **Risk Level**: Low (TypeScript already in use, no functional changes)
- **Dependencies**: None (all tools already installed)
- **Rollback Plan**: Git revert (no breaking changes to output)
