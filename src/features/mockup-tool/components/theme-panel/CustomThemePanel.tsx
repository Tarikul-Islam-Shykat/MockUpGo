import type { CustomThemeSettings } from "@/features/mockup-tool/types";

import styles from "./CustomThemePanel.module.css";

type CustomThemePanelProps = {
  customBackgroundName: string;
  settings: CustomThemeSettings;
  onCustomBackgroundUpload: (file: File | null) => void;
  onClearCustomBackground: () => void;
  onSettingsChange: <Key extends keyof CustomThemeSettings>(
    field: Key,
    value: CustomThemeSettings[Key],
  ) => void;
  onResetCustomTheme: () => void;
};

export function CustomThemePanel({
  customBackgroundName,
  settings,
  onCustomBackgroundUpload,
  onClearCustomBackground,
  onSettingsChange,
  onResetCustomTheme,
}: CustomThemePanelProps) {
  return (
    <div className={styles.panel}>
      <div className={styles.modeCard}>
        <div className={styles.modeBadge}>Custom Theme</div>
        <strong>{customBackgroundName}</strong>
        <span>
          Standard theme visuals are disabled. Your uploaded background now
          drives the scene.
        </span>
      </div>

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
        <strong>Replace custom background</strong>
        <span>Choose a different image file for this custom theme.</span>
      </label>

      <div className={styles.controlSurface}>
        <div className={styles.surfaceHeader}>
          <div>
            <strong>Background Controls</strong>
            <span>Fine-tune the custom scene without bringing the old theme back.</span>
          </div>
        </div>

        <div className={styles.fieldGroupLabel}>Transform</div>

        <label className={styles.field}>
          <div className={styles.rangeHeader}>
            <span>Zoom</span>
            <b>{settings.scale}%</b>
          </div>
          <input
            type="range"
            min={70}
            max={180}
            step={1}
            value={settings.scale}
            onChange={(event) =>
              onSettingsChange("scale", Number(event.target.value))
            }
          />
        </label>

        <label className={styles.field}>
          <div className={styles.rangeHeader}>
            <span>Rotation</span>
            <b>{settings.rotation}deg</b>
          </div>
          <input
            type="range"
            min={-45}
            max={45}
            step={1}
            value={settings.rotation}
            onChange={(event) =>
              onSettingsChange("rotation", Number(event.target.value))
            }
          />
        </label>

        <div className={styles.fieldGroupLabel}>Position</div>

        <label className={styles.field}>
          <div className={styles.rangeHeader}>
            <span>Horizontal pan</span>
            <b>{settings.offsetX}px</b>
          </div>
          <input
            type="range"
            min={-240}
            max={240}
            step={1}
            value={settings.offsetX}
            onChange={(event) =>
              onSettingsChange("offsetX", Number(event.target.value))
            }
          />
        </label>

        <label className={styles.field}>
          <div className={styles.rangeHeader}>
            <span>Vertical pan</span>
            <b>{settings.offsetY}px</b>
          </div>
          <input
            type="range"
            min={-240}
            max={240}
            step={1}
            value={settings.offsetY}
            onChange={(event) =>
              onSettingsChange("offsetY", Number(event.target.value))
            }
          />
        </label>

        <div className={styles.fieldGroupLabel}>Atmosphere</div>

        <label className={styles.field}>
          <div className={styles.rangeHeader}>
            <span>Veil strength</span>
            <b>{settings.overlayOpacity}%</b>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={settings.overlayOpacity}
            onChange={(event) =>
              onSettingsChange("overlayOpacity", Number(event.target.value))
            }
          />
        </label>
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
          onClick={onClearCustomBackground}
        >
          Return to themes
        </button>
      </div>
    </div>
  );
}
