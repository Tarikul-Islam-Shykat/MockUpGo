import type { EditorDraft, SlideDraft } from "@/features/mockup-tool/types";

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
};

export function TextPanel({
  draft,
  slide,
  selectedSlideIndex,
  onDraftChange,
  onSlideChange,
}: TextPanelProps) {
  return (
    <div className={styles.panel}>
      <label className={styles.field}>
        <span>Project name</span>
        <input
          value={draft.projectName}
          onChange={(event) => onDraftChange("projectName", event.target.value)}
        />
      </label>

      <div className={styles.fieldGroupLabel}>
        Slide {selectedSlideIndex + 1} content
      </div>

      <label className={styles.field}>
        <span>Badge label</span>
        <input
          value={slide.badge}
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
    </div>
  );
}
