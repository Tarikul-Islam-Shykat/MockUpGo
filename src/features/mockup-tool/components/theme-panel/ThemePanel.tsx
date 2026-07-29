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
  onClearCustomBackground: () => void;
  onCustomThemeSettingsChange: <Key extends keyof CustomThemeSettings>(
    field: Key,
    value: CustomThemeSettings[Key],
  ) => void;
  onResetCustomTheme: () => void;
  onResetTheme: () => void;
};

export function ThemePanel({
  themes,
  selectedThemeId,
  customBackgroundName,
  customThemeSettings,
  onThemeSelect,
  onCustomBackgroundUpload,
  onClearCustomBackground,
  onCustomThemeSettingsChange,
  onResetCustomTheme,
  onResetTheme,
}: ThemePanelProps) {
  if (customBackgroundName) {
    return (
      <CustomThemePanel
        customBackgroundName={customBackgroundName}
        settings={customThemeSettings}
        onCustomBackgroundUpload={onCustomBackgroundUpload}
        onClearCustomBackground={onClearCustomBackground}
        onSettingsChange={onCustomThemeSettingsChange}
        onResetCustomTheme={onResetCustomTheme}
      />
    );
  }

  return (
    <StandardThemePanel
      themes={themes}
      selectedThemeId={selectedThemeId}
      onThemeSelect={onThemeSelect}
      onCustomBackgroundUpload={onCustomBackgroundUpload}
      onResetTheme={onResetTheme}
    />
  );
}
