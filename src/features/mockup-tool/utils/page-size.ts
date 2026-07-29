import type { EditorDraft, SlideDraft } from "@/features/mockup-tool/types";
import { getPageSizeDimensions } from "@/features/mockup-tool/data/page-size-presets";

export function getDraftPageSize(draft: EditorDraft) {
  return {
    width: draft.pageWidth,
    height: draft.pageHeight,
  };
}

export function getSlidePageSize(draft: EditorDraft, slide: SlideDraft) {
  if (slide.pageWidth !== undefined && slide.pageHeight !== undefined) {
    return {
      width: slide.pageWidth,
      height: slide.pageHeight,
      isCustom: true,
    };
  }

  return {
    width: draft.pageWidth,
    height: draft.pageHeight,
    isCustom: false,
  };
}

export function createPresetPageSize(
  presetId: EditorDraft["pageSizePreset"],
) {
  return getPageSizeDimensions(presetId);
}
