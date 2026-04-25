import { vi } from "vite-plus/test";
import { installAnimationStubs, installMatchMediaStub } from "../helpers/browser";

function rect({
  left,
  top = 0,
  width,
  height = 300,
}: {
  left: number;
  top?: number;
  width: number;
  height?: number;
}): DOMRect {
  return {
    x: left,
    y: top,
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
    toJSON() {
      return {};
    },
  } as DOMRect;
}

function installHorizontalMetrics(track: HTMLElement, slides: HTMLElement[]) {
  const trackLeft = 120;
  const slideWidth = 420;
  const gap = 32;
  const baseOffsets = slides.map((_, index) => index * (slideWidth + gap));
  let scrollLeft = 0;

  Object.defineProperty(track, "clientWidth", {
    configurable: true,
    value: slideWidth,
  });
  Object.defineProperty(track, "scrollWidth", {
    configurable: true,
    value: baseOffsets.at(-1)! + slideWidth,
  });
  Object.defineProperty(track, "scrollLeft", {
    configurable: true,
    get: () => scrollLeft,
    set: (value: number) => {
      scrollLeft = value;
    },
  });
  Object.defineProperty(track, "offsetLeft", {
    configurable: true,
    value: 0,
  });
  Object.defineProperty(track, "getBoundingClientRect", {
    configurable: true,
    value: () => rect({ left: trackLeft, width: slideWidth }),
  });

  Object.defineProperty(track, "scrollTo", {
    configurable: true,
    value: vi.fn((value: number | ScrollToOptions = 0, y?: number) => {
      if (typeof value === "number") {
        scrollLeft = value;
      } else {
        scrollLeft = value.left ?? scrollLeft;
      }
      if (typeof y === "number") {
        scrollLeft = value as number;
      }
      track.dispatchEvent(new Event("scroll"));
    }),
  });

  slides.forEach((slide, index) => {
    Object.defineProperty(slide, "getBoundingClientRect", {
      configurable: true,
      value: () => rect({ left: trackLeft + baseOffsets[index] - scrollLeft, width: slideWidth }),
    });
    Object.defineProperty(slide, "offsetWidth", {
      configurable: true,
      value: slideWidth,
    });
    Object.defineProperty(slide, "offsetLeft", {
      configurable: true,
      value: baseOffsets[index],
    });
  });

  return {
    getScrollLeft: () => scrollLeft,
    getSlideOffset(index: number) {
      return baseOffsets[index];
    },
  };
}

describe("case carousel", () => {
  async function loadModule() {
    return import("../../src/scripts/motion/case-carousel");
  }

  beforeEach(() => {
    installAnimationStubs();
    installMatchMediaStub({ reducedMotion: true });
    document.body.innerHTML = `
      <section data-case-slider>
        <nav>
          <button data-case-nav="one" aria-pressed="true" type="button">One</button>
          <button data-case-nav="two" aria-pressed="false" type="button">Two</button>
          <button data-case-nav="three" aria-pressed="false" type="button">Three</button>
        </nav>
        <button data-case-prev type="button">Previous</button>
        <span data-case-progress>1 / 3</span>
        <button data-case-next type="button">Next</button>
        <span data-swipe-hint>Hint</span>
        <div data-case-track>
          <article data-case-slide="one" aria-hidden="false"></article>
          <article data-case-slide="two" aria-hidden="true"></article>
          <article data-case-slide="three" aria-hidden="true"></article>
        </div>
      </section>
    `;
  });

  afterEach(async () => {
    const { cleanupCaseCarousel } = await loadModule();
    cleanupCaseCarousel();
    vi.resetModules();
    document.body.innerHTML = "";
  });

  test("clicking a pill scrolls to the matching slide", async () => {
    const { initCaseCarousel } = await loadModule();
    const track = document.querySelector("[data-case-track]") as HTMLElement;
    const slides = Array.from(document.querySelectorAll("[data-case-slide]")) as HTMLElement[];
    const { getSlideOffset, getScrollLeft } = installHorizontalMetrics(track, slides);

    initCaseCarousel();

    expect(track.getAttribute("data-lenis-prevent-horizontal")).toBe("");
    expect(track.getAttribute("data-lenis-prevent")).toBeNull();

    (document.querySelectorAll("[data-case-nav]")[1] as HTMLButtonElement).click();

    expect(track.scrollTo).toHaveBeenCalledWith({
      behavior: "auto",
      left: getSlideOffset(1),
    });
    expect(getScrollLeft()).toBe(getSlideOffset(1));
    expect(
      Array.from(document.querySelectorAll("[data-case-nav]")).map((pill) =>
        pill.getAttribute("aria-pressed"),
      ),
    ).toEqual(["false", "true", "false"]);
    expect(
      Array.from(document.querySelectorAll("[data-case-slide]")).map((slide) =>
        slide.getAttribute("aria-hidden"),
      ),
    ).toEqual(["true", "false", "true"]);
  });

  test("a pill still scrolls correctly after the track was moved before the click", async () => {
    const { initCaseCarousel } = await loadModule();
    const track = document.querySelector("[data-case-track]") as HTMLElement;
    const slides = Array.from(document.querySelectorAll("[data-case-slide]")) as HTMLElement[];
    const { getSlideOffset, getScrollLeft } = installHorizontalMetrics(track, slides);

    initCaseCarousel();

    track.scrollLeft = getSlideOffset(1);
    track.dispatchEvent(new Event("scroll"));
    (document.querySelectorAll("[data-case-nav]")[2] as HTMLButtonElement).click();

    expect(getScrollLeft()).toBe(getSlideOffset(2));
    expect(
      Array.from(document.querySelectorAll("[data-case-nav]")).map((pill) =>
        pill.getAttribute("aria-pressed"),
      ),
    ).toEqual(["false", "false", "true"]);
    expect(
      Array.from(document.querySelectorAll("[data-case-slide]")).map((slide) =>
        slide.getAttribute("aria-hidden"),
      ),
    ).toEqual(["true", "true", "false"]);
  });

  test("step controls move forward and back with disabled boundary states", async () => {
    const { initCaseCarousel } = await loadModule();
    const track = document.querySelector("[data-case-track]") as HTMLElement;
    const slides = Array.from(document.querySelectorAll("[data-case-slide]")) as HTMLElement[];
    const { getSlideOffset, getScrollLeft } = installHorizontalMetrics(track, slides);
    const previous = document.querySelector("[data-case-prev]") as HTMLButtonElement;
    const next = document.querySelector("[data-case-next]") as HTMLButtonElement;
    const progress = document.querySelector("[data-case-progress]") as HTMLElement;

    initCaseCarousel();

    expect(previous.disabled).toBe(true);
    expect(next.disabled).toBe(false);
    expect(progress.textContent).toBe("1 / 3");

    next.click();
    expect(getScrollLeft()).toBe(getSlideOffset(1));
    expect(previous.disabled).toBe(false);
    expect(next.disabled).toBe(false);
    expect(progress.textContent).toBe("2 / 3");

    next.click();
    expect(getScrollLeft()).toBe(getSlideOffset(2));
    expect(previous.disabled).toBe(false);
    expect(next.disabled).toBe(true);
    expect(progress.textContent).toBe("3 / 3");

    previous.click();
    expect(getScrollLeft()).toBe(getSlideOffset(1));
    expect(previous.disabled).toBe(false);
    expect(next.disabled).toBe(false);
    expect(progress.textContent).toBe("2 / 3");
  });
});
