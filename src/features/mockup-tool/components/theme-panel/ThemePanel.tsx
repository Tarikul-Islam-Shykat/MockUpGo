import type {
  CustomThemeSettings,
  MockupTheme,
} from "@/features/mockup-tool/types";

import { CustomThemePanel } from "./CustomThemePanel";
import { StandardThemePanel } from "./StandardThemePanel";

type ThemePanelProps = {
  themes: MockupTheme[];
  selectedThemeId: string;
  customBackgroundName: string | null;
  customThemeSettings: CustomThemeSettings;
  onThemeSelect: (themeId: string) => void;
  onCustomBackgroundUpload: (file: File | null) => void;
  onSetGradientTheme: () => void;
  onCustomThemeSettingsChange: <Key extends keyof CustomThemeSettings>(
    field: Key,
    value: CustomThemeSettings[Key],
  ) => void;
  onResetCustomTheme: () => void;
  onResetTheme: () => void;
  onReturnToThemes: () => void;
};

export function ThemePanel({
  themes,
  selectedThemeId,
  customBackgroundName,
  customThemeSettings,
  onThemeSelect,
  onCustomBackgroundUpload,
  onSetGradientTheme,
  onCustomThemeSettingsChange,
  onResetCustomTheme,
  onResetTheme,
  onReturnToThemes,
}: ThemePanelProps) {
  const hasCustomTheme =
    customBackgroundName !== null ||
    customThemeSettings.backgroundMode !== "preset";

  if (hasCustomTheme) {
    return (
      <CustomThemePanel
        settings={customThemeSettings}
        onSettingsChange={onCustomThemeSettingsChange}
        onResetCustomTheme={onResetCustomTheme}
        onReturnToThemes={onReturnToThemes}
      />
    );
  }

  return (
      <StandardThemePanel
        themes={themes}
        selectedThemeId={selectedThemeId}
        onThemeSelect={onThemeSelect}
        onCustomBackgroundUpload={onCustomBackgroundUpload}
        onSetGradientTheme={onSetGradientTheme}
        onResetTheme={onResetTheme}
      />
  );
}
