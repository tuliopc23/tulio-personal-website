/** @jsxImportSource react */
import { Player, type PlayerRef } from "@remotion/player";
import { useEffect, useRef, useState } from "react";
import { HeroComposition } from "./remotion/HeroComposition";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const DESKTOP_WIDTH = 1920;
const DESKTOP_HEIGHT = 1080;
const MOBILE_WIDTH = 1080;
const MOBILE_HEIGHT = 1920;
const MOBILE_BREAKPOINT = 768;
const FPS = 30;
const DURATION_SECONDS = 7;
const DURATION_FRAMES = FPS * DURATION_SECONDS;

const MACINTOSH_IMAGE = "/images/hero/mac-asset-frame_upscayl_2x_upscayl-lite-4x.webp";

function readReducedMotionPreference(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* ------------------------------------------------------------------ */
/*  Static Fallback (reduced motion / SSR placeholder)                 */
/* ------------------------------------------------------------------ */

function StaticFallback() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <img
        src={MACINTOSH_IMAGE}
        alt="Classic Macintosh computer displaying hello"
        style={{
          position: "absolute",
          top: "3%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "90%",
          height: "auto",
          filter: "var(--mac-drop-shadow)",
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero Player                                                        */
/* ------------------------------------------------------------------ */

export default function HeroPlayer() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(readReducedMotionPreference);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth <= MOBILE_BREAKPOINT,
  );
  const playerRef = useRef<PlayerRef>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    let cancelled = false;
    let raf = 0;
    let startTime: number | null = null;
    let lastFrame = -1;

    const tick = (timestamp: number) => {
      if (cancelled) {
        return;
      }

      const player = playerRef.current;
      if (!player) {
        raf = requestAnimationFrame(tick);
        return;
      }

      if (startTime === null) {
        startTime = timestamp;
      }

      const elapsed = (timestamp - startTime) / 1000;
      const frame = Math.min(Math.floor(elapsed * FPS), DURATION_FRAMES - 1);

      if (frame !== lastFrame) {
        lastFrame = frame;
        player.seekTo(frame);
      }

      if (frame < DURATION_FRAMES - 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    return <StaticFallback />;
  }

  const compWidth = isMobile ? MOBILE_WIDTH : DESKTOP_WIDTH;
  const compHeight = isMobile ? MOBILE_HEIGHT : DESKTOP_HEIGHT;

  return (
    <Player
      ref={playerRef}
      component={HeroComposition}
      compositionWidth={compWidth}
      compositionHeight={compHeight}
      durationInFrames={DURATION_FRAMES}
      fps={FPS}
      loop={false}
      moveToBeginningWhenEnded={false}
      controls={false}
      initiallyMuted
      numberOfSharedAudioTags={0}
      acknowledgeRemotionLicense
      inputProps={{ isMobile }}
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  );
}
