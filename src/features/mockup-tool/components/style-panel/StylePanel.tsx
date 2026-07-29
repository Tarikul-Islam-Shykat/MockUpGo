import type {
  DeviceFinish,
  EditorDraft,
  ScreenshotFit,
} from "@/features/mockup-tool/types";

import styles from "./StylePanel.module.css";

type StylePanelProps = {
  draft: EditorDraft;
  onDraftChange: <Key extends keyof EditorDraft>(
    field: Key,
    value: EditorDraft[Key],
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

export function StylePanel({ draft, onDraftChange }: StylePanelProps) {
  return (
    <div className={styles.panel}>
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
