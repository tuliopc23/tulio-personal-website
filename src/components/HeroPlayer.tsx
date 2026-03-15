/** @jsxImportSource react */
import { Player } from "@remotion/player";
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
        backgroundColor: "#050505",
      }}
    >
      <img
        src="/images/hero/macintosh-cleaned.png"
        alt="Classic Macintosh computer displaying hello"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          objectPosition: "center center",
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero Player                                                        */
/* ------------------------------------------------------------------ */

export default function HeroPlayer() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const playerRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (!isClient || prefersReducedMotion) {
    return <StaticFallback />;
  }

  return (
    <Player
      ref={playerRef}
      component={HeroComposition}
      inputProps={{}}
      compositionWidth={COMPOSITION_WIDTH}
      compositionHeight={COMPOSITION_HEIGHT}
      durationInFrames={DURATION_FRAMES}
      fps={FPS}
      autoPlay
      loop={false}
      controls={false}
      initiallyMuted
      acknowledgeRemotionLicense
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  );
}
