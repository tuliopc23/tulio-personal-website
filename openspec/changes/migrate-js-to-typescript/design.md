# Design: JavaScript to TypeScript Migration

## Context

The Tulio Personal Website is built with Astro 5, React 19, and TypeScript in strict mode. The codebase follows Apple HIG design principles with a focus on clean, maintainable code. 

### Code Audit Results

After analyzing all 6 production JavaScript files (560 lines total), key findings:

**File Complexity Ratings**:
- ⭐ Simple: visual-editing.js (8 lines), scroll-indicators.js (57 lines)
- ⭐⭐ Medium: theme.js (84 lines), web-vitals.js (88 lines)
- ⭐⭐⭐ Complex: sidebar.js (132 lines), motion.js (191 lines)

**Code Quality**:
- All files use modern ES patterns (optional chaining, nullish coalescing, IIFE wrappers)
- theme.js already has JSDoc type hint: `/** @type {"light" | "dark" | null} */`
- All files demonstrate good null handling and defensive programming
- One bug found: sidebar.js line 31 uses broken `!important` inline style hack

**Migration Readiness**:
- High: Modern code patterns map well to TypeScript
- Zero dependency conflicts: All libraries have TypeScript support
- Build infrastructure ready: Astro handles `.ts` files automatically
- Estimated effort: 2-3 hours as planned

### Current State
- **TypeScript Coverage**: ~95% (all .astro, .tsx, .ts files)
- **JavaScript Files**: 6 production scripts (560 lines)
  - visual-editing.js (8 lines) - Sanity overlay loader
  - sidebar.js (132 lines) - Nav toggle, filter, backdrop
  - theme.js (84 lines) - Theme switcher with localStorage
  - motion.js (191 lines) - Page transitions, reveal animations
  - scroll-indicators.js (57 lines) - Horizontal scroll edge fades
  - web-vitals.js (88 lines) - Performance monitoring (dev only)
- **Debug Files**: 12 temporary scripts (will be removed/excluded)

### Constraints
- Must maintain functional equivalence (no behavior changes)
- Must not break existing imports or script loading
- Must pass strict TypeScript compilation
- Build time must not significantly increase
- Zero runtime overhead (TypeScript compiles to equivalent JS)

### Stakeholders
- **Developers**: Better DX with type safety and IDE support
- **Users**: No impact (output JavaScript remains the same)
- **CI/CD**: Type checking ensures code quality

## Goals / Non-Goals

### Goals
1. **Type Safety**: All client scripts have compile-time type checking
2. **Consistency**: 100% TypeScript codebase (except disposable debug files)
3. **Better DX**: Full IDE autocomplete, inline docs, refactoring support
4. **Catch Errors Early**: Prevent runtime errors through strict null checking
5. **Maintainability**: Self-documenting code with explicit types

### Non-Goals
1. **Refactoring**: No logic changes, only adding types
2. **Performance Optimization**: Not the focus (already optimal)
3. **New Features**: Purely type migration
4. **Debug Script Migration**: Debug files can be excluded/removed

## Technical Decisions

### Decision 1: Migration Strategy (Phased Approach)

**Chosen**: Migrate in phases by priority (production → utilities → config → debug)

**Why**:
- **Risk Management**: Production scripts first ensures core functionality is type-safe
- **Value Delivery**: Highest-impact files get types immediately
- **Testability**: Can validate each phase independently
- **Flexibility**: Can defer or skip debug files if needed

**Alternatives Considered**:
- **Big Bang**: Migrate all at once
  - **Pros**: Faster completion, single commit
  - **Cons**: Higher risk, harder to debug issues, all-or-nothing
- **File-by-file**: Ad-hoc migration as needed
  - **Pros**: Lowest risk per change
  - **Cons**: Slow, inconsistent, easy to forget files

### Decision 2: Type Strictness (Full Strict Mode)

**Chosen**: Use strict TypeScript with no `any`, proper null checking

**Why**:
- **Project Standard**: tsconfig.json already extends "astro/tsconfigs/strict"
- **Consistency**: Match existing codebase standards
- **Maximum Safety**: Catch all potential runtime errors
- **No Technical Debt**: Start with best practices

**Alternatives Considered**:
- **Gradual Typing**: Use `any` temporarily, tighten later
  - **Pros**: Faster initial migration
  - **Cons**: Defeats purpose, creates debt, inconsistent with project
