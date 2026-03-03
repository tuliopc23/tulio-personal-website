# Bentolink Parity Elevation Audit + Implementation Plan (Enhanced)

Date: 2026-03-03

Repos cross-referenced:
- Visual source: `/Users/tuliopinheirocunha/Developer/Bentolink-bio`
- Target: `/Users/tuliopinheirocunha/Developer/tulio-personal-website`

## 1) Executive Summary
The target repo is not just missing polish; it has architectural drift from Bentolink in core UI primitives.

Key finding:
- Design tokens are strong in target, but Bentolink parity is blocked by component-level divergence and mixed icon systems.

High-impact blockers:
1. Home/Profile primitives differ (`ProfileCard`, `IconTile`, widget composition).
2. Writing CTA pattern in target is simplified vs Bentolink chip-CTA language.
3. Iconography is mixed (`SFIcon` + `PhosphorIcon` + asset icons) while requested direction is outlined icons globally.
4. `Uses` page is still live and referenced in route/nav/sitemap/styles.
5. Blog/article shells are high quality but not consistently in the same material depth grammar as Bentolink cards.

## 2) Additional Deep Findings (New Investigation)

## 2.1 Architecture drift is significant
Observed via direct diffs:
- `src/components/ProfileCard.astro` differs heavily between repos in structure, data model, and class system.
- `src/components/IconTile.astro` in target uses `BrandIcon`/`SFIcon` symbol system, while Bentolink version uses stronger tile-centric icon framing.
- `src/pages/index.astro` diverged from Bentolink layout model (target introduced extra sections like Stack and swapped GitHub implementation).
- `src/styles/theme.css` is now a much larger monolith in target (thousands of lines), making parity edits riskier if done by broad search/replace.

Implication:
- Parity should be done with controlled component migration, not global CSS surgery.

## 2.2 "Flatness" is primarily implementation, not token shortage
- Token files (`materials.css`, `shadows.css`) are already robust.
- The “too flat” perception comes from how components apply those tokens (surface stacking, highlights, edge contrast, CTA affordance, icon tile emboss).

## 2.3 Global icon inconsistency is confirmed
Current target counts:
- `SFIcon` usage occurrences: 25
- `Phosphor`/`ph` usage occurrences: 11

Implication:
- Icon migration requires a compatibility strategy to avoid breaking semantic mapping and accessibility labels.

## 2.4 `Uses` page removal scope is larger than route deletion
Current references matched in target repo:
- `src/pages/uses.astro`
- `src/layouts/Base.astro` (top nav + sidebar/footer links)
- `src/pages/sitemap.xml.ts` (static routes include `/uses/`)
- `src/styles/theme.css` (`.uses__*` blocks)

Total matched references (`href="/uses"|/uses/|uses__`): 22

## 2.5 Social extension constraints (GitHub + Mastodon)
- GitHub URL provided and straightforward.
- Mastodon handle provided as `@tuliocunhadev` but no instance URL was provided.
- No Mastodon icon asset currently identified in target icon directories.

Implication:
- Plan must include Mastodon canonical URL confirmation + icon asset pipeline.

## 2.6 Home writing CTA parity gap is concrete
- Target `FeatureWritingWidget.astro` CTA is a basic pill (`Read`).
- Bentolink writing cards use stronger metadata chips and CTA chip with icon.

Implication:
- Porting Bentolink CTA language is a discrete, low-risk, high-impact change.

## 3) Refined Strategy (Recommended)

Use a 2-track migration model:

Track A: Primitive parity first (lowest risk, highest leverage)
- ProfileCard
- IconTile
- Writing card CTA language
- Icon utility semantics

Track B: Surface harmonization second
- Blog index cards
- Blog article shell + portable blocks
- Sanity authoring guidance alignment

Do not:
- Attempt a full raw merge of Bentolink `theme.css` into target monolith.
- Replace all icon usage in one shot without compatibility adapter.

## 4) Detailed Work Plan

## Phase 0: Pre-flight and baseline locking
1. Create visual baselines (desktop + mobile):
   - `/`
   - `/blog/`
   - one `/blog/[slug]/`
