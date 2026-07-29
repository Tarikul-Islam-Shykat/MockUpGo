import { ThemePanel } from "@/features/mockup-tool/components/theme-panel/ThemePanel";
import { SlidePanel } from "@/features/mockup-tool/components/slide-panel/SlidePanel";
import { TextPanel } from "@/features/mockup-tool/components/text-panel/TextPanel";
import { StylePanel } from "@/features/mockup-tool/components/style-panel/StylePanel";
import { ExportPanel } from "@/features/mockup-tool/components/export-panel/ExportPanel";
import type {
  CustomThemeSettings,
  EditorDraft,
  MockupTheme,
  ScreenshotAsset,
  SlideDraft,
  ToolTab,
} from "@/features/mockup-tool/types";

import styles from "./InspectorPanel.module.css";

type InspectorPanelProps = {
  activeTab: ToolTab;
  draft: EditorDraft;
  slides: SlideDraft[];
  selectedSlideIndex: number;
  themes: MockupTheme[];
  screenshotLibrary: ScreenshotAsset[];
  slideScreenshotAssetIds: Array<string | null>;
  screenshotNames: Array<string | null>;
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
  onDraftChange: <Key extends keyof EditorDraft>(
    field: Key,
    value: EditorDraft[Key],
  ) => void;
  onSlideChange: <Key extends keyof SlideDraft>(
    index: number,
    field: Key,
    value: SlideDraft[Key],
  ) => void;
  onSelectedSlideChange: (index: number) => void;
  onAssignScreenshotToSlide: (index: number, assetId: string | null) => void;
  onRemoveScreenshotAsset: (assetId: string) => void;
  onSlideScreenshotChange: (index: number, file: File | null) => void;
  onScreenshotLibraryUpload: (files: FileList | null) => void;
  onResetTheme: () => void;
  onExport: () => void;
  onAddSlide: () => void;
  onRemoveSlide: (index: number) => void;
  isExporting: boolean;
  maxSlides: number;
  isZipping?: boolean;
  zipProgress?: number;
  onExportZip?: () => void;
};

export function InspectorPanel({
  activeTab,
  draft,
  slides,
  selectedSlideIndex,
  themes,
  screenshotLibrary,
  slideScreenshotAssetIds,
  screenshotNames,
  customBackgroundName,
  customThemeSettings,
  onThemeSelect,
  onCustomBackgroundUpload,
  onClearCustomBackground,
  onCustomThemeSettingsChange,
  onResetCustomTheme,
  onDraftChange,
  onSlideChange,
  onSelectedSlideChange,
  onAssignScreenshotToSlide,
  onRemoveScreenshotAsset,
  onSlideScreenshotChange,
  onScreenshotLibraryUpload,
  onResetTheme,
  onExport,
  onAddSlide,
  onRemoveSlide,
  isExporting,
  maxSlides,
  isZipping = false,
  zipProgress = 0,
  onExportZip,
}: InspectorPanelProps) {
  return (
    <aside className={styles.panel}>
      <div className={styles.header}>
        <span>Inspector</span>
        <h2>{getTabTitle(activeTab)}</h2>
        <p>{getTabDescription(activeTab)}</p>
      </div>

      {/* ── THEME TAB ──────────────────────────────────────────────── */}
      {activeTab === "theme" ? (
        <section className={styles.section}>
          <ThemePanel
            themes={themes}
            selectedThemeId={draft.themeId}
            customBackgroundName={customBackgroundName}
            customThemeSettings={customThemeSettings}
            onThemeSelect={onThemeSelect}
            onCustomBackgroundUpload={onCustomBackgroundUpload}
            onClearCustomBackground={onClearCustomBackground}
            onCustomThemeSettingsChange={onCustomThemeSettingsChange}
            onResetCustomTheme={onResetCustomTheme}
            onResetTheme={onResetTheme}
          />
        </section>
      ) : null}

      {/* ── SLIDES TAB ─────────────────────────────────────────────── */}
      {activeTab === "slides" ? (
        <section className={styles.section}>
          <SlidePanel
            slides={slides}
            selectedSlideIndex={selectedSlideIndex}
            maxSlides={maxSlides}
            screenshotLibrary={screenshotLibrary}
            slideScreenshotAssetIds={slideScreenshotAssetIds}
            screenshotNames={screenshotNames}
            onSelectedSlideChange={onSelectedSlideChange}
            onAssignScreenshotToSlide={onAssignScreenshotToSlide}
            onRemoveScreenshotAsset={onRemoveScreenshotAsset}
            onSlideScreenshotChange={onSlideScreenshotChange}
            onScreenshotLibraryUpload={onScreenshotLibraryUpload}
            onAddSlide={onAddSlide}
            onRemoveSlide={onRemoveSlide}
          />
        </section>
      ) : null}

      {/* ── TEXT TAB ───────────────────────────────────────────────── */}
      {activeTab === "text" ? (
        <section className={styles.section}>
          <TextPanel
            draft={draft}
            slide={slides[selectedSlideIndex]}
            selectedSlideIndex={selectedSlideIndex}
            onDraftChange={onDraftChange}
            onSlideChange={onSlideChange}
          />
        </section>
      ) : null}

      {/* ── STYLE TAB ──────────────────────────────────────────────── */}
      {activeTab === "style" ? (
        <section className={styles.section}>
          <StylePanel draft={draft} onDraftChange={onDraftChange} />
        </section>
      ) : null}

      {/* ── EXPORT TAB ─────────────────────────────────────────────── */}
      {activeTab === "export" ? (
        <section className={styles.section}>
          <ExportPanel
            slideCount={slides.length}
            isExporting={isExporting}
            isZipping={isZipping}
            zipProgress={zipProgress}
            onExport={onExport}
            onExportZip={onExportZip}
          />
        </section>
      ) : null}
    </aside>
  );
}

function getTabTitle(tab: ToolTab) {
  switch (tab) {
    case "theme":  return "Theme library";
    case "slides": return "Slide assets";
    case "text":   return "Slide copy";
    case "style":  return "Visual settings";
    case "export": return "Export";
  }
}

function getTabDescription(tab: ToolTab) {
  switch (tab) {
    case "theme":  return "Choose the visual direction.";
    case "slides": return "Upload screenshots and manage slides.";
    case "text":   return "Edit the selected slide copy.";
    case "style":  return "Font, device, and layout controls.";
    case "export": return "Download your mockup assets.";
  }
}
