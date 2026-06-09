/**
 * One signature scroll/interaction moment per route — progressive enhancement only.
 * Home hero corridor lives in scroll-progress.ts; this module handles other pages.
 */

import { scroll } from "motion";
import { subscribeScroll } from "../../lib/scroll-subscribe";
import { animateDOM } from "./dom-animate";
import { isReducedMotion } from "./reduced-motion";

type StopFn = VoidFunction;

let cleanups: StopFn[] = [];

function remember(stop: StopFn): void {
  cleanups.push(stop);
}

function setupAboutShowcase(): void {
  const frames = document.querySelectorAll<HTMLElement>(".aboutStage__frame");
  if (frames.length === 0) return;

  for (const frame of frames) {
    const stop = scroll(
      animateDOM(frame, {
        opacity: [0.82, 1],
        transform: ["translateY(16px)", "translateY(0)"],
      }),
      { target: frame, offset: ["start 92%", "start 55%"] },
    );
    remember(stop);
  }
}

function setupProjectsCaseDepth(): void {
  const track = document.querySelector<HTMLElement>("[data-case-track]");
  if (!track) return;

  const syncActiveSlide = (): void => {
    const slides = track.querySelectorAll<HTMLElement>("[data-case-slide]");
    if (slides.length === 0) return;

    const trackRect = track.getBoundingClientRect();
    const trackCenter = trackRect.left + trackRect.width * 0.5;

    slides.forEach((slide) => {
      const slideRect = slide.getBoundingClientRect();
      const slideCenter = slideRect.left + slideRect.width * 0.5;
      const distance = Math.abs(slideCenter - trackCenter);
      const proximity = Math.max(0, 1 - distance / Math.max(trackRect.width, 1));
      const scale = 0.97 + proximity * 0.03;
      const opacity = 0.72 + proximity * 0.28;
      slide.style.setProperty("--case-slide-scale", String(scale));
      slide.style.setProperty("--case-slide-opacity", String(opacity));
    });
  };

  syncActiveSlide();
  remember(subscribeScroll(syncActiveSlide));
  track.addEventListener("scroll", syncActiveSlide, { passive: true });
  remember(() => track.removeEventListener("scroll", syncActiveSlide));
}

function setupBlogFeaturedLift(): void {
  const featured = document.querySelector<HTMLElement>(".blogHero__featured");
  const hero = document.querySelector<HTMLElement>(".blogHero");
  if (!featured || !hero) return;

  const stop = scroll(
    animateDOM(featured, {
      transform: ["translateY(0)", "translateY(-8px)"],
      opacity: [1, 0.94],
    }),
    { target: hero, offset: ["start start", "end start"] },
  );
  remember(stop);
}

function setupReaderProgressGlow(): void {
  const bar = document.querySelector<HTMLElement>("[data-reading-progress]");
  const body = document.querySelector<HTMLElement>("[data-reading-body]");
  if (!bar || !body) return;

  const stop = scroll(
    animateDOM(bar, {
      opacity: [0.55, 1],
      filter: ["brightness(1)", "brightness(1.15)"],
    }),
    { target: body, offset: ["start end", "end start"] },
  );
  remember(stop);
}

function setupContactFocusGlow(): void {
  const card = document.querySelector<HTMLElement>("[data-contact-card]");
  if (!(card instanceof HTMLElement)) return;

  const onFocusIn = (): void => {
    card.dataset.focusActive = "true";
  };
  const onFocusOut = (event: FocusEvent): void => {
    if (card.contains(event.relatedTarget as Node)) return;
    delete card.dataset.focusActive;
  };

  card.addEventListener("focusin", onFocusIn);
  card.addEventListener("focusout", onFocusOut);
  remember(() => {
    card.removeEventListener("focusin", onFocusIn);
    card.removeEventListener("focusout", onFocusOut);
    delete card.dataset.focusActive;
  });
}

function setupUtilityRecovery(): void {
  const meta = document.querySelector<HTMLElement>(".pageBento--utility .pageHero__meta");
  if (!meta) return;

  meta.classList.add("pageHero__meta--recover");
}

function setupArchiveHeroSettle(): void {
  const hero = document.querySelector<HTMLElement>(".categoryHero, .blogHero");
  if (!hero) return;

  const stop = scroll(
    animateDOM(hero, {
      opacity: [1, 0.92],
      transform: ["translateY(0)", "translateY(-6px)"],
    }),
    { target: hero, offset: ["start start", "end start"] },
  );
  remember(stop);
}

export function initPageOverdrive(): void {
  cleanupPageOverdrive();

  const route = document.body.dataset.pageRoute ?? "";
  if (route === "contact") {
    // Focus ring enhancement — not scroll motion; keep for keyboard users under reduced motion.
    setupContactFocusGlow();
  }

  if (isReducedMotion()) return;

  switch (route) {
    case "about":
      setupAboutShowcase();
      break;
    case "projects":
      setupProjectsCaseDepth();
      break;
    case "blog-index":
      setupBlogFeaturedLift();
      break;
    case "blog-article":
      setupReaderProgressGlow();
      break;
    case "utility":
      setupUtilityRecovery();
      break;
    case "blog-archive":
      setupArchiveHeroSettle();
      break;
    default:
      break;
  }
}

export function cleanupPageOverdrive(): void {
  for (const stop of cleanups) stop();
  cleanups = [];

  document.querySelectorAll<HTMLElement>("[data-case-slide]").forEach((slide) => {
    slide.style.removeProperty("--case-slide-scale");
    slide.style.removeProperty("--case-slide-opacity");
  });
}
