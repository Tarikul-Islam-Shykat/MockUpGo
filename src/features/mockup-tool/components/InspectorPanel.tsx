import { ThemePanel } from "@/features/mockup-tool/components/theme-panel/ThemePanel";
import { TextPanel } from "@/features/mockup-tool/components/text-panel/TextPanel";
import { StylePanel } from "@/features/mockup-tool/components/style-panel/StylePanel";
import { DevicePanel } from "@/features/mockup-tool/components/device-panel/DevicePanel";
import { ExportPanel } from "@/features/mockup-tool/components/export-panel/ExportPanel";
import type {
  CanvasSelection,
  CustomThemeSettings,
  EditorDraft,
  MockupTheme,
  PhoneFramePreset,
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
  selectedCanvasItem: CanvasSelection | null;
  onSelectCanvasItem: (item: CanvasSelection | null) => void;
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
  onReturnToThemes: () => void;
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
  onSlideFrameChange: (index: number, framePreset: PhoneFramePreset) => void;
  onAssignScreenshotToSlide: (index: number, assetId: string | null) => void;
  onRemoveScreenshotAsset: (assetId: string) => void;
  onSlideScreenshotChange: (index: number, file: File | null) => void;
  onScreenshotLibraryUpload: (files: FileList | null) => void;
  onAddSlideImageBlock: (index: number, file: File | null) => void;
  onRemoveSlideImageBlock: (index: number, blockId: string) => void;
  onDeleteSelectedCanvasItem: () => void;
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
  selectedCanvasItem,
  onSelectCanvasItem,
  customBackgroundName,
  customThemeSettings,
  onThemeSelect,
  onCustomBackgroundUpload,
  onSetGradientTheme,
  onCustomThemeSettingsChange,
  onResetCustomTheme,
  onReturnToThemes,
  onDraftChange,
  onSlideChange,
  onSelectedSlideChange,
  onSlideFrameChange,
  onAssignScreenshotToSlide,
  onRemoveScreenshotAsset,
  onSlideScreenshotChange,
  onScreenshotLibraryUpload,
  onAddSlideImageBlock,
  onRemoveSlideImageBlock,
  onDeleteSelectedCanvasItem,
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
            onSetGradientTheme={onSetGradientTheme}
            onCustomThemeSettingsChange={onCustomThemeSettingsChange}
            onResetCustomTheme={onResetCustomTheme}
            onReturnToThemes={onReturnToThemes}
            onResetTheme={onResetTheme}
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
            onAddImageBlock={onAddSlideImageBlock}
            onRemoveImageBlock={onRemoveSlideImageBlock}
            onAddSlide={onAddSlide}
            selectedCanvasItem={selectedCanvasItem}
            onDeleteSelectedCanvasItem={onDeleteSelectedCanvasItem}
            screenshotLibrary={screenshotLibrary}
            slideScreenshotAssetIds={slideScreenshotAssetIds}
            screenshotNames={screenshotNames}
            onAssignScreenshotToSlide={onAssignScreenshotToSlide}
            onRemoveScreenshotAsset={onRemoveScreenshotAsset}
            onSlideScreenshotChange={onSlideScreenshotChange}
            onScreenshotLibraryUpload={onScreenshotLibraryUpload}
          />
        </section>
      ) : null}

      {/* ── STYLE TAB ──────────────────────────────────────────────── */}
      {activeTab === "style" ? (
        <section className={styles.section}>
          <StylePanel
            draft={draft}
            slides={slides}
            slide={slides[selectedSlideIndex]}
            selectedSlideIndex={selectedSlideIndex}
            onDraftChange={onDraftChange}
            onSlideChange={onSlideChange}
          />
        </section>
      ) : null}

      {/* ── DEVICE TAB ─────────────────────────────────────────────── */}
      {activeTab === "device" ? (
        <section className={styles.section}>
          <DevicePanel
            slide={slides[selectedSlideIndex]}
            selectedSlideIndex={selectedSlideIndex}
            selectedCanvasItem={selectedCanvasItem}
            onSelectCanvasItem={onSelectCanvasItem}
            screenshotLibrary={screenshotLibrary}
            onSlideChange={onSlideChange}
          />
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
    case "text":   return "Slide copy";
    case "style":  return "Visual settings";
    case "device": return "Device canvas";
    case "export": return "Export";
  }
}

function getTabDescription(tab: ToolTab) {
  switch (tab) {
    case "theme":  return "Choose the visual direction.";
    case "text":   return "Edit content and manage draggable canvas items.";
    case "style":  return "Device and layout controls.";
    case "device": return "Manage multiple phones, positions and angles.";
    case "export": return "Download your mockup assets.";
  }
}
