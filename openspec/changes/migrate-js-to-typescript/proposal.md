# Migrate JavaScript to TypeScript

**Status:** draft
**Date:** 2025-01-29
**Author:** AI Agent

## Why

The project has **6 production JavaScript files** totaling 560 lines of code that lack type safety. Code audit reveals these scripts are well-structured with modern patterns (optional chaining, nullish coalescing, IIFE wrappers) but would benefit significantly from TypeScript's compile-time checks.

**Key Findings from Audit**:
- **theme.js** already has JSDoc type hints showing TypeScript readiness
- **sidebar.js** has a bug: inline `!important` style hack (line 31) that won't work
- **motion.js** is the most complex with state management and IntersectionObserver
- All files use modern ES patterns that TypeScript handles well
- No major refactoring needed, just add types

The codebase already uses TypeScript with strict mode for all Astro/React components. These remaining JavaScript files create inconsistency and miss opportunities to catch bugs during development. The project's TypeScript infrastructure is already configured, making this a natural next step.

## What Changes

Migrate all production JavaScript files to TypeScript with strict typing:

### Production Scripts (Priority 1 - 560 lines total)
- `src/scripts/visual-editing.js` → `src/scripts/visual-editing.ts`
- `src/scripts/sidebar.js` → `src/scripts/sidebar.ts`
- `src/scripts/theme.js` → `src/scripts/theme.ts`
- `src/scripts/motion.js` → `src/scripts/motion.ts`
- `src/scripts/scroll-indicators.js` → `src/scripts/scroll-indicators.ts`

### Utilities (Priority 2)
- `public/web-vitals.js` → `public/web-vitals.ts`
- `refresh.js` → Remove (simple debug utility, not needed)

### Config Files (Priority 3)
- `astro.config.mjs` → `astro.config.ts`
- `eslint.config.mjs` → `eslint.config.ts`
- `prettier.config.mjs` → `prettier.config.ts`

### Debug Files (Priority 4 - Optional)
- Keep as `.js` or remove entirely (temporary debugging scripts)
- Document in `.gitignore` if retained

### Changes
- Add proper TypeScript types for DOM APIs, events, and browser globals
- Add type annotations for function parameters and return types
- Add interfaces for complex objects (theme state, sidebar state, page state, glass state)
- Fix bug in sidebar.js: `style.display = "block !important"` → `style.setProperty("display", "block", "important")`
- Ensure strict null checking is satisfied
- Use `import type` for type-only imports (Biome rule)
- Use `const` instead of `let` where variables aren't reassigned (Biome rule)
- Update Astro config to handle TypeScript in scripts
- Ensure build process compiles TypeScript scripts correctly

## Impact

### Affected Areas
- **Scripts**: All client-side scripts in `src/scripts/`
- **Build Process**: Astro build configuration for TypeScript compilation
- **Type Checking**: CI pipeline includes all scripts in type checking
- **IDE Support**: Better autocomplete and error detection during development

### Breaking Changes
None. Output JavaScript remains functionally identical. Scripts are loaded the same way in HTML.

### Benefits
- **Type Safety**: Catch errors at compile time instead of runtime
- **Better DX**: IDE autocomplete, inline documentation, refactoring support
- **Consistency**: 100% TypeScript codebase (except temporary debug files)
- **Maintainability**: Self-documenting code with explicit types
- **Fewer Bugs**: Strict null checking prevents common runtime errors

### Risks
- **Minimal**: TypeScript compilation is already part of build process
- **Effort**: ~2-3 hours for migration and testing
- **Learning Curve**: None, team already using TypeScript elsewhere
