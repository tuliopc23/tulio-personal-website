# Bentolink -> Tulio Website Total Overhaul Port Plan

## Status
- Planning/documentation only.
- No implementation edits in this step.
- Goal: port Bentolink design system language exactly, then adapt missing multi-page/blog/project surfaces without losing brand consistency.

## Non-Negotiables
- Bentolink is the visual/interaction source of truth for design language.
- Tulio website must keep route/content architecture (home, blog, post, categories, projects, about, uses, now, sanity studio).
- This is not only a style port: it is a system replacement plus adaptation.
- Monolithic styling architecture in Tulio is to be decomposed into Bentolink-style modular tokens/material layers and component styles.

## What Was Mapped
- Documentation/guides in both repos.
- Style architecture (tokens, materials, shadows, typography, motion).
- Layout shell (Base, nav/sidebar/topbar/footer/theme toggles).
- Motion/theme scripts.
- Component sets in both repos.
- Page-level information architecture and sections.

## Key Findings

### 1) Information Architecture Delta
- Bentolink is single-page (`src/pages/index.astro`) with widget composition.
- Tulio website is multi-route with long-form editorial surfaces:
  - `/` home
  - `/blog`
  - `/blog/[slug]`
  - `/blog/category/[slug]`
  - `/projects`
  - `/about`
  - `/uses`
  - `/now`
  - `/studio`
- Consequence: exact DS language must be shared, but multiple route templates must be designed/adapted beyond Bentolink's single-page model.

### 2) Styling Architecture Delta
- Tulio currently has a very large monolithic stylesheet (`src/styles/theme.css`, ~6.8k LOC).
- Bentolink uses a smaller modular token architecture with clearer separation:
  - `src/styles/tokens/colors.css`
  - `src/styles/tokens/typography.css`
  - `src/styles/tokens/spacing.css`
  - `src/styles/tokens/shadows.css`
  - `src/styles/tokens/animations.css`
  - `src/styles/tokens/materials.css`
- Tulio already has some token files but still duplicates/conflicts many values inside monolith.
- Consequence: Tulio must be split into Bentolink-like token/material architecture, then route/component styles layered on top.

### 3) Motion System Delta
- Bentolink motion is leaner and page-progress oriented.
- Tulio motion system is more complex (reveal groups, per-element progress, article special handling, sidebar states).
- Consequence: keep Bentolink motion language and timing curves, but preserve Tulio functional behaviors where required (blog reading experience, section reveals, sidebar mobile behavior).

### 4) Theme/Material Delta
- Bentolink has stronger material primitives (`materials.css`) and atmospheric background layering tied to shell.
- Tulio has broad shadow/glass definitions but mixed sources and duplicated tokens.
- Consequence: Bentolink material model becomes canonical; Tulio custom backgrounds/surfaces should be re-authored against those canonical materials.

### 5) Component Coverage Delta
- Bentolink includes: profile, socials, dock/tooling, github activity, feature writing, section nav, scroll CTA/indicator.
- Tulio includes all above needs plus editorial/project/CMS components:
  - `ArticleCard`, `ProjectCard`, `RecentPosts`, `CategoryList`, `MarkdownContent`, portable text blocks, etc.
- Consequence: components missing in Bentolink must be newly skinned with Bentolink DS primitives.

## Canonical System Decision
- **Canonical DS source**: Bentolink token/material/motion/component language.
- **Tulio-specific adaptation layer**: only for route-specific structures not present in Bentolink (blog post, project index, category archive, etc.).
- **Deprecation target**: monolithic Tulio theme architecture after migration and parity validation.

## Port + Adapt Strategy (Execution Order)

### Phase 0 - Baseline and Freeze
1. Freeze current Tulio visual baseline via screenshots for all routes/themes/breakpoints.
2. Freeze Bentolink baseline for matching surfaces.
3. Define parity checklist for desktop/tablet/mobile + dark/light + reduced motion.

