# Blog Index Page Overrides

> **PROJECT:** Tulio Personal Website
> **Generated:** 2026-03-03 13:35:29
> **Page Type:** Blog / Article

> ⚠️ **IMPORTANT:** Rules in this file **override** the Master file (`design-system/MASTER.md`).
> Only deviations from the Master are documented here. For all other rules, refer to the Master.

---

## Page-Specific Rules

### Layout Overrides

- **Max Width:** 1200px (standard)
- **Layout:** Full-width sections, centered content
- **Sections:** 1. Hero (Value Prop + Form), 2. Recent Issues/Archives, 3. Social Proof (Subscriber count), 4. About Author

### Spacing Overrides

- No overrides — use Master spacing

### Typography Overrides

- No overrides — use Master typography

### Color Overrides

- **Strategy:** Minimalist. Paper-like background. Text focus. Accent color for Subscribe.

### Component Overrides

- Avoid: Expect z-index to work across contexts
- Avoid: Use arbitrary large z-index values

---

## Page-Specific Components

- No unique components for this page

---

## Recommendations

- Effects: z-index stacking, box-shadow elevation (4 levels), transform: translateZ(), backdrop-filter, parallax
- Layout: Understand what creates new stacking context
- Layout: Define z-index scale system (10 20 30 50)
- CTA Placement: Hero inline form + Sticky header form
