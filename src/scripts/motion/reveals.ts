/**
 * Scroll-triggered reveal orchestration.
 *
 * Handles both generic `[data-reveal]` elements and scoped section reveals
 * like `.stage-intro`, so supporting copy, controls, and media enter as one
 * composition instead of unrelated text-only effects.
 */

import type { AnimationPlaybackControlsWithThen, DOMKeyframesDefinition } from "motion";
import { inView, stagger } from "motion";
import { animateDOM } from "./dom-animate";
import { SPRING_HEAVY, SPRING_SMOOTH } from "./springs";

const MAX_STAGGER_DELAY_S = 0.18;
const STEP_S = 0.06;

type StopFn = VoidFunction;

let cleanups: StopFn[] = [];
let animations: AnimationPlaybackControlsWithThen[] = [];

function parseDelay(el: HTMLElement): number {
  const explicit = el.dataset.revealDelay;
  if (explicit) {
    const ms = Number.parseFloat(explicit);
    return Number.isNaN(ms) ? 0 : ms / 1000;
  }

  const order = el.dataset.revealOrder;
  if (order !== undefined) {
    const n = Number(order);
    return Number.isNaN(n) ? 0 : Math.min(Math.max(n, 0) * STEP_S, MAX_STAGGER_DELAY_S);
  }

  return 0;
}

function isArticlePage(): boolean {
  const path = window.location.pathname;
  return path.startsWith("/blog/") && path !== "/blog/" && !path.startsWith("/blog/category/");
}

function usesCompoundTransform(el: HTMLElement): boolean {
  return (
    el.classList.contains("hover-elevate") ||
    el.hasAttribute("data-parallax-card") ||
    el.classList.contains("motion-chip") ||
    el.classList.contains("motion-cta-pill")
  );
}

function markVisible(el: HTMLElement): void {
  el.classList.add("is-visible");
  el.style.setProperty("--scroll-progress", "1");
  el.style.setProperty("--reveal-translate", "0px");
  el.style.setProperty("--reveal-scale", "1");
}

function revealKeyframes(el: HTMLElement): DOMKeyframesDefinition {
  const type = el.dataset.revealType;

  if (usesCompoundTransform(el)) {
    if (type === "scale") {
      return {
        opacity: [0, 1],
        "--reveal-translate": ["10px", "0px"],
        "--reveal-scale": ["0.97", "1"],
      };
    }

    return {
      opacity: [0, 1],
      "--reveal-translate": ["16px", "0px"],
      "--reveal-scale": ["0.985", "1"],
    };
  }

  if (type === "scale") {
    return {
      opacity: [0, 1],
      transform: ["translateY(10px) scale(0.97)", "translateY(0) scale(1)"],
    };
  }

  if (type === "slide-left") {
    return {
      opacity: [0, 1],
      transform: ["translateX(18px)", "translateX(0)"],
    };
  }

  if (type === "fade") {
    return {
      opacity: [0, 1],
      transform: ["translateY(10px)", "translateY(0)"],
    };
  }

  return {
    opacity: [0, 1],
    transform: ["translateY(16px)", "translateY(0)"],
  };
}

function animateReveal(
  targets: HTMLElement | HTMLElement[],
  keyframes: DOMKeyframesDefinition,
  options: { delay?: number | ReturnType<typeof stagger>; duration?: number } = {},
): void {
  const elements = Array.isArray(targets) ? targets : [targets];
  const ctrl = animateDOM(targets, keyframes, {
    ...SPRING_SMOOTH,
    delay: options.delay,
  });

  animations.push(ctrl);
  for (const el of elements) {
    markVisible(el);
  }
}

function collectStageTargets(stage: HTMLElement): HTMLElement[] {
  const copy = stage.querySelector<HTMLElement>(".stage-intro__copy");
  const targets: HTMLElement[] = [];

  if (copy) {
    const eyebrow = copy.querySelector<HTMLElement>(".stage-intro__eyebrow");
    const title = copy.querySelector<HTMLElement>(".stage-intro__title");
    const caption = copy.querySelector<HTMLElement>(".stage-intro__caption");

    if (eyebrow) targets.push(eyebrow);
    if (title) targets.push(title);
    if (caption) targets.push(caption);
  }

  for (const child of Array.from(stage.children)) {
    if (!(child instanceof HTMLElement) || child === copy) continue;
    targets.push(child);
  }

  return targets;
}

