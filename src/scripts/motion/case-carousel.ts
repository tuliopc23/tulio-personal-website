/**
 * Case-study carousel (native scroll rail).
 *
 * Uses native horizontal scrolling plus scroll-snap so touch, trackpad,
 * and wheel behavior match the blog and GitHub rails.
 */

import type { AnimationPlaybackControlsWithThen } from "motion";
import { animateDOM } from "./dom-animate";
import { isReducedMotion } from "./reduced-motion";
import { SPRING_SNAPPY } from "./springs";

let slider: HTMLElement | null = null;
let track: HTMLElement | null = null;
let pills: HTMLElement[] = [];
let slides: HTMLElement[] = [];
let hint: HTMLElement | null = null;
let currentIndex = 0;
let hasDismissedHint = false;
let hintAnim: AnimationPlaybackControlsWithThen | null = null;

function updateAria(index: number): void {
  slides.forEach((slide, i) => {
    slide.setAttribute("aria-hidden", i === index ? "false" : "true");
  });
  pills.forEach((pill, i) => {
    pill.setAttribute("aria-pressed", i === index ? "true" : "false");
    pill.classList.toggle("cta-pill--accent", i === index);
    pill.classList.toggle("cta-pill--neutral", i !== index);
  });
}

function startHintLoop(): void {
  if (!hint || isReducedMotion()) return;
  hintAnim = animateDOM(
    hint,
    { transform: ["translateX(0px)", "translateX(-5px)", "translateX(0px)"] },
    { duration: 2, repeat: Infinity, ease: "easeInOut" },
  );
}

function dismissHint(): void {
  if (hasDismissedHint || !hint) return;
  hasDismissedHint = true;
  if (hintAnim) {
    hintAnim.stop();
    hintAnim = null;
  }
  if (isReducedMotion()) {
    hint.style.display = "none";
    return;
  }
  animateDOM(
    hint,
    { opacity: [null, 0], transform: [null, "translateX(-8px)"] },
    { ...SPRING_SNAPPY },
  ).finished.then(() => {
    if (hint) hint.style.display = "none";
  });
}

function goTo(index: number): void {
  if (!track || index < 0 || index >= slides.length) return;
  currentIndex = index;
  updateAria(index);
  dismissHint();
  slides[index]?.scrollIntoView({
    behavior: isReducedMotion() ? "auto" : "smooth",
    block: "nearest",
    inline: "start",
  });
}

function onTrackScroll(): void {
  if (!track || slides.length === 0) return;
  dismissHint();
  const width = Math.max(track.clientWidth, 1);
  const nextIndex = Math.max(0, Math.min(slides.length - 1, Math.round(track.scrollLeft / width)));
  if (nextIndex === currentIndex) return;
  currentIndex = nextIndex;
  updateAria(nextIndex);
}

function onPillKeyDown(event: KeyboardEvent): void {
  const current = event.currentTarget as HTMLElement | null;
  if (!current || pills.length === 0) return;
  const index = pills.indexOf(current);
  if (index === -1) return;

  if (event.key === "ArrowRight") {
    event.preventDefault();
    pills[(index + 1) % pills.length]?.focus();
  } else if (event.key === "ArrowLeft") {
    event.preventDefault();
    pills[(index - 1 + pills.length) % pills.length]?.focus();
  }
}

function onResize(): void {
  if (!track || slides.length === 0) return;
  slides[currentIndex]?.scrollIntoView({ behavior: "auto", block: "nearest", inline: "start" });
}

export function initCaseCarousel(): void {
  cleanupCaseCarousel();

  slider = document.querySelector<HTMLElement>("[data-case-slider]");
  if (!slider) return;

  track = slider.querySelector<HTMLElement>("[data-case-track]");
  pills = Array.from(slider.querySelectorAll<HTMLElement>("[data-case-nav]"));
  slides = Array.from(slider.querySelectorAll<HTMLElement>("[data-case-slide]"));
  hint = slider.querySelector<HTMLElement>("[data-swipe-hint]");
  if (!track || slides.length === 0) return;

  updateAria(0);
  startHintLoop();
  slides[0]?.scrollIntoView({ behavior: "auto", block: "nearest", inline: "start" });

  pills.forEach((pill, i) => {
    pill.addEventListener("click", () => goTo(i));
    pill.addEventListener("keydown", onPillKeyDown);
  });

  track.addEventListener("scroll", onTrackScroll, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });
}

export function cleanupCaseCarousel(): void {
  if (hintAnim) {
    hintAnim.stop();
    hintAnim = null;
  }

  if (track) track.removeEventListener("scroll", onTrackScroll);
  pills.forEach((pill) => pill.removeEventListener("keydown", onPillKeyDown));
  window.removeEventListener("resize", onResize);

  slider = null;
  track = null;
  pills = [];
  slides = [];
  hint = null;
  currentIndex = 0;
  hasDismissedHint = false;
}