- **Loose Mode**: Disable strict null checks
  - **Pros**: Easier to migrate
  - **Cons**: Misses common bug sources, inconsistent

### Decision 3: Config File Format (TypeScript)

**Chosen**: Migrate `.mjs` config files to `.ts`

**Why**:
- **Type Safety**: Config objects benefit from type checking
- **IDE Support**: Autocomplete for config options
- **Consistency**: All config files in same language
- **Tooling Support**: Astro, ESLint, Prettier all support TypeScript configs

**Alternatives Considered**:
- **Keep as .mjs**: Leave config files as JavaScript
  - **Pros**: Less work, already working
  - **Cons**: Inconsistent, no type checking for configs
  - **Why Not**: Small effort for consistency gain

### Decision 4: Debug Files Handling (Exclude or Remove)

**Chosen**: Document for exclusion or removal (not migrate)

**Why**:
- **Temporary Nature**: Debug files are not production code
- **Low Value**: Rarely used, disposable
- **Effort vs Benefit**: Not worth migration time
- **Cleanup Opportunity**: Good chance to remove obsolete files

**Alternatives Considered**:
- **Migrate All**: Include debug files in TypeScript migration
  - **Pros**: 100% completion
  - **Cons**: Wasted effort on temporary code
- **Separate Debug Folder**: Move to `debug/` and gitignore
  - **Pros**: Organized, preserved if needed
  - **Cons**: Extra complexity, may never be used

### Decision 5: Script Loading (No Changes)

**Chosen**: Keep existing script loading mechanism (Astro handles)

**Why**:
- **Works Already**: Astro automatically compiles `.ts` imports
- **Zero Config**: No additional build configuration needed
- **Proven**: TypeScript support is core Astro feature

**Implementation**:
```astro
<!-- Before: -->
<script src="../scripts/theme.js"></script>

<!-- After: -->
<script src="../scripts/theme.ts"></script>
```
Astro's Vite integration handles the rest.

### Decision 6: Biome for Linting and Formatting (Strict Rules)

**Chosen**: Enforce tight Biome linting and formatting rules for all TypeScript files

**Why**:
- **Project Standard**: Biome is already configured and used in the project
- **Consistency**: Single tool for both linting and formatting
- **Performance**: Biome is faster than ESLint + Prettier combination
- **Auto-fix**: Most issues can be fixed automatically
- **Type Safety**: Biome rules enforce TypeScript best practices

**Alternatives Considered**:
- **Keep ESLint + Prettier**: Use existing tools
  - **Pros**: Already configured
  - **Cons**: Slower, more complex, project is moving to Biome
  - **Why Not**: Project has `biome.json` and uses Biome in scripts
- **No Linting**: Just TypeScript compiler
  - **Pros**: Faster, simpler
  - **Cons**: Misses code quality issues, inconsistent style
  - **Why Not**: Code quality matters

**Key Biome Rules Enforced**:

*Correctness:*
- `noUnusedVariables: warn` - No unused variables
- `noUnusedImports: warn` - No unused imports
- `noUndeclaredVariables: error` - All variables must be declared

*Suspicious:*
- `noExplicitAny: warn` - Avoid `any` type
- `noDebugger: error` - No debugger statements
- `noDoubleEquals: error` - Use `===` instead of `==`
- `noConsole: off` - Allow console.log in scripts (for debugging)

*Style:*
- `useConst: warn` - Prefer `const` over `let`
- `useImportType: warn` - Use `import type` for type-only imports
- `useExportType: warn` - Use `export type` for type-only exports
- `noInferrableTypes: warn` - Omit obvious type annotations

*Formatting:*
- Double quotes for strings
- Semicolons required
- Trailing commas where valid
- 2-space indentation
- 100-character line width
- Arrow functions always use parentheses

## Type Patterns

### Pattern 1: DOM Types (Explicit Casting)

```typescript
// Before (JavaScript)
const toggle = document.querySelector(".topbar__menu");
toggle?.addEventListener("click", handler);

// After (TypeScript)
const toggle = document.querySelector<HTMLButtonElement>(".topbar__menu");
toggle?.addEventListener("click", handler);
```

**Benefits**: Type-safe access to element properties, catches wrong element types

### Pattern 2: Custom Types (String Literals)

