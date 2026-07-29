import { phoneFrameOptions } from "@/features/mockup-tool/data/phone-frames";
import type {
  PhoneFramePreset,
  ScreenshotAsset,
  SlideDraft,
} from "@/features/mockup-tool/types";

import styles from "./SlidePanel.module.css";

type SlidePanelProps = {
  slides: SlideDraft[];
  selectedSlideIndex: number;
  maxSlides: number;
  screenshotLibrary: ScreenshotAsset[];
  slideScreenshotAssetIds: Array<string | null>;
  screenshotNames: Array<string | null>;
  onSelectedSlideChange: (index: number) => void;
  onSlideFrameChange: (index: number, framePreset: PhoneFramePreset) => void;
  onAssignScreenshotToSlide: (index: number, assetId: string | null) => void;
  onRemoveScreenshotAsset: (assetId: string) => void;
  onSlideScreenshotChange: (index: number, file: File | null) => void;
  onScreenshotLibraryUpload: (files: FileList | null) => void;
  onAddSlide: () => void;
  onRemoveSlide: (index: number) => void;
};

export function SlidePanel({
  slides,
  selectedSlideIndex,
  maxSlides,
  screenshotLibrary,
  slideScreenshotAssetIds,
  screenshotNames,
  onSelectedSlideChange,
  onSlideFrameChange,
  onAssignScreenshotToSlide,
  onRemoveScreenshotAsset,
  onSlideScreenshotChange,
  onScreenshotLibraryUpload,
  onAddSlide,
  onRemoveSlide,
}: SlidePanelProps) {
  const selectedSlide = slides[selectedSlideIndex];
  const selectedScreenshotName = screenshotNames[selectedSlideIndex];
  const selectedSlideScreenshotId = slideScreenshotAssetIds[selectedSlideIndex];

  function getAssignedSlides(assetId: string) {
    return slideScreenshotAssetIds.reduce<number[]>(
      (list, assignedAssetId, index) => {
        if (assignedAssetId === assetId) list.push(index + 1);
        return list;
      },
      [],
    );
  }

  return (
    <div className={styles.panel}>
      <label className={styles.uploadCard}>
        <input
          type="file"
          accept="image/*"
          multiple
          className={styles.hiddenInput}
          onChange={(event) => onScreenshotLibraryUpload(event.target.files)}
        />
        <strong>Upload screenshot library</strong>
        <span>
          Select several app screens at once. They will be added below and
          auto-filled from slide {selectedSlideIndex + 1}.
        </span>
      </label>

      <div className={styles.slideListHeader}>
        <span>
          Slides ({slides.length}/{maxSlides})
        </span>
        {slides.length < maxSlides && (
          <button
            type="button"
            className={styles.addSlideBtn}
            onClick={onAddSlide}
          >
            + Add slide
          </button>
        )}
      </div>

      <div className={styles.slideList}>
        {slides.map((slide, index) => (
          <div key={slide.id} className={styles.slideRowWrap}>
            <button
              type="button"
              className={styles.slideRow}
              data-active={index === selectedSlideIndex}
              onClick={() => onSelectedSlideChange(index)}
            >
              <span>{index + 1}</span>
              <div>
                <strong>{slide.title}</strong>
                <small>{screenshotNames[index] ?? "No screenshot"}</small>
              </div>
            </button>
            {slides.length > 1 && (
              <button
                type="button"
                className={styles.removeSlideBtn}
                onClick={() => onRemoveSlide(index)}
                title="Remove slide"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      <div className={styles.divider} />
      <div className={styles.fieldGroupLabel}>Selected slide setup</div>

      {phoneFrameOptions.length > 1 ? (
        <label className={styles.field}>
          <span>Phone frame</span>
          <select
            value={selectedSlide.framePreset}
            onChange={(event) =>
              onSlideFrameChange(
                selectedSlideIndex,
                event.target.value as PhoneFramePreset,
              )
            }
          >
            {phoneFrameOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <div className={styles.selectionCard}>
        <strong>Phone frame</strong>
        <span>
          {
            phoneFrameOptions.find(
              (option) => option.value === selectedSlide.framePreset,
            )?.description
          }
        </span>
      </div>

      <div className={styles.divider} />
      <div className={styles.fieldGroupLabel}>Screenshot library</div>

      <div className={styles.selectionCard}>
        <strong>Selected slide: {selectedSlideIndex + 1}</strong>
        <span>
          {selectedScreenshotName
            ? `Using ${selectedScreenshotName}`
            : "Choose any uploaded screen below to place it in the phone."}
        </span>
      </div>

      {screenshotLibrary.length > 0 ? (
        <div className={styles.assetGrid}>
          {screenshotLibrary.map((asset) => {
            const assignedSlides = getAssignedSlides(asset.id);
            const isActive = asset.id === selectedSlideScreenshotId;

            return (
              <button
                key={asset.id}
                type="button"
                className={styles.assetCard}
                data-active={isActive}
                onClick={() =>
                  onAssignScreenshotToSlide(selectedSlideIndex, asset.id)
                }
              >
                <img
                  src={asset.url}
                  alt={asset.name}
                  className={styles.assetThumb}
                />
                <div className={styles.assetCopy}>
                  <strong>{asset.name}</strong>
                  <span>
                    {assignedSlides.length > 0
                      ? `Used on slide ${assignedSlides.join(", ")}`
                      : "Not assigned yet"}
                  </span>
                </div>
                <div className={styles.assetActions}>
                  {isActive ? (
                    <span className={styles.assetBadge}>Selected</span>
                  ) : null}
                  <span
                    role="button"
                    tabIndex={-1}
                    className={styles.assetRemove}
                    onClick={(event) => {
                      event.stopPropagation();
                      onRemoveScreenshotAsset(asset.id);
                    }}
                  >
                    Remove
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <strong>No screenshots uploaded yet</strong>
          <span>
            Add multiple app screens once, then click one to assign it to the
            selected slide.
          </span>
        </div>
      )}

      <label className={styles.uploadCard}>
        <input
          type="file"
          accept="image/*"
          className={styles.hiddenInput}
          onChange={(event) =>
            onSlideScreenshotChange(
              selectedSlideIndex,
              event.target.files?.[0] ?? null,
            )
          }
        />
        <strong>
          {selectedScreenshotName
            ? `Quick replace slide ${selectedSlideIndex + 1}`
            : `Upload one screenshot for slide ${selectedSlideIndex + 1}`}
        </strong>
        <span>
          {selectedScreenshotName ??
            "PNG or JPG. This also adds it to the library."}
        </span>
      </label>

      {selectedSlideScreenshotId ? (
        <button
          type="button"
          className={styles.secondaryButton}
          onClick={() => onAssignScreenshotToSlide(selectedSlideIndex, null)}
        >
          Clear selected slide screenshot
        </button>
      ) : null}
    </div>
  );
}
