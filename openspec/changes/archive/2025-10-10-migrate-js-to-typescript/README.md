# JavaScript to TypeScript Migration

**Quick Links:**

- 📋 [SUMMARY.md](./SUMMARY.md) - Executive overview and current state
- 📝 [proposal.md](./proposal.md) - Why, what changes, and impact
- ✅ [tasks.md](./tasks.md) - Detailed implementation checklist
- 🏗️ [design.md](./design.md) - Technical decisions and patterns
- 📖 [specs/client-scripts/spec.md](./specs/client-scripts/spec.md) - Requirements and scenarios

## Quick Overview

Migrate 19 JavaScript files to TypeScript for 100% type safety coverage.

### Files to Migrate

**Priority 1 - Production Scripts (5 files)**

- `src/scripts/visual-editing.js` → `.ts`
- `src/scripts/sidebar.js` → `.ts`
- `src/scripts/theme.js` → `.ts`
- `src/scripts/motion.js` → `.ts`
- `src/scripts/scroll-indicators.js` → `.ts`

**Priority 2 - Utilities (2 files)**

- `public/web-vitals.js` → `.ts`
- `refresh.js` → Remove (obsolete)

**Priority 3 - Config Files (3 files)**

- `astro.config.mjs` → `astro.config.ts`
- `eslint.config.mjs` → `eslint.config.ts`
- `prettier.config.mjs` → `prettier.config.ts`

**Priority 4 - Debug Files (12 files)**

- Recommend: Exclude or remove (temporary/obsolete code)

## Validation

```bash
# Validate proposal
openspec validate migrate-js-to-typescript --strict

# Result: ✅ Valid
```

## Implementation

See [tasks.md](./tasks.md) for the complete step-by-step checklist.

**Estimated Time:** 2-3 hours
**Risk Level:** Low
**Breaking Changes:** None

## Key Type Patterns

### String Literal Unions

```typescript
type Theme = "light" | "dark";
type PageState = "entering" | "ready" | "leaving";
```

### DOM Element Types

```typescript
const btn = document.querySelector<HTMLButtonElement>(".btn");
```

### Strict Null Checks

```typescript
element?.addEventListener("click", handler);
```

### Biome Rules

```typescript
// Use import type for types
import type { Theme } from "./types";

// Use const over let
const theme = "dark"; // ✅

// Avoid explicit any
function handle(event: Event) {} // ✅
```

See [design.md](./design.md) for complete type patterns and examples.

## Benefits

- ✅ Compile-time type checking
- ✅ Better IDE autocomplete and refactoring
- ✅ Catch errors before runtime
- ✅ Self-documenting code
- ✅ 100% TypeScript coverage
- ✅ Tight Biome linting rules (no unused vars, no `any`, etc.)
- ✅ Consistent Biome formatting (quotes, semicolons, indentation)
- ✅ Fast tooling with Biome

## Questions?

Refer to:

1. [SUMMARY.md](./SUMMARY.md) for overview
2. [design.md](./design.md) for technical details
3. [tasks.md](./tasks.md) for implementation steps
