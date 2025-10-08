# Design: JavaScript to TypeScript Migration

## Context

The Tulio Personal Website is built with Astro 5, React 19, and TypeScript in strict mode. The codebase follows Apple HIG design principles with a focus on clean, maintainable code. Currently, 19 JavaScript files remain unmigrated, creating inconsistency in the type safety coverage.

### Current State
- **TypeScript Coverage**: ~95% (all .astro, .tsx, .ts files)
- **JavaScript Files**: 19 total
  - 5 production client scripts (`src/scripts/*.js`)
  - 1 public utility (`public/web-vitals.js`)
  - 1 trivial utility (`refresh.js`)
  - 3 config files (`*.config.mjs`)
  - 12 debug/fix scripts (root level)

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

## Implementation Strategy

### Phase 1: Core Scripts (Days 1-2)
1. Migrate `src/scripts/*.js` (5 files)
2. Add proper DOM types
3. Add state management types
4. Test all interactive features
5. Validate with `bun run typecheck`

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
5. **Test**:
   - TypeScript compiles (`bun run typecheck`)
   - Build succeeds (`bun run build`)
   - Runtime works (manual testing)

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