2. Record computed CSS snapshots for target components:
   - `.profileCard`
   - `.profileCard__contact`
   - `.profileCard__socialCard`
   - `.feature-writing-widget__cta`
   - `.articleCard__cta`
3. Save parity checklist with measurable targets (see section 6).

## Phase 1: Home primitive parity
1. ProfileCard parity
   - Migrate Bentolink visual grammar (surface stack + internal card relation) into target `src/components/ProfileCard.astro`.
   - Keep current data fields but enforce Bentolink spacing and depth rhythm.
2. Contact chip parity
   - Rebuild contact tiles to blue-tinted glass behavior with stronger internal highlights and edge contrast.
3. Social grid parity
   - Expand to 6 social tiles.
   - Add:
     - GitHub: `https://github.com/tuliopc23`
     - Mastodon: pending canonical instance URL from handle `@tuliocunhadev`
4. IconTile parity
   - Align icon tile dimensions, border treatment, and glow behavior with Bentolink's stronger tile presence.

## Phase 2: Writing widget parity
1. Replace simplified CTA with Bentolink chip-style CTA (icon + chip group).
2. Ensure metadata chips match Bentolink hierarchy (calendar/read-time/CTA).
3. Preserve existing Astro data binding while porting visual language.

## Phase 3: Global iconography unification (outlined icons)
1. Define one canonical UI icon source:
   - Phosphor outline for all non-brand/system icons.
2. Introduce adapter strategy:
   - Keep `SFIcon` only where there is no mapped Phosphor equivalent or where required for legacy fallback.
   - Prefer replacing direct `SFIcon` usage in nav/breadcrumb/footer/article meta with `PhosphorIcon` mappings.
3. Create explicit icon mapping table (old -> new) and migrate page-by-page:
   - Home
   - Blog index
   - Blog article
   - About
   - Projects
   - Now
4. Add/normalize Mastodon icon asset style to match outlined icon system.

## Phase 4: Blog index and article-reader parity
1. Blog index (`src/pages/blog/index.astro`, `src/components/ArticleCard.astro`)
   - Harmonize card shells and CTA posture to match home card depth language.
2. Article page (`src/pages/blog/[slug].astro`)
   - Tighten material hierarchy around:
     - header shell
     - metadata strip
     - body container
     - related cards
3. Portable blocks (`ArticlePortableText`, `ArticlePortableImage`, code/callout blocks)
   - Ensure consistent border radius, surface tint, and shadow tiering.

## Phase 5: Sanity schema/editor fidelity
1. Schema guidance polish
   - Update field descriptions in `src/sanity/schemaTypes/post.ts` and `seo.ts` to enforce editorial constraints that match UI cards and reader design.
2. Studio structure clarity
   - Improve labels/order in `sanity.config.ts` for content workflow coherence.
3. Design-aware editorial constraints
   - Guidance on summary/hook length, hero image ratio, and title cadence to preserve frontend fidelity.

## Phase 6: Remove Uses completely
1. Delete `src/pages/uses.astro`.
2. Remove all `/uses` links from `src/layouts/Base.astro`.
3. Remove `/uses/` from `src/pages/sitemap.xml.ts`.
4. Remove `.uses__*` styles from `src/styles/theme.css`.
5. Verify zero references remain via grep.

## Phase 7: Verification and quality gates
1. Static checks:
   - `bun run lint`
   - `bun run typecheck`
   - `bun run build`
2. Regression checks:
   - route sanity for `/`, `/blog/`, `/blog/[slug]/`, `/about/`, `/projects/`, `/now/`
   - no 404s from removed `/uses/` links
3. Visual QA matrix:
   - light + dark
   - desktop + mobile
   - hover/focus/active states
4. Content QA:
   - article metadata chips, CTA consistency, and icon stroke harmony.

## 5) Task Board (Execution-ready)

P0 (must-do first)
1. Home ProfileCard/Contact/Social parity.
2. Writing widget CTA parity.
3. Add GitHub and Mastodon social tiles (with canonical Mastodon URL).
4. Remove Uses route + navigation + sitemap + CSS leftovers.

