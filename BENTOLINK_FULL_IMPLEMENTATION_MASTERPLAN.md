# Bentolink-Exact Redesign: Full Implementation Masterplan

## Scope

Total overhaul of `tulio-personal-website` to match Bentolink design system language exactly, while adapting Tulio-only pages and CMS surfaces.

This plan is implementation-ready and gap-free: architecture, sequence, dependencies, acceptance gates, rollback, and commit slicing.

## Mandatory Skill Alignment Used

### 1) `frontend-design` (applied)

- Use a single intentional visual direction and execute it consistently.
- Prefer distinctive, production-grade design over generic patterns.
- Keep motion meaningful and restrained; avoid noisy micro-motion.
- Build atmosphere via layered backgrounds/material depth, not flat surfaces.

### 2) `ui-ux-pro-max` (applied)

- Ran design-system generation and persisted artifacts.
- Kept useful structural guidance (layout flows, accessibility reminders, QA checklist).
- Rejected conflicting auto-suggestions that break Bentolink parity (e.g., Inter-based recommendations, unrelated product patterns).

## Skill Output Artifacts Generated

- `design-system/tulio-personal-website/MASTER.md`
- `design-system/tulio-personal-website/pages/home.md`
- `design-system/tulio-personal-website/pages/blog-index.md`
- `design-system/tulio-personal-website/pages/blog-article.md`
- `design-system/tulio-personal-website/pages/projects.md`
- `design-system/tulio-personal-website/pages/about-uses-now.md`

## Hard Constraints (Do Not Break)

- Bentolink is canonical design source.
- Keep Tulio route architecture and Sanity CMS functionality.
- Keep accessibility baseline and improve where needed.
- Preserve Astro islands strategy (hydrate only interactive components).
- Decommission monolithic style system after parity is verified.

## Canonical Decisions

- Typography canonical baseline: SF family system (Bentolink/Tulio Apple language), not generated generic substitutions.
- Color/material/shadow/motion canonical baseline: Bentolink token values and semantics.
- Interaction language canonical baseline: Bentolink hover/focus/press/easing rhythm.

## System Target Architecture

### CSS Architecture (Target)

- `src/styles/theme.css` -> thin orchestrator only.
- `src/styles/tokens/colors.css` -> canonical palette + semantic states.
- `src/styles/tokens/typography.css` -> canonical type scale and letter spacing.
- `src/styles/tokens/spacing.css` -> layout rhythm and radii scale.
- `src/styles/tokens/shadows.css` -> canonical elevation system.
- `src/styles/tokens/materials.css` -> glass/material/vibrancy layers.
- `src/styles/tokens/animations.css` -> canonical durations/easing/keyframes.
- `src/styles/motion.css` -> reusable reveal/page-transition rules only.
- Optional split if needed:
  - `src/styles/components/*.css`
  - `src/styles/routes/*.css`

### JS Architecture (Target)

- Theme: one controller path (`src/scripts/theme.ts`) with single source of truth.
- Motion: one motion orchestration layer (`src/scripts/motion.ts`) with reduced-motion branch.
- Sidebar/scroll indicators kept modular and route-safe.

## Workstreams and Execution Order

## W0 - Baseline Capture and Freeze

### Objective

Capture visual/behavioral baselines before migration.

### Tasks

1. Capture screenshots/video for all routes in dark/light at 375, 768, 1024, 1440.
2. Capture Bentolink baseline for matching surfaces.
3. Create parity checklist (visual + motion + interaction + a11y).

### Exit Criteria

- Complete before any style refactor starts.

---

## W1 - Token Canonicalization Layer

### Objective

Create canonical Bentolink-equivalent token files in Tulio without breaking runtime.

### Tasks

1. Add/normalize token files to Bentolink schema:
   - colors, typography, spacing, shadows, materials, animations.
2. Introduce alias map for old token names -> new canonical names.
3. Ensure both themes (dark/light) have complete token coverage.
4. Remove duplicate root token definitions from `theme.css` in small slices.

### Files

- `src/styles/tokens/*.css`
- `src/styles/theme.css`

### Exit Criteria

- No direct hardcoded colors in shared primitives.
- No token collisions in `:root`/`[data-theme]`.

---

## W2 - Global Shell Port (Base Layout)

### Objective

Port Bentolink shell language into Tulio base while keeping Tulio routes.

