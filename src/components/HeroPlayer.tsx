/** @jsxImportSource react */
import { Player, type PlayerRef } from "@remotion/player";
import { useEffect, useRef, useState } from "react";
import { HeroComposition } from "./remotion/HeroComposition";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const COMPOSITION_WIDTH = 1920;
const COMPOSITION_HEIGHT = 1080;
const FPS = 30;
const DURATION_SECONDS = 7;
const DURATION_FRAMES = FPS * DURATION_SECONDS;

const MACINTOSH_IMAGE = "/images/hero/mac-asset-frame_upscayl_2x_upscayl-lite-4x.png";

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
  const playerRef = useRef<PlayerRef>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    let cancelled = false;
    let removeListener: (() => void) | undefined;
    let raf = 0;

    const syncPlayback = () => {
      if (cancelled) {
        return;
      }

      const player = playerRef.current;
      if (!player) {
        raf = requestAnimationFrame(syncPlayback);
        return;
      }

      const holdLastFrame = () => {
        player.seekTo(DURATION_FRAMES - 1);
        player.pause();
      };

      const onEnded = () => holdLastFrame();
      player.addEventListener("ended", onEnded);
      removeListener = () => player.removeEventListener("ended", onEnded);

      player.seekTo(0);
      player.play();
    };

    raf = requestAnimationFrame(syncPlayback);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      removeListener?.();
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    return <StaticFallback />;
  }

  return (
    <Player
      ref={playerRef}
      component={HeroComposition}
      compositionWidth={COMPOSITION_WIDTH}
      compositionHeight={COMPOSITION_HEIGHT}
      durationInFrames={DURATION_FRAMES}
      fps={FPS}
      loop={false}
      moveToBeginningWhenEnded={false}
      controls={false}
      initiallyMuted
      autoPlay
      acknowledgeRemotionLicense
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  );
}
