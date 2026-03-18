/** @jsxImportSource react */

import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  HELLO_DOT_CX,
  HELLO_DOT_CY,
  HELLO_DOT_R,
  HELLO_PATH,
  HELLO_PATH_LENGTH,
  HELLO_VIEWBOX,
} from "./HelloPathData";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

export type HeroCompositionProps = {
  isMobile?: boolean;
};

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const MACINTOSH_IMAGE = "/images/hero/mac-asset-frame_upscayl_2x_upscayl-lite-4x.png";

/* Transparent framed asset is 3072x2048 (3:2). Screen bounds measured
   against the asset itself so hello tracks the actual CRT opening. */
const SCREEN = {
  top: 18.5,
  left: 32.5,
  width: 35.0,
  height: 31.0,
} as const;

/* Desktop: Mac at 90% of 1920×1080 landscape composition — fills width. */
const DESKTOP_MAC = { top: 3, width: 90 } as const;

/* Mobile: portrait 1080×1920 composition. The Mac must be massive to fill
   the screen height. At 220% width (3:2 → height ~76% of 1920), the Mac
   dominates vertically. Sides overflow and are clipped by composition bounds.
   The CRT screen + bezel remain fully visible and centered. */
const MOBILE_MAC = { top: 5, width: 220 } as const;

const HELLO_SCALE = 0.76;

function helloPosition() {
  const wPct = SCREEN.width * HELLO_SCALE;
  const lPct = SCREEN.left + (SCREEN.width - wPct) / 2;
  const hPct = (wPct / 100 / 2.58) * 100;
  const tPct = SCREEN.top + (SCREEN.height - hPct) / 2;
  return { top: `${tPct}%`, left: `${lPct}%`, width: `${wPct}%` };
}

const HELLO_POSITION = helloPosition();

/* Dramatic drop-shadow for the Mac — works on both themes since the
   asset has a transparent background. The shadow creates depth and
   visual drama matching the original design intent. */
/* ------------------------------------------------------------------ */
/*  Macintosh Image — clip-path circle reveal with subtle scale settle */
/* ------------------------------------------------------------------ */

function MacintoshLayer({ isMobile }: { isMobile: boolean }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mac = isMobile ? MOBILE_MAC : DESKTOP_MAC;

  /* Cinematic fade-in: smooth, slow opacity ramp for a soft emergence */
  const fadeStart = 0;
  const fadeEnd = Math.round(2.0 * fps); // Extended duration for calm transition
  const opacity = interpolate(frame, [fadeStart, fadeEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  /* Extremely subtle blur-to-clear interpolation */
  const blur = interpolate(frame, [fadeStart, fadeEnd], [8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  return (
    <AbsoluteFill
      style={{
        opacity,
        filter: `blur(${blur}px)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: `${mac.top}%`,
          left: "50%",
          transform: "translateX(-50%)",
          width: `${mac.width}%`,
          aspectRatio: "3 / 2",
          filter: "var(--mac-drop-shadow)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: `${SCREEN.top}%`,
            left: `${SCREEN.left}%`,
            width: `${SCREEN.width}%`,
            height: `${SCREEN.height}%`,
            background: "#f5f5f0",
            borderRadius: "2%",
            zIndex: 0,
          }}
        />
        <Img
          src={MACINTOSH_IMAGE}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "center center",
            zIndex: 1,
          }}
        />
      </div>
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ */
/*  Hello SVG Path Draw — renders inside the CRT screen area           */
/* ------------------------------------------------------------------ */

function HelloDraw({ isMobile }: { isMobile: boolean }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mac = isMobile ? MOBILE_MAC : DESKTOP_MAC;

  const drawStart = Math.round(0.9 * fps); // frame 27 — starts as reveal nears completion
  const drawEnd = Math.round(3.2 * fps); // frame 96
  const dotAppear = Math.round(3.1 * fps); // frame 93

  const drawProgress = interpolate(frame, [drawStart, drawEnd], [0, HELLO_PATH_LENGTH], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  const strokeOpacity = interpolate(frame, [drawStart, drawStart + 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const dotScale = spring({
    frame: frame - dotAppear,
    fps,
    config: { damping: 12, stiffness: 200, mass: 0.5 },
  });

  return (
    <AbsoluteFill
      style={{
        opacity: strokeOpacity,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: `${mac.top}%`,
          left: "50%",
          transform: "translateX(-50%)",
          width: `${mac.width}%`,
          aspectRatio: "3 / 2",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            ...HELLO_POSITION,
          }}
        >
          <svg
            viewBox={HELLO_VIEWBOX}
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: "100%", height: "auto", display: "block" }}
          >
            <title>hello</title>
            <path
              d={HELLO_PATH}
              fill="none"
              stroke="rgba(0, 0, 0, 0.12)"
              strokeWidth={20}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={HELLO_PATH_LENGTH}
              strokeDashoffset={HELLO_PATH_LENGTH - drawProgress}
              filter="url(#helloGlow)"
            />
            <path
              d={HELLO_PATH}
              fill="none"
              stroke="#1a1a1a"
              strokeWidth={15.75}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={HELLO_PATH_LENGTH}
              strokeDashoffset={HELLO_PATH_LENGTH - drawProgress}
            />
            <circle
              cx={HELLO_DOT_CX}
              cy={HELLO_DOT_CY}
              r={HELLO_DOT_R}
              fill="#1a1a1a"
              opacity={dotScale}
              transform={`translate(${HELLO_DOT_CX * (1 - dotScale)}, ${HELLO_DOT_CY * (1 - dotScale)}) scale(${dotScale})`}
              style={{
                transformOrigin: `${HELLO_DOT_CX}px ${HELLO_DOT_CY}px`,
              }}
            />
            <defs>
              <filter id="helloGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Composition                                                   */
/* ------------------------------------------------------------------ */

export function HeroComposition({ isMobile = false }: HeroCompositionProps) {
  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      <MacintoshLayer isMobile={isMobile} />
      <HelloDraw isMobile={isMobile} />
    </AbsoluteFill>
  );
}
