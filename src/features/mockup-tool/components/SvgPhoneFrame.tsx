import type { DeviceFinish } from "@/features/mockup-tool/types";

type SvgPhoneFrameProps = {
  finish: DeviceFinish;
  screenshotUrl: string | null;
  screenshotFit?: "cover" | "contain";
  className?: string;
  style?: React.CSSProperties;
};

type FinishPalette = {
  frameDark: string;
  frameMid: string;
  frameLight: string;
  bodyDark: string;
  bodyLight: string;
  buttonFill: string;
  buttonEdge: string;
  glassStroke: string;
  highlight: string;
  speaker: string;
  port: string;
};

const FINISH: Record<DeviceFinish, FinishPalette> = {
  obsidian: {
    frameDark: "#06080d",
    frameMid: "#29303a",
    frameLight: "#596272",
    bodyDark: "#0f1218",
    bodyLight: "#1f242d",
    buttonFill: "#1b2028",
    buttonEdge: "#555f6d",
    glassStroke: "rgba(255,255,255,0.12)",
    highlight: "rgba(255,255,255,0.34)",
    speaker: "rgba(0,0,0,0.58)",
    port: "rgba(0,0,0,0.72)",
  },
  silver: {
    frameDark: "#858d99",
    frameMid: "#c9d1dd",
    frameLight: "#f6fbff",
    bodyDark: "#b6beca",
    bodyLight: "#edf3fb",
    buttonFill: "#bcc5d1",
    buttonEdge: "#f5fbff",
    glassStroke: "rgba(255,255,255,0.46)",
    highlight: "rgba(255,255,255,0.75)",
    speaker: "rgba(42,48,58,0.45)",
    port: "rgba(42,48,58,0.66)",
  },
  champagne: {
    frameDark: "#6f5845",
    frameMid: "#c4a07a",
    frameLight: "#f4debe",
    bodyDark: "#8f6e53",
    bodyLight: "#d9bc98",
    buttonFill: "#bb946d",
    buttonEdge: "#f2d7b5",
    glassStroke: "rgba(255,244,224,0.34)",
    highlight: "rgba(255,244,224,0.68)",
    speaker: "rgba(36,22,10,0.42)",
    port: "rgba(36,22,10,0.68)",
  },
};

const VW = 320;
const VH = 660;

const SHELL = { x: 8, y: 2, w: 304, h: 656, rx: 56 } as const;
const INNER = { x: 12, y: 6, w: 296, h: 648, rx: 52 } as const;
const GLASS = { x: 16, y: 12, w: 288, h: 636, rx: 48 } as const;

export const SCREEN = { x: 18, y: 18, w: 284, h: 624, rx: 44 } as const;

const ISLAND = { x: 104, y: 30, w: 112, h: 32, rx: 16 } as const;

function buildRectPath(
  x: number,
  y: number,
  w: number,
  h: number,
  rx: number,
) {
  return `
    M${x + rx},${y}
    H${x + w - rx}
    Q${x + w},${y} ${x + w},${y + rx}
    V${y + h - rx}
    Q${x + w},${y + h} ${x + w - rx},${y + h}
    H${x + rx}
    Q${x},${y + h} ${x},${y + h - rx}
    V${y + rx}
    Q${x},${y} ${x + rx},${y}
    Z
  `;
}

