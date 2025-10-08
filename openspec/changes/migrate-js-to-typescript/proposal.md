# Migrate JavaScript to TypeScript

**Status:** draft
**Date:** 2025-01-29
**Author:** AI Agent

## Why

The project currently has 19 JavaScript files (5 production scripts, 12 debug utilities, 2 config utilities) that lack type safety. The codebase already uses TypeScript with strict mode enabled for Astro components, React components, and utilities. Migrating remaining JavaScript files to TypeScript will provide compile-time type checking, better IDE support, and catch potential runtime errors during development.

The project already has full TypeScript infrastructure configured (tsconfig.json with strict mode, type checking in CI), making this a natural next step for consistency and improved maintainability.

## What Changes

Migrate all JavaScript files to TypeScript with strict typing:

### Production Scripts (Priority 1)
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
- Add interfaces for complex objects (e.g., theme state, sidebar state)
- Ensure strict null checking is satisfied
- Update import statements where needed
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
