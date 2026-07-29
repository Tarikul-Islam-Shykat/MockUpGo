import type { PhoneFramePreset } from "@/features/mockup-tool/types";

export const phoneFrameOptions: Array<{
  value: PhoneFramePreset;
  label: string;
  description: string;
}> = [
  {
    value: "svg-classic",
    label: "SVG Phone",
    description: "Clean built-in SVG phone frame",
  },
];

export function getPhoneFrameLabel(framePreset: PhoneFramePreset) {
  return (
    phoneFrameOptions.find((option) => option.value === framePreset)?.label ??
    "SVG Phone"
  );
}