P1 (high priority)
1. Global icon unification with explicit mapping table.
2. Blog index card parity.
3. Blog article shell + portable block material parity.

P2 (stabilization)
1. Sanity schema/editor fidelity improvements.
2. Cleanup dead icon code paths and compatibility fallbacks.
3. Post-merge polish and consistency pass.

## 6) Definition of Done (Measurable)
Home parity
- Profile card depth stack visually matches Bentolink at rest and hover.
- Contact chips have tinted-glass contrast and embossed feel (not flat pills).
- Social grid is 6 tiles with consistent spacing and equal card weight.

CTA parity
- Writing cards use metadata-chip + icon CTA pattern (not plain text pill).
- CTA visual hierarchy is clearly stronger than metadata chips.

Icon parity
- Outlined icon style is consistent across all page shells and content cards.
- No mixed icon language in the same component context.

Blog/article parity
- Blog cards and article reader use same material family as home cards.
- No readability regressions (contrast and line length remain safe).

Removal parity
- `/uses/` route removed.
- Zero `/uses` references in nav, sitemap, styles, or internal links.

## 7) Risks + Mitigations (Refined)
Risk: Monolithic `theme.css` edits cause collateral regressions.
- Mitigation: component-scoped edits first; isolate global token edits to minimal diffs.

Risk: Icon migration breaks semantics/accessibility.
- Mitigation: explicit icon mapping table + aria-label review during migration.

Risk: Mastodon URL ambiguity causes broken social link.
- Mitigation: require canonical Mastodon instance URL before final merge.

Risk: Blog parity work overfits to home and hurts content readability.
- Mitigation: enforce reader-first constraints (contrast, line-height, max width).

## 8) Explicit File Checklist
Home and primitives
- `src/components/ProfileCard.astro`
- `src/components/IconTile.astro`
- `src/components/DockLink.astro`
- `src/components/FeatureWritingWidget.astro`
- `src/pages/index.astro`

Icons and global shell
- `src/components/PhosphorIcon.astro`
- `src/components/SFIcon.astro` (deprecation/compatibility path)
- `src/layouts/Base.astro`
- `src/components/Breadcrumbs.astro`
- `src/components/Footer.astro`
- `src/components/Card.astro`
- `src/components/ProjectCard.astro`
- `src/components/ScrollToTop.astro`

Blog and reader
- `src/pages/blog/index.astro`
- `src/components/ArticleCard.astro`
- `src/pages/blog/[slug].astro`
- `src/components/ArticlePortableText.astro`
- `src/components/ArticlePortableImage.astro`

Sanity
- `sanity.config.ts`
- `src/sanity/schemaTypes/post.ts`
- `src/sanity/schemaTypes/seo.ts`

Uses removal
- `src/pages/uses.astro` (delete)
- `src/layouts/Base.astro`
- `src/pages/sitemap.xml.ts`
- `src/styles/theme.css`

## 9) Open Inputs Needed Before Implementation
1. Mastodon canonical URL for `@tuliocunhadev` (instance/domain required).
2. Preference on icon migration strictness:
   - Strict: eliminate `SFIcon` from UI pages.
   - Hybrid: keep `SFIcon` only where no equivalent exists.

## 10) Suggested Execution Order (Final)
1. Home primitives and social expansion.
2. Writing CTA parity.
3. Uses removal.
4. Global icon unification.
5. Blog + article parity.
6. Sanity schema/editor fidelity.
7. Final QA and regression checks.

---

Heuristic guidance used from `ui-ux-pro-max`:
- Keep hierarchy explicit, emphasize premium depth through layered surfaces, avoid decorative noise, and preserve accessibility/focus clarity.

## 11) Motion Parity Guide (Exact, No-Code Execution Map)

This section is the exact guide for replicating Bentolink high-fidelity elevation motion across the whole website.

## 11.1 Motion Objective
Replicate Bentolink’s interaction language where nearly every interactive surface has layered feedback:
- hover lift
- scale response
- depth shadow escalation
- tile/icon micro-lift
- pointer-driven parallax on selected cards
- consistent easing timing

