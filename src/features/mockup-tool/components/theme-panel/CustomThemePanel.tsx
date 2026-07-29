import { customThemePalettes } from "@/features/mockup-tool/data/custom-theme-palettes";
import type { CustomThemeSettings } from "@/features/mockup-tool/types";

import { GradientPaletteRail } from "./gradient-palette-rail/GradientPaletteRail";
import styles from "./CustomThemePanel.module.css";

type CustomThemePanelProps = {
  settings: CustomThemeSettings;
  onSettingsChange: <Key extends keyof CustomThemeSettings>(
    field: Key,
    value: CustomThemeSettings[Key],
  ) => void;
  onResetCustomTheme: () => void;
  onReturnToThemes: () => void;
};

export function CustomThemePanel({
  settings,
  onSettingsChange,
  onResetCustomTheme,
  onReturnToThemes,
}: CustomThemePanelProps) {
  function applyPalette(paletteId: string) {
    const palette =
      customThemePalettes.find((item) => item.id === paletteId) ??
      customThemePalettes[0];

    onSettingsChange("backgroundMode", "gradient");
    onSettingsChange("paletteId", palette.id);
    onSettingsChange("backgroundStart", palette.backgroundStart);
    onSettingsChange("backgroundEnd", palette.backgroundEnd);
    onSettingsChange("backgroundAngle", palette.backgroundAngle);
    onSettingsChange("textColor", palette.textColor);
    onSettingsChange("mutedColor", palette.mutedColor);
    onSettingsChange("accentColor", palette.accentColor);
  }

  return (
    <div className={styles.panel}>
      <div className={styles.controlSurface}>
        <GradientPaletteRail
          selectedPaletteId={settings.paletteId}
          onSelectPalette={applyPalette}
        />

        <div className={styles.fieldGroupLabel}>Gradient colors</div>

        <label className={styles.field}>
          <div className={styles.rangeHeader}>
            <span>Gradient angle</span>
            <b>{settings.backgroundAngle}°</b>
          </div>
          <input
            type="range"
            min={0}
            max={360}
            step={1}
            value={settings.backgroundAngle}
            onChange={(event) =>
              onSettingsChange("backgroundAngle", Number(event.target.value))
            }
          />
        </label>

        <div className={styles.colorGrid}>
          <label className={styles.colorField}>
            <span>Start</span>
            <input
              type="color"
              value={settings.backgroundStart}
              onChange={(event) => {
                onSettingsChange("backgroundMode", "gradient");
                onSettingsChange("backgroundStart", event.target.value);
              }}
            />
          </label>

          <label className={styles.colorField}>
            <span>End</span>
            <input
              type="color"
              value={settings.backgroundEnd}
              onChange={(event) => {
                onSettingsChange("backgroundMode", "gradient");
                onSettingsChange("backgroundEnd", event.target.value);
              }}
            />
          </label>
        </div>
      </div>

      <div className={styles.actionRow}>
        <button
          type="button"
          className={styles.secondaryButton}
          onClick={onResetCustomTheme}
        >
          Reset controls
        </button>

        <button
          type="button"
          className={styles.dangerButton}
          onClick={onReturnToThemes}
        >
          Return to themes
        </button>
      </div>
    </div>
  );
}