export function SvgPhoneFrame({
  finish,
  screenshotUrl,
  screenshotFit = "cover",
  className,
  style,
}: SvgPhoneFrameProps) {
  const c = FINISH[finish];
  const uid = finish;
  const shellPath = buildRectPath(SHELL.x, SHELL.y, SHELL.w, SHELL.h, SHELL.rx);
  const glassPath = buildRectPath(GLASS.x, GLASS.y, GLASS.w, GLASS.h, GLASS.rx);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${VW} ${VH}`}
      width="100%"
      height="100%"
      className={className}
      style={{ overflow: "visible", ...style }}
    >
      <defs>
        <linearGradient id={`frameGrad-${uid}`} x1="0.08" y1="0" x2="0.92" y2="1">
          <stop offset="0%" stopColor={c.frameDark} />
          <stop offset="18%" stopColor={c.frameLight} />
          <stop offset="45%" stopColor={c.frameMid} />
          <stop offset="78%" stopColor={c.frameDark} />
          <stop offset="100%" stopColor={c.frameLight} />
        </linearGradient>

        <linearGradient id={`bodyGrad-${uid}`} x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor={c.bodyLight} />
          <stop offset="38%" stopColor={c.bodyDark} />
          <stop offset="100%" stopColor={c.bodyLight} />
        </linearGradient>

        <linearGradient id={`glassGrad-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#161b23" stopOpacity="0.92" />
          <stop offset="100%" stopColor="#090c12" stopOpacity="0.98" />
        </linearGradient>

        <linearGradient id={`screenGloss-${uid}`} x1="0" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.16" />
          <stop offset="16%" stopColor="#ffffff" stopOpacity="0.06" />
          <stop offset="52%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.04" />
        </linearGradient>

        <linearGradient id={`reflection-${uid}`} x1="0.12" y1="0" x2="0.78" y2="0.9">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.28" />
          <stop offset="22%" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="55%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.12" />
        </linearGradient>

        <radialGradient id={`topGlow-${uid}`} cx="0.18" cy="0.02" r="0.72">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="25%" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>

        <radialGradient id={`cameraLens-${uid}`} cx="0.35" cy="0.35" r="0.8">
          <stop offset="0%" stopColor="#4f5564" />
          <stop offset="28%" stopColor="#1b1f28" />
          <stop offset="72%" stopColor="#07090d" />
          <stop offset="100%" stopColor="#000000" />
        </radialGradient>

        <clipPath id={`screenClip-${uid}`}>
          <rect
            x={SCREEN.x}
            y={SCREEN.y}
            width={SCREEN.w}
            height={SCREEN.h}
            rx={SCREEN.rx}
            ry={SCREEN.rx}
          />
        </clipPath>

        <filter id={`phoneShadow-${uid}`} x="-18%" y="-8%" width="136%" height="128%">
          <feDropShadow dx="0" dy="28" stdDeviation="22" floodColor="#000000" floodOpacity="0.30" />
          <feDropShadow dx="0" dy="10" stdDeviation="8" floodColor="#000000" floodOpacity="0.18" />
        </filter>
      </defs>

      <g filter={`url(#phoneShadow-${uid})`}>
        <rect
          x={SHELL.x}
          y={SHELL.y}
          width={SHELL.w}
          height={SHELL.h}
          rx={SHELL.rx}
          ry={SHELL.rx}
          fill={`url(#frameGrad-${uid})`}
        />

        <rect
          x={SHELL.x + 0.75}
          y={SHELL.y + 0.75}
          width={SHELL.w - 1.5}
          height={SHELL.h - 1.5}
          rx={SHELL.rx - 0.75}
          ry={SHELL.rx - 0.75}
          fill="none"
          stroke={c.highlight}
          strokeOpacity="0.66"
          strokeWidth="1.5"
        />

        <rect
          x={INNER.x}
          y={INNER.y}
          width={INNER.w}
          height={INNER.h}
          rx={INNER.rx}
          ry={INNER.rx}
          fill={`url(#bodyGrad-${uid})`}
        />

        <path
          d={glassPath}
          fill={`url(#glassGrad-${uid})`}
          stroke={c.glassStroke}
          strokeWidth="1.2"
        />

        {screenshotUrl ? (
          <image
            href={screenshotUrl}
            x={SCREEN.x}
            y={SCREEN.y}
            width={SCREEN.w}
            height={SCREEN.h}
            clipPath={`url(#screenClip-${uid})`}
            preserveAspectRatio={
              screenshotFit === "cover" ? "xMidYMid slice" : "xMidYMid meet"
            }
          />
        ) : (
          <>
            <rect
              x={SCREEN.x}
              y={SCREEN.y}
              width={SCREEN.w}
              height={SCREEN.h}
              rx={SCREEN.rx}
              ry={SCREEN.rx}
              fill="#0b0e14"
              clipPath={`url(#screenClip-${uid})`}
            />
            <rect
              x={SCREEN.x}
              y={SCREEN.y}
              width={SCREEN.w}
              height={SCREEN.h}
              rx={SCREEN.rx}
              ry={SCREEN.rx}
              fill={`url(#topGlow-${uid})`}
              clipPath={`url(#screenClip-${uid})`}
            />
            {[146, 170, 194, 228, 246, 270].map((y, index) => (
              <rect
                key={y}
                x={index % 2 === 0 ? 42 : 66}
                y={y}
                width={index % 3 === 0 ? 196 : index % 3 === 1 ? 138 : 214}
                height={index % 2 === 0 ? 10 : 8}
                rx="4"
                ry="4"
                fill="rgba(255,255,255,0.08)"
              />
            ))}
            <text
              x={VW / 2}
              y={SCREEN.y + SCREEN.h / 2 - 6}
              textAnchor="middle"
              fill="rgba(255,255,255,0.24)"
              fontSize="13"
              fontFamily="system-ui,sans-serif"
              letterSpacing="0.08em"
            >
              SCREENSHOT
            </text>
          </>
        )}

        <rect
          x={SCREEN.x}
          y={SCREEN.y}
          width={SCREEN.w}
          height={SCREEN.h}
          rx={SCREEN.rx}
          ry={SCREEN.rx}
          fill={`url(#screenGloss-${uid})`}
          clipPath={`url(#screenClip-${uid})`}
        />

        <rect
          x={SCREEN.x + 0.5}
          y={SCREEN.y + 0.5}
          width={SCREEN.w - 1}
          height={SCREEN.h - 1}
          rx={SCREEN.rx - 0.5}
          ry={SCREEN.rx - 0.5}
          fill="none"
          stroke="rgba(255,255,255,0.09)"
          strokeWidth="1"
        />

        <g>
          <rect
            x={ISLAND.x}
            y={ISLAND.y}
            width={ISLAND.w}
            height={ISLAND.h}
            rx={ISLAND.rx}
            ry={ISLAND.rx}
            fill="#020304"
          />
          <rect
            x={ISLAND.x + 0.5}
            y={ISLAND.y + 0.5}
            width={ISLAND.w - 1}
            height={ISLAND.h - 1}
            rx={ISLAND.rx - 0.5}
            ry={ISLAND.rx - 0.5}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />
          <rect
            x="130"
            y="41"
            width="48"
            height="6"
            rx="3"
            ry="3"
            fill={c.speaker}
          />
          <circle cx="198" cy="46" r="6.5" fill={`url(#cameraLens-${uid})`} />
          <circle cx="196.5" cy="44.6" r="1.3" fill="rgba(255,255,255,0.24)" />
        </g>

        <g opacity="0.96">
          <rect x="6" y="126" width="4.5" height="24" rx="2.25" ry="2.25" fill={c.buttonFill} />
          <rect x="6" y="126" width="1" height="24" rx="0.5" ry="0.5" fill={c.buttonEdge} />

          <rect x="6" y="172" width="4.5" height="56" rx="2.25" ry="2.25" fill={c.buttonFill} />
          <rect x="6" y="172" width="1" height="56" rx="0.5" ry="0.5" fill={c.buttonEdge} />

          <rect x="6" y="238" width="4.5" height="56" rx="2.25" ry="2.25" fill={c.buttonFill} />
          <rect x="6" y="238" width="1" height="56" rx="0.5" ry="0.5" fill={c.buttonEdge} />

          <rect x="309.5" y="186" width="4.5" height="92" rx="2.25" ry="2.25" fill={c.buttonFill} />
          <rect x="313" y="186" width="1" height="92" rx="0.5" ry="0.5" fill={c.buttonEdge} />
        </g>

        <g opacity="0.94">
          {[72, 80, 88, 96, 104].map((x) => (
            <circle key={`left-${x}`} cx={x} cy="632" r="2.1" fill={c.speaker} />
          ))}
          {[216, 224, 232, 240, 248].map((x) => (
            <circle key={`right-${x}`} cx={x} cy="632" r="2.1" fill={c.speaker} />
          ))}
          <rect x="138" y="627.5" width="44" height="9" rx="4.5" ry="4.5" fill={c.port} />
          <rect x="144" y="629.2" width="32" height="5.6" rx="2.8" ry="2.8" fill="rgba(255,255,255,0.12)" />
        </g>

        <path
          d={shellPath}
          fill={`url(#reflection-${uid})`}
          opacity="0.72"
          pointerEvents="none"
        />

        <path
          d={shellPath}
          fill={`url(#topGlow-${uid})`}
          opacity="0.86"
          pointerEvents="none"
        />
      </g>
    </svg>
  );
}
