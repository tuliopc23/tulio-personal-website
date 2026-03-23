/**
 * Typed wrapper around Motion's `animate()` for DOM elements.
 *
 * Motion v12's TypeScript overloads struggle with `HTMLElement` —
 * they match the generic `ObjectTarget<O>` overload instead of the
 * `DOMKeyframesDefinition` one.  This helper narrows the call so
 * that every consumer gets the correct DOM overload without casts.
 */

import type {
  AnimationOptions,
  AnimationPlaybackControlsWithThen,
  DOMKeyframesDefinition,
} from "motion";
import { animate } from "motion";

type DOMTarget = Element | Element[] | NodeListOf<Element> | string;

export function animateDOM(
  target: DOMTarget,
  keyframes: DOMKeyframesDefinition,
  options?: AnimationOptions,
): AnimationPlaybackControlsWithThen {
  // The runtime accepts Element | Element[] just fine — this cast
  // convinces the compiler to pick the DOM overload.
  return (
    animate as (
      t: DOMTarget,
      kf: DOMKeyframesDefinition,
      opts?: AnimationOptions,
    ) => AnimationPlaybackControlsWithThen
  )(target, keyframes, options);
}
