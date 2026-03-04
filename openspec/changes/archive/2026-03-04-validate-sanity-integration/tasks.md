## 1. Environment & Config Audit
- [x] 1.1 Confirm `astro.config.mjs` resolves Sanity env vars (projectId, dataset, token, apiVersion)
- [x] 1.2 Verify `sanity.config.ts` fallbacks, presentation tool configuration, and warnings
- [x] 1.3 Align environment variable docs (`README.md`, `.env` template, `openspec/project.md`)

## 2. Schema & Type Consistency
- [x] 2.1 Review `src/sanity/schemaTypes` for required fields, workflow enums, validation rules
- [x] 2.2 Regenerate types via `bun run sanity:typegen` and ensure `sanity.types.ts` is current
- [x] 2.3 Audit Portable Text renderers for coverage of schema blocks

## 3. Frontend Integration Review
- [x] 3.1 Check GROQ queries and helper utilities only surface published content
- [x] 3.2 Confirm visual editing toggle respects `PUBLIC_SANITY_VISUAL_EDITING_ENABLED`
- [x] 3.3 Ensure failing env configuration surfaces clear build/runtime errors

## 4. Spec & Documentation Updates
- [x] 4.1 Update `openspec/specs/sanity-cms/spec.md` with environment + integration requirements
- [x] 4.2 Document troubleshooting steps or checklists for Sanity setup

## 5. Verification
- [x] 5.1 Run `bun run check`
- [x] 5.2 Run `bun run sanity:typegen`
