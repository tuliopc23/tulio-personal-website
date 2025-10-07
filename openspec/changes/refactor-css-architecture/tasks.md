# Implementation Tasks

## 1. Preparation
- [ ] 1.1 Take visual regression screenshots (all pages, both themes)
- [ ] 1.2 Document all current shadow values
- [ ] 1.3 Document all current color values
- [ ] 1.4 Create new directory structure in `src/styles/`

## 2. Extract Tokens
- [ ] 2.1 Create `tokens/colors.css` with all 750+ rgba() values as variables
- [ ] 2.2 Create `tokens/shadows.css` with all shadow systems
- [ ] 2.3 Verify no color/shadow values lost

## 3. Split Components
- [ ] 3.1 Extract card styles to `components/cards.css`
- [ ] 3.2 Extract navigation styles to `components/navigation.css`
- [ ] 3.3 Extract hero styles to `components/hero.css`
- [ ] 3.4 Extract article styles to `components/article.css`
- [ ] 3.5 Extract remaining component styles

## 4. Consolidate Themes
- [ ] 4.1 Move all `[data-theme="dark"]` rules to `themes/dark.css`
- [ ] 4.2 Move all `[data-theme="light"]` rules to `themes/light.css`
- [ ] 4.3 Verify all 202 theme rules migrated

## 5. Update References
- [ ] 5.1 Replace hardcoded colors with CSS variables
- [ ] 5.2 Replace hardcoded shadows with CSS variables
- [ ] 5.3 Update `theme.css` to import all modules
- [ ] 5.4 Update component scoped styles if needed

## 6. Validation
- [ ] 6.1 Build project successfully
- [ ] 6.2 Visual regression test (compare screenshots)
- [ ] 6.3 Test all hover states and animations
- [ ] 6.4 Test theme switching (dark/light)
- [ ] 6.5 Test all pages render identically
- [ ] 6.6 Verify symbol tiles maintain 3D elevation
- [ ] 6.7 Verify 4-layer shadows intact

## 7. Documentation
- [ ] 7.1 Create `STYLING.md` guide
- [ ] 7.2 Document when to use scoped vs global styles
- [ ] 7.3 Document CSS variable naming conventions
- [ ] 7.4 Update project.md with new structure
