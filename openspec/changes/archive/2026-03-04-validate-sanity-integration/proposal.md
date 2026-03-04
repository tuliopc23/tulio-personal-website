# Validate Sanity Integration

**Status:** draft
**Date:** 2025-10-12
**Author:** Codex (AI assistant)

## Overview
Sanity CMS powers all dynamic content for the personal website. We need to verify that the Astro ↔ Sanity integration is production ready: environment variables must be wired correctly, schema/type generation should stay in sync, and both Studio and frontend builds must fail fast when misconfigured. This change confirms the integration is complete, documents the guarantees, and closes remaining gaps before further content work.

## Proposed Changes

### Areas to Review / Update
- `astro.config.mjs` – ensure the environment loader, dataset defaults, and API version are correct for production.
- `sanity.config.ts` – confirm Studio configuration (presentation tool, actions, preview URL fallbacks) and add safeguards for missing env vars.
- `src/sanity/schemaTypes` & related modules – audit schema completeness, validation, and Portable Text components.
- `sanity.types.ts` & `sanity-codegen` tooling – ensure type generation is reliable and documented.
- Environment docs (`README`, `.env.example`, `openspec/project.md`) – align variable list and usage guidance.
- Frontend data access (`src/lib`, `src/pages`) – verify GROQ queries only consume published content and handle nulls defensively.

### Expected Outcomes
- Documented checklist for configuring Sanity across local, preview, and production environments.
- Spec updates covering environment requirements and integration health checks.
- Clear tasks defined for implementation (linting, schema/type updates, runtime validation).

## Implementation Plan
1. **Environment & Config Audit**
   - Inspect `astro.config.mjs`, `sanity.config.ts`, and existing env docs.
   - Identify required vs optional variables and desired runtime safeguards.
2. **Schema & Type Consistency**
   - Review schema modules, generated types, and Portable Text renderers.
   - Outline any fixes or enhancements (validation gaps, missing fields, dead queries).
3. **Frontend Integration Review**
   - Trace GROQ queries, dataset usage, and visual editing toggles.
   - Capture gaps in build-time/runtime failure handling or data handling.
4. **Spec & Documentation Updates**
   - Draft spec deltas for `sanity-cms` capability.
   - Update `openspec/project.md` or README if new guidance emerges.
5. **Verification**
   - Run `bun run check` and `bun run sanity:typegen` once implementation is ready.

## Risks & Considerations
- **Security:** Ensure tokens stay server-side and never leak into client bundles.
- **Performance:** Sanity CDN settings must remain cached for production responses.
- **Breaking Changes:** Tightening validation or env checks could surface existing misconfigurations; plan staging verification before deploy.

## Testing Strategy
- `bun run sanity:typegen`
- `bun run check`
- Manual Studio smoke test (login, create draft, publish) after implementation.

## Documentation Updates
- Sync environment variable references across `README.md`, `openspec/project.md`, and `.env` templates.
- Add troubleshooting notes for missing env vars or invalid tokens if needed.