### Phase 1 - Design Token Replacement (No Route Redesign Yet)
1. Establish canonical token set in Tulio mirroring Bentolink structure and semantics.
2. Introduce explicit material layer (`materials.css`) and animation layer (`animations.css`) in Tulio.
3. Map legacy token names to canonical aliases to avoid immediate breakage.
4. Remove duplicate token definitions from monolith in controlled slices.

### Phase 2 - Global Shell Port
1. Port Bentolink shell semantics into Tulio Base layout:
   - body/background atmospheric layers
   - liquid-glass reflector treatment
   - theme toggle behavior and transition semantics
   - topbar/sidebar/footer material treatment
2. Keep Tulio route navigation structure; align visuals and interaction patterns to Bentolink.
3. Ensure consistent URL conventions and active-link logic remain correct.

### Phase 3 - Core Component Port
1. Port shared components to Bentolink visual behavior:
   - Card primitives
   - Icon tiles
   - Profile/cta/social blocks
   - Scroll indicator + quick navigation patterns
2. Keep semantics/accessibility contracts from Tulio components.
3. Remove legacy component-specific styling once each component is migrated.

### Phase 4 - Route-by-Route Adaptation (Tulio-only Surfaces)
1. Home:
   - Apply exact Bentolink DS language for all sections present on home.
2. Blog index:
   - Convert filters/rails/cards to Bentolink material, spacing, typography, shadows, and motion.
3. Blog post (`/blog/[slug]`):
   - Build an editorial template in Bentolink language (reading width, heading rhythm, metadata chips, related content).
4. Category pages:
   - Reuse blog primitives with canonical section shells.
5. Projects page:
   - Re-theme project cards/list/filter states in Bentolink language.
6. About/Uses/Now:
   - Re-theme static/essay sections with consistent card/section primitives.
7. Studio route:
   - Ensure shell consistency and safe isolation of Sanity studio surface.

### Phase 5 - Motion and Interaction Harmonization
1. Normalize timing/easing/hover/focus/press using canonical animation tokens.
2. Keep reduced-motion behavior robust across all routes.
3. Align rail/scroll hints/edge fade behavior with shared interaction primitives.

### Phase 6 - Old System Removal
1. Remove dead selectors and route-specific leftovers from monolithic theme.
2. Delete or shrink legacy files after reference checks.
3. Ensure no component imports deprecated token names directly.
4. Finalize modular style architecture only.

### Phase 7 - Verification and Release
1. Visual regression sweep (dark/light + breakpoints).
2. Interaction QA (hover/focus/keyboard/touch).
3. Accessibility pass (contrast/focus/target/reduced motion).
4. Performance pass (CSS weight, layout shifts, animation cost).

## Monolith Decomposition Plan
- Current monolith: `src/styles/theme.css`.
- Target structure:
  - `src/styles/tokens/colors.css`
  - `src/styles/tokens/typography.css`
  - `src/styles/tokens/spacing.css`
  - `src/styles/tokens/shadows.css`
  - `src/styles/tokens/animations.css`
  - `src/styles/tokens/materials.css`
  - `src/styles/theme.css` (thin orchestrator only: imports + minimal globals)
  - optional route/component partials if needed (`src/styles/routes/*.css`, `src/styles/components/*.css`)

## Component Parity Map (High-Level)
- Bentolink -> Tulio direct parity candidates:
  - `Card.astro` -> `Card.astro`
  - `IconTile.astro` -> `IconTile.astro`
  - `ProfileCard.astro` -> `ProfileCard.astro`
  - `ScrollIndicator.astro` -> `ScrollIndicator.astro`
- Bentolink patterns to adapt for Tulio features:
  - `FeatureWritingWidget` style language -> `ArticleCard`, `RecentPosts`, blog rails
  - `SectionQuickNav`/`ScrollCTA` language -> home/page indicators and section transitions
  - `GitHubActivity` widget treatment -> credibility/activity sections where used

## Route Adaptation Matrix
- Present in Bentolink: Home widgets.
- Present only in Tulio (must be adapted to same DS):
  - Blog index
  - Blog post detail
  - Category archives
  - Projects listing and filters
  - About/Uses/Now narrative sections
  - Studio shell integration