Target scope:
- Home, Blog index, Blog article, About, Projects, Now
- profile cards, widget cards, article cards, icon tiles, social/contact chips, dock/tool cards

## 11.2 Motion Source of Truth (Bentolink)
Reference implementation files:
- `/Users/tuliopinheirocunha/Developer/Bentolink-bio/src/styles/motion.css`
- `/Users/tuliopinheirocunha/Developer/Bentolink-bio/src/scripts/motion.ts`
- `/Users/tuliopinheirocunha/Developer/Bentolink-bio/src/styles/feature-writing-widget.css`
- `/Users/tuliopinheirocunha/Developer/Bentolink-bio/src/styles/theme.css` (`.hover-elevate` utility)
- `/Users/tuliopinheirocunha/Developer/Bentolink-bio/src/components/Card.astro`
- `/Users/tuliopinheirocunha/Developer/Bentolink-bio/src/components/DockLink.astro`
- `/Users/tuliopinheirocunha/Developer/Bentolink-bio/src/components/FeatureWritingWidget.tsx` (pointer parallax logic)

## 11.3 Target Files to Touch for Motion
Primary:
- `src/styles/theme.css`
- `src/styles/motion.css`
- `src/scripts/motion.ts`

Component-level wiring:
- `src/components/ProfileCard.astro`
- `src/components/IconTile.astro`
- `src/components/FeatureWritingWidget.astro`
- `src/components/Card.astro`
- `src/components/DockLink.astro`
- `src/components/ArticleCard.astro`
- `src/components/ProjectCard.astro`
- `src/pages/index.astro`
- `src/pages/blog/index.astro`
- `src/pages/blog/[slug].astro`

## 11.4 Motion Contract (Global Primitive)
Create one canonical motion utility contract and apply everywhere.

Required utility states:
- Rest: `--hover-translate: 0`, `--hover-scale: 1`, standard shadow.
- Hover/focus-within/focus-visible:
  - `--hover-translate: var(--hover-elevate-translate)`
  - `--hover-scale: var(--hover-elevate-scale)`
  - stronger shadow + border
- Active:
  - slight press-down scale (`0.985` to `0.992` depending on component)

Required transition stack:
- `transform`: spring curve
- `box-shadow`: smooth out curve
- `border-color`: smooth out curve
- `background-color`: smooth out curve

Required transform composition order:
- translateY -> scale -> optional rotateX/rotateY (when parallax enabled)

## 11.5 Timing and Easing Standardization
Use one timing family across components:
- Enter/hover: `var(--motion-duration-spring-sm)` + `var(--spring-smooth)`
- Color/shadow/border: `var(--motion-duration-sm)` + `var(--motion-ease-out)`
- Active press: `var(--motion-duration-instant)`

Do not mix arbitrary easing per component unless intentionally branded.

## 11.6 Parallax Layers (Where It Is Allowed)
Enable pointer parallax only on premium surfaces, not on every chip:

Tier A (full parallax allowed):
- home writing cards
- featured article cards
- primary profile/media card shells

Tier B (hover-elevate only, no pointer parallax):
- contact chips
- social tiles
- regular list cards
- nav/filter pills

Reason:
- avoids visual noise and reduces input latency on dense UIs.

## 11.7 Component Motion Matrix (Exact)

1. Profile shell (`ProfileCard` root)
- Resting deep shadow + subtle surface sheen.
- Hover: +translate, +scale, +ambient shadow expansion.
- Photo block: independent lift on hover, optional depth highlight ring.

2. Contact chips (`profileCard__contact`)
- Hover: tiny lift, border brighten, inner-glass sheen increase.
- Active: press-in micro-scale.
- No heavy parallax.

3. Social tiles (`profileCard__socialCard`)
- Hover: medium lift, shadow expand, icon tile lift.
- Active: press-in.
- Optional tiny tilt only if performance remains stable on Safari.

4. Dock/tool cards (`DockLink`, `Card`, `ProjectCard`)
- Must share same `hover-elevate` primitive.
- Individual overrides only via CSS variables (`--hover-elevate-*`).

