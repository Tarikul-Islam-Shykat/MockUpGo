import type {
  DeviceFinish,
  PhoneFramePreset,
  PhonePoseId,
  ScreenshotFit,
} from "@/features/mockup-tool/types";
import { PosedPhoneFrame } from "./phone-poses/PosedPhoneFrame";

type PhoneMockupProps = {
  screenshotUrl: string | null;
  screenshotFit: ScreenshotFit;
  deviceFinish: DeviceFinish;
  framePreset: PhoneFramePreset;
  phoneTilt: number;
  phoneScale: number;
  /** Per-slide 3D pose. Defaults to "flat" (original behaviour). */
  poseId?: PhonePoseId;
};

export function PhoneMockup({
  screenshotUrl,
  screenshotFit,
  deviceFinish,
  phoneTilt,
  phoneScale,
  poseId = "flat",
}: PhoneMockupProps) {
  return (
    <PosedPhoneFrame
      poseId={poseId}
      phoneTilt={phoneTilt}
      phoneScale={phoneScale}
      finish={deviceFinish}
      screenshotUrl={screenshotUrl}
      screenshotFit={screenshotFit}
    />
  );
}
