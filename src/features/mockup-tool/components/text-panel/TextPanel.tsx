import type {
  CanvasSelection,
  EditorDraft,
  FontOption,
  SlideDraft,
  SlideTextBlock,
} from "@/features/mockup-tool/types";
import { fontOptions } from "@/features/mockup-tool/data/fonts";

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
  selectedCanvasItem: CanvasSelection | null;
  onDeleteSelectedCanvasItem: () => void;
};

export function TextPanel({
  draft,
  slide,
  selectedSlideIndex,
  onDraftChange,
  onSlideChange,
  onAddImageBlock,
  onRemoveImageBlock,
  selectedCanvasItem,
  onDeleteSelectedCanvasItem,
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

  return (
    <div className={styles.panel}>
      <label className={styles.field}>
        <span>Project name</span>
        <input
          value={draft.projectName}
          onChange={(event) => onDraftChange("projectName", event.target.value)}
        />
      </label>

      <div className={styles.fieldGroupLabel}>Typography</div>
      <div className={styles.fontGrid}>
        {fontOptions.map((font) => (
          <button
            key={font.id}
            type="button"
            className={styles.fontCard}
            data-active={draft.font === font.id}
            onClick={() => onDraftChange("font", font.id as FontOption)}
            style={{ fontFamily: font.family }}
          >
            <span className={styles.fontPreview}>Ag</span>
            <b>{font.name}</b>
          </button>
        ))}
      </div>

      <div className={styles.fieldGroupLabel}>
        Slide {selectedSlideIndex + 1} content
      </div>

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

      <button
        type="button"
        className={styles.primaryButton}
        onClick={addTextBlock}
      >
        Add text block
      </button>

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

              <div className={styles.dragHint}>
                Drag this text directly on the slide canvas to place it anywhere.
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          Add a text block to place extra copy anywhere on the slide.
        </div>
      )}

      <div className={styles.fieldGroupLabel}>Image blocks</div>

      <label className={styles.uploadCard}>
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
        <strong>Add image or logo</strong>
        <span>
          Upload a logo or image block, then drag it on the slide and resize it from the canvas.
        </span>
      </label>

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
              <div className={styles.dragHint}>
                Drag the image on the canvas and use the bottom-right handle to resize it.
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          Add an image block if you want to place a logo or extra artwork on the slide.
        </div>
      )}

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

      <div className={styles.canvasHint}>
        Drag the main headline, the phone, any extra text block, or any image block directly on the slide canvas. Select a text or image block and press Delete to remove it.
      </div>
    </div>
  );
}
