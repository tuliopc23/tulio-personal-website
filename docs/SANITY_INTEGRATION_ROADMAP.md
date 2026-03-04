# Sanity Integration Roadmap and Page Content Mapping

## Scope

This document audits the current Sanity + Astro integration and proposes a practical roadmap to improve editorial workflows, security, preview quality, and content modeling.

It also maps each page (excluding `/`) to content areas that should move to or expand in Sanity.

## Current Integration Snapshot

### What is already strong

- Sanity is integrated in Astro with `@sanity/astro` (`astro.config.mjs`).
- Blog content is Sanity-driven end-to-end (`src/sanity/lib/posts.ts`, `src/pages/blog/*.astro`).
- Projects are modeled in Sanity and rendered from Content Lake (`src/sanity/schemaTypes/project.ts`, `src/sanity/lib/projects.ts`, `src/pages/projects.astro`).
- Studio structure is customized and includes editorial views (In Review, Scheduled, Featured) (`sanity.config.ts`).
- Presentation tool is enabled (`sanity.config.ts`) and visual editing script is conditionally loaded (`src/components/VisualEditing.astro`).
- Custom editorial actions exist for review/publish/unpublish/cross-post/schedule (`src/sanity/actions/*.ts`).

### Key risks and gaps

- API versions are split across `2024-01-01` and `2025-01-01`; newer release-era behavior and perspectives rely on `2025-02-19+`.
- Custom scheduling (`scheduledPublishAt`, +1h action) overlaps with platform-native Scheduled Drafts/Releases.
- Webhook endpoint currently lacks request-signature verification (`src/pages/api/auto-publish.ts`).
- Rebuild workflow creates empty commits to trigger deployment (`.github/workflows/sanity-webhook.yml`), which pollutes history.
- Presentation resolver maps only `post`, not `project` or other route-driven content (`src/sanity/lib/resolve.ts`).
- Production is static-first; full visual-editing behavior is strongest on an SSR/hybrid preview deployment.

## Sanity Docs and Changelog Signals Incorporated

This roadmap aligns with recent Sanity guidance:

- Query perspective defaults changed (`published` default) and release-aware APIs arrived in `v2025-02-19`.
- Scheduled Drafts is the platform-native path for single-document future publishing.
- Content Releases is the platform-native path for coordinated multi-document launches.
- Functions are the preferred event-driven automation surface for content reactions.
- Studio v5 requires React 19.2+ (already satisfied by `sanity@^5` in this repo).

## Priority Roadmap

## Phase 1 - Hardening and alignment (high value, low risk)

1. Standardize Sanity API version to `2025-02-19` where compatible.
2. Add webhook signature verification in `src/pages/api/auto-publish.ts`.
3. Replace empty-commit rebuild trigger with deploy hook/API trigger (or cache purge).
4. Expand `resolve.locations` to include `project` and category-aware routes.
5. Add CI guardrails for `sanity schema validate` + `sanity typegen generate`.

## Phase 2 - Editorial workflow modernization

1. Replace custom schedule action with Scheduled Drafts for single-post scheduling.
2. Keep custom review statuses, but ensure publishability is consistent and explicit.
3. Add idempotency keys and retry-safe handling for cross-post/rebuild automation.
4. Move webhook-driven platform publishing logic to Sanity Functions.

## Phase 3 - Content operations maturity

1. Adopt Content Releases for coordinated campaigns (if plan/permissions allow).
2. Add singleton settings docs (site SEO defaults, social links, legal, contact metadata).
3. Add Tasks/assignment conventions in Studio for review and production workflow.
4. Add optional AI Assist helpers for summary/hook/meta drafting.

## Page-by-Page Mapping (excluding `/`)

## `/blog/` (already Sanity-driven, expand)

Current state:

- Articles, tags, categories, featured state, SEO, and hero images come from Sanity.

Additional content to move into Sanity:

- Editorial hero copy (`title`, `lede`) currently hardcoded in `src/pages/blog/index.astro`.
- Editorial direction cards ("Product Engineering", "Design Language", "Tooling And Workflows").
- Placeholder cards and fallback narrative content.
- Spotlight tag seed list currently hardcoded.