```typescript
// Theme types
type Theme = "light" | "dark";
type ThemeStorage = Theme | null;

// State types
type PageState = "entering" | "ready" | "leaving";
type GlassState = "rest" | "scrolled";
type SidebarState = "open" | "closed";

// Benefits: Autocomplete, prevents typos, self-documenting
```

### Pattern 3: Event Handlers (Proper Types)

```typescript
// Before (JavaScript)
element.addEventListener("click", (event) => {
  const target = event.currentTarget;
  // ...
});

// After (TypeScript)
element.addEventListener("click", (event: MouseEvent) => {
  const target = event.currentTarget as HTMLElement;
  // ...
});
```

### Pattern 4: Dataset Access (Type-safe)

```typescript
// Before (JavaScript)
body.dataset.pageState = "ready";

// After (TypeScript)
interface BodyDataset extends DOMStringMap {
  pageState?: PageState;
  glassState?: GlassState;
  sidebarState?: SidebarState;
}

const body = document.body as HTMLElement & {
  dataset: BodyDataset;
};
body.dataset.pageState = "ready"; // Type-safe!
```

### Pattern 5: Nullable DOM (Strict Null Checks)

```typescript
// Before (JavaScript - assumes exists)
const filter = document.querySelector("#filter");
filter.addEventListener("input", handler);

// After (TypeScript - handles null)
const filter = document.querySelector<HTMLInputElement>("#filter");
filter?.addEventListener("input", handler);
// OR
if (filter) {
  filter.addEventListener("input", handler);
}
```

### Pattern 6: Type-only Imports (Biome Rule)

```typescript
// Biome enforces import type for type-only imports
import type { Theme, PageState } from "./types";
import { applyTheme } from "./theme-utils";

// NOT:
import { Theme, PageState, applyTheme } from "./theme-utils"; // ❌

// Export types properly
export type { Theme, PageState };
export { applyTheme };
```

### Pattern 7: Const over Let (Biome Rule)

```typescript
// Before (JavaScript or loose TypeScript)
let theme = "dark"; // ❌ Biome warning if never reassigned
theme = "light";

// After (TypeScript with Biome)
const theme = "dark"; // ✅ If not reassigned
let mutableTheme = "dark"; // ✅ If reassigned later
mutableTheme = "light";
```

### Pattern 8: Avoid Explicit Any (Biome Rule)

```typescript
// BAD - Biome warns
function handleEvent(event: any) { // ❌
  console.log(event);
}

// GOOD - Proper typing
function handleEvent(event: Event) { // ✅
  console.log(event);
}

// GOOD - Use unknown if truly unknown
function handleData(data: unknown) { // ✅
  if (typeof data === "string") {
    console.log(data.toUpperCase());
  }
}
```

## Real Code Examples from Audit

### Example 1: theme.js - Already Has JSDoc Types

**Current JavaScript** (line 15):
```javascript
/** @type {"light" | "dark" | null} */
let stored = readStoredTheme();
```

**Migrated TypeScript**:
```typescript
type Theme = "light" | "dark";
type ThemeStorage = Theme | null;

let stored: ThemeStorage = readStoredTheme();
```

### Example 2: sidebar.js - Bug Fix Required

**Current JavaScript** (line 31) - **BROKEN**:
```javascript
// Never hide the site navigation group
if (groupEl.classList.contains("sidebar__group--site")) {
  groupEl.style.display = "block !important"; // ❌ Won't work!
  return;
}
```

**Fixed TypeScript**:
```typescript
// Never hide the site navigation group
if (groupEl.classList.contains("sidebar__group--site")) {
  groupEl.style.setProperty("display", "block", "important"); // ✅ Works!
  return;
}
```

**Explanation**: Setting `style.display = "block !important"` doesn't work because the `!important` is treated as part of the string value, not as a priority flag. Must use `setProperty()` with the third parameter.

### Example 3: motion.js - Complex State Types

**Current JavaScript** (lines 23-30, 62, 71):
```javascript
// Implicit state strings scattered throughout
body.dataset.glassState = "rest";
body.dataset.glassState = scrolled ? "scrolled" : "rest";
body.dataset.pageState = "ready";
body.dataset.pageState = "entering";
body.dataset.pageState = "leaving";
```

