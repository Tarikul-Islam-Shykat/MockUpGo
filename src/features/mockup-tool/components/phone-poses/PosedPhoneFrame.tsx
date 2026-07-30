/**
 * PosedPhoneFrame
 * ─────────────────────────────────────────────────────────────────────
 * Decides how to render the phone based on the active pose:
 *
 *  • "flat"  → SvgPhoneFrame (fast, clean 2D SVG — unchanged from before)
 *  • any pose with modelRotation → Phone3DModel (real iPhone 16 Pro Max
 *    GLB rendered via Three.js with PBR materials and proper lighting)
 *
 * The phoneTilt slider and phoneScale are respected in both modes so
 * they coexist with the pose selection as the user requested.
 */
import type { DeviceFinish, PhonePoseId, ScreenshotFit } from "@/features/mockup-tool/types";
import { SvgPhoneFrame } from "@/features/mockup-tool/components/SvgPhoneFrame";
import { Phone3DModel } from "@/features/mockup-tool/components/Phone3DModel";
import { phonePoses } from "./index";

import styles from "./PosedPhoneFrame.module.css";

type PosedPhoneFrameProps = {
  poseId?: PhonePoseId;
  phoneTilt: number;
  phoneScale: number;
  finish: DeviceFinish;
  screenshotUrl: string | null;
  screenshotFit?: ScreenshotFit;
};

export function PosedPhoneFrame({
  poseId = "flat",
  phoneTilt,
  phoneScale,
  finish,
  screenshotUrl,
  screenshotFit = "cover",
}: PosedPhoneFrameProps) {
  const pose = phonePoses[poseId];

  /* ── Flat pose: lightweight SVG — zero 3D overhead ─────────────── */
  if (!pose.modelRotation) {
    // Combine the phoneTilt/scale into a plain 2D CSS transform (original behaviour)
    const flatTransform = `rotateZ(${phoneTilt}deg) scale(${phoneScale / 100})`;
    return (
      <div className={styles.flatShell} style={{ transform: flatTransform }}>
        <SvgPhoneFrame
          finish={finish}
          screenshotUrl={screenshotUrl}
          screenshotFit={screenshotFit}
        />
      </div>
    );
  }

  /* ── 3D posed: real iPhone 16 Pro Max GLB via Three.js ─────────── */
  return (
    <div className={styles.modelShell}>
      <Phone3DModel
        screenshotUrl={screenshotUrl}
        tilt={phoneTilt}
        scale={phoneScale}
        poseRotation={pose.modelRotation}
      />
    </div>
  );
}
