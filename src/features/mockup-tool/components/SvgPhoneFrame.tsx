import type { DeviceFinish } from "@/features/mockup-tool/types";

type SvgPhoneFrameProps = {
  finish: DeviceFinish;
  screenshotUrl: string | null;
  screenshotFit?: "cover" | "contain";
  /** tilt in degrees applied via CSS on the parent */
  className?: string;
  style?: React.CSSProperties;
};

// ── Finish colour tokens ──────────────────────────────────────────
const FINISH: Record<
  DeviceFinish,
  { body: string; bodyGrad: string; rim: string; rimHi: string; buttonFill: string }
> = {
  obsidian: {
    body:       "#1a1c22",
    bodyGrad:   "linear-gradient(160deg,#2e3240 0%,#111318 100%)",
    rim:        "#2a2d38",
    rimHi:      "rgba(255,255,255,0.13)",
    buttonFill: "#222530",
  },
  silver: {
    body:       "#d4d8e2",
    bodyGrad:   "linear-gradient(160deg,#f0f4ff 0%,#8d98ad 100%)",
    rim:        "#b8bdc8",
    rimHi:      "rgba(255,255,255,0.7)",
    buttonFill: "#c8cdd8",
  },
  champagne: {
    body:       "#c8a882",
    bodyGrad:   "linear-gradient(160deg,#f5d8b0 0%,#7a5c3e 100%)",
    rim:        "#b09070",
    rimHi:      "rgba(255,240,200,0.55)",
    buttonFill: "#c0a070",
  },
};

// ── SVG constants (viewBox 0 0 320 660) ──────────────────────────
//  Outer body   : 0,0  → 320,660   rx=52
//  Glass inset  : 14,14 → 292,646  rx=42   ← screen frame / glass
//  Screen clip  : 14,50 → 292,646  rx=40   ← actual screenshot area
//  Notch pill   : x=95,y=14,w=130,h=36,rx=18
//  Camera       : cx=227,cy=32,r=8
//  Speaker      : rect x=128,y=652,w=64,h=6,rx=3
//  USB-C        : rect x=138,y=654,w=44,h=4,rx=2

const VW = 320;
const VH = 660;

// Screen area (where screenshot is placed)
export const SCREEN = { x: 14, y: 50, w: 292, h: 596, rx: 40 } as const;