**Migrated TypeScript**:
```typescript
type PageState = "entering" | "ready" | "leaving";
type GlassState = "rest" | "scrolled";

interface BodyDataset extends DOMStringMap {
  pageState?: PageState;
  glassState?: GlassState;
  sidebarState?: "open" | "closed"; // Also used by sidebar.js
}

const body = document.body as HTMLElement & { dataset: BodyDataset };

// Now type-safe assignments
body.dataset.glassState = "rest"; // ✅
body.dataset.pageState = "entering"; // ✅
// body.dataset.pageState = "invalid"; // ❌ Type error!
```

### Example 4: visual-editing.js - Dynamic Imports

**Current JavaScript**:
```javascript
if (window.location !== window.parent.location) {
  const loadOverlays = async () => {
    const { enableOverlays } = await import("@sanity/visual-editing");
    enableOverlays({ zIndex: 999999 });
  };
  loadOverlays();
}
```

**Migrated TypeScript**:
```typescript
if (window.location !== window.parent.location) {
  const loadOverlays = async (): Promise<void> => {
    const { enableOverlays } = await import("@sanity/visual-editing");
    enableOverlays({ zIndex: 999999 });
  };
  void loadOverlays();
}
```

**Improvements**:
- Explicit `Promise<void>` return type
- `void` operator to indicate intentional fire-and-forget

### Example 5: web-vitals.js - PerformanceObserver Types

**Current JavaScript** (lines 11-18):
```javascript
const lcpObserver = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  const lastEntry = entries[entries.length - 1];
  console.log(
    `%c⚡ LCP: ${Math.round(lastEntry.renderTime || lastEntry.loadTime)}ms`,
    "color: #0ea5e9; font-weight: bold"
  );
});
```

**Migrated TypeScript**:
```typescript
const lcpObserver = new PerformanceObserver((list: PerformanceObserverEntryList) => {
  const entries = list.getEntries();
  const lastEntry = entries[entries.length - 1] as PerformancePaintTiming;
  console.log(
    `%c⚡ LCP: ${Math.round(lastEntry.renderTime || lastEntry.loadTime)}ms`,
    "color: #0ea5e9; font-weight: bold",
  );
});
lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
```

### Example 6: sidebar.js - Complex Event Handlers

**Current JavaScript** (lines 55-58):
```javascript
filter?.addEventListener("input", (event) => {
  const target = event.target;
  apply(target?.value ?? null);
});
```

**Migrated TypeScript**:
```typescript
filter?.addEventListener("input", (event: Event) => {
  const target = event.target as HTMLInputElement;
  apply(target?.value ?? null);
});

// Or with proper type narrowing
filter?.addEventListener("input", (event: Event) => {
  if (!(event.target instanceof HTMLInputElement)) return;
  apply(event.target.value ?? null);
});
```

## Implementation Strategy

### Phase 1: Core Scripts (Prioritized by Complexity)

**Day 1 - Easy Wins (Est: 45 min)**
1. Migrate `visual-editing.js` (8 lines) - Simplest, good warm-up
2. Migrate `scroll-indicators.js` (57 lines) - Clean, straightforward
3. Test both files, ensure Biome passes

**Day 1 - Medium Complexity (Est: 1 hour)**
4. Migrate `theme.js` (84 lines) - Already has JSDoc types, easy conversion
5. Migrate `web-vitals.js` (88 lines) - Structured, clear patterns
6. Test both files, validate type safety

**Day 2 - Complex Files (Est: 1.5 hours)**
7. Migrate `sidebar.js` (132 lines) - **Fix the `!important` bug while migrating**
8. Migrate `motion.js` (191 lines) - Most complex, comprehensive state management
9. Thorough testing of interactive features

### Phase 2: Utilities & Config (Day 2)
1. Migrate `public/web-vitals.js`
2. Migrate 3 config files
3. Remove `refresh.js`
4. Test build and linting

### Phase 3: Cleanup (Day 2)
1. Decide on debug files (likely remove)
2. Update documentation
3. Final validation

### Phase 4: Testing (Day 2-3)
1. Run full test suite
2. Manual browser testing
3. CI validation
4. Production preview

## Migration Checklist Per File

For each `.js` → `.ts` file:

1. **Rename**: Change extension to `.ts`
2. **Add Types**: 
   - Function parameters
   - Return types
   - Variables (where not inferred)
3. **Type DOM**:
   - Add generic types to querySelector
   - Type event parameters
   - Handle nullability
4. **Custom Types**:
   - Define string literal unions
   - Create interfaces for complex objects
   - Type dataset access
