import { useEffect, useState } from "react";

import type {
  DeviceFinish,
  EditorDraft,
  ScreenshotFit,
  SlideDraft,
} from "@/features/mockup-tool/types";
import {
  getPageSizeDimensions,
  pageSizePresets,
} from "@/features/mockup-tool/data/page-size-presets";

import styles from "./StylePanel.module.css";

type StylePanelProps = {
  draft: EditorDraft;
  slides: SlideDraft[];
  slide: SlideDraft;
  selectedSlideIndex: number;
  onDraftChange: <Key extends keyof EditorDraft>(
    field: Key,
    value: EditorDraft[Key],
  ) => void;
  onSlideChange: <Key extends keyof SlideDraft>(
    index: number,
    field: Key,
    value: SlideDraft[Key],
  ) => void;
};

const deviceFinishOptions: Array<{ value: DeviceFinish; label: string }> = [
  { value: "obsidian", label: "Obsidian" },
  { value: "silver", label: "Silver" },
  { value: "champagne", label: "Champagne" },
];

const fitOptions: Array<{ value: ScreenshotFit; label: string }> = [
  { value: "cover", label: "Cover (fill)" },
  { value: "contain", label: "Contain (fit)" },
];

export function StylePanel({
  draft,
  slides,
  slide,
  selectedSlideIndex,
  onDraftChange,
  onSlideChange,
}: StylePanelProps) {
  const [pageTarget, setPageTarget] = useState<"all" | number>(
    selectedSlideIndex,
  );

  useEffect(() => {
    setPageTarget(selectedSlideIndex);
  }, [selectedSlideIndex]);

  const safePageTarget =
    typeof pageTarget === "number" && pageTarget < slides.length
      ? pageTarget
      : "all";
  const targetSlide =
    safePageTarget === "all" ? slide : slides[safePageTarget] ?? slide;
  const hasTargetPageSize =
    targetSlide.pageWidth !== undefined && targetSlide.pageHeight !== undefined;
  const activeWidth =
    safePageTarget === "all"
      ? draft.pageWidth
      : targetSlide.pageWidth ?? draft.pageWidth;
  const activeHeight =
    safePageTarget === "all"
      ? draft.pageHeight
      : targetSlide.pageHeight ?? draft.pageHeight;

  function applySizeToAllPages(presetId: EditorDraft["pageSizePreset"]) {
    const nextSize = getPageSizeDimensions(presetId);
    onDraftChange("pageSizePreset", presetId);
    onDraftChange("pageWidth", nextSize.width);
    onDraftChange("pageHeight", nextSize.height);
  }

  function applySizeToSelectedPage(presetId: EditorDraft["pageSizePreset"]) {
    const nextSize = getPageSizeDimensions(presetId);
    if (safePageTarget === "all") {
      applySizeToAllPages(presetId);
      return;
    }

    onSlideChange(safePageTarget, "pageWidth", nextSize.width);
    onSlideChange(safePageTarget, "pageHeight", nextSize.height);
  }

  function applyCustomValue<Key extends "pageWidth" | "pageHeight">(
    field: Key,
    value: number,
  ) {
    if (safePageTarget !== "all") {
      onSlideChange(safePageTarget, field, value);
      return;
    }

    onDraftChange(field, value);
  }

  function clearSelectedPageOverride() {
    if (safePageTarget === "all") return;
    onSlideChange(safePageTarget, "pageWidth", undefined);
    onSlideChange(safePageTarget, "pageHeight", undefined);
  }

  return (
    <div className={styles.panel}>
      <div className={styles.fieldGroupLabel}>Custom slide size</div>
      <label className={styles.field}>
        <span>Target slide</span>
        <select
          value={safePageTarget}
          onChange={(event) => {
            const value = event.target.value;
            setPageTarget(value === "all" ? "all" : Number(value));
          }}
        >
          <option value="all">All pages</option>
          {slides.map((item, index) => (
            <option key={item.id} value={index}>
              Page {index + 1}
            </option>
          ))}
        </select>
      </label>

      <div className={styles.presetGrid}>
        {pageSizePresets.map((preset) => {
          const targetPresetMatch =
            safePageTarget === "all"
              ? draft.pageSizePreset === preset.id
              : targetSlide.pageWidth === getPageSizeDimensions(preset.id).width &&
                targetSlide.pageHeight === getPageSizeDimensions(preset.id).height;

          return (
            <button
              key={preset.id}
              type="button"
              className={styles.presetButton}
              data-active={
                safePageTarget === "all"
                  ? draft.pageSizePreset === preset.id
                  : targetPresetMatch
              }
              title={preset.label}
              onClick={() => {
                if (safePageTarget === "all") {
                  applySizeToAllPages(preset.id);
                  return;
                }

                applySizeToSelectedPage(preset.id);
              }}
            >
              {preset.label}
            </button>
          );
        })}
      </div>

      <div className={styles.sizeGrid}>
        <label className={styles.field}>
          <span>Width</span>
          <input
            type="number"
            min={24}
            step={1}
            value={activeWidth}
            onChange={(event) =>
              applyCustomValue("pageWidth", Number(event.target.value))
            }
          />
        </label>

        <label className={styles.field}>
          <span>Height</span>
          <input
            type="number"
            min={24}
            step={1}
            value={activeHeight}
            onChange={(event) =>
              applyCustomValue("pageHeight", Number(event.target.value))
            }
          />
        </label>
      </div>

      {safePageTarget !== "all" && hasTargetPageSize ? (
        <button
          type="button"
          className={styles.secondaryButton}
          onClick={clearSelectedPageOverride}
        >
          Reset custom slide size
        </button>
      ) : null}

      <div className={styles.divider} />

      <div className={styles.fieldGroupLabel}>Device</div>
      <div className={styles.grid}>
        <label className={styles.field}>
          <span>Finish</span>
          <select
            value={draft.deviceFinish}
            onChange={(event) =>
              onDraftChange(
                "deviceFinish",
                event.target.value as DeviceFinish,
              )
            }
          >
            {deviceFinishOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span>Screenshot fit</span>
          <select
            value={draft.screenshotFit}
            onChange={(event) =>
              onDraftChange(
                "screenshotFit",
                event.target.value as ScreenshotFit,
              )
            }
          >
            {fitOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className={styles.divider} />

      <div className={styles.fieldGroupLabel}>Layout</div>

      <div className={styles.orientationGroup}>
        <span className={styles.orientationLabel}>Orientation</span>
        <div className={styles.orientationButtons}>
          <button
            type="button"
            className={styles.orientationButton}
            data-active={draft.phoneTilt === 0}
            onClick={() => onDraftChange("phoneTilt", 0)}
          >
            Portrait
          </button>
          <button
            type="button"
            className={styles.orientationButton}
            data-active={draft.phoneTilt === 90}
            onClick={() => onDraftChange("phoneTilt", 90)}
          >
            Landscape
          </button>
          <button
            type="button"
            className={styles.orientationButton}
            data-active={draft.phoneTilt === -90}
            onClick={() => onDraftChange("phoneTilt", -90)}
          >
            Reverse
          </button>
        </div>
      </div>

      <div className={styles.controlCard}>
        <label className={styles.field}>
          <div className={styles.rangeHeader}>
            <span>Phone size</span>
            <b>{draft.phoneScale}%</b>
          </div>
          <input
            type="range"
            min={82}
            max={110}
            step={1}
            value={draft.phoneScale}
            onChange={(event) =>
              onDraftChange("phoneScale", Number(event.target.value))
            }
          />
        </label>
      </div>

      <div className={styles.controlCard}>
        <label className={styles.field}>
          <div className={styles.rangeHeader}>
            <span>Phone rotation</span>
            <b>{draft.phoneTilt}°</b>
          </div>
          <input
            type="range"
            min={-90}
            max={90}
            step={1}
            value={draft.phoneTilt}
            onChange={(event) =>
              onDraftChange("phoneTilt", Number(event.target.value))
            }
          />
        </label>
      </div>

      <label className={styles.field}>
        <div className={styles.rangeHeader}>
          <span>Slide gap</span>
          <b>{draft.slideGap}px</b>
        </div>
        <input
          type="range"
          min={6}
          max={32}
          step={1}
          value={draft.slideGap}
          onChange={(event) =>
            onDraftChange("slideGap", Number(event.target.value))
          }
        />
      </label>
    </div>
  );
}
