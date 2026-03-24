# Blog Reader + Sanity Fidelity Parity

**Status:** draft  
**Date:** 2026-03-03  
**Author:** Codex (AI assistant)

## Overview

Homepage visual parity alone is insufficient if blog cards and article reading surfaces remain stylistically disjoint. This change aligns blog index and article-reader materials with Bentolink-grade fidelity and updates Sanity authoring guidance so content quality consistently maps to the new visual system.

## Proposed Changes

### Files/Components Affected

- `src/pages/blog/index.astro`
- `src/components/ArticleCard.astro`
- `src/pages/blog/[slug].astro`
- `src/components/ArticlePortableText.astro`
- `src/components/ArticlePortableImage.astro`
- `sanity.config.ts`
- `src/sanity/schemaTypes/post.ts`
- `src/sanity/schemaTypes/seo.ts`

## Implementation Plan

1. **Blog Surface Alignment**
   - Harmonize article cards and section shells with home material/elevation language.
2. **Reader Surface Alignment**
   - Apply consistent shell hierarchy to article header/body/related sections and portable blocks.
3. **Sanity Editorial Guidance**
   - Tighten schema descriptions and content constraints (title/summary/hook/hero expectations).
4. **Verification**
   - Validate frontend rendering and editorial workflow coherence.

## Risks & Considerations

- Heavy reader effects may hurt long-form readability if not calibrated.
- Schema guidance changes should avoid over-constraining editorial flexibility.
- Blog and home token drift can reappear without explicit shared requirements.

## Testing Strategy

- `bun run lint`
- `bun run typecheck`
- `bun run build`
- Manual QA: `/blog/`, `/blog/[slug]/`, and Sanity Studio authoring flow.
