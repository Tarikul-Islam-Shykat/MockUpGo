import { useEffect, useRef, useState } from "react";

import { AnimatedPreview } from "@/features/mockup-tool/components/AnimatedPreview";
import { CanvasEditor } from "@/features/mockup-tool/components/CanvasEditor";
import { InspectorPanel } from "@/features/mockup-tool/components/InspectorPanel";
import { PreviewStage } from "@/features/mockup-tool/components/PreviewStage";
import { ToolRail } from "@/features/mockup-tool/components/ToolRail";
import {
  createBlankSlide,
  createDraftFromTheme,
  createSlidesFromTheme,
  mockupThemes,
} from "@/features/mockup-tool/data/mockup-templates";
import type {
  CustomThemeSettings,
  EditorDraft,
  ScreenshotAsset,
  SlideDraft,
  ToolTab,
} from "@/features/mockup-tool/types";
import { exportMockupAsPng, exportMockupAsZip } from "@/features/mockup-tool/utils/export-mockup";

import styles from "./MockupToolPage.module.css";

const initialTheme = mockupThemes[0];
const MAX_SLIDES = 10;

function createDefaultCustomThemeSettings(): CustomThemeSettings {
  return {
    scale: 100,
    rotation: 0,
    offsetX: 0,
    offsetY: 0,
    overlayOpacity: 0,
  };
}

function resizeSlideAssignments(
  assignments: Array<string | null>,
  nextLength: number,
) {
  return Array.from({ length: nextLength }, (_, index) => assignments[index] ?? null);
}

type MockupToolPageProps = {
  onGoHome?: () => void;
};

type CustomBackgroundAsset = {
  name: string;
  url: string;
};

