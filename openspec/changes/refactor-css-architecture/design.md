# CSS Architecture Refactor Design

## Context

Current CSS is functional but difficult to maintain:
- 5,150-line monolithic theme.css
- 750+ hardcoded rgba() colors
- 202 theme rules scattered throughout
- Recent ProfileCard bug due to scoped vs global confusion

**Constraint:** Zero visual changes allowed. Pixel-perfect preservation required.

## Goals

- Improve maintainability without changing output
- Make theme updates easier and safer
- Establish clear patterns for future development
- Preserve all visual details (colors, shadows, animations)

## Non-Goals

- Visual redesign or color changes
- Performance optimization (unless free)
- Adding new features or components
- Changing existing component behavior

## Decisions

### Decision 1: Module Structure
**Choice:** Split by concern (tokens, base, components, themes)

**Alternatives considered:**
- Split by page (home.css, blog.css) - rejected, too much duplication
- Keep monolithic - rejected, doesn't solve maintainability
- Split by component only - rejected, themes still scattered

**Rationale:** Separation by concern makes it clear where to find/update styles. Tokens layer enables consistency without duplication.

### Decision 2: CSS Variables for Repeated Values
**Choice:** Extract to variables, preserve exact values

**Alternatives considered:**
- Semantic naming (--primary-bg) - rejected, loses specificity
- Keep hardcoded - rejected, doesn't improve maintainability
- Use preprocessor - rejected, adds build complexity

**Rationale:** Variables enable consistency and easier updates while preserving exact current values. Direct CSS variables (no preprocessor) keeps build simple.

### Decision 3: Theme Consolidation
**Choice:** Separate dark.css and light.css files

**Alternatives considered:**
- Keep inline with components - rejected, current bug source
- Single themes.css - rejected, harder to work on one theme
- CSS layers - rejected, browser support concerns

**Rationale:** Separate files make theme-specific changes obvious and prevent scoped component issues we just fixed.

### Decision 4: Migration Strategy
**Choice:** Incremental with visual regression testing

**Steps:**
1. Create new structure alongside old
2. Extract tokens first (colors, shadows)
3. Migrate components one at a time
4. Visual regression test after each component
5. Remove old theme.css only when complete

**Rationale:** Incremental approach reduces risk. Visual regression catches any unintended changes immediately.

## Implementation Details

### Token Extraction Pattern
```css
/* BEFORE (theme.css) */
.profileCard {
  background: rgba(29, 29, 32, 1);
  border: 1px solid rgba(255, 255, 255, 0.106);
}

/* AFTER (tokens/colors.css) */
:root {
  --color-dark-surface: rgba(29, 29, 32, 1);
  --color-dark-border: rgba(255, 255, 255, 0.106);
}

/* AFTER (themes/dark.css) */
[data-theme="dark"] .profileCard {
  background: var(--color-dark-surface);
  border: 1px solid var(--color-dark-border);
}
```

### Shadow System Pattern
```css
/* tokens/shadows.css */
:root {
  /* 4-layer elevation system - exact current values */
  --shadow-card: 
    0 1px 2px rgba(0, 0, 0, 0.06),
    0 2px 4px rgba(0, 0, 0, 0.04),
    0 4px 8px rgba(0, 0, 0, 0.03),
    0 8px 16px rgba(0, 0, 0, 0.02);
  
  --shadow-card-hover:
    0 2px 4px rgba(0, 0, 0, 0.08),
    0 4px 8px rgba(0, 0, 0, 0.06),
    0 8px 16px rgba(0, 0, 0, 0.05),
    0 16px 32px rgba(0, 0, 0, 0.04);
}
```

### Import Structure
```css
/* theme.css becomes orchestrator */
@import './tokens/colors.css';
@import './tokens/shadows.css';
@import './tokens/spacing.css';
@import './tokens/typography.css';

@import './base/reset.css';
@import './base/layout.css';

@import './components/cards.css';
@import './components/navigation.css';
@import './components/hero.css';
@import './components/article.css';

@import './themes/dark.css';
@import './themes/light.css';

@import './motion.css';
```

## Risks / Trade-offs

### Risk: Accidental visual changes
**Mitigation:** 
- Visual regression screenshots before/after
- Test every page in both themes
- Verify shadows, colors, animations unchanged
- Use exact same rgba() values in variables

### Risk: Import order issues
**Mitigation:**
- Document import order requirements
- Test in production build (not just dev)
- Themes import last to ensure overrides work

### Risk: Increased file count
**Trade-off:** More files but easier to navigate
- Current: 1 file, 5,150 lines, hard to find anything
- After: ~15 files, clear organization, easy to locate

### Risk: CSS variable browser support
**Mitigation:** Already using 399 CSS variables successfully

## Migration Plan

### Phase 1: Setup (no changes to output)
1. Create new directory structure
2. Set up import orchestration in theme.css
3. Verify build still works

### Phase 2: Extract Tokens
1. Create colors.css with all 750+ values
2. Create shadows.css with all shadow systems
3. Don't replace usages yet - just define variables
4. Verify build, no visual changes

### Phase 3: Migrate Components (one at a time)
1. Cards → components/cards.css
2. Navigation → components/navigation.css
3. Hero → components/hero.css
4. Article → components/article.css
5. After each: visual regression test

### Phase 4: Consolidate Themes
1. Extract all `[data-theme="dark"]` → themes/dark.css
2. Extract all `[data-theme="light"]` → themes/light.css
3. Visual regression test both themes

### Phase 5: Replace Hardcoded Values
1. Replace colors with variables
2. Replace shadows with variables
3. Visual regression test after each batch

### Phase 6: Cleanup
1. Remove old theme.css content
2. Update documentation
3. Final visual regression test

## Rollback Plan

If visual regressions found:
1. Git revert to previous commit
2. Identify which component caused issue
3. Fix in isolation
4. Re-apply incrementally

## Open Questions

None - approach is clear and low-risk with incremental migration.