## Risks and Controls
- Risk: visual drift between routes if migration is piecemeal.
  - Control: token-first migration + shared primitives before route adaptation.
- Risk: regressions from removing monolith too early.
  - Control: phased deprecation with selector usage checks per phase.
- Risk: motion complexity mismatch.
  - Control: keep canonical easing/timing, preserve critical Tulio behaviors only where functionally required.
- Risk: CMS/editorial readability regressions.
  - Control: dedicated editorial template validation on real posts.

## Acceptance Criteria for "Exact DS Language"
- Same token family philosophy and values as Bentolink for color/material/shadow/typography/motion.
- Same surface hierarchy and depth cues.
- Same interaction feel (hover, focus, press, transitions).
- Same atmospheric background and shell treatment logic.
- Tulio-only pages look like native extensions of Bentolink, not a separate design system.

## Implementation Checklist (When Execution Starts)
- [ ] Create migration branch for DS overhaul.
- [ ] Introduce canonical token files and aliases.
- [ ] Port Base shell.
- [ ] Port core shared components.
- [ ] Adapt each route in order: home -> blog index -> post -> category -> projects -> about/uses/now -> studio shell.
- [ ] Remove monolith leftovers.
- [ ] Run full QA matrix.

## Appendix A - Full Markdown Guide Inventory (tulio-personal-website)

