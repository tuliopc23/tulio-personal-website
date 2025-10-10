# client-scripts Specification

## Purpose
TBD - created by archiving change migrate-js-to-typescript. Update Purpose after archive.
## Requirements
### Requirement: TypeScript for Client Scripts
All client-side scripts SHALL be written in TypeScript with strict type checking enabled.

#### Scenario: Script type safety
- **WHEN** a developer writes or modifies a client script
- **THEN** the script MUST be a `.ts` file with explicit types
- **AND** the script MUST compile without errors under strict mode
- **AND** the script MUST have proper DOM element types

#### Scenario: Type checking in development
- **WHEN** running `bun run typecheck`
- **THEN** all client scripts MUST pass type checking
- **AND** no TypeScript errors SHALL be present
- **AND** strict null checks SHALL be satisfied

#### Scenario: IDE support
- **WHEN** a developer opens a client script in an IDE
- **THEN** the IDE MUST provide type-aware autocomplete
- **AND** the IDE MUST show inline type errors
- **AND** the IDE MUST enable refactoring tools

### Requirement: Production Script Types
Production client scripts in `src/scripts/` SHALL use explicit TypeScript types for all DOM interactions, events, and state management.

#### Scenario: Theme script types
- **WHEN** the theme switcher script runs
- **THEN** theme values SHALL be typed as `"light" | "dark"`
- **AND** localStorage access SHALL handle null values with strict types
- **AND** media query event handlers SHALL have proper types

#### Scenario: Sidebar script types
- **WHEN** the sidebar navigation script runs
- **THEN** sidebar state SHALL be typed as `"open" | "closed"`
- **AND** DOM element queries SHALL use generic types (e.g., `HTMLButtonElement`)
- **AND** event handlers SHALL have proper MouseEvent/KeyboardEvent types

#### Scenario: Motion script types
- **WHEN** the motion/animation script runs
- **THEN** page state SHALL be typed as `"entering" | "ready" | "leaving"`
- **AND** glass state SHALL be typed as `"rest" | "scrolled"`
- **AND** IntersectionObserver callbacks SHALL have proper entry types

#### Scenario: Scroll indicators script types
- **WHEN** the scroll indicators script runs
- **THEN** scroll event handlers SHALL have proper types
- **AND** element queries SHALL use specific HTMLElement types
- **AND** edge fade calculations SHALL use typed numeric values

#### Scenario: Visual editing script types
- **WHEN** the Sanity visual editing script loads
- **THEN** import statements SHALL use proper TypeScript dynamic imports
- **AND** window/parent location comparisons SHALL be type-safe
- **AND** enableOverlays options SHALL be typed

### Requirement: Config File Types
Configuration files SHALL be written in TypeScript with proper type definitions for configuration objects.

#### Scenario: Astro config types
- **WHEN** modifying `astro.config.ts`
- **THEN** the config object SHALL be typed as `AstroUserConfig`
- **AND** integration options SHALL have type-safe properties
- **AND** environment variables SHALL be properly typed

#### Scenario: ESLint config types
- **WHEN** modifying `eslint.config.ts`
- **THEN** the config array SHALL be typed as `Linter.Config[]`
- **AND** rule configurations SHALL be type-safe
- **AND** plugin imports SHALL have proper types

#### Scenario: Prettier config types
- **WHEN** modifying `prettier.config.ts`
- **THEN** the config object SHALL be typed as `Options`
- **AND** all properties SHALL match Prettier's type definitions

### Requirement: Build Integration
TypeScript client scripts SHALL be automatically compiled by the Astro/Vite build system without additional configuration.

#### Scenario: Script compilation
- **WHEN** building the project with `bun run build`
- **THEN** all `.ts` scripts in `src/scripts/` SHALL be compiled to JavaScript
- **AND** the compiled scripts SHALL be bundled in the `dist/` folder
- **AND** script imports in Astro components SHALL work transparently

#### Scenario: Development mode
- **WHEN** running the dev server with `bun run dev`
- **THEN** TypeScript scripts SHALL be compiled on-the-fly
- **AND** changes SHALL trigger hot module replacement
- **AND** type errors SHALL appear in the console

### Requirement: Strict Null Checking
All client scripts SHALL handle potentially null DOM elements and values explicitly.

#### Scenario: Optional chaining for DOM elements
- **WHEN** querying the DOM for an element that may not exist
- **THEN** the code SHALL use optional chaining (`?.`) or explicit null checks
- **AND** TypeScript SHALL enforce null safety
- **AND** runtime errors from null access SHALL be prevented

#### Scenario: Type narrowing
- **WHEN** a DOM element requires specific operations
- **THEN** the code SHALL use type guards or assertions
- **AND** TypeScript SHALL narrow the type appropriately
- **AND** only safe operations SHALL be permitted

### Requirement: Type Documentation
Complex types and interfaces SHALL be self-documenting through explicit type annotations.

#### Scenario: State management types
- **WHEN** defining state values (theme, page state, sidebar state)
- **THEN** string literal unions SHALL be used for finite states
- **AND** type aliases SHALL have descriptive names
- **AND** the intent SHALL be clear from the type definition

#### Scenario: Dataset types
- **WHEN** accessing element dataset properties
- **THEN** custom interfaces SHALL extend `DOMStringMap`
- **AND** all dataset properties SHALL be explicitly typed
- **AND** optional properties SHALL use the `?` modifier

