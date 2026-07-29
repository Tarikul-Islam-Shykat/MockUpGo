import type { PageSizePresetId } from "@/features/mockup-tool/types";

export type PageSizePreset = {
  id: PageSizePresetId;
  label: string;
  ratio: number;
};

export const pageSizePresets: PageSizePreset[] = [
  { id: "landscape-16-9", label: "16:9", ratio: 16 / 9 },
  { id: "landscape-3-2", label: "3:2", ratio: 3 / 2 },
  { id: "landscape-4-3", label: "4:3", ratio: 4 / 3 },
  { id: "landscape-5-4", label: "5:4", ratio: 5 / 4 },
  { id: "landscape-3-1", label: "3:1", ratio: 3 / 1 },
  { id: "square-1-1", label: "1:1", ratio: 1 / 1 },
  { id: "portrait-4-5", label: "4:5", ratio: 4 / 5 },
  { id: "portrait-3-4", label: "3:4", ratio: 3 / 4 },
  { id: "portrait-2-3", label: "2:3", ratio: 2 / 3 },
  { id: "portrait-9-16", label: "9:16", ratio: 9 / 16 },
  { id: "portrait-10-21", label: "10:21", ratio: 10 / 21 },
];

export function getPageSizePreset(presetId: PageSizePresetId) {
  return (
    pageSizePresets.find((preset) => preset.id === presetId) ??
    pageSizePresets[0]
  );
}

export function getPageSizeDimensions(
  presetId: PageSizePresetId,
  baseLongSide = 620,
) {
  const preset = getPageSizePreset(presetId);

  if (presetId === "landscape-16-9") {
    return {
      width: 1920,
      height: 1080,
    };
  }

  if (presetId === "portrait-9-16") {
    return {
      width: 1080,
      height: 1920,
    };
  }

  if (preset.ratio >= 1) {
    return {
      width: baseLongSide,
      height: Math.max(24, Math.round(baseLongSide / preset.ratio)),
    };
  }

  return {
    width: Math.max(24, Math.round(baseLongSide * preset.ratio)),
    height: baseLongSide,
  };
}

export function getPageSizeLabel(presetId: PageSizePresetId) {
  return getPageSizePreset(presetId).label;
}