```text
.agent/skills/ui-ux-pro-max/SKILL.md
.amazonq/prompts/openspec-apply.md
.amazonq/prompts/openspec-archive.md
.amazonq/prompts/openspec-proposal.md
.claude/commands/openspec/apply.md
.claude/commands/openspec/archive.md
.claude/commands/openspec/proposal.md
.claude/skills/ui-ux-pro-max/SKILL.md
.codebuddy/skills/ui-ux-pro-max/SKILL.md
.codex/skills/ui-ux-pro-max/SKILL.md
.continue/skills/ui-ux-pro-max/SKILL.md
.cursor/skills/ui-ux-pro-max/SKILL.md
.factory/commands/openspec-apply.md
.factory/commands/openspec-archive.md
.factory/commands/openspec-proposal.md
.gemini/skills/ui-ux-pro-max/SKILL.md
.github/prompts/ui-ux-pro-max/PROMPT.md
.kiro/steering/ui-ux-pro-max/SKILL.md
.opencode/skills/ui-ux-pro-max/SKILL.md
.qoder/skills/ui-ux-pro-max/SKILL.md
.roo/skills/ui-ux-pro-max/SKILL.md
.trae/skills/ui-ux-pro-max/SKILL.md
.windsurf/skills/ui-ux-pro-max/SKILL.md
AGENTS.md
AstroCss.md
Astrodocs.md
astrodocslite.md
AUTO_PUBLISHING_SETUP.md
AUTO_TAGGING.md
BENTOLINK_TOTAL_OVERHAUL_PORT_PLAN.md
CLAUDE.md
codex/AGENTS.md
codex/openspec/project.md
DESIGN_AUDIT_COMPLETE.md
DESIGN_AUDIT_PHASE1-3_COMPLETE.md
DESIGN_AUDIT_SUMMARY.md
docs/slider-evaluation.md
DRAMATIC_ELEVATION_APPLIED.md
IMPLEMENTATION_REVIEW.md
IMPLEMENTATION_SUMMARY.md
openspec/AGENTS.md
openspec/changes/add-profile-contact-cards/proposal.md
openspec/changes/add-profile-contact-cards/specs/responsive-layout/spec.md
openspec/changes/add-profile-contact-cards/tasks.md
openspec/changes/add-scroll-cta-hints/proposal.md
openspec/changes/add-scroll-cta-hints/specs/responsive-layout/spec.md
openspec/changes/add-scroll-cta-hints/tasks.md
openspec/changes/add-tools-section/proposal.md
openspec/changes/add-tools-section/specs/responsive-layout/spec.md
openspec/changes/add-tools-section/tasks.md
openspec/changes/archive/2025-10-10-migrate-js-to-typescript/COMPLETE.md
openspec/changes/archive/2025-10-10-migrate-js-to-typescript/design.md
openspec/changes/archive/2025-10-10-migrate-js-to-typescript/proposal.md
openspec/changes/archive/2025-10-10-migrate-js-to-typescript/README.md
openspec/changes/archive/2025-10-10-migrate-js-to-typescript/specs/client-scripts/spec.md
openspec/changes/archive/2025-10-10-migrate-js-to-typescript/SUMMARY.md
openspec/changes/archive/2025-10-10-migrate-js-to-typescript/tasks.md
openspec/changes/archive/2025-10-10-migrate-js-to-typescript/VALIDATION.md
openspec/changes/archive/2025-10-10-optimize-mobile-responsive-ux/design.md
openspec/changes/archive/2025-10-10-optimize-mobile-responsive-ux/IMPLEMENTATION_SUMMARY.md
openspec/changes/archive/2025-10-10-optimize-mobile-responsive-ux/NAVBAR_IMPROVEMENTS.md
openspec/changes/archive/2025-10-10-optimize-mobile-responsive-ux/PAGE_INDICATORS_ENHANCEMENT.md
openspec/changes/archive/2025-10-10-optimize-mobile-responsive-ux/proposal.md
openspec/changes/archive/2025-10-10-optimize-mobile-responsive-ux/specs/responsive-layout/spec.md
openspec/changes/archive/2025-10-10-optimize-mobile-responsive-ux/tasks.md
openspec/changes/archive/2025-10-10-optimize-sanity-integration/design.md
openspec/changes/archive/2025-10-10-optimize-sanity-integration/proposal.md
openspec/changes/archive/2025-10-10-optimize-sanity-integration/specs/sanity-cms/spec.md
openspec/changes/archive/2025-10-10-optimize-sanity-integration/tasks.md
openspec/changes/archive/2025-10-10-refactor-css-architecture/design.md
openspec/changes/archive/2025-10-10-refactor-css-architecture/proposal.md
openspec/changes/archive/2025-10-10-refactor-css-architecture/specs/styling-system/spec.md
openspec/changes/archive/2025-10-10-refactor-css-architecture/tasks.md
openspec/changes/archive/2025-10-25-enhance-apple-hig-compliance/proposal.md
openspec/changes/archive/2025-10-25-enhance-apple-hig-compliance/specs/styling-system/spec.md
openspec/changes/archive/2025-10-25-enhance-apple-hig-compliance/tasks.md
openspec/changes/design-system-audit/proposal.md
openspec/changes/design-system-audit/specs/styling-system/spec.md
openspec/changes/design-system-audit/tasks.md
openspec/changes/dramatic-card-elevation/proposal.md
openspec/changes/dramatic-card-elevation/specs/styling-system/spec.md
openspec/changes/dramatic-card-elevation/tasks.md
openspec/changes/enhance-shadows-animations/proposal.md
openspec/changes/enhance-shadows-animations/specs/styling-system/spec.md
openspec/changes/enhance-shadows-animations/tasks.md
openspec/changes/fix-contact-cards-mobile-layout/proposal.md
openspec/changes/fix-contact-cards-mobile-layout/tasks.md
openspec/changes/refine-iconography-microinteractions/proposal.md
openspec/changes/refine-iconography-microinteractions/specs/styling-system/spec.md
openspec/changes/refine-iconography-microinteractions/tasks.md
openspec/changes/update-liquid-theme-toggle/proposal.md
openspec/changes/update-liquid-theme-toggle/specs/client-scripts/spec.md
openspec/changes/update-liquid-theme-toggle/specs/styling-system/spec.md
openspec/changes/update-liquid-theme-toggle/tasks.md
openspec/changes/update-profile-card-social-cta/proposal.md
openspec/changes/update-profile-card-social-cta/specs/responsive-layout/spec.md
openspec/changes/update-profile-card-social-cta/tasks.md
openspec/changes/validate-sanity-integration/proposal.md
openspec/changes/validate-sanity-integration/specs/sanity-cms/spec.md
openspec/changes/validate-sanity-integration/tasks.md
openspec/project.md
openspec/proposals/2025-10-07-apple-hig-compliance-enhancements.md
openspec/README.md
openspec/specs/client-scripts/spec.md
openspec/specs/responsive-layout/spec.md
openspec/specs/sanity-cms/spec.md
openspec/specs/styling-system/spec.md
openspec/templates/proposal-template.md
QUICK_REFERENCE.md
QUICK_START_WEBHOOK.md
README.md
SANITY_WEBHOOK_SETUP.md
SHADOW_ANIMATION_VERIFICATION.md
src/slider-button-liquid-glass-apple-ios-262025/README.md
TAHOE_3D_SHADOWS.md

```

