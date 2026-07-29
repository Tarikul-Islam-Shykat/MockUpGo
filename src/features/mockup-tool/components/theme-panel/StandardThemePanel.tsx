import type { MockupTheme } from "@/features/mockup-tool/types";

import { TemplateRail } from "./TemplateRail";
import styles from "./StandardThemePanel.module.css";

type StandardThemePanelProps = {
  themes: MockupTheme[];
  selectedThemeId: string;
  onThemeSelect: (themeId: string) => void;
  onCustomBackgroundUpload: (file: File | null) => void;
  onResetTheme: () => void;
};

export function StandardThemePanel({
  themes,
  selectedThemeId,
  onThemeSelect,
  onCustomBackgroundUpload,
  onResetTheme,
}: StandardThemePanelProps) {
  return (
    <div className={styles.panel}>
      <TemplateRail
        templates={themes}
        selectedTemplateId={selectedThemeId}
        onSelect={onThemeSelect}
      />

      <label className={styles.uploadCard}>
        <input
          type="file"
          accept="image/*"
          className={styles.hiddenInput}
          onChange={(event) => {
            onCustomBackgroundUpload(event.target.files?.[0] ?? null);
            event.target.value = "";
          }}
        />
        <strong>Create custom theme</strong>
        <span>
          Upload a background image to switch from the standard theme library to
          custom theme controls.
        </span>
      </label>

      <button
        type="button"
        className={styles.secondaryButton}
        onClick={onResetTheme}
      >
        Reset theme defaults
      </button>
    </div>
  );
}
