# Blog Design Patterns — Code Reference

## Card Structure Pattern

### Standard Article Card

```astro
<article class="articleCard hover-elevate motion-surface-standard" data-parallax-card>
  <a class="articleCard__link" href={href}>
    <header class="articleCard__header">
      <div class="articleCard__taxonomy">
        <!-- Categories/tags -->
      </div>
      <h3 class="articleCard__title">{title}</h3>
    </header>
    <p class="articleCard__summary">{summary}</p>
    <div class="articleCard__footer">
      <div class="articleCard__meta">
        <span class="articleCard__metaItem">
          <PhosphorIcon name="calendar" size={14} />
          <time>{dateLabel}</time>
        </span>
      </div>
      <span class="articleCard__cta">
        <span>Open entry</span>
        <PhosphorIcon name="arrow-up-right" size={16} />
      </span>
    </div>
  </a>
</article>
```

### Featured Article Card

```astro
<article class="articleCard hover-elevate motion-surface-premium articleCard--featured" data-parallax-card>
  <!-- Same structure, with .articleCard--featured class -->
  <!-- Includes .articleCard__halo for gradient effect -->
</article>
```

---

## CSS Pattern: Featured Card Styling

### Dark Mode

```css
[data-theme="dark"] .articleCard--featured {
  border-left: 3px solid #4da6ff;
  box-shadow:
    inset 3px 0 0 rgba(10, 132, 255, 0.2),
    0 4px 8px rgba(0, 0, 0, 0.1),
    0 12px 24px rgba(0, 0, 0, 0.15),
    0 24px 48px rgba(0, 0, 0, 0.2),
    0 0 40px rgba(10, 132, 255, 0.15);
}

[data-theme="dark"] .articleCard--featured:hover {
  box-shadow:
    inset 3px 0 0 rgba(10, 132, 255, 0.3),
    0 8px 16px rgba(0, 0, 0, 0.15),
    0 16px 32px rgba(0, 0, 0, 0.2),
    0 32px 64px rgba(0, 0, 0, 0.25),
    0 0 60px rgba(10, 132, 255, 0.25);
}
```

### Light Mode

```css
[data-theme="light"] .articleCard--featured {
  border-left: 3px solid #0071e3;
  box-shadow:
    inset 3px 0 0 rgba(0, 113, 227, 0.15),
    0 2px 4px rgba(31, 35, 53, 0.08),
    0 8px 16px rgba(31, 35, 53, 0.12),
    0 18px 36px rgba(31, 35, 53, 0.14),
    0 0 30px rgba(0, 113, 227, 0.12);
}
```

---

## Halo Gradient Pattern

### Featured Card Halo

```css
.articleCard__halo {
  position: absolute;
  inset: clamp(20px, 2.4vw, 34px);
  border-radius: clamp(var(--radius-md), 4vw, var(--radius-xl));
  background:
    radial-gradient(circle at 25% 25%, rgba(10, 132, 255, 0.48) 0%, transparent 60%),
    radial-gradient(circle at 75% 75%, rgba(94, 92, 230, 0.38) 0%, transparent 65%);
  opacity: 0.52;
  filter: blur(42px);
  z-index: -1;
}

[data-theme="dark"] .articleCard__halo {
  opacity: 0.72;
  filter: blur(50px);
}

[data-theme="light"] .articleCard__halo {
  opacity: 0.58;
  filter: blur(46px);
}
```

---

## Grid Layout Pattern

### Blog Surface Grid

```css
.blogSurface {
  display: grid;
  gap: clamp(var(--space-sm), 2.4vw, var(--space-lg));
  margin-bottom: clamp(var(--space-md), 4vw, 64px);
}

.blogSurface .articleGrid__item {
  flex-basis: clamp(292px, 28vw, 344px);
  max-width: clamp(292px, 28vw, 344px);
}
```

---

## Motion Classes

- `.hover-elevate` — Base elevation on hover
- `.motion-surface-standard` — Standard card motion (4px lift, 1.01 scale)
- `.motion-surface-premium` — Featured card motion (6px lift, 1.014 scale)
- `data-parallax-card` — Enables tilt parallax on hover
- `data-reveal` — Enables staggered entrance animation

---

## Key Tokens to Use

| Token                    | Value             | Usage               |
| ------------------------ | ----------------- | ------------------- |
| `--shadow-card`          | 4-layer system    | Base card shadow    |
| `--shadow-card-hover`    | Enhanced 4-layer  | Hover state         |
| `--motion-duration-fast` | 200ms             | Transition duration |
| `--motion-ease-out`      | cubic-bezier      | Easing function     |
| `--blue`                 | #0a84ff / #0071e3 | Accent color        |
| `--radius-card`          | 20px              | Card border radius  |
