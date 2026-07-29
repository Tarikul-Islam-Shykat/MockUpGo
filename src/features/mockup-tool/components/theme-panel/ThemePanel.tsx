import type { MockupTheme } from "@/features/mockup-tool/types";

import { TemplateRail } from "./TemplateRail";
import styles from "./ThemePanel.module.css";

type ThemePanelProps = {
  themes: MockupTheme[];
  selectedThemeId: string;
  onThemeSelect: (themeId: string) => void;
  onResetTheme: () => void;
};

export function ThemePanel({
  themes,
  selectedThemeId,
  onThemeSelect,
  onResetTheme,
}: ThemePanelProps) {
  return (
    <div className={styles.panel}>
      <TemplateRail
        templates={themes}
        selectedTemplateId={selectedThemeId}
        onSelect={onThemeSelect}
      />

      <button
        type="button"
        className={styles.resetButton}
        onClick={onResetTheme}
      >
        Reset theme defaults
      </button>
    </div>
  );
}
