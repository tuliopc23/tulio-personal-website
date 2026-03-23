/**
 * Shared spring presets for Motion's DOM animate().
 *
 * These are partial AnimationOptions objects that set `type: "spring"`
 * with tuned stiffness / damping / mass values.  Spread them into any
 * `animateDOM()` call to get real spring physics.
 *
 * Usage:
 *   animateDOM(el, keyframes, { ...SPRING_SNAPPY })
 *   animateDOM(el, keyframes, { ...SPRING_SMOOTH, duration: 0.4 })
 */

type SpringPreset = {
  type: "spring";
  stiffness: number;
  damping: number;
  mass: number;
};

/** Instant interactive response — hover arrows, press feedback. */
export const SPRING_SNAPPY: SpringPreset = {
  type: "spring",
  stiffness: 500,
  damping: 30,
  mass: 0.8,
};

/** Smooth settle — card resets, tilt returns, nav transitions. */
export const SPRING_SMOOTH: SpringPreset = {
  type: "spring",
  stiffness: 200,
  damping: 26,
  mass: 1.0,
};

/** Bouncy delight — focus rings, scroll-to-top entrance, badge appear. */
export const SPRING_BOUNCY: SpringPreset = {
  type: "spring",
  stiffness: 300,
  damping: 18,
  mass: 0.9,
};

/** Heavy / premium — page transitions, hero sequences. */
export const SPRING_HEAVY: SpringPreset = {
  type: "spring",
  stiffness: 120,
  damping: 20,
  mass: 1.2,
};

/** Quick micro — press scale, chip hover. */
export const SPRING_RESPONSIVE: SpringPreset = {
  type: "spring",
  stiffness: 400,
  damping: 28,
  mass: 0.7,
};
