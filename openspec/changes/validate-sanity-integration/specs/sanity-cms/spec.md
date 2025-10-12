# sanity-cms Specification - Validate Sanity Integration

## MODIFIED Purpose
Sanity CMS powers all dynamic content and editorial workflows for tuliocunha.dev. The capability MUST guarantee that environment configuration, schemas, generated types, and frontend queries stay in sync so that editors and visitors always experience the intended content pipeline.

## ADDED Requirements

### Requirement: Environment Configuration
The Sanity integration SHALL load and validate environment variables for both Astro builds and the Studio runtime.

#### Scenario: Load env vars through Vite
- **WHEN** Astro starts in any mode (dev, build, preview)
- **THEN** `astro.config.mjs` SHALL use `loadEnv` to read Sanity variables
- **AND** it SHALL supply `projectId`, `dataset`, `apiVersion`, and optional `token` to the Sanity integration
- **AND** local development SHALL fall back to projectId `61249gtj` and dataset `production` if overrides are absent
- **AND** production/CI builds SHALL require explicit environment overrides for those values

#### Scenario: Warn when Studio env missing
- **WHEN** `sanity.config.ts` initializes without `PUBLIC_SANITY_PROJECT_ID` or `PUBLIC_SANITY_DATASET`
- **THEN** the Studio SHALL log a warning explaining the missing variables
- **AND** editors SHALL be instructed to add the variables before continuing

#### Scenario: Visual editing toggle respects env
- **WHEN** `PUBLIC_SANITY_VISUAL_EDITING_ENABLED` is `false` or unset
- **THEN** visual editing overlays SHALL remain disabled on the frontend
- **AND** enabling the flag SHALL activate overlays without redeploying code

### Requirement: Integration Health Checks
The integration SHALL provide commands and documentation to verify schema, types, and build health.

#### Scenario: Type generation command succeeds
- **WHEN** `bun run sanity:typegen` executes
- **THEN** the command SHALL regenerate `sanity.types.ts` without errors
- **AND** failures SHALL surface actionable messages referencing schema issues

#### Scenario: Build pipeline validates Sanity setup
- **WHEN** `bun run check` runs in CI
- **THEN** Biome SHALL pass without Sanity-related lint errors
- **AND** TypeScript type checking SHALL include the generated Sanity types
- **AND** the Astro build SHALL fail if required Sanity env variables are missing in non-development environments

#### Scenario: Setup checklist documented
- **WHEN** a developer references project documentation
- **THEN** the required Sanity environment variables and verification commands SHALL be documented in `README.md` or `openspec/project.md`
- **AND** the documentation SHALL include local, preview, and production guidance

## MODIFIED Requirements
None.

## REMOVED Requirements
None.

## RENAMED Requirements
None.