5. Article cards (`ArticleCard`, writing cards)
- Hover: stronger than generic cards.
- CTA chip and metadata chips receive secondary motion (subtle x-shift or glow).
- Writing cards may use pointer parallax (Tier A).

6. Icon tiles (`IconTile`)
- Must react to parent hover (scale + border + glow intensification).
- Keep transform bounded to avoid blur artifacts.

## 11.8 Script Behavior Guide (`src/scripts/motion.ts`)

Current target script already handles reveal/page transitions; extend behavior to match Bentolink interaction depth:

Required script responsibilities:
1. Respect `prefers-reduced-motion` strictly.
2. Keep reveal system and page transition system isolated from hover/parallax logic.
3. Add dedicated pointer-parallax handler for `data-parallax-card` or equivalent attribute.
4. Use `requestAnimationFrame` throttling for pointer move updates.
5. Reset tilt variables on pointer leave/cancel.
6. Avoid global pointer listeners; attach per element and cleanup on page transitions.

Data attributes to standardize:
- `data-reveal`
- `data-reveal-order`
- `data-reveal-group`
- `data-parallax-card` (Tier A only)

CSS variables updated by script:
- `--parallax-rotate-x`
- `--parallax-rotate-y`
- `--parallax-translate`

## 11.9 CSS Guide for Writing Card Parallax
For writing/article spotlight cards:
- `transform-style: preserve-3d`
- perspective transform composition
- slightly higher hover shadow depth than normal cards
- explicit active state reducing tilt intensity
- glow overlay on hover/focus

Also enforce:
- `touch-action: pan-y`
- no jitter on trackpad + Safari

## 11.10 Accessibility and Safety Rules
1. If `prefers-reduced-motion: reduce`, disable:
- pointer parallax
- reveal displacement transforms
- large hover scaling

2. Keep focus-visible parity with hover:
- keyboard users must get same depth cues as mouse users.

3. Preserve readable content:
- no transform should clip text or degrade text anti-aliasing.

4. Interaction latency budget:
- no motion update should block main thread > 16ms frame budget.

## 11.11 Cross-Page Rollout Order (Motion)
1. Home page primitives first.
2. Shared components (`Card`, `DockLink`, `IconTile`, `ArticleCard`).
3. Blog index and article page.
4. Remaining pages (`About`, `Projects`, `Now`).
5. Final full-site pass for consistency.

## 11.12 QA Checklist (Motion-Only)
Visual QA:
- Every interactive card has clear rest/hover/active states.
- Elevation hierarchy is consistent:
  - primary cards > secondary cards > chips.
- Icon tile motion feels connected to parent hover.

Behavior QA:
- pointer parallax only on intended components.
- no jump on mouse enter/leave.
- no transform accumulation bug after Astro route transitions.

A11y QA:
- reduced motion mode removes non-essential movement.
- keyboard focus receives equivalent depth cues.

Performance QA:
- smooth on Safari/macOS desktop.
- acceptable on mobile Safari (no stutter in scroll + hover simulation contexts).

## 11.13 Validation Commands (Post-Implementation)
Run after motion implementation:
1. `bun run lint`
2. `bun run typecheck`
3. `bun run build`

Then manual validation pages:
1. `/`
2. `/blog/`
3. any `/blog/[slug]/`
4. `/projects/`
5. `/about/`
6. `/now/`

## 11.14 Failure Patterns to Watch
- Over-scaling cards causes text blur.
- Multiple nested hovers produce exaggerated motion.
- Parallax applied to too many nodes causes frame drops.
- Inconsistent easing curves makes UI feel stitched together.
- Reduced-motion mode still showing displacement transforms.

## 11.15 Done Criteria (Motion Replication)
Motion replication is complete when:
- all primary interactive surfaces have Bentolink-grade hover elevation
- motion hierarchy is coherent and consistent across pages
- writing/profile cards exhibit premium depth behavior
- reduced-motion and keyboard-focus paths are first-class
- no performance regressions are introduced
