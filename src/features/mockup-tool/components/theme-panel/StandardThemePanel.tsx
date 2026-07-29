import type { MockupTheme } from "@/features/mockup-tool/types";

import { TemplateRail } from "./TemplateRail";
import styles from "./StandardThemePanel.module.css";

type StandardThemePanelProps = {
  themes: MockupTheme[];
  selectedThemeId: string;
  onThemeSelect: (themeId: string) => void;
  onCustomBackgroundUpload: (file: File | null) => void;
  onSetGradientTheme: () => void;
  onResetTheme: () => void;
};

export function StandardThemePanel({
  themes,
  selectedThemeId,
  onThemeSelect,
  onCustomBackgroundUpload,
  onSetGradientTheme,
  onResetTheme,
}: StandardThemePanelProps) {
  return (
    <div className={styles.panel}>
      <TemplateRail
        templates={themes}
        selectedTemplateId={selectedThemeId}
        onSelect={onThemeSelect}
      />

      <div className={styles.actionStack}>
        <label className={styles.primaryButton}>
          <input
            type="file"
            accept="image/*"
            className={styles.hiddenInput}
            onChange={(event) => {
              onCustomBackgroundUpload(event.target.files?.[0] ?? null);
              event.target.value = "";
            }}
          />
          Set custom theme
        </label>

        <button
          type="button"
          className={styles.gradientButton}
          onClick={onSetGradientTheme}
        >
          Set gradient theme
        </button>

        <button
          type="button"
          className={styles.secondaryButton}
          onClick={onResetTheme}
        >
          Reset to default
        </button>
      </div>
    </div>
  );
}
