import type {
  CanvasSelection,
  DeviceFinish,
  PhonePoseId,
  ScreenshotAsset,
  SlideDraft,
  SlidePhoneBlock,
} from "@/features/mockup-tool/types";
import { phonePoseList } from "@/features/mockup-tool/components/phone-poses";

import styles from "./DevicePanel.module.css";

type DevicePanelProps = {
  slide: SlideDraft;
  selectedSlideIndex: number;
  selectedCanvasItem: CanvasSelection | null;
  onSelectCanvasItem: (item: CanvasSelection | null) => void;
  screenshotLibrary: ScreenshotAsset[];
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

export function DevicePanel({
  slide,
  selectedSlideIndex,
  selectedCanvasItem,
  onSelectCanvasItem,
  screenshotLibrary,
  onSlideChange,
}: DevicePanelProps) {
  const phoneBlocks = slide.phoneBlocks ?? [];

  // Helper to update the phoneBlocks array on the slide
  function updatePhoneBlocks(nextBlocks: SlidePhoneBlock[]) {
    onSlideChange(selectedSlideIndex, "phoneBlocks", nextBlocks);
  }

  // Update a single phone block field
  function updatePhoneBlock<Key extends keyof SlidePhoneBlock>(
    blockId: string,
    field: Key,
    value: SlidePhoneBlock[Key],
  ) {
    updatePhoneBlocks(
      phoneBlocks.map((block) =>
        block.id === blockId ? { ...block, [field]: value } : block,
      ),
    );
  }

  // Add a new phone block to the canvas
  function addPhoneBlock() {
    const nextBlock: SlidePhoneBlock = {
      id: crypto.randomUUID(),
      x: phoneBlocks.length * 30 + 10,
      y: phoneBlocks.length * 35 + 80,
      scale: 90,
      rotation: 0,
      poseId: "flat",
      deviceFinish: "obsidian",
      screenshotAssetId: null,
    };
    updatePhoneBlocks([...phoneBlocks, nextBlock]);
    onSelectCanvasItem({
      kind: "phone-block",
      slideIndex: selectedSlideIndex,
      id: nextBlock.id,
    });
  }

  // Remove a phone block from the canvas
  function removePhoneBlock(blockId: string) {
    updatePhoneBlocks(phoneBlocks.filter((block) => block.id !== blockId));
    if (
      selectedCanvasItem?.kind === "phone-block" &&
      selectedCanvasItem.id === blockId
    ) {
      onSelectCanvasItem(null);
    }
  }

  // Find the currently selected phone block, if any
  const selectedPhoneBlock =
    selectedCanvasItem?.kind === "phone-block" &&
    selectedCanvasItem.slideIndex === selectedSlideIndex
      ? phoneBlocks.find((block) => block.id === selectedCanvasItem.id)
      : null;

  // Add custom text block helper
  function addTextBlock() {
    onSlideChange(selectedSlideIndex, "extraTextBlocks", [
      ...slide.extraTextBlocks,
      {
        id: crypto.randomUUID(),
        text: "New text",
        x: 20,
        y: 60,
        size: 28,
        width: 180,
        weight: 700,
        font: "inter",
      },
    ]);
  }

  return (
    <div className={styles.panel}>
      <div style={{ display: "flex", gap: "8px" }}>
        <button
          type="button"
          className={styles.actionButton}
          onClick={addPhoneBlock}
          style={{ flex: 1 }}
        >
          + Phone Frame
        </button>
        <button
          type="button"
          className={styles.secondaryButton}
          onClick={addTextBlock}
          style={{ flex: 1, padding: "12px", background: "var(--c-accent)", color: "#000", border: "none" }}
        >
          + Add Text
        </button>
      </div>

      <div className={styles.fieldGroupLabel}>Phones on Canvas</div>

      {phoneBlocks.length > 0 ? (
        <div className={styles.blockList}>
          {phoneBlocks.map((block, index) => {
            const isActive = selectedCanvasItem?.kind === "phone-block" && selectedCanvasItem.id === block.id;

            return (
              <div
                key={block.id}
                className={styles.blockCard}
                data-active={isActive}
                onClick={() =>
                  onSelectCanvasItem({
                    kind: "phone-block",
                    slideIndex: selectedSlideIndex,
                    id: block.id,
                  })
                }
                style={{ cursor: "pointer" }}
              >
                <div className={styles.blockHeader}>
                  <strong>Phone {index + 1} ({block.poseId})</strong>
                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      removePhoneBlock(block.id);
                    }}
                  >
                    Delete
                  </button>
                </div>

                {isActive && (
                  <div className={styles.panel} style={{ gap: "10px", marginTop: "8px" }} onClick={(e) => e.stopPropagation()}>
                    <label className={styles.field}>
                      <span>Screenshot</span>
                      <select
                        value={block.screenshotAssetId ?? ""}
                        onChange={(e) =>
                          updatePhoneBlock(
                            block.id,
                            "screenshotAssetId",
                            e.target.value || null,
                          )
                        }
                      >
                        <option value="">No screenshot</option>
                        {screenshotLibrary.map((asset) => (
                          <option key={asset.id} value={asset.id}>
                            {asset.name}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className={styles.field}>
                      <span>Finish</span>
                      <select
                        value={block.deviceFinish}
                        onChange={(e) =>
                          updatePhoneBlock(
                            block.id,
                            "deviceFinish",
                            e.target.value as DeviceFinish,
                          )
                        }
                      >
                        {deviceFinishOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className={styles.field}>
                      <span>Pose</span>
                      <select
                        value={block.poseId}
                        onChange={(e) =>
                          updatePhoneBlock(
                            block.id,
                            "poseId",
                            e.target.value as PhonePoseId,
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

                    <label className={styles.field}>
                      <div className={styles.rangeHeader}>
                        <span>Scale</span>
                        <b>{block.scale}%</b>
                      </div>
                      <input
                        type="range"
                        min={30}
                        max={120}
                        value={block.scale}
                        onChange={(e) =>
                          updatePhoneBlock(
                            block.id,
                            "scale",
                            Number(e.target.value),
                          )
                        }
                      />
                    </label>

                    <label className={styles.field}>
                      <div className={styles.rangeHeader}>
                        <span>Rotation</span>
                        <b>{block.rotation}°</b>
                      </div>
                      <input
                        type="range"
                        min={-180}
                        max={180}
                        value={block.rotation}
                        onChange={(e) =>
                          updatePhoneBlock(
                            block.id,
                            "rotation",
                            Number(e.target.value),
                          )
                        }
                      />
                    </label>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.emptyState}>
          No phones added yet. Click "+ Add Phone Frame" to add your first device mock to the canvas.
        </div>
      )}

      <div className={styles.fieldGroupLabel}>Text Blocks on Canvas</div>

      {slide.extraTextBlocks.length > 0 ? (
        <div className={styles.blockList}>
          {slide.extraTextBlocks.map((block, idx) => {
            const isActive = selectedCanvasItem?.kind === "text-block" && selectedCanvasItem.id === block.id;

            return (
              <div
                key={block.id}
                className={styles.blockCard}
                data-active={isActive}
                onClick={() =>
                  onSelectCanvasItem({
                    kind: "text-block",
                    slideIndex: selectedSlideIndex,
                    id: block.id,
                  })
                }
                style={{ cursor: "pointer" }}
              >
                <div className={styles.blockHeader}>
                  <strong>Text {idx + 1} ("{block.text.substring(0, 10)}...")</strong>
                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSlideChange(
                        selectedSlideIndex,
                        "extraTextBlocks",
                        slide.extraTextBlocks.filter((t) => t.id !== block.id)
                      );
                      if (selectedCanvasItem?.kind === "text-block" && selectedCanvasItem.id === block.id) {
                        onSelectCanvasItem(null);
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>

                {isActive && (
                  <div className={styles.panel} style={{ gap: "10px", marginTop: "8px" }} onClick={(e) => e.stopPropagation()}>
                    <label className={styles.field}>
                      <span>Text Value</span>
                      <input
                        value={block.text}
                        onChange={(e) => {
                          const nextText = slide.extraTextBlocks.map((t) =>
                            t.id === block.id ? { ...t, text: e.target.value } : t
                          );
                          onSlideChange(selectedSlideIndex, "extraTextBlocks", nextText);
                        }}
                      />
                    </label>

                    <label className={styles.field}>
                      <div className={styles.rangeHeader}>
                        <span>Text Size</span>
                        <b>{block.size}px</b>
                      </div>
                      <input
                        type="range"
                        min={12}
                        max={80}
                        value={block.size}
                        onChange={(e) => {
                          const nextText = slide.extraTextBlocks.map((t) =>
                            t.id === block.id ? { ...t, size: Number(e.target.value) } : t
                          );
                          onSlideChange(selectedSlideIndex, "extraTextBlocks", nextText);
                        }}
                      />
                    </label>

                    <label className={styles.field}>
                      <div className={styles.rangeHeader}>
                        <span>Block Width</span>
                        <b>{block.width}px</b>
                      </div>
                      <input
                        type="range"
                        min={50}
                        max={500}
                        value={block.width}
                        onChange={(e) => {
                          const nextText = slide.extraTextBlocks.map((t) =>
                            t.id === block.id ? { ...t, width: Number(e.target.value) } : t
                          );
                          onSlideChange(selectedSlideIndex, "extraTextBlocks", nextText);
                        }}
                      />
                    </label>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.emptyState}>
          No extra text blocks. Click "+ Add Text" to add a text layer.
        </div>
      )}
    </div>
  );
}