Recommended schema additions:

- `blogPage` singleton with hero copy, pillars, spotlight tags, empty-state text, and CTA labels.

## `/blog/[slug]/` (already strong, extend metadata)

Current state:

- Full post detail is Sanity-driven with SEO, structured data input, tags, categories, key takeaways.

Additional content to move into Sanity:

- Share CTA copy labels if editorial team should control wording.
- Related-reading strategy settings (count/order/fallback text) as config.

Recommended schema additions:

- Extend `post` with optional social copy template fields or add `blogSettings` singleton for UI labels.

## `/blog/category/[slug]/` (mostly Sanity-driven)

Current state:

- Category and category posts are Sanity-driven.

Additional content to move into Sanity:

- Empty-state messaging and eyebrow labels are hardcoded.

Recommended schema additions:

- `blogPage` or `blogSettings` singleton for category page shared copy.

## `/projects/` (Sanity-driven cards, partial static shell)

Current state:

- Project cards and filtering are Sanity-driven.

Additional content to move into Sanity:

- Hero copy and empty-state copy currently hardcoded.
- Optional per-project: outcome metrics, highlights, timeline, stack visibility controls.

Recommended schema additions:

- `projectsPage` singleton with hero text, empty-state content, and optional section toggles.
- Optional `project` enhancements: `impactMetrics`, `caseStudyUrl`, `repoUrl`, `featuredRank`.

## `/about/` (high opportunity)

Current state:

- Fully hardcoded.

Content that should move to Sanity:

- Hero copy, manifesto, principles cards, timeline entries, and proof bullets.
- Structured data text and OG description source copy.

Recommended schema additions:

- `aboutPage` singleton with sections:
  - hero
  - manifesto
  - principles[]
  - timeline[]
  - seo

## `/now/` (high opportunity)

Current state:

- Fully hardcoded except GitHub activity widget.

Content that should move to Sanity:

- Now/Next/Later lists.
- Execution Signals cards.
- Last-updated source should be content-driven (manual field), not server date.

Recommended schema additions:

- `nowPage` singleton with:
  - hero
  - updatedAt
  - nowItems[]
  - nextItems[]
  - laterItems[]
  - executionSignals[]
  - seo

## `/studio/`

Current state:

- Local embedded in dev, hosted Studio link in non-dev.

Potential enhancement:

- Keep as-is; no strong need to model in Sanity.

## Cross-Cutting Content Areas That Benefit from Sanity

1. **Navigation/footer management**
   - Manage header/footer links from Studio instead of hardcoding in layout.

2. **Announcement/banner system**
   - Time-bound banners for launches, newsletter prompts, or maintenance notices.

3. **Reusable CTA library**
   - Consistent CTA labels/URLs used across blog/projects/about/now.

4. **Redirects management**
   - Manage route redirects in Sanity and apply in Astro build/runtime.

5. **Author/profile enrichment**
   - Bio variants, current role, location, avatar variants, social handles for multiple surfaces.

Note: `siteSettings` is intentionally excluded for this codebase based on your preference and Workers deployment model.

## Suggested Target Schema Additions

- `blogPage` (singleton)
- `projectsPage` (singleton)
- `aboutPage` (singleton)
- `nowPage` (singleton)
- Optional `announcement` document
- Optional `redirect` document

## Implementation Notes

- Keep production static for performance, but introduce an SSR/hybrid preview deployment for richer visual editing.
- For release-aware previews, align preview clients to API version `2025-02-19` and perspective handling.
- Prefer platform-native Scheduled Drafts/Releases over bespoke schedule metadata where possible.
- Keep custom actions only where they add clear UX value beyond native behavior.

## Practical Next Steps

1. Implement `aboutPage` + `nowPage` singletons first (fastest visible win).
2. Add `blogPage` and `projectsPage` singletons for static shell copy currently hardcoded.
3. Migrate `/about` and `/now` to Sanity-driven rendering.
4. Harden webhooks and switch rebuild trigger strategy.
5. Migrate scheduling flow to Scheduled Drafts.
6. Add optional Releases and Functions as workflow scale grows.
