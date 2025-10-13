## 1. Planning & Design Parity
- [ ] 1.1 Document Tech stack card anatomy (spacing, shadows, icon tile metrics)
- [ ] 1.2 Document Tech stack carousel behaviour across breakpoints

## 2. Tools Section Implementation
- [x] 2.1 Add Tools data collection with icon slugs and descriptions
- [x] 2.2 Render Tools section after Tech stack using existing Card components
- [x] 2.3 Wire PageIndicator/ScrollIndicator targeting Tools rail
- [x] 2.4 Register `#tools` anchor with in-page navigation/sidebar data (if required)

## 3. Asset Pipeline
- [x] 3.1 Normalise tool icon assets (light/dark variants, fallback glyphs)
- [x] 3.2 Ensure accessible labels/alt text mirror Tech stack cards

## 4. Verification
- [x] 4.1 Run `bun run check`
- [ ] 4.2 Visual regression check desktop/tablet/mobile light/dark
- [ ] 4.3 Assistive tech pass (keyboard focus + screen reader labels)