export function MockupToolPage({ onGoHome }: MockupToolPageProps) {
  const [draft, setDraft] = useState<EditorDraft>(
    createDraftFromTheme(initialTheme),
  );
  const [slides, setSlides] = useState<SlideDraft[]>(
    createSlidesFromTheme(initialTheme),
  );
  const [activeTab, setActiveTab] = useState<ToolTab>("slides");
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
  const [canvasMode, setCanvasMode] = useState(false);
  const [screenshotAssets, setScreenshotAssets] = useState<ScreenshotAsset[]>(
    [],
  );
  const [slideScreenshotAssetIds, setSlideScreenshotAssetIds] = useState<
    Array<string | null>
  >(
    Array.from({ length: createSlidesFromTheme(initialTheme).length }, () => null),
  );
  const [customBackground, setCustomBackground] =
    useState<CustomBackgroundAsset | null>(null);
  const [customThemeSettings, setCustomThemeSettings] =
    useState<CustomThemeSettings>(createDefaultCustomThemeSettings);
  const [isExporting, setIsExporting] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [use3D, setUse3D] = useState(true);
  const previewRef = useRef<HTMLDivElement>(null);
  const screenshotAssetsRef = useRef<ScreenshotAsset[]>([]);
  const customBackgroundRef = useRef<CustomBackgroundAsset | null>(null);

  const selectedTheme =
    mockupThemes.find((theme) => theme.id === draft.themeId) ?? initialTheme;
  const screenshotLookup = new Map(
    screenshotAssets.map((asset) => [asset.id, asset] as const),
  );
  const screenshotUrls = slideScreenshotAssetIds.map(
    (assetId) => (assetId ? screenshotLookup.get(assetId)?.url ?? null : null),
  );
  const screenshotNames = slideScreenshotAssetIds.map(
    (assetId) => (assetId ? screenshotLookup.get(assetId)?.name ?? null : null),
  );

  useEffect(() => {
    screenshotAssetsRef.current = screenshotAssets;
  }, [screenshotAssets]);

  useEffect(() => {
    customBackgroundRef.current = customBackground;
  }, [customBackground]);

  useEffect(() => {
    return () => {
      screenshotAssetsRef.current.forEach((asset) => {
        URL.revokeObjectURL(asset.url);
      });
      if (customBackgroundRef.current) {
        URL.revokeObjectURL(customBackgroundRef.current.url);
      }
    };
  }, []);

  function createScreenshotAssets(files: Iterable<File>) {
    return Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => ({
        id: crypto.randomUUID(),
        name: file.name,
        url: URL.createObjectURL(file),
      }));
  }

  function handleCustomBackgroundUpload(file: File | null) {
    if (!file || !file.type.startsWith("image/")) return;

    const nextBackground = {
      name: file.name,
      url: URL.createObjectURL(file),
    };

    setCustomBackground((current) => {
      if (current) {
        URL.revokeObjectURL(current.url);
      }
      return nextBackground;
    });
    setCustomThemeSettings(createDefaultCustomThemeSettings());
  }

  function handleClearCustomBackground() {
    setCustomBackground((current) => {
      if (current) {
        URL.revokeObjectURL(current.url);
      }
      return null;
    });
    setCustomThemeSettings(createDefaultCustomThemeSettings());
  }

  function updateCustomThemeSettings<Key extends keyof CustomThemeSettings>(
    field: Key,
    value: CustomThemeSettings[Key],
  ) {
    setCustomThemeSettings((current) => ({ ...current, [field]: value }));
  }

  function handleResetCustomTheme() {
    setCustomThemeSettings(createDefaultCustomThemeSettings());
  }

  function updateDraft<Key extends keyof EditorDraft>(
    field: Key,
    value: EditorDraft[Key],
  ) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function updateSlide<Key extends keyof SlideDraft>(
    index: number,
    field: Key,
    value: SlideDraft[Key],
  ) {
    setSlides((current) =>
      current.map((slide, slideIndex) =>
        slideIndex === index ? { ...slide, [field]: value } : slide,
      ),
    );
  }

  function handleThemeSelect(themeId: string) {
    const theme = mockupThemes.find((item) => item.id === themeId);
    if (!theme) return;
    const nextSlides = createSlidesFromTheme(theme);
    setDraft((current) => ({
      ...createDraftFromTheme(theme),
      projectName: current.projectName,
      deviceFinish: current.deviceFinish,
      screenshotFit: current.screenshotFit,
    }));
    setSlides(nextSlides);
    setSlideScreenshotAssetIds((current) =>
      resizeSlideAssignments(current, nextSlides.length),
    );
    setSelectedSlideIndex((current) => Math.min(current, nextSlides.length - 1));
    setCanvasMode(false);
  }

  function assignScreenshotToSlide(index: number, assetId: string | null) {
    setSlideScreenshotAssetIds((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? assetId : item)),
    );
  }

  function setSlideScreenshot(index: number, file: File | null) {
    if (!file) {
      assignScreenshotToSlide(index, null);
      return;
    }

    const [nextAsset] = createScreenshotAssets([file]);
    if (!nextAsset) return;

    setScreenshotAssets((current) => [nextAsset, ...current]);
    assignScreenshotToSlide(index, nextAsset.id);
  }

  function handleLibraryUpload(files: FileList | null) {
    if (!files?.length) return;
    const nextAssets = createScreenshotAssets(files);
    if (!nextAssets.length) return;

    setScreenshotAssets((current) => [...current, ...nextAssets]);
    setSlideScreenshotAssetIds((current) => {
      const nextAssignments = [...current];
      nextAssets.forEach((asset, offset) => {
        const targetIndex = selectedSlideIndex + offset;
        if (targetIndex < slides.length) {
          nextAssignments[targetIndex] = asset.id;
        }
      });
      return nextAssignments;
    });
  }

  function handleResetTheme() {
    const nextSlides = createSlidesFromTheme(selectedTheme);
    setDraft((current) => ({
      ...createDraftFromTheme(selectedTheme),
      projectName: current.projectName,
      deviceFinish: current.deviceFinish,
      screenshotFit: current.screenshotFit,
    }));
    setSlides(nextSlides);
    setSlideScreenshotAssetIds((current) =>
      resizeSlideAssignments(current, nextSlides.length),
    );
    setSelectedSlideIndex((current) => Math.min(current, nextSlides.length - 1));
    handleClearCustomBackground();
  }

  function handleAddSlide() {
    if (slides.length >= MAX_SLIDES) return;
    setSlides((current) => [...current, createBlankSlide(current.length)]);
    setSlideScreenshotAssetIds((current) => [...current, null]);
  }

  function handleRemoveSlide(index: number) {
    if (slides.length <= 1) return;
    setSlides((current) => current.filter((_, i) => i !== index));
    setSlideScreenshotAssetIds((current) =>
      current.filter((_, itemIndex) => itemIndex !== index),
    );
    // Adjust selected index
    setSelectedSlideIndex((current) =>
      current >= index && current > 0 ? current - 1 : current,
    );
    if (canvasMode && selectedSlideIndex === index) {
      setCanvasMode(false);
    }
  }

  async function handleExport() {
    if (!previewRef.current) return;
    try {
      setIsExporting(true);
      await exportMockupAsPng(previewRef.current, draft.projectName);
    } finally {
      setIsExporting(false);
    }
  }

  async function handleExportZip() {
    if (!previewRef.current) return;
    
    // Find all rendered slide container buttons inside our preview track
    const trackElement = previewRef.current;
    const slideElements = Array.from(trackElement.children) as HTMLElement[];
    
    if (slideElements.length === 0) return;

    try {
      setIsZipping(true);
      setZipProgress(0);
      await exportMockupAsZip(slideElements, draft.projectName, (current, total) => {
        setZipProgress(Math.round((current / total) * 100));
      });
    } catch (err) {
      console.error("ZIP Export failed:", err);
    } finally {
      setIsZipping(false);
      setZipProgress(0);
    }
  }

  function handleSelectSlide(index: number) {
    setSelectedSlideIndex(index);
    setActiveTab("text");
    setCanvasMode(true);
  }

  function handleExitCanvas() {
    setCanvasMode(false);
  }

  function handleRemoveScreenshotAsset(assetId: string) {
    setScreenshotAssets((current) => {
      const assetToRemove = current.find((asset) => asset.id === assetId);
      if (assetToRemove) {
        URL.revokeObjectURL(assetToRemove.url);
      }
      return current.filter((asset) => asset.id !== assetId);
    });
    setSlideScreenshotAssetIds((current) =>
      current.map((item) => (item === assetId ? null : item)),
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <div className={styles.topbarLeft}>
          {onGoHome && (
            <button type="button" className={styles.backBtn} onClick={onGoHome}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
            </button>
          )}
          <div className={styles.brand}>
            <img src="/logo.png" alt="MockUpGo Logo" className={styles.logoImg} />
            <div>
              <strong>MockUpGo</strong>
              <span>{canvasMode ? "Canvas Mode" : "Editor"}</span>
            </div>
          </div>
        </div>

        <div className={styles.projectName}>
          <span>{draft.projectName}</span>
          <span className={styles.slideCount}>{slides.length} slide{slides.length !== 1 ? "s" : ""}</span>
        </div>

        <div className={styles.toolbarActions}>
          <span className={styles.deviceBadge}>iPhone 6.9"</span>
          {/* 3D device toggle */}
          <button
            type="button"
            className={`${styles.previewBtn} ${use3D ? styles.active3DBtn : ""}`}
            onClick={() => setUse3D((v) => !v)}
            title={use3D ? "Switch to flat device" : "Switch to 3D device"}
          >
            {use3D ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                </svg>
                3D On
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                  <line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>
                Flat
              </>
            )}
          </button>
          <button
            type="button"
            className={styles.previewBtn}
            onClick={() => setShowPreview(true)}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Preview
          </button>
          <button
            type="button"
            className={styles.exportBtn}
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? (
              <><span className={styles.spinner} />Exporting…</>
            ) : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                Export Strip
              </>
            )}
          </button>
        </div>
      </header>

      <main className={styles.workspaceShell}>
        <ToolRail activeTab={activeTab} onChange={setActiveTab} />

        {canvasMode ? (
          <CanvasEditor
            theme={selectedTheme}
            draft={draft}
            slide={slides[selectedSlideIndex]}
            slideIndex={selectedSlideIndex}
            totalSlides={slides.length}
            screenshotUrl={screenshotUrls[selectedSlideIndex]}
            customBackgroundUrl={customBackground?.url ?? null}
            customThemeSettings={customThemeSettings}
            use3D={use3D}
            onBack={handleExitCanvas}
            onScreenshotChange={setSlideScreenshot}
            onSlideChange={updateSlide}
            onPrevSlide={() =>
              setSelectedSlideIndex((i) => Math.max(0, i - 1))
            }
            onNextSlide={() =>
              setSelectedSlideIndex((i) => Math.min(slides.length - 1, i + 1))
            }
          />
        ) : (
          <PreviewStage
            theme={selectedTheme}
            draft={draft}
            slides={slides}
            screenshotUrls={screenshotUrls}
            customBackgroundUrl={customBackground?.url ?? null}
            customThemeSettings={customThemeSettings}
            selectedSlideIndex={selectedSlideIndex}
            onSelectSlide={handleSelectSlide}
            previewRef={previewRef}
          />
        )}

        <InspectorPanel
          activeTab={activeTab}
          draft={draft}
          slides={slides}
          selectedSlideIndex={selectedSlideIndex}
          themes={mockupThemes}
          screenshotLibrary={screenshotAssets}
          slideScreenshotAssetIds={slideScreenshotAssetIds}
          screenshotNames={screenshotNames}
          customBackgroundName={customBackground?.name ?? null}
          customThemeSettings={customThemeSettings}
          onThemeSelect={handleThemeSelect}
          onCustomBackgroundUpload={handleCustomBackgroundUpload}
          onClearCustomBackground={handleClearCustomBackground}
          onCustomThemeSettingsChange={updateCustomThemeSettings}
          onResetCustomTheme={handleResetCustomTheme}
          onDraftChange={updateDraft}
          onSlideChange={updateSlide}
          onSelectedSlideChange={(index) => {
            setSelectedSlideIndex(index);
          }}
          onAssignScreenshotToSlide={assignScreenshotToSlide}
          onRemoveScreenshotAsset={handleRemoveScreenshotAsset}
          onSlideScreenshotChange={setSlideScreenshot}
          onScreenshotLibraryUpload={handleLibraryUpload}
          onResetTheme={handleResetTheme}
          onExport={handleExport}
          onAddSlide={handleAddSlide}
          onRemoveSlide={handleRemoveSlide}
          isExporting={isExporting}
          maxSlides={MAX_SLIDES}
          isZipping={isZipping}
          zipProgress={zipProgress}
          onExportZip={handleExportZip}
        />
      </main>

      {showPreview && (
        <AnimatedPreview
          theme={selectedTheme}
          draft={draft}
          slides={slides}
          screenshotUrls={screenshotUrls}
          customBackgroundUrl={customBackground?.url ?? null}
          customThemeSettings={customThemeSettings}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}
