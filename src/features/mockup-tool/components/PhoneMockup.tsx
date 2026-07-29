import type { DeviceFinish, ScreenshotFit } from "@/features/mockup-tool/types";
import { Phone3DModel } from "./Phone3DModel";
import { SvgPhoneFrame } from "./SvgPhoneFrame";

import styles from "./PhoneMockup.module.css";

type PhoneMockupProps = {
  screenshotUrl: string | null;
  screenshotFit: ScreenshotFit;
  deviceFinish: DeviceFinish;
  phoneTilt: number;
  phoneScale: number;
  render3D?: boolean;
};

export function PhoneMockup({
  screenshotUrl,
  screenshotFit,
  deviceFinish,
  phoneTilt,
  phoneScale,
  render3D = false,
}: PhoneMockupProps) {
  const transform = `rotate(${phoneTilt}deg) scale(${phoneScale / 100})`;

  // ── 3D GLB mode ──────────────────────────────────────────────────
  if (render3D) {
    return (
      <div
        className={styles.shell}
        style={{ width: "280px", height: "440px", transform }}
      >
        <Phone3DModel
          screenshotUrl={screenshotUrl}
          tilt={0}   // tilt is already applied via CSS transform above
          scale={100}
        />
      </div>
    );
  }

  // ── SVG frame mode (default) ─────────────────────────────────────
  return (
    <div
      className={styles.svgShell}
      style={{ transform }}
    >
      <SvgPhoneFrame
        finish={deviceFinish}
        screenshotUrl={screenshotUrl}
        screenshotFit={screenshotFit}
      />
    </div>
  );
}