5. **Follow Biome Rules**:
   - Use `import type` for type-only imports
   - Use `const` instead of `let` where possible
   - Avoid explicit `any` types
   - Remove unused variables and imports
   - Use strict equality (`===`)
6. **Format**:
   - Run `biome check --write .` to auto-fix
   - Verify with `biome lint .`
7. **Test**:
   - TypeScript compiles (`bun run typecheck`)
   - Build succeeds (`bun run build`)
   - Runtime works (manual testing)
   - Biome passes (`bun run check`)

## Risks & Mitigations

### Risk 1: Build Time Increase
**Impact**: Low
**Likelihood**: Low
**Mitigation**: TypeScript compilation is fast, Astro already does it for other files
**Monitoring**: Track build times before/after

### Risk 2: Subtle Type Errors
**Impact**: Medium
**Likelihood**: Low
**Mitigation**: Comprehensive testing, strict mode catches issues early
**Rollback**: Simple git revert

### Risk 3: Third-party Type Definitions
**Impact**: Low
**Likelihood**: Very Low
**Mitigation**: All libraries already have TypeScript support (Sanity, Astro, etc.)
**Fallback**: Add `@types/*` packages if needed

### Risk 4: Developer Onboarding
**Impact**: Very Low
**Likelihood**: N/A
**Mitigation**: Team already uses TypeScript, no new concepts
**Documentation**: Update project.md with script patterns

## Testing Strategy

### Type Checking
```bash
bun run typecheck  # Must pass with 0 errors
```

### Build Validation
```bash
bun run build      # Must succeed
ls -lh dist/       # Check output size
```

### Biome Validation
```bash
biome lint .           # Linting must pass
biome format .         # Formatting check
biome check --write .  # Fix all auto-fixable issues
bun run check          # Full check (Biome + typecheck + build)
bun run check:ci       # CI check (stricter, no auto-fix)
```

**Key Biome Checks**:
- No unused variables or imports
- No explicit `any` types
- `import type` used for type-only imports
- `const` used where applicable
- Strict equality operators (`===`)
- Consistent formatting (quotes, semicolons, indentation)

### Runtime Testing
- **Theme Switcher**: Toggle light/dark, check persistence
- **Sidebar**: Open/close, filter, keyboard shortcuts (Escape, /)
- **Motion**: Page transitions, reveal animations, reduced motion
- **Scroll Indicators**: Article carousel, card rail edge fades
- **Visual Editing**: Sanity overlays (if enabled)
- **Web Vitals**: Logging in dev mode

### Browser Matrix
- Chrome/Chromium (primary)
- Safari (Apple focus)
- Firefox
- Mobile Safari (iOS)
- Chrome Android

## Success Criteria

1. ✅ All production scripts are `.ts` with strict types
2. ✅ Zero TypeScript errors (`bun run typecheck` passes)
3. ✅ Build succeeds (`bun run build` passes)
4. ✅ All manual tests pass
5. ✅ No runtime regressions
6. ✅ CI pipeline passes
7. ✅ Code is self-documenting with explicit types
8. ✅ Biome linting passes with 0 errors (`biome lint .`)
9. ✅ Biome formatting is consistent (`biome format .`)
10. ✅ Full Biome check passes (`bun run check`)

## Future Considerations

### Potential Enhancements (Out of Scope)
- Add JSDoc comments for complex type interactions
- Create shared type library for common DOM patterns
- Add unit tests for script logic (separate effort)
- Consider extracting reusable functions to utilities

### Maintenance
- Keep TypeScript version updated
- Monitor for new script additions (ensure they're `.ts`)
- Update types if DOM APIs change

## Resources

- **TypeScript Handbook**: https://www.typescriptlang.org/docs/handbook/
- **Astro TypeScript Guide**: https://docs.astro.build/en/guides/typescript/
- **DOM TypeScript Types**: Built into TypeScript (`lib.dom.d.ts`)
- **Project TypeScript Config**: `tsconfig.json`

## Open Questions

1. **Debug Files**: Keep or delete? → Recommend delete (obsolete)
2. **Type Documentation**: Add JSDoc? → Only if complex, prefer self-documenting types
3. **Shared Types**: Create types library? → Not needed yet, can add later if duplication emerges

## Summary

This migration is low-risk, high-value work that brings the codebase to 100% TypeScript coverage. The phased approach ensures we can validate each step and roll back if needed. With the existing TypeScript infrastructure, this is mostly mechanical work with significant long-term benefits for maintainability and developer experience.
