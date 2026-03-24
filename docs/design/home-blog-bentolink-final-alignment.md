# Home + Blog Bentolink Final Alignment Audit

Date: 2026-03-04
Repos compared:

- Source baseline: `/Users/tuliopinheirocunha/Developer/Bentolink-bio`
- Target: `/Users/tuliopinheirocunha/Developer/tulio-personal-website`

## Scope

Only Home and Blog parity gaps from visual references provided.

## Findings

### 1) Profile card copy + identity mismatch

- Topbar subtitle still reads `Product Engineer` instead of requested `Software Developer`.
- Profile summary copy differs from requested line:
  - target currently: long engineering sentence
  - requested: `Full Stack Developer` + `. Command Line Junkie . Mac Head . Unix Enthusiast . Tool Addict..`

Files:

- `src/layouts/Base.astro`
- `src/components/ProfileCard.astro`

### 2) Social tile alignment + iconography in heading

- Social panel title/eyebrow has no iconographic support in the heading row.
- Social cards are left-aligned; Bentolink reference centers icon+label in each tile.

Files:

- `src/components/ProfileCard.astro`

### 3) Big-card interaction depth missing on profile shell

- Motion/elevation is strong on tool/stack tiles (`hover-elevate`) but weaker on the large profile subcards.
- Bentolink uses larger-surface lift and richer hover depth for identity/social parent cards.

Files:

- `src/components/ProfileCard.astro`

### 4) Section quick-nav shape/state drift

- Current `SectionQuickNav` is a rounded-rectangle container with static pills and no active blue state system.
- Bentolink uses pill chips, active blue glow, and section-aware state updates.

Files:

- `src/components/SectionQuickNav.astro`

### 5) Feature writing cards (Home) parity gaps

- CTA/micro-icon language is weaker vs Bentolink chip contract.
- Metadata chips need explicit iconography in-chip (calendar + clock) and stronger blue CTA posture.

Files:

- `src/components/FeatureWritingWidget.astro`

### 6) Blog card shape/weight behavior drift

- Card CTA can visually stretch in some layouts; should stay compact pill.
- Card content height can diverge strongly; cards should remain constrained and visually consistent.
- Typography weight needs stronger title mass closer to Bentolink appearance.

Files:

- `src/styles/theme.css` (`.articleCard*`, `.articleGrid*`)
- `src/components/ArticleCard.astro` (structure hooks already compatible)

### 7) Material depth/shadow tuning needed

- Home `widget-box`, profile cards, social cards, and blog cards are flatter than Bentolink references.
- Need stronger layered shadow + border contrast + hover escalation.

Files:

- `src/pages/index.astro` (widget-box local styles)
- `src/components/ProfileCard.astro`
- `src/styles/theme.css` (`.articleCard*`)

## Execution Plan

### Phase A: Home shell + profile parity

1. Update identity copy (`Software Developer`, requested profile line).
2. Add heading iconography and centered social tile layout.
3. Apply large-card hover/parallax/elevation to profile subcards.
4. Increase profile/social card depth and hover contrast.

### Phase B: Section nav parity

1. Replace simplified nav style with Bentolink-style pill system.
2. Add active blue state (`.is-active`) and intersection-aware updates.
3. Preserve keyboard accessibility and reduced motion behavior.

### Phase C: Home writing widget parity

1. Add article/meta iconography in cards.
2. Strengthen blue pill CTA and chip hierarchy.
3. Keep card footprint constrained and consistent.

### Phase D: Blog card parity

1. Constrain card geometry to prevent visual expansion drift.
2. Enforce compact pill CTA (`justify-self: start`, `width: fit-content`).
3. Strengthen card title weight and material depth.
4. Keep iconography consistent in metadata + CTA.

### Phase E: Validation

1. `bun run format`
2. `bun run lint`
3. `bun run build`
4. Visual check: Home + Blog card blocks against parity notes

## Definition of Done

- Home profile and social block match Bentolink alignment/motion/depth direction.
- Section quick nav uses true pill chips with blue active state.
- Feature writing cards and blog cards maintain compact blue CTA pills, iconized metadata, and no uncontrolled card expansion.
- Typography weight on blog cards is visibly stronger and consistent with Bentolink references.
