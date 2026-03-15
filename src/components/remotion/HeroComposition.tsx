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

const MACINTOSH_IMAGE = "/images/hero/macintosh-cleaned.png";
const BG_COLOR = "#050505";

/*  Screen area coordinates — measured from the cleaned image.
    The image (3072×2048, 3:2) renders via object-fit:contain in a
    1920×1080 composition at 1620×1080, centered with 150px black
    bars on each side.

    White screen bounds in composition space:
      top: 23.05%  left: 39.23%  width: 22.30%  height: 26.17%       */

const SCREEN = {
  top: 23.05,
  left: 39.23,
  width: 22.3,
  height: 26.17,
} as const;

const HELLO_SCALE = 0.78;
const HELLO_WIDTH_PCT = SCREEN.width * HELLO_SCALE;
const HELLO_LEFT_PCT = SCREEN.left + (SCREEN.width - HELLO_WIDTH_PCT) / 2;
const HELLO_RENDERED_HEIGHT_PCT = (((HELLO_WIDTH_PCT / 100) * 1920) / 2.58 / 1080) * 100;
const HELLO_TOP_PCT = SCREEN.top + (SCREEN.height - HELLO_RENDERED_HEIGHT_PCT) / 2;

const HELLO_POSITION = {
  top: `${HELLO_TOP_PCT}%`,
  left: `${HELLO_LEFT_PCT}%`,
  width: `${HELLO_WIDTH_PCT}%`,
} as const;

/* ------------------------------------------------------------------ */
/*  Macintosh Image — fade in with scale settle                        */
/* ------------------------------------------------------------------ */

function MacintoshLayer() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 1.4 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const scaleProgress = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 80, mass: 1.5 },
    durationInFrames: Math.round(2 * fps),
  });
  const scale = interpolate(scaleProgress, [0, 1], [1.05, 1]);

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `scale(${scale})`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Img
        src={MACINTOSH_IMAGE}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          objectPosition: "center center",
        }}
      />
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ */
/*  Hello SVG Path Draw — renders inside the CRT screen area           */
/* ------------------------------------------------------------------ */

function HelloDraw() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const drawStart = 1.2 * fps;
  const drawEnd = 3.5 * fps;
  const dotAppear = 3.4 * fps;

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
    frame: frame - Math.round(dotAppear),
    fps,
    config: { damping: 12, stiffness: 200, mass: 0.5 },
  });

  const imageOpacity = interpolate(frame, [0, 1.4 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scaleProgress = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 80, mass: 1.5 },
    durationInFrames: Math.round(2 * fps),
  });
  const parentScale = interpolate(scaleProgress, [0, 1], [1.05, 1]);

  return (
    <AbsoluteFill
      style={{
        opacity: imageOpacity * strokeOpacity,
        transform: `scale(${parentScale})`,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          ...HELLO_POSITION,
          pointerEvents: "none",
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
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Composition                                                   */
/* ------------------------------------------------------------------ */

export function HeroComposition(_props: HeroCompositionProps) {
  return (
    <AbsoluteFill style={{ backgroundColor: BG_COLOR }}>
      <MacintoshLayer />
      <HelloDraw />
    </AbsoluteFill>
  );
}
