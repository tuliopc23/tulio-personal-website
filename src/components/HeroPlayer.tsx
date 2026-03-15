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

const BG_COLORS = {
  dark: "#050505",
  light: "#f5f5f7",
} as const;

const MACINTOSH_IMAGES = {
  dark: "/images/hero/macintosh-cleaned.png",
  light: "/images/hero/macintosh-cleaned-light.png",
} as const;

/* ------------------------------------------------------------------ */
/*  Theme detection hook                                               */
/* ------------------------------------------------------------------ */

type Theme = "dark" | "light";

function useTheme(): Theme {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const root = document.documentElement;
    const initial = root.getAttribute("data-theme");
    if (initial === "light" || initial === "dark") {
      setTheme(initial);
    }

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "attributes" && mutation.attributeName === "data-theme") {
          const next = root.getAttribute("data-theme");
          if (next === "light" || next === "dark") {
            setTheme(next);
          }
        }
      }
    });

    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  return theme;
}

/* ------------------------------------------------------------------ */
/*  Static Fallback (reduced motion / SSR placeholder)                 */
/* ------------------------------------------------------------------ */

function StaticFallback({ theme }: { theme: Theme }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        backgroundColor: BG_COLORS[theme],
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        src={MACINTOSH_IMAGES[theme]}
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
  const playerRef = useRef<PlayerRef>(null);
  const theme = useTheme();

  useEffect(() => {
    setIsClient(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  /* Hold on the last frame when playback ends — prevents reset to frame 0.
     The Player mounts after isClient flips true (second render), so we
     wait one rAF for the ref to be populated before attaching. */
  useEffect(() => {
    if (!isClient) return;

    let cancelled = false;
    let removeListener: (() => void) | undefined;

    const raf = requestAnimationFrame(() => {
      if (cancelled) return;
      const player = playerRef.current;
      if (!player) return;

      const onEnded = () => player.seekTo(DURATION_FRAMES - 1);
      player.addEventListener("ended", onEnded);
      removeListener = () => player.removeEventListener("ended", onEnded);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      removeListener?.();
    };
  }, [isClient]);

  if (!isClient || prefersReducedMotion) {
    return <StaticFallback theme={theme} />;
  }

  return (
    <Player
      ref={playerRef}
      component={HeroComposition}
      inputProps={{ theme }}
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