### Tasks

1. Reconcile `src/layouts/Base.astro` with Bentolink shell primitives:
   - atmospheric background layers
   - reflector treatment
   - topbar/sidebar/footer material language
2. Consolidate theme init logic to avoid duplicate controller paths.
3. Keep route link consistency and active-state logic stable.
4. Keep skip-link + keyboard nav intact.

### Files

- `src/layouts/Base.astro`
- `src/scripts/theme.ts`
- `src/scripts/sidebar.ts`
- `src/styles/theme.css`

### Exit Criteria

- Base shell visually matches Bentolink DS language.
- Navigation behavior unchanged functionally.

---

## W3 - Primitive Component Port

### Objective

Unify core primitives used across all pages.

### Tasks

1. Port card primitive language.
2. Port icon tile and symbol treatment.
3. Normalize section headers, eyebrow labels, metadata pills.
4. Normalize focus ring and pointer behavior for interactive items.

### Files

- `src/components/Card.astro`
- `src/components/IconTile.astro`
- `src/components/SFIcon.astro`
- `src/components/PhosphorIcon.astro`
- shared style files used by these components

### Exit Criteria

- All common primitives use canonical tokens only.

---

## W4 - Home Route Redesign (Bentolink parity)

### Objective

Make `/` feel like Bentolink-native while preserving Tulio-specific sections/content.

### Tasks

1. Keep section structure, re-skin each block with Bentolink language.
2. Port profile/tooling/activity/writing surface treatment.
3. Keep removed projects section removed.
4. Normalize rails, indicators, and quick nav interactions.

### Files

- `src/pages/index.astro`
- `src/components/ProfileCard.astro`
- `src/components/RecentPosts.astro`
- `src/components/PageIndicator.astro`
- `src/components/ScrollHint.astro`
- `src/components/ScrollIndicator.astro`

### Exit Criteria

- Home dark/light parity with Bentolink quality bar.

---

## W5 - Blog Index Adaptation

### Objective

Re-theme `/blog` to canonical DS while preserving filtering/content behavior.

### Tasks

1. Convert hero, filters, rails, archive, cards to canonical material/depth.
2. Keep filtering and load-more behaviors unchanged.
3. Verify no z-index conflicts with new materials.

### Files

- `src/pages/blog/index.astro`
- `src/components/ArticleCard.astro`
- `src/scripts/scroll-indicators.ts`

### Exit Criteria

- Editorial index is consistent with Bentolink DS and remains functional.

---

## W6 - Blog Article Template Adaptation

### Objective

Rebuild long-form article surface in Bentolink language.

### Tasks

1. Define reading width, typography rhythm, metadata chips, and hero media framing.
2. Re-style portable text components.
3. Keep reading progress and related posts behavior.
4. Validate code block readability in both themes.

### Files

- `src/pages/blog/[slug].astro`
- `src/components/ArticlePortableText.astro`
- `src/components/ArticleCodeBlock.astro`
- `src/components/ArticlePortableImage.astro`
- `src/components/ReadingProgress.astro`

### Exit Criteria

- Long-form readability and DS parity both pass.

---

## W7 - Category + Projects + Static Narrative Routes

### Objective

Adapt Tulio-only routes not present in Bentolink.

### Tasks

1. Category route (`/blog/category/[slug]`) with canonical list/card shells.
2. Projects route (`/projects`) with canonical card/filter/tag/status treatment.
3. Narrative routes (`/about`, `/uses`, `/now`) with consistent section/card patterns.

### Files

- `src/pages/blog/category/[slug].astro`
- `src/pages/projects.astro`
- `src/components/ProjectCard.astro`
- `src/pages/about.astro`
- `src/pages/uses.astro`
- `src/pages/now.astro`

### Exit Criteria

- No route feels like legacy DS.

---

## W8 - Studio and CMS Safety

### Objective

Ensure redesign does not break Sanity workflows.

### Tasks

1. Validate `/studio` shell isolation.
2. Validate preview/visual editing scripts remain operational.
3. Validate blog content fetch/render contracts untouched.

### Files

- `src/pages/studio/index.astro`
- `src/components/VisualEditing.astro`
- `src/scripts/visual-editing.ts`
- Sanity fetch libs used by pages

### Exit Criteria

- CMS authoring and preview are unaffected.

---

## W9 - Motion System Harmonization