### Requirement: Migration Compatibility
Migrating JavaScript files to TypeScript SHALL NOT introduce functional changes or regressions.

#### Scenario: Functional equivalence
- **WHEN** a JavaScript file is migrated to TypeScript
- **THEN** the compiled output SHALL be functionally identical
- **AND** all existing features SHALL work as before
- **AND** no new runtime errors SHALL be introduced

#### Scenario: Import compatibility
- **WHEN** Astro components import migrated scripts
- **THEN** the import paths SHALL work with `.ts` extension
- **AND** Astro SHALL handle TypeScript compilation automatically
- **AND** no build configuration changes SHALL be required

#### Scenario: Testing validation
- **WHEN** migration is complete for a script
- **THEN** manual browser testing SHALL confirm functionality
- **AND** all interactive features SHALL work correctly
- **AND** performance SHALL not degrade

### Requirement: Biome Linting Compliance
All TypeScript client scripts SHALL pass Biome linting rules with no errors or warnings.

#### Scenario: Linting rules adherence
- **WHEN** running `biome lint .` or `bun run lint`
- **THEN** all migrated TypeScript files SHALL pass without errors
- **AND** no unused variables SHALL remain (correctness.noUnusedVariables: warn)
- **AND** no unused imports SHALL remain (correctness.noUnusedImports: warn)
- **AND** no undeclared variables SHALL exist (correctness.noUndeclaredVariables: error)

#### Scenario: Code quality rules
- **WHEN** TypeScript code is written
- **THEN** explicit `any` types SHALL be avoided (suspicious.noExplicitAny: warn)
- **AND** debugger statements SHALL NOT be present (suspicious.noDebugger: error)
- **AND** strict equality operators SHALL be used (suspicious.noDoubleEquals: error)
- **AND** `const` SHALL be preferred over `let` where applicable (style.useConst: warn)

#### Scenario: Type import optimization
- **WHEN** importing types in TypeScript files
- **THEN** type-only imports SHALL use `import type` syntax (style.useImportType: warn)
- **AND** type-only exports SHALL use `export type` syntax (style.useExportType: warn)
- **AND** inferrable types SHALL be omitted where obvious (style.noInferrableTypes: warn)

#### Scenario: Script-specific overrides
- **WHEN** linting client scripts in `src/scripts/`
- **THEN** console statements SHALL be allowed (suspicious.noConsole: off)
- **AND** parameter reassignment SHALL be allowed where needed (style.noParameterAssign: off)
- **AND** inner declarations SHALL be allowed for IIFE patterns (correctness.noInnerDeclarations: off)

### Requirement: Biome Formatting Compliance
All TypeScript client scripts SHALL follow consistent Biome formatting rules.

#### Scenario: Formatting consistency
- **WHEN** running `biome format .` or `bun run format:check`
- **THEN** all TypeScript files SHALL be formatted consistently
- **AND** no formatting errors SHALL be present
- **AND** the code SHALL match the project's style guide

#### Scenario: JavaScript formatting rules
- **WHEN** formatting TypeScript code
- **THEN** double quotes SHALL be used for strings (quoteStyle: "double")
- **AND** semicolons SHALL be required (semicolons: "always")
- **AND** trailing commas SHALL be used where valid (trailingCommas: "all")
- **AND** arrow function parentheses SHALL always be present (arrowParentheses: "always")
- **AND** 2-space indentation SHALL be used (indentWidth: 2)
- **AND** line width SHALL not exceed 100 characters (lineWidth: 100)

#### Scenario: Formatting before commit
- **WHEN** a developer commits TypeScript changes
- **THEN** `biome format --write .` SHALL be run
- **AND** all files SHALL be auto-formatted
- **AND** formatting changes SHALL be included in the commit

### Requirement: Biome Check Integration
The full Biome check SHALL pass for all migrated TypeScript files before merging.

#### Scenario: Pre-commit validation
- **WHEN** preparing to commit TypeScript changes
- **THEN** `biome check --write .` SHALL be run
- **AND** both linting and formatting SHALL pass
- **AND** auto-fixable issues SHALL be corrected automatically

#### Scenario: CI pipeline validation
- **WHEN** running CI checks with `bun run check:ci`
- **THEN** `biome ci .` SHALL pass without errors
- **AND** no linting violations SHALL exist
- **AND** no formatting inconsistencies SHALL exist
- **AND** TypeScript compilation SHALL succeed

#### Scenario: Full quality check
- **WHEN** running `bun run check`
- **THEN** Biome check SHALL pass with auto-fixes applied
- **AND** TypeScript type checking SHALL pass
- **AND** build SHALL succeed
- **AND** the codebase SHALL be ready for deployment

### Requirement: Biome Configuration Updates
The Biome configuration SHALL include all TypeScript files from the migration.

#### Scenario: Include patterns
- **WHEN** TypeScript files are added to `src/scripts/`
- **THEN** they SHALL be included in Biome's file patterns
- **AND** `src/scripts/**/*.ts` SHALL be in the includes array
- **AND** config files SHALL be covered by `*.config.ts` pattern

#### Scenario: Script-specific rules
- **WHEN** Biome processes files in `src/scripts/`
- **THEN** the override rules for scripts SHALL apply
- **AND** console.log SHALL be allowed (for debugging)
- **AND** IIFE patterns SHALL not trigger warnings
- **AND** browser globals SHALL be recognized (Window, Document, HTMLElement)