## Appendix B - Full Markdown Guide Inventory (Bentolink-bio)

```text
.amazonq/prompts/openspec-apply.md
.amazonq/prompts/openspec-archive.md
.amazonq/prompts/openspec-proposal.md
.claude/commands/openspec/apply.md
.claude/commands/openspec/archive.md
.claude/commands/openspec/proposal.md
.claude/commands/speckit.analyze.md
.claude/commands/speckit.checklist.md
.claude/commands/speckit.clarify.md
.claude/commands/speckit.constitution.md
.claude/commands/speckit.implement.md
.claude/commands/speckit.plan.md
.claude/commands/speckit.specify.md
.claude/commands/speckit.tasks.md
.cursor/commands/openspec-apply.md
.cursor/commands/openspec-archive.md
.cursor/commands/openspec-proposal.md
.factory/commands/openspec-apply.md
.factory/commands/openspec-archive.md
.factory/commands/openspec-proposal.md
.opencode/command/openspec-apply.md
.opencode/command/openspec-archive.md
.opencode/command/openspec-proposal.md
.specify/memory/constitution.md
.specify/templates/agent-file-template.md
.specify/templates/checklist-template.md
.specify/templates/plan-template.md
.specify/templates/spec-template.md
.specify/templates/tasks-template.md
AGENTS.md
apple hig guide.md
APPLE_HIG_ENHANCEMENTS.md
CLAUDE.md
codex/SPECIFICATION.md
DEPLOY_CHECKLIST.md
DEPLOYMENT.md
GITHUB_TOKEN_SETUP.md
GITHUB_WIDGET_FIX.md
ICONOGRAPHY_IMPLEMENTATION.md
openspec/AGENTS.md
openspec/changes/archive/2025-10-20-optimize-mobile-ux/proposal.md
openspec/changes/archive/2025-10-20-optimize-mobile-ux/specs/scroll-progress-indicator/spec.md
openspec/changes/archive/2025-10-20-optimize-mobile-ux/specs/touch-optimizations/spec.md
openspec/changes/archive/2025-10-20-optimize-mobile-ux/tasks.md
openspec/changes/archive/2025-10-25-enhance-writing-widget-mobile/proposal.md
openspec/changes/archive/2025-10-25-enhance-writing-widget-mobile/specs/feature-writing-widget/spec.md
openspec/changes/archive/2025-10-25-enhance-writing-widget-mobile/tasks.md
openspec/changes/final-polish-refinements/proposal.md
openspec/changes/final-polish-refinements/tasks.md
openspec/changes/harmonize-widget-surfaces/proposal.md
openspec/changes/harmonize-widget-surfaces/specs/github-activity-widget/spec.md
openspec/changes/harmonize-widget-surfaces/specs/tool-showcase-widget/spec.md
openspec/changes/harmonize-widget-surfaces/tasks.md
openspec/changes/polish-github-widget-compliance/proposal.md
openspec/changes/polish-github-widget-compliance/specs/github-activity-widget/spec.md
openspec/changes/polish-github-widget-compliance/tasks.md
openspec/changes/redesign-github-widget-carousel/design.md
openspec/changes/redesign-github-widget-carousel/proposal.md
openspec/changes/redesign-github-widget-carousel/specs/github-activity-widget/spec.md
openspec/changes/redesign-github-widget-carousel/tasks.md
openspec/changes/refine-mobile-navigation/proposal.md
openspec/changes/refine-mobile-navigation/specs/section-navigation/spec.md
openspec/changes/refine-mobile-navigation/tasks.md
openspec/project.md
openspec/specs/feature-writing-widget/spec.md
openspec/specs/scroll-progress-indicator/spec.md
openspec/specs/touch-optimizations/spec.md
PROFILE_CARD_REFACTOR_SUMMARY.md
README.md
TEST_BLOG.md
VIBEPROXY_SETUP_GUIDE.md
WARP.md

```

