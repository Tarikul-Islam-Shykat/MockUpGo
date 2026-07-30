import type {
  CanvasSelection,
  EditorDraft,
  FontOption,
  PhonePoseId,
  ScreenshotAsset,
  SlideDraft,
  SlideTextBlock,
} from "@/features/mockup-tool/types";
import { fontOptions } from "@/features/mockup-tool/data/fonts";
import { phonePoseList } from "@/features/mockup-tool/components/phone-poses";

import styles from "./TextPanel.module.css";

type TextPanelProps = {
  draft: EditorDraft;
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
  onAddImageBlock: (index: number, file: File | null) => void;
  onRemoveImageBlock: (index: number, blockId: string) => void;
  onAddSlide: () => void;
  selectedCanvasItem: CanvasSelection | null;
  onDeleteSelectedCanvasItem: () => void;
  screenshotLibrary: ScreenshotAsset[];
  slideScreenshotAssetIds: Array<string | null>;
  screenshotNames: Array<string | null>;
  onAssignScreenshotToSlide: (index: number, assetId: string | null) => void;
  onRemoveScreenshotAsset: (assetId: string) => void;
  onSlideScreenshotChange: (index: number, file: File | null) => void;
  onScreenshotLibraryUpload: (files: FileList | null) => void;
};

export function TextPanel({
  draft,
  slide,
  selectedSlideIndex,
  onDraftChange,
  onSlideChange,
  onAddImageBlock,
  onRemoveImageBlock,
  onAddSlide,
  selectedCanvasItem,
  onDeleteSelectedCanvasItem,
  screenshotLibrary,
  slideScreenshotAssetIds,
  screenshotNames,
  onAssignScreenshotToSlide,
  onRemoveScreenshotAsset,
  onSlideScreenshotChange,
  onScreenshotLibraryUpload,
}: TextPanelProps) {
  function updateBlocks(nextBlocks: SlideTextBlock[]) {
    onSlideChange(selectedSlideIndex, "extraTextBlocks", nextBlocks);
  }

  function updateBlock(
    blockId: string,
    patch: Partial<SlideTextBlock>,
  ) {
    updateBlocks(
      slide.extraTextBlocks.map((block) =>
        block.id === blockId ? { ...block, ...patch } : block,
      ),
    );
  }

  function addTextBlock() {
    updateBlocks([
      ...slide.extraTextBlocks,
      {
        id: crypto.randomUUID(),
        text: "New text",
        x: 0,
        y: 0,
        size: 28,
        width: 180,
        weight: 700,
        font: draft.font,
      },
    ]);
  }

  function removeTextBlock(blockId: string) {
    updateBlocks(slide.extraTextBlocks.filter((block) => block.id !== blockId));
  }

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
      <label className={styles.field}>
        <span>Project name</span>
        <input
          value={draft.projectName}
          onChange={(event) => onDraftChange("projectName", event.target.value)}
        />
      </label>

      <div className={styles.actionRow}>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={addTextBlock}
        >
          Add text
        </button>

        <label className={styles.actionButton}>
          <input
            type="file"
            accept="image/*"
            className={styles.hiddenInput}
            onChange={(event) =>
              onAddImageBlock(
                selectedSlideIndex,
                event.target.files?.[0] ?? null,
              )
            }
          />
          Add image
        </label>

        <label className={styles.actionButton}>
          <input
            type="file"
            accept="image/*"
            multiple
            className={styles.hiddenInput}
            onChange={(event) => onScreenshotLibraryUpload(event.target.files)}
          />
          Upload screenshot
        </label>

        <button
          type="button"
          className={styles.secondaryButton}
          onClick={onAddSlide}
        >
          Add new slide
        </button>
      </div>

      <div className={styles.fieldGroupLabel}>Typography</div>
      <label className={styles.field}>
        <span>Font</span>
        <select
          value={draft.font}
          onChange={(event) =>
            onDraftChange("font", event.target.value as FontOption)
          }
        >
          {fontOptions.map((font) => (
            <option key={font.id} value={font.id}>
              {font.name}
            </option>
          ))}
        </select>
      </label>

      <div className={styles.fieldGroupLabel}>
        Slide {selectedSlideIndex + 1} content
      </div>

      <label className={styles.field}>
        <span>Phone pose</span>
        <select
          value={slide.poseId ?? "flat"}
          onChange={(event) =>
            onSlideChange(
              selectedSlideIndex,
              "poseId",
              event.target.value as PhonePoseId,
            )
          }
        >
          {phonePoseList.map((pose) => (
            <option key={pose.id} value={pose.id}>
              {pose.label}
            </option>
          ))}
        </select>
      </label>

      <div className={styles.blockHeader}>
        <div className={styles.optionalHeading}>
          <strong>Badge</strong>
          <span>Optional</span>
        </div>
        {slide.badge.trim() ? (
          <button
            type="button"
            className={styles.removeButton}
            onClick={() => onSlideChange(selectedSlideIndex, "badge", "")}
          >
            Remove
          </button>
        ) : null}
      </div>

      <label className={styles.field}>
        <span>Badge label</span>
        <input
          value={slide.badge}
          placeholder="Leave empty if you do not need a badge"
          onChange={(event) =>
            onSlideChange(selectedSlideIndex, "badge", event.target.value)
          }
        />
      </label>

      <label className={styles.field}>
        <span>Headline</span>
        <textarea
          rows={4}
          value={slide.title}
          onChange={(event) =>
            onSlideChange(selectedSlideIndex, "title", event.target.value)
          }
        />
      </label>

      <label className={styles.field}>
        <span>Support text</span>
        <textarea
          rows={3}
          value={slide.subtitle}
          onChange={(event) =>
            onSlideChange(selectedSlideIndex, "subtitle", event.target.value)
          }
        />
      </label>

      <div className={styles.fieldGroupLabel}>Extra text blocks</div>

      {slide.extraTextBlocks.length > 0 ? (
        <div className={styles.blockList}>
          {slide.extraTextBlocks.map((block, index) => (
            <div key={block.id} className={styles.blockCard}>
              <div className={styles.blockHeader}>
                <strong>Text block {index + 1}</strong>
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => removeTextBlock(block.id)}
                >
                  Remove
                </button>
              </div>

              <label className={styles.field}>
                <span>Text</span>
                <textarea
                  rows={3}
                  value={block.text}
                  onChange={(event) =>
                    updateBlock(block.id, { text: event.target.value })
                  }
                />
              </label>

              <label className={styles.field}>
                <div className={styles.rangeHeader}>
                  <span>Text size</span>
                  <b>{block.size}px</b>
                </div>
                <input
                  type="range"
                  min={14}
                  max={64}
                  step={1}
                  value={block.size}
                  onChange={(event) =>
                    updateBlock(block.id, {
                      size: Number(event.target.value),
                    })
                  }
                />
              </label>

              <label className={styles.field}>
                <div className={styles.rangeHeader}>
                  <span>Text width</span>
                  <b>{block.width}px</b>
                </div>
                <input
                  type="range"
                  min={80}
                  max={220}
                  step={1}
                  value={block.width}
                  onChange={(event) =>
                    updateBlock(block.id, {
                      width: Number(event.target.value),
                    })
                  }
                />
              </label>

              <label className={styles.field}>
                <span>Weight</span>
                <select
                  value={block.weight}
                  onChange={(event) =>
                    updateBlock(block.id, {
                      weight: Number(event.target.value) as 500 | 700 | 900,
                    })
                  }
                >
                  <option value={500}>Medium</option>
                  <option value={700}>Bold</option>
                  <option value={900}>Black</option>
                </select>
              </label>

              <label className={styles.field}>
                <span>Font</span>
                <select
                  value={block.font}
                  onChange={(event) =>
                    updateBlock(block.id, {
                      font: event.target.value as FontOption,
                    })
                  }
                >
                  {fontOptions.map((font) => (
                    <option key={font.id} value={font.id}>
                      {font.name}
                    </option>
                  ))}
                </select>
              </label>

            </div>
          ))}
        </div>
      ) : null}

      <div className={styles.fieldGroupLabel}>Image blocks</div>

      {slide.imageBlocks.length > 0 ? (
        <div className={styles.blockList}>
          {slide.imageBlocks.map((block, index) => (
            <div key={block.id} className={styles.blockCard}>
              <div className={styles.blockHeader}>
                <strong>Image block {index + 1}</strong>
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => onRemoveImageBlock(selectedSlideIndex, block.id)}
                >
                  Remove
                </button>
              </div>
              <div className={styles.assetRow}>
                <img
                  src={block.url}
                  alt={block.name}
                  className={styles.assetThumb}
                />
                <div className={styles.assetCopy}>
                  <strong>{block.name}</strong>
                  <span>{block.width} × {block.height}px</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {selectedCanvasItem &&
      selectedCanvasItem.slideIndex === selectedSlideIndex &&
      selectedCanvasItem.kind !== "main-text" ? (
        <div className={styles.selectedCard}>
          <div className={styles.optionalHeading}>
            <strong>
              {selectedCanvasItem.kind === "text-block"
                ? "Selected text block"
                : "Selected image block"}
            </strong>
            <span>Canvas selection</span>
          </div>
          <button
            type="button"
            className={styles.deleteButton}
            onClick={onDeleteSelectedCanvasItem}
          >
            Delete selected block
          </button>
        </div>
      ) : null}

      <div className={styles.fieldGroupLabel}>Screenshot library</div>

      {screenshotLibrary.length > 0 ? (
        <div className={styles.assetGrid}>
          {screenshotLibrary.map((asset) => {
            const assignedSlides = getAssignedSlides(asset.id);
            const isActive = asset.id === slideScreenshotAssetIds[selectedSlideIndex];

            return (
              <button
                key={asset.id}
                type="button"
                className={styles.assetCard}
                data-active={isActive}
                onClick={() => onAssignScreenshotToSlide(selectedSlideIndex, asset.id)}
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
          {screenshotNames[selectedSlideIndex]
            ? `Quick replace slide ${selectedSlideIndex + 1}`
            : `Upload one screenshot for slide ${selectedSlideIndex + 1}`}
        </strong>
        <span>
          {screenshotNames[selectedSlideIndex] ??
            "PNG or JPG. This also adds it to the library."}
        </span>
      </label>
    </div>
  );
}
