import type {
  DeviceFinish,
  PhoneFramePreset,
  ScreenshotFit,
} from "@/features/mockup-tool/types";
import { SvgPhoneFrame } from "./SvgPhoneFrame";

import styles from "./PhoneMockup.module.css";

type PhoneMockupProps = {
  screenshotUrl: string | null;
  screenshotFit: ScreenshotFit;
  deviceFinish: DeviceFinish;
  framePreset: PhoneFramePreset;
  phoneTilt: number;
  phoneScale: number;
};

export function PhoneMockup({
  screenshotUrl,
  screenshotFit,
  deviceFinish,
  framePreset,
  phoneTilt,
  phoneScale,
}: PhoneMockupProps) {
  const transform = `rotate(${phoneTilt}deg) scale(${phoneScale / 100})`;

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