function animateStageSequence(stage: HTMLElement): void {
  const copy = stage.querySelector<HTMLElement>(".stage-intro__copy");
  const eyebrow = copy?.querySelector<HTMLElement>(".stage-intro__eyebrow");
  const title = copy?.querySelector<HTMLElement>(".stage-intro__title");
  const caption = copy?.querySelector<HTMLElement>(".stage-intro__caption");

  // Non-copy children (media, controls, etc.)
  const extras: HTMLElement[] = [];
  for (const child of Array.from(stage.children)) {
    if (child instanceof HTMLElement && child !== copy) extras.push(child);
  }

  // Orchestrated sequence with overlapping delays
  let offset = 0;

  if (eyebrow) {
    const ctrl = animateDOM(
      eyebrow,
      { opacity: [0, 1], transform: ["translateY(14px)", "translateY(0)"] },
      { ...SPRING_SMOOTH, delay: offset },
    );
    animations.push(ctrl);
    markVisible(eyebrow);
    offset += 0.08;
  }

  if (title) {
    const ctrl = animateDOM(
      title,
      { opacity: [0, 1], transform: ["translateY(20px)", "translateY(0)"] },
      { ...SPRING_HEAVY, delay: offset },
    );
    animations.push(ctrl);
    markVisible(title);
    offset += 0.1;
  }

  if (caption) {
    const ctrl = animateDOM(
      caption,
      { opacity: [0, 1], transform: ["translateY(12px)", "translateY(0)"] },
      { ...SPRING_SMOOTH, delay: offset },
    );
    animations.push(ctrl);
    markVisible(caption);
    offset += 0.08;
  }

  for (let i = 0; i < extras.length; i++) {
    const ctrl = animateDOM(
      extras[i],
      { opacity: [0, 1], transform: ["translateY(16px)", "translateY(0)"] },
      { ...SPRING_SMOOTH, delay: offset + i * 0.06 },
    );
    animations.push(ctrl);
    markVisible(extras[i]);
  }
}

function initStageReveals(): void {
  const stages = Array.from(document.querySelectorAll<HTMLElement>(".stage-intro"));

  for (const stage of stages) {
    const targets = collectStageTargets(stage);
    if (!targets.length) continue;

    if (isArticlePage()) {
      for (const target of targets) markVisible(target);
      continue;
    }

    cleanups.push(inView(stage, () => animateStageSequence(stage), { margin: "0px 0px -14% 0px" }));
  }
}

function initScopedContainerReveals(): void {
  const containers = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal-children]"));

  for (const container of containers) {
    const targets = Array.from(container.children).filter(
      (child): child is HTMLElement => child instanceof HTMLElement,
    );
    if (!targets.length) continue;

    cleanups.push(
      inView(
        container,
        () => {
          animateReveal(
            targets,
            {
              opacity: [0, 1],
              transform: ["translateY(18px)", "translateY(0)"],
            },
            { delay: stagger(0.05), duration: 0.4 },
          );
        },
        { margin: "0px 0px -14% 0px" },
      ),
    );
  }
}

function isManagedByScopedReveal(el: HTMLElement): boolean {
  return !!el.closest(".stage-intro, [data-reveal-children]");
}

export function initReveals(): void {
  cleanupReveals();

  initStageReveals();
  initScopedContainerReveals();

  const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]")).filter(
    (el) => !isManagedByScopedReveal(el),
  );

  if (!elements.length) return;

  if (isArticlePage()) {
    for (const el of elements) markVisible(el);
    return;
  }

  const groups = new Map<string, HTMLElement[]>();
  const ungrouped: HTMLElement[] = [];

  for (const el of elements) {
    const group = el.dataset.revealGroup;
    if (!group) {
      ungrouped.push(el);
      continue;
    }

    const list = groups.get(group) ?? [];
    list.push(el);
    groups.set(group, list);
  }

  for (const el of ungrouped) {
    const hasExit = el.hasAttribute("data-reveal-exit");

    cleanups.push(
      inView(
        el,
        () => {
          animateReveal(el, revealKeyframes(el), {
            delay: parseDelay(el),
          });

          if (hasExit) {
            return () => {
              el.classList.remove("is-visible");
              animateDOM(
                el,
                usesCompoundTransform(el)
                  ? { opacity: [1, 0], "--reveal-translate": ["0px", "8px"] }
                  : { opacity: [1, 0], transform: ["translateY(0)", "translateY(8px)"] },
                { ...SPRING_SMOOTH },
              );
            };
          }
        },
        { margin: "0px 0px -12% 0px" },
      ),
    );
  }

  for (const [, grouped] of groups) {
    if (!grouped.length) continue;

    cleanups.push(
      inView(
        grouped[0],
        () => {
          animateReveal(grouped, revealKeyframes(grouped[0]), {
            duration: 0.4,
            delay: stagger(STEP_S),
          });
        },
        { margin: "0px 0px -12% 0px" },
      ),
    );
  }
}

export function showAllReveals(): void {
  const generic = document.querySelectorAll<HTMLElement>("[data-reveal]");
  const stageTargets = document.querySelectorAll<HTMLElement>(
    ".stage-intro__eyebrow, .stage-intro__title, .stage-intro__caption, .stage-intro > :not(.stage-intro__copy)",
  );

  for (const el of [...generic, ...stageTargets]) {
    markVisible(el);
  }
}

export function cleanupReveals(): void {
  for (const ctrl of animations) ctrl.stop();
  animations = [];
  for (const stop of cleanups) stop();
  cleanups = [];
}