export function SvgPhoneFrame({
  finish,
  screenshotUrl,
  screenshotFit = "cover",
  className,
  style,
}: SvgPhoneFrameProps) {
  const c = FINISH[finish];
  const uid = finish; // stable id per finish for gradient/clipPath ids

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
        {/* ── Body gradient ── */}
        <linearGradient id={`bodyGrad-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={c.rimHi} />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </linearGradient>

        {/* ── Screen clip (where screenshot is shown) ── */}
        <clipPath id={`screenClip-${uid}`}>
          <rect
            x={SCREEN.x} y={SCREEN.y}
            width={SCREEN.w} height={SCREEN.h}
            rx={SCREEN.rx} ry={SCREEN.rx}
          />
        </clipPath>

        {/* ── Drop shadow ── */}
        <filter id={`phoneShadow-${uid}`} x="-30%" y="-10%" width="160%" height="130%">
          <feDropShadow dx="0" dy="16" stdDeviation="22" floodColor="rgba(0,0,0,0.55)" />
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="rgba(0,0,0,0.3)" />
        </filter>

        {/* ── Screen inner glow ── */}
        <filter id={`screenGlow-${uid}`} x="-5%" y="-5%" width="110%" height="110%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
          <feOffset dx="0" dy="1" result="offset" />
          <feComposite in="SourceGraphic" in2="offset" operator="over" />
        </filter>

        {/* ── Glass reflection gradient ── */}
        <linearGradient id={`glassRef-${uid}`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
          <stop offset="55%" stopColor="rgba(255,255,255,0.03)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 1. Drop shadow base                                        */}
      {/* ══════════════════════════════════════════════════════════ */}
      <rect
        x="0" y="0" width={VW} height={VH} rx="52" ry="52"
        fill={c.body}
        filter={`url(#phoneShadow-${uid})`}
        opacity="0.7"
      />

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 2. Screenshot — lives BEHIND the frame                     */}
      {/* ══════════════════════════════════════════════════════════ */}
      {screenshotUrl ? (
        <image
          href={screenshotUrl}
          x={SCREEN.x} y={SCREEN.y}
          width={SCREEN.w} height={SCREEN.h}
          clipPath={`url(#screenClip-${uid})`}
          preserveAspectRatio={
            screenshotFit === "cover"
              ? "xMidYMid slice"
              : "xMidYMid meet"
          }
        />
      ) : (
        /* Placeholder gradient screen */
        <>
          <rect
            x={SCREEN.x} y={SCREEN.y}
            width={SCREEN.w} height={SCREEN.h} rx={SCREEN.rx} ry={SCREEN.rx}
            fill="#0c0e16"
            clipPath={`url(#screenClip-${uid})`}
          />
          <rect
            x={SCREEN.x} y={SCREEN.y}
            width={SCREEN.w} height={SCREEN.h} rx={SCREEN.rx} ry={SCREEN.rx}
            fill="url(#bodyGrad-{uid})"
            opacity="0.3"
            clipPath={`url(#screenClip-${uid})`}
          />
          {/* Placeholder lines */}
          {[130, 150, 165, 180, 195, 215, 225].map((y, i) => (
            <rect
              key={i}
              x={i % 2 === 0 ? 40 : 60} y={y}
              width={i % 3 === 0 ? 180 : i % 3 === 1 ? 140 : 210}
              height={i % 2 === 0 ? 10 : 8}
              rx="4" ry="4"
              fill="rgba(255,255,255,0.07)"
            />
          ))}
          <text
            x={VW / 2} y={SCREEN.y + SCREEN.h / 2 - 20}
            textAnchor="middle" fill="rgba(255,255,255,0.2)"
            fontSize="13" fontFamily="system-ui,sans-serif"
          >
            App Screenshot
          </text>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 3. Phone body frame — even-odd cutout (transparent screen) */}
      {/* ══════════════════════════════════════════════════════════ */}
      <path
        fillRule="evenodd"
        fill={c.body}
        d={`
          M52,0 H${VW - 52}
          Q${VW},0 ${VW},52
          V${VH - 52}
          Q${VW},${VH} ${VW - 52},${VH}
          H52
          Q0,${VH} 0,${VH - 52}
          V52
          Q0,0 52,0
          Z

          M${SCREEN.x + SCREEN.rx},${SCREEN.y}
          H${SCREEN.x + SCREEN.w - SCREEN.rx}
          Q${SCREEN.x + SCREEN.w},${SCREEN.y} ${SCREEN.x + SCREEN.w},${SCREEN.y + SCREEN.rx}
          V${SCREEN.y + SCREEN.h - SCREEN.rx}
          Q${SCREEN.x + SCREEN.w},${SCREEN.y + SCREEN.h} ${SCREEN.x + SCREEN.w - SCREEN.rx},${SCREEN.y + SCREEN.h}
          H${SCREEN.x + SCREEN.rx}
          Q${SCREEN.x},${SCREEN.y + SCREEN.h} ${SCREEN.x},${SCREEN.y + SCREEN.h - SCREEN.rx}
          V${SCREEN.y + SCREEN.rx}
          Q${SCREEN.x},${SCREEN.y} ${SCREEN.x + SCREEN.rx},${SCREEN.y}
          Z
        `}
      />

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 4. Rim highlight (thin inner stroke)                       */}
      {/* ══════════════════════════════════════════════════════════ */}
      <rect
        x="0.5" y="0.5" width={VW - 1} height={VH - 1} rx="51.5" ry="51.5"
        fill="none"
        stroke={c.rimHi}
        strokeWidth="1.5"
      />

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 5. Screen rim (inner bezel ring around screen)             */}
      {/* ══════════════════════════════════════════════════════════ */}
      <rect
        x={SCREEN.x} y={SCREEN.y}
        width={SCREEN.w} height={SCREEN.h} rx={SCREEN.rx} ry={SCREEN.rx}
        fill="none"
        stroke="rgba(255,255,255,0.09)"
        strokeWidth="1"
      />

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 6. Dynamic Island / Notch pill                             */}
      {/* ══════════════════════════════════════════════════════════ */}
      <rect
        x="95" y="16" width="130" height="30" rx="15" ry="15"
        fill={c.body}
      />
      {/* Speaker grille inside notch */}
      <rect x="142" y="27" width="36" height="7" rx="3.5" ry="3.5" fill="rgba(0,0,0,0.5)" />
      {/* Front camera dot */}
      <circle cx="228" cy="31" r="7" fill="rgba(0,0,0,0.6)" />
      <circle cx="228" cy="31" r="4.5" fill={c.body} />
      <circle cx="228" cy="31" r="3" fill="rgba(0,0,0,0.8)" />
      <circle cx="226" cy="29" r="1" fill="rgba(255,255,255,0.25)" />

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 7. Side hardware buttons                                   */}
      {/* ══════════════════════════════════════════════════════════ */}
      {/* Silent switch (left) */}
      <rect x="-3" y="120" width="6" height="24" rx="3" ry="3" fill={c.buttonFill} />
      <rect x="-2" y="120" width="4" height="24" rx="2" ry="2" fill={c.rim} />
      {/* Volume up (left) */}
      <rect x="-3" y="162" width="6" height="52" rx="3" ry="3" fill={c.buttonFill} />
      <rect x="-2" y="162" width="4" height="52" rx="2" ry="2" fill={c.rim} />
      {/* Volume down (left) */}
      <rect x="-3" y="228" width="6" height="52" rx="3" ry="3" fill={c.buttonFill} />
      <rect x="-2" y="228" width="4" height="52" rx="2" ry="2" fill={c.rim} />
      {/* Power / Sleep-Wake (right) */}
      <rect x={VW - 3} y="180" width="6" height="88" rx="3" ry="3" fill={c.buttonFill} />
      <rect x={VW - 2} y="180" width="4" height="88" rx="2" ry="2" fill={c.rim} />

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 8. Bottom bar: USB-C + speaker dots                        */}
      {/* ══════════════════════════════════════════════════════════ */}
      {/* USB-C */}
      <rect x="134" y={VH - 10} width="52" height="7" rx="3.5" ry="3.5" fill="rgba(0,0,0,0.45)" />
      <rect x="138" y={VH - 9} width="44" height="5" rx="2.5" ry="2.5" fill={c.rim} />
      {/* Speaker dots left */}
      {[68, 76, 84, 92].map((x) => (
        <circle key={x} cx={x} cy={VH - 7} r="2.5" fill="rgba(0,0,0,0.4)" />
      ))}
      {/* Speaker dots right */}
      {[228, 236, 244, 252].map((x) => (
        <circle key={x} cx={x} cy={VH - 7} r="2.5" fill="rgba(0,0,0,0.4)" />
      ))}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 9. Glass reflection overlay (top-left diagonal shimmer)    */}
      {/* ══════════════════════════════════════════════════════════ */}
      <rect
        x="0" y="0" width={VW} height={VH} rx="52" ry="52"
        fill={`url(#glassRef-${uid})`}
        style={{ pointerEvents: "none" }}
      />
    </svg>
  );
}