### Objective

Converge all route motion to canonical timing/easing while preserving function.

### Tasks

1. Map existing motion variables to canonical animation tokens.
2. Reduce over-animation where not meaningful.
3. Enforce reduced-motion path globally.
4. Confirm sidebar/page transitions still feel natural.

### Files

- `src/styles/tokens/animations.css`
- `src/styles/motion.css`
- `src/scripts/motion.ts`

### Exit Criteria

- Motion passes UX and accessibility checks.

---

## W10 - Monolith Decommission

### Objective

Remove old style system safely.

### Tasks

1. Run usage checks for legacy selectors/tokens.
2. Delete obsolete CSS chunks from monolith.
3. Keep `theme.css` as import orchestrator and minimum global glue only.

### Files

- `src/styles/theme.css`
- any deprecated style files

### Exit Criteria

- No dead legacy style system remains.

---

## W11 - Quality Gates

### Functional Gates

- Build passes.
- Route navigation and filtering/loads pass.
- Theme toggle pass.
- Sidebar mobile pass.

### Visual Gates

- Dark/light snapshots pass for all routes at 375, 768, 1024, 1440.
- Bentolink parity checklist pass on shared surface language.

### Accessibility Gates

- Focus states visible.
- Keyboard navigation complete.
- Skip links operational.
- Contrast checks >= WCAG AA.
- `prefers-reduced-motion` respected.

### Performance Gates

- CSS size reduced from baseline.
- No major CLS regressions.
- Animation properties are transform/opacity-first.

---

## W12 - Release + Stabilization

### Tasks

1. Final cleanup pass (unused classes, orphan tokens).
2. Update root docs to reflect new architecture.
3. Tag release checkpoint.

### Exit Criteria

- Overhaul complete and maintainable.

## Dependency Graph

- W0 -> W1 -> W2 -> W3 -> W4/W5/W6/W7 (parallel by route once primitives stable) -> W8/W9 -> W10 -> W11 -> W12.

## Commit Slicing Strategy

1. `chore(ds): add canonical token/material architecture scaffolding`
2. `refactor(shell): port Base layout to bentolink language`
3. `refactor(primitives): unify card/icon/surface primitives`
4. `feat(home): apply bentolink parity to home route`
5. `feat(blog-index): port editorial list surfaces`
6. `feat(blog-article): port long-form article template`
7. `feat(routes): port category/projects/about/uses/now surfaces`
8. `refactor(motion): harmonize motion and reduced-motion`
9. `chore(css): remove monolithic legacy styles`
10. `test(qa): finalize visual/a11y/perf verification`

## Rollback Strategy

- Keep each workstream commit isolated.
- If route regression occurs, revert only route-level commit, not token/base commits.
- Never combine shell migration and monolith deletion in one commit.

## Detailed Route Acceptance Criteria

### Home

- Profile/tools/activity/writing modules share Bentolink material depth and rhythm.
- Section transitions and indicators are consistent.

### Blog Index

- Card rails and filters retain behavior and match new DS surfaces.
- No layout jump when filtering/loading.

### Blog Article

- Reading width and typography optimized for long form.
- Code/media/callout components visually coherent.

### Projects

- Cards, stacks, statuses and filters align with canonical components.

### About/Uses/Now

- Narrative pages use same shell, type rhythm, and card language.

### Studio

- Operational and visually isolated where required.

## Explicit Non-Goals

- No content strategy rewrite.
- No CMS schema refactor unless required by regression.
- No route architecture rewrite.

## Execution Checklist (No Gaps)

- [ ] W0 baseline captured.
- [ ] W1 token canonicalization done.
- [ ] W2 shell port done.
- [ ] W3 primitive components done.
- [ ] W4 home done.
- [ ] W5 blog index done.
- [ ] W6 blog article done.
- [ ] W7 category/projects/about/uses/now done.
- [ ] W8 studio/CMS validation done.
- [ ] W9 motion harmonization done.
- [ ] W10 monolith removal done.
- [ ] W11 quality gates all green.
- [ ] W12 docs/release done.

## Notes on ui-ux-pro-max Generated Outputs

The generated `design-system/tulio-personal-website/*` files are retained as auxiliary brainstorming artifacts. For implementation decisions, Bentolink parity constraints take precedence where outputs conflict with canonical Apple-inspired branding language.
