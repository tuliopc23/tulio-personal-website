# Biome Setup - Complete! ✅

Biome has been installed and configured as a fast, modern linter and formatter for this project.

## What is Biome?

Biome is a fast toolchain for web projects, replacing ESLint + Prettier with a single, blazing-fast tool written in Rust. It's 97% compatible with Prettier and much faster than ESLint.

## Installation

```bash
bun add -d @biomejs/biome
```

## Configuration

The configuration is in `biome.json` with:

- **Strict linting rules** (recommended + custom overrides)
- **Auto-formatting** (2 spaces, double quotes, trailing commas)
- **Import organizing** capability
- **Astro-specific** overrides
- **A11y rules** enabled
- **Git integration** enabled

### Key Rules

- ✅ All recommended rules enabled
- ✅ `noUnusedVariables`: warn
- ✅ `noUndeclaredVariables`: error  
- ✅ `noExplicitAny`: warn
- ✅ `noDebugger`: error
- ✅ `noDoubleEquals`: error (enforces `===`)
- ✅ `useConst`: error (prefer const over let)
- ✅ TypeScript import types for better performance
- ✅ Accessibility (a11y) rules enabled
- ✅ Console allowed in scripts directory

## Available Scripts

### Main Commands

```bash
# Check everything (lint + format)
bun run check            # Apply fixes + typecheck + build
bun run check:ci         # CI mode (no fixes, just errors)

# Lint only
bun run lint             # Check linting
bun run lint:fix         # Apply lint fixes

# Format only
bun run format           # Apply formatting
bun run format:check     # Check formatting without changes
```

### Biome-Specific Commands

```bash
# All-in-one commands
bun run biome:check      # Check everything (readonly)
bun run biome:fix        # Fix everything (lint + format)

# Individual commands
bun run biome:lint       # Lint only
bun run biome:format     # Format only
```

### Legacy Commands (Still Available)

ESLint and Prettier are still installed for migration period:

```bash
bun run eslint           # Use ESLint (old)
bun run prettier         # Use Prettier (old)
bun run prettier:check   # Check Prettier (old)
```

## Migration from ESLint/Prettier

If you want to migrate your existing ESLint/Prettier configs:

```bash
bun run biome:migrate
```

This will attempt to convert:
- `.eslintrc.js` / `eslint.config.mjs` → `biome.json`
- `.prettierrc` / `prettier.config.mjs` → `biome.json`

## Editor Integration

### VS Code

1. Install the **Biome extension**:
   - Search "Biome" in VS Code extensions
   - Or: https://marketplace.visualstudio.com/items?itemName=biomejs.biome

2. Set as default formatter (`.vscode/settings.json`):
   ```json
   {
     "editor.defaultFormatter": "biomejs.biome",
     "editor.formatOnSave": true,
     "[javascript]": {
       "editor.defaultFormatter": "biomejs.biome"
     },
     "[typescript]": {
       "editor.defaultFormatter": "biomejs.biome"
     },
     "[json]": {
       "editor.defaultFormatter": "biomejs.biome"
     }
   }
   ```

### Other Editors

- **WebStorm/IntelliJ**: Built-in support in 2023.3+
- **Neovim**: `biomejs/biome` via LSP
- **Sublime Text**: Biome LSP package

## What Files Are Checked?

Biome checks:
- `src/**/*` (all source files)
- `*.ts`, `*.js`, `*.tsx`, `*.jsx`
- `*.json`
- `*.astro` (with special rules)

Biome ignores (via Git):
- `node_modules/`
- `dist/`
- `.astro/`
- Any files in `.gitignore`

## Performance Comparison

| Tool | Speed | Features |
|------|-------|----------|
| ESLint + Prettier | ~2-3s | Lint + Format |
| **Biome** | ~0.1-0.3s | Lint + Format + Import Sort |

**Biome is 10-30x faster!** ⚡

## Common Commands

```bash
# Before committing
bun run check             # Fix all issues

# Quick formatting
bun run format            # Format all files

# Check specific file
bunx biome check src/components/MyComponent.tsx

# Fix specific file
bunx biome check --write src/components/MyComponent.tsx

# CI/CD pipeline
bun run check:ci          # No fixes, just report errors
```

## Troubleshooting

### "Configuration error" messages

Make sure you're using Biome 2.2.5+:
```bash
bunx biome --version
```

### Files not being checked

Check the `includes` in `biome.json`:
```json
"files": {
  "includes": ["src/**/*", "*.ts", "*.js", "*.tsx", "*.jsx", "*.json", "*.astro"]
}
```

### Conflicting with ESLint/Prettier

You can safely remove ESLint and Prettier after confirming Biome works:

```bash
bun remove eslint prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-astro eslint-config-prettier prettier-plugin-astro

# Remove config files
rm eslint.config.mjs prettier.config.mjs
```

## Next Steps

1. ✅ Biome is installed and configured
2. ⏭️  Run `bun run biome:fix` to fix existing issues
3. ⏭️  Set up VS Code extension for live linting
4. ⏭️  (Optional) Remove ESLint/Prettier after testing
5. ⏭️  Add Biome check to pre-commit hook

## Resources

- [Biome Documentation](https://biomejs.dev)
- [VS Code Extension](https://marketplace.visualstudio.com/items?itemName=biomejs.biome)
- [GitHub](https://github.com/biomejs/biome)
- [Migration Guide](https://biomejs.dev/guides/migrate-eslint-prettier/)
