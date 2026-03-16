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

export type HeroCompositionProps = Record<string, never>;

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const MACINTOSH_IMAGE = "/images/hero/mac-asset-frame_upscayl_2x_upscayl-lite-4x.png";

/* Mac is centered horizontally and pushed slightly above center.
   85% width gives a dominant, impactful presence. */
const MAC_LAYOUT = {
  top: 3,
  width: 90,
} as const;

/* Transparent framed asset is 3072x2048 (3:2). Screen bounds measured
   against the asset itself so hello tracks the actual CRT opening. */

const SCREEN = {
  top: 18.5,
  left: 32.5,
  width: 35.0,
  height: 31.0,
} as const;

const HELLO_SCALE = 0.76;
const HELLO_WIDTH_PCT = SCREEN.width * HELLO_SCALE;
const HELLO_LEFT_PCT = SCREEN.left + (SCREEN.width - HELLO_WIDTH_PCT) / 2;
const HELLO_RENDERED_HEIGHT_PCT = (HELLO_WIDTH_PCT / 100 / 2.58) * 100;
const HELLO_TOP_PCT = SCREEN.top + (SCREEN.height - HELLO_RENDERED_HEIGHT_PCT) / 2;

const HELLO_POSITION = {
  top: `${HELLO_TOP_PCT}%`,
  left: `${HELLO_LEFT_PCT}%`,
  width: `${HELLO_WIDTH_PCT}%`,
} as const;

/* Dramatic drop-shadow for the Mac — works on both themes since the
   asset has a transparent background. The shadow creates depth and
   visual drama matching the original design intent. */
/* ------------------------------------------------------------------ */
/*  Macintosh Image — clip-path circle reveal with subtle scale settle */
/* ------------------------------------------------------------------ */

function MacintoshLayer() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* Clip-path reveal: circle expands from 0% to 80% radius over 1.0s.
     Center at 50% 45% — slightly above center, near the Mac screen.
     80% of the reference length guarantees full corner coverage. */
  const revealEnd = Math.round(1.0 * fps); // frame 30
  const revealRadius = interpolate(frame, [0, revealEnd], [0, 80], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  /* Subtle scale settle for organic weight after reveal */
  const scaleProgress = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 90, mass: 1.3 },
    durationInFrames: Math.round(1.4 * fps),
  });
  const scale = interpolate(scaleProgress, [0, 1], [1.04, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        clipPath: `circle(${revealRadius}% at 50% 45%)`,
        transform: `scale(${scale})`,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: `${MAC_LAYOUT.top}%`,
          left: "50%",
          transform: "translateX(-50%)",
          width: `${MAC_LAYOUT.width}%`,
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

function HelloDraw() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

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

  /* Match the Mac layer's clip-path so the hello is clipped during
   the reveal, then its own stroke fade-in begins at drawStart. */
  const revealEnd = Math.round(1.0 * fps);
  const revealRadius = interpolate(frame, [0, revealEnd], [0, 80], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        opacity: strokeOpacity,
        clipPath: `circle(${revealRadius}% at 50% 45%)`,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: `${MAC_LAYOUT.top}%`,
          left: "50%",
          transform: "translateX(-50%)",
          width: `${MAC_LAYOUT.width}%`,
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

export function HeroComposition() {
  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      <MacintoshLayer />
      <HelloDraw />
    </AbsoluteFill>
  );
}