## Appendix C - Design System Files Compared

### Tulio Website
```text
src/components/ArticleCard.astro
src/components/ArticleCodeBlock.astro
src/components/ArticlePortableImage.astro
src/components/ArticlePortableLink.astro
src/components/ArticlePortableText.astro
src/components/brand-icons.ts
src/components/BrandIcon.astro
src/components/BrandLogo.astro
src/components/Breadcrumbs.astro
src/components/Card.astro
src/components/CategoryBadges.astro
src/components/CategoryList.astro
src/components/Footer.astro
src/components/IconTile.astro
src/components/LiquidThemeToggle.astro
src/components/MarkdownContent.astro
src/components/Navbar.astro
src/components/PageIndicator.astro
src/components/PersonalIcon.astro
src/components/PhosphorIcon.astro
src/components/portable-text/Callout.astro
src/components/portable-text/Divider.astro
src/components/portable-text/VideoEmbed.astro
src/components/PostCard.astro
src/components/ProfileCard.astro
src/components/ProjectCard.astro
src/components/ReadingProgress.astro
src/components/RecentPosts.astro
src/components/ScrollHint.astro
src/components/ScrollIndicator.astro
src/components/ScrollToTop.astro
src/components/SFIcon.astro
src/components/SkeletonCard.astro
src/components/VisualEditing.astro
src/layouts/Base.astro
src/pages/about.astro
src/pages/blog/[slug].astro
src/pages/blog/atom.xml.ts
src/pages/blog/category/[slug].astro
src/pages/blog/feed.xml.ts
src/pages/blog/index.astro
src/pages/index.astro
src/pages/now.astro
src/pages/projects.astro
src/pages/sitemap.xml.ts
src/pages/studio/index.astro
src/pages/uses.astro
src/scripts/motion.ts
src/scripts/scroll-indicators.ts
src/scripts/sidebar.ts
src/scripts/theme.ts
src/scripts/visual-editing.ts
src/scripts/web-vitals.ts
src/styles/fonts.css
src/styles/icons.css
src/styles/motion.css
src/styles/section.css
src/styles/theme.css
src/styles/tokens/breakpoints.css
src/styles/tokens/colors.css
src/styles/tokens/motion.css
src/styles/tokens/shadows.css
src/styles/tokens/spacing.css
src/styles/tokens/typography.css

```

### Bentolink
```text
src/components/Card.astro
src/components/ContactWidget.astro
src/components/DockLink.astro
src/components/FeatureWritingWidget.tsx
src/components/GitHubActivity.tsx
src/components/Icon.astro
src/components/IconTile.astro
src/components/ProfileCard.astro
src/components/ProfileHeader.astro
src/components/ScrollCTA.astro
src/components/ScrollIndicator.astro
src/components/SectionQuickNav.astro
src/components/SocialsCard.astro
src/layouts/Base.astro
src/pages/index.astro
src/scripts/carousel-handler.ts
src/scripts/motion.ts
src/scripts/theme.ts
src/styles/feature-writing-widget.css
src/styles/github-activity-widget.css
src/styles/motion.css
src/styles/phosphor-icons.css
src/styles/phosphor.css
src/styles/theme.css
src/styles/tokens/animations.css
src/styles/tokens/colors.css
src/styles/tokens/materials.css
src/styles/tokens/shadows.css
src/styles/tokens/spacing.css
src/styles/tokens/typography.css

```
