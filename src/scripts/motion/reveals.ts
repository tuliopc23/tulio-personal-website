/**
 * Scroll-triggered reveal orchestration.
 *
 * Uses GSAP ScrollTrigger for reveal timing so Lenis and reveal playback
 * share the same scroll lifecycle instead of running separate systems.
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const MAX_STAGGER_DELAY_S = 0.18;
const STEP_S = 0.06;
const STAGE_TARGET_SELECTOR =
  ".stage-intro__eyebrow, .stage-intro__title, .stage-intro__caption, .stage-intro > :not(.stage-intro__copy)";
const GENERIC_REVEAL_SELECTOR = "[data-reveal], [data-reveal-children] > *";
const ALL_REVEAL_SELECTOR = `${GENERIC_REVEAL_SELECTOR}, ${STAGE_TARGET_SELECTOR}`;

type TweenLike = gsap.core.Tween | gsap.core.Timeline;

let animations: TweenLike[] = [];
let triggers: ScrollTrigger[] = [];

function setRevealState(state: "armed" | "running" | "ready" | "fallback"): void {
  document.documentElement.dataset.revealState = state;
}

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
}

function getGenericOffset(el: HTMLElement): number {
  switch (el.dataset.revealType) {
    case "scale":
      return 10;
    case "fade":
      return 10;
    case "slide-left":
      return 18;
    default:
      return 16;
  }
}

function setHiddenState(el: HTMLElement): void {
  if (usesCompoundTransform(el)) {
    gsap.set(el, {
      autoAlpha: 0,
      "--reveal-translate": `${getGenericOffset(el)}px`,
      "--reveal-scale": el.dataset.revealType === "scale" ? 0.97 : 0.985,
    });
    return;
  }

  const vars: gsap.TweenVars = {
    autoAlpha: 0,
    y: getGenericOffset(el),
  };

  if (el.dataset.revealType === "scale") {
    vars.scale = 0.97;
  }

  if (el.dataset.revealType === "slide-left") {
    delete vars.y;
    vars.x = 18;
  }

  gsap.set(el, vars);
}

function revealVars(el: HTMLElement): gsap.TweenVars {
  if (usesCompoundTransform(el)) {
    return {
      autoAlpha: 1,
      "--reveal-translate": "0px",
      "--reveal-scale": 1,
      duration: 0.72,
      ease: "power3.out",
    };
  }

  const vars: gsap.TweenVars = {
    autoAlpha: 1,
    x: 0,
    y: 0,
    scale: 1,
    duration: 0.72,
    ease: "power3.out",
    clearProps: "transform,opacity,visibility",
  };

  if (el.dataset.revealType === "fade") {
    delete vars.scale;
  }

  if (el.dataset.revealType === "slide-left") {
    delete vars.scale;
  }

  return vars;
}

function animateSingleReveal(el: HTMLElement, delay = 0): void {
  const tween = gsap.to(el, {
    ...revealVars(el),
    delay,
    onStart: () => markVisible(el),
  });

  animations.push(tween);
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

function initStageReveals(): void {
  const stages = Array.from(document.querySelectorAll<HTMLElement>(".stage-intro"));

  for (const stage of stages) {
    const targets = collectStageTargets(stage);
    if (!targets.length) continue;

    for (const target of targets) {
      gsap.set(target, { autoAlpha: 0, y: 14 });
    }

    const timeline = gsap.timeline({
      defaults: { duration: 0.72, ease: "power3.out" },
      scrollTrigger: {
        trigger: stage,
        start: "top 86%",
        once: true,
      },
      onStart: () => {
        for (const target of targets) markVisible(target);
      },
    });

    const [eyebrow, title, caption, ...extras] = targets;

    if (eyebrow)
      timeline.to(eyebrow, { autoAlpha: 1, y: 0, clearProps: "opacity,visibility,transform" }, 0);
    if (title) {
      timeline.to(
        title,
        { autoAlpha: 1, y: 0, clearProps: "opacity,visibility,transform" },
        eyebrow ? 0.08 : 0,
      );
    }
    if (caption) {
      timeline.to(
        caption,
        { autoAlpha: 1, y: 0, clearProps: "opacity,visibility,transform" },
        title ? 0.18 : 0.08,
      );
    }

    for (let index = 0; index < extras.length; index++) {
      timeline.to(
        extras[index],
        { autoAlpha: 1, y: 0, clearProps: "opacity,visibility,transform" },
        (caption ? 0.28 : 0.18) + index * 0.06,
      );
    }

    animations.push(timeline);
    if (timeline.scrollTrigger) triggers.push(timeline.scrollTrigger);
  }
}

function initScopedContainerReveals(): void {
  const containers = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal-children]"));

  for (const container of containers) {
    const targets = Array.from(container.children).filter(
      (child): child is HTMLElement => child instanceof HTMLElement,
    );
    if (!targets.length) continue;

    for (const target of targets) {
      gsap.set(target, { autoAlpha: 0, y: 18 });
    }

    const timeline = gsap.timeline({
      defaults: { duration: 0.68, ease: "power3.out" },
      scrollTrigger: {
        trigger: container,
        start: "top 86%",
        once: true,
      },
      onStart: () => {
        for (const target of targets) markVisible(target);
      },
    });

    timeline.to(targets, {
      autoAlpha: 1,
      y: 0,
      stagger: 0.05,
      clearProps: "opacity,visibility,transform",
    });

    animations.push(timeline);
    if (timeline.scrollTrigger) triggers.push(timeline.scrollTrigger);
  }
}

function isManagedByScopedReveal(el: HTMLElement): boolean {
  return !!el.closest(".stage-intro, [data-reveal-children]");
}

export function initReveals(): void {
  cleanupReveals();
  setRevealState("running");

  if (isArticlePage()) {
    showAllReveals();
    return;
  }

  initStageReveals();
  initScopedContainerReveals();

  const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]")).filter(
    (el) => !isManagedByScopedReveal(el),
  );

  if (!elements.length) {
    setRevealState("ready");
    return;
  }

  const groups = new Map<string, HTMLElement[]>();
  const ungrouped: HTMLElement[] = [];

  for (const el of elements) {
    setHiddenState(el);

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
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      once: true,
      onEnter: () => animateSingleReveal(el, parseDelay(el)),
    });
    triggers.push(trigger);
  }

  for (const [, grouped] of groups) {
    if (!grouped.length) continue;

    const timeline = gsap.timeline({
      defaults: { duration: 0.68, ease: "power3.out" },
      scrollTrigger: {
        trigger: grouped[0],
        start: "top 88%",
        once: true,
      },
      onStart: () => {
        for (const target of grouped) markVisible(target);
      },
    });

    for (const target of grouped) {
      setHiddenState(target);
    }

    grouped.forEach((target, index) => {
      timeline.to(
        target,
        {
          ...revealVars(target),
          clearProps: usesCompoundTransform(target)
            ? "opacity,visibility"
            : "opacity,visibility,transform",
        },
        index * 0.06,
      );
    });

    animations.push(timeline);
    if (timeline.scrollTrigger) triggers.push(timeline.scrollTrigger);
  }

  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
  });
}

export function showAllReveals(): void {
  const elements = document.querySelectorAll<HTMLElement>(ALL_REVEAL_SELECTOR);

  for (const el of elements) {
    markVisible(el);
    gsap.set(el, {
      autoAlpha: 1,
      x: 0,
      y: 0,
      scale: 1,
      "--reveal-translate": "0px",
      "--reveal-scale": 1,
      clearProps: "opacity,visibility,transform",
    });
  }

  setRevealState("ready");
}

export function cleanupReveals(): void {
  for (const animation of animations) animation.kill();
  animations = [];

  for (const trigger of triggers) trigger.kill();
  triggers = [];

  const elements = document.querySelectorAll<HTMLElement>(ALL_REVEAL_SELECTOR);
  for (const el of elements) {
    el.classList.remove("is-visible");
    gsap.set(el, {
      autoAlpha: 1,
      x: 0,
      y: 0,
      scale: 1,
      "--reveal-translate": "0px",
      "--reveal-scale": 1,
      clearProps: "opacity,visibility,transform",
    });
  }

  setRevealState("ready");
}
