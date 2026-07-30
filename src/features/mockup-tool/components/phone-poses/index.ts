/**
 * phone-poses/index.ts
 * ─────────────────────────────────────────────────────────────────────
 * Central registry for all phone pose presets.
 *
 * To add a new pose:
 *   1. Create a new file  pose-<name>.ts  in this folder
 *   2. Export the pose object (matching the PhonePoseConfig shape)
 *   3. Import it here and add it to `phonePoses` and `phonePoseList`
 */

import type { PhonePoseId } from "@/features/mockup-tool/types";
import { poseFlat } from "./pose-flat";
import { poseLeanLeft } from "./pose-lean-left";
import { poseThreeQuarter } from "./pose-three-quarter";

export type PhonePoseConfig = {
  id: PhonePoseId;
  label: string;
  /** CSS transform string used when no GLB modelRotation is provided. */
  transform: string;
  /** Width in px of the CSS left-edge depth panel (fallback only). */
  edgeDepth: number;
  /**
   * Three.js group rotation [x, y, z] in radians.
   * When present, PosedPhoneFrame renders the real iPhone 16 Pro Max GLB
   * instead of the flat SVG frame. Omit for the "flat" pose.
   */
  modelRotation?: [number, number, number];
};

export const phonePoses: Record<PhonePoseId, PhonePoseConfig> = {
  "flat": poseFlat,
  "lean-left": poseLeanLeft,
  "three-quarter": poseThreeQuarter,
};

/** Ordered list used to render dropdowns / pickers */
export const phonePoseList: PhonePoseConfig[] = [
  poseFlat,
  poseLeanLeft,
  poseThreeQuarter,
];
