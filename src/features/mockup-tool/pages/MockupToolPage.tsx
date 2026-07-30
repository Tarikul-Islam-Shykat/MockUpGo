import { useEffect, useRef, useState } from "react";

import { AnimatedPreview } from "@/features/mockup-tool/components/animated-preview/AnimatedPreview";
import { InspectorPanel } from "@/features/mockup-tool/components/InspectorPanel";
import { PreviewStage } from "@/features/mockup-tool/components/PreviewStage";
import { ToolRail } from "@/features/mockup-tool/components/ToolRail";
import { getPhoneFrameLabel } from "@/features/mockup-tool/data/phone-frames";
import {
  createBlankSlide,
  createDraftFromTheme,
  createSlidesFromTheme,
  mockupThemes,
} from "@/features/mockup-tool/data/mockup-templates";
import { customThemePalettes } from "@/features/mockup-tool/data/custom-theme-palettes";
import type {
  CanvasSelection,
  CustomThemeBackgroundMode,
  CustomThemeSettings,
  EditorDraft,
  ScreenshotAsset,
  SlideDraft,
  SlideImageBlock,
  SlideTextBlock,
  ToolTab,
} from "@/features/mockup-tool/types";
import { exportMockupAsPng, exportMockupAsZip } from "@/features/mockup-tool/utils/export-mockup";

import styles from "./MockupToolPage.module.css";

const initialTheme = mockupThemes[0];
const initialPalette = customThemePalettes[0];
const MAX_SLIDES = 10;

function createDefaultCustomThemeSettings(
  backgroundMode: CustomThemeBackgroundMode = "preset",
): CustomThemeSettings {
  return {
    backgroundMode,
    paletteId: initialPalette.id,
    backgroundStart: initialPalette.backgroundStart,
    backgroundEnd: initialPalette.backgroundEnd,
    backgroundAngle: initialPalette.backgroundAngle,
    textColor: initialPalette.textColor,
    mutedColor: initialPalette.mutedColor,
    accentColor: initialPalette.accentColor,
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

function revokeSlideImageUrls(slides: SlideDraft[]) {
  slides.forEach((slide) => {
    slide.imageBlocks.forEach((block) => {
      URL.revokeObjectURL(block.url);
    });
  });
}

export function MockupToolPage({ onGoHome }: MockupToolPageProps) {
  const [draft, setDraft] = useState<EditorDraft>(
    createDraftFromTheme(initialTheme),
  );
  const [slides, setSlides] = useState<SlideDraft[]>(
    createSlidesFromTheme(initialTheme),
  );
  const [activeTab, setActiveTab] = useState<ToolTab>("text");
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
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
  const [selectedCanvasItem, setSelectedCanvasItem] =
    useState<CanvasSelection | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const screenshotAssetsRef = useRef<ScreenshotAsset[]>([]);
  const customBackgroundRef = useRef<CustomBackgroundAsset | null>(null);
  const slidesRef = useRef<SlideDraft[]>([]);

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
  const selectedSlide = slides[selectedSlideIndex];

  useEffect(() => {
    screenshotAssetsRef.current = screenshotAssets;
  }, [screenshotAssets]);

  useEffect(() => {
    customBackgroundRef.current = customBackground;
  }, [customBackground]);

  useEffect(() => {
    slidesRef.current = slides;
  }, [slides]);

  useEffect(() => {
    function handleDeleteSelected(event: KeyboardEvent) {
      if (!selectedCanvasItem) return;
      if (event.key !== "Delete" && event.key !== "Backspace") return;

      const target = event.target as HTMLElement | null;
      const tagName = target?.tagName ?? "";
      const isTypingTarget =
        tagName === "INPUT" ||
        tagName === "TEXTAREA" ||
        tagName === "SELECT" ||
        target?.isContentEditable;

      if (isTypingTarget) return;

      if (selectedCanvasItem.kind === "text-block") {
        setSlides((current) =>
          current.map((slide, slideIndex) =>
            slideIndex === selectedCanvasItem.slideIndex
              ? {
                  ...slide,
                  extraTextBlocks: slide.extraTextBlocks.filter(
                    (block) => block.id !== selectedCanvasItem.id,
                  ),
                }
              : slide,
          ),
        );
        setSelectedCanvasItem(null);
        event.preventDefault();
        return;
      }

      if (selectedCanvasItem.kind === "image-block") {
        removeSlideImageBlock(
          selectedCanvasItem.slideIndex,
          selectedCanvasItem.id,
        );
        setSelectedCanvasItem(null);
        event.preventDefault();
      }
    }

    window.addEventListener("keydown", handleDeleteSelected);
    return () => window.removeEventListener("keydown", handleDeleteSelected);
  }, [selectedCanvasItem]);

  useEffect(() => {
    return () => {
      screenshotAssetsRef.current.forEach((asset) => {
        URL.revokeObjectURL(asset.url);
      });
      if (customBackgroundRef.current) {
        URL.revokeObjectURL(customBackgroundRef.current.url);
      }
      revokeSlideImageUrls(slidesRef.current);
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
    setCustomThemeSettings((current) => ({
      ...current,
      backgroundMode: "image",
    }));
  }

  function handleClearCustomBackground() {
    setCustomBackground((current) => {
      if (current) {
        URL.revokeObjectURL(current.url);
      }
      return null;
    });
    setCustomThemeSettings((current) => ({
      ...current,
      backgroundMode: "gradient",
    }));
  }

  function handleReturnToThemes() {
    setCustomBackground((current) => {
      if (current) {
        URL.revokeObjectURL(current.url);
      }
      return null;
    });
    setCustomThemeSettings(createDefaultCustomThemeSettings("preset"));
  }

  function updateCustomThemeSettings<Key extends keyof CustomThemeSettings>(
    field: Key,
    value: CustomThemeSettings[Key],
  ) {
    setCustomThemeSettings((current) => ({ ...current, [field]: value }));
  }

  function handleResetCustomTheme() {
    setCustomThemeSettings((current) =>
      createDefaultCustomThemeSettings(current.backgroundMode),
    );
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
    revokeSlideImageUrls(slides);
    setDraft((current) => ({
      ...createDraftFromTheme(theme),
      projectName: current.projectName,
      deviceFinish: current.deviceFinish,
      screenshotFit: current.screenshotFit,
      pageSizePreset: current.pageSizePreset,
      pageWidth: current.pageWidth,
      pageHeight: current.pageHeight,
    }));
    setSlides(nextSlides);
    setSlideScreenshotAssetIds((current) =>
      resizeSlideAssignments(current, nextSlides.length),
    );
    setSelectedSlideIndex((current) => Math.min(current, nextSlides.length - 1));
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
    revokeSlideImageUrls(slides);
    setDraft((current) => ({
      ...createDraftFromTheme(selectedTheme),
      projectName: current.projectName,
      deviceFinish: current.deviceFinish,
      screenshotFit: current.screenshotFit,
      pageSizePreset: current.pageSizePreset,
      pageWidth: current.pageWidth,
      pageHeight: current.pageHeight,
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
    revokeSlideImageUrls([slides[index]]);
    setSlides((current) => current.filter((_, i) => i !== index));
    setSlideScreenshotAssetIds((current) =>
      current.filter((_, itemIndex) => itemIndex !== index),
    );
    // Adjust selected index
    setSelectedSlideIndex((current) =>
      current >= index && current > 0 ? current - 1 : current,
    );
  }

  function updateSlideTextBlock(
    index: number,
    blockId: string,
    patch: Partial<SlideTextBlock>,
  ) {
    setSlides((current) =>
      current.map((slide, slideIndex) =>
        slideIndex === index
          ? {
              ...slide,
              extraTextBlocks: slide.extraTextBlocks.map((block) =>
                block.id === blockId ? { ...block, ...patch } : block,
              ),
            }
          : slide,
      ),
    );
  }

  function updateSlideImageBlock(
    index: number,
    blockId: string,
    patch: Partial<SlideImageBlock>,
  ) {
    setSlides((current) =>
      current.map((slide, slideIndex) =>
        slideIndex === index
          ? {
              ...slide,
              imageBlocks: slide.imageBlocks.map((block) =>
                block.id === blockId ? { ...block, ...patch } : block,
              ),
            }
          : slide,
      ),
    );
  }

  function addSlideImageBlock(index: number, file: File | null) {
    if (!file || !file.type.startsWith("image/")) return;

    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      const aspectRatio =
        image.naturalWidth > 0 && image.naturalHeight > 0
          ? image.naturalWidth / image.naturalHeight
          : 1;
      const width = 88;
      const height = Math.max(24, Math.round(width / aspectRatio));

      setSlides((current) =>
        current.map((slide, slideIndex) =>
          slideIndex === index
            ? {
                ...slide,
                imageBlocks: [
                  ...slide.imageBlocks,
                  {
                    id: crypto.randomUUID(),
                    name: file.name,
                    url,
                    x: 0,
                    y: 0,
                    width,
                    height,
                    aspectRatio,
                  },
                ],
              }
            : slide,
        ),
      );
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
    };

    image.src = url;
  }

  function removeSlideImageBlock(index: number, blockId: string) {
    setSlides((current) =>
      current.map((slide, slideIndex) => {
        if (slideIndex !== index) return slide;
        const block = slide.imageBlocks.find((item) => item.id === blockId);
        if (block) {
          URL.revokeObjectURL(block.url);
        }
        return {
          ...slide,
          imageBlocks: slide.imageBlocks.filter((item) => item.id !== blockId),
        };
      }),
    );
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
    setSelectedCanvasItem(null);
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
              <span>Editor</span>
            </div>
          </div>
        </div>

        <div className={styles.projectName}>
          <span>{draft.projectName}</span>
          <span className={styles.slideCount}>{slides.length} slide{slides.length !== 1 ? "s" : ""}</span>
        </div>

        <div className={styles.toolbarActions}>
          <span className={styles.deviceBadge}>
            {selectedSlide
              ? getPhoneFrameLabel(selectedSlide.framePreset)
              : "Classic SVG"}
          </span>
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

        <PreviewStage
          theme={selectedTheme}
          draft={draft}
          slides={slides}
          screenshotUrls={screenshotUrls}
          customBackgroundUrl={customBackground?.url ?? null}
          customThemeSettings={customThemeSettings}
          selectedSlideIndex={selectedSlideIndex}
          onSelectSlide={handleSelectSlide}
          selectedCanvasItem={selectedCanvasItem}
          onSelectCanvasItem={setSelectedCanvasItem}
          onMainTextMove={(slideIndex, x, y) => {
            updateSlide(slideIndex, "textOffsetX", x);
            updateSlide(slideIndex, "textOffsetY", y);
          }}
          onPhoneMove={(slideIndex, x, y) => {
            updateSlide(slideIndex, "phoneOffsetX", x);
            updateSlide(slideIndex, "phoneOffsetY", y);
          }}
          onTextBlockMove={(slideIndex, blockId, x, y) => {
            updateSlideTextBlock(slideIndex, blockId, { x, y });
          }}
          onTextBlockResize={(slideIndex, blockId, size) => {
            updateSlideTextBlock(slideIndex, blockId, { size });
          }}
          onImageBlockMove={(slideIndex, blockId, x, y) => {
            updateSlideImageBlock(slideIndex, blockId, { x, y });
          }}
          onImageBlockResize={(slideIndex, blockId, width, height) => {
            updateSlideImageBlock(slideIndex, blockId, { width, height });
          }}
          onRemoveSlide={handleRemoveSlide}
          previewRef={previewRef}
          screenshotLookup={screenshotLookup}
          onSlideChange={updateSlide}
        />

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
          selectedCanvasItem={selectedCanvasItem}
          onSelectCanvasItem={setSelectedCanvasItem}
          onThemeSelect={handleThemeSelect}
          onCustomBackgroundUpload={handleCustomBackgroundUpload}
          onSetGradientTheme={handleClearCustomBackground}
          onCustomThemeSettingsChange={updateCustomThemeSettings}
          onResetCustomTheme={handleResetCustomTheme}
          onReturnToThemes={handleReturnToThemes}
          onDraftChange={updateDraft}
          onSlideChange={updateSlide}
          onSelectedSlideChange={(index) => {
            setSelectedSlideIndex(index);
          }}
          onSlideFrameChange={(index, framePreset) => {
            updateSlide(index, "framePreset", framePreset);
          }}
          onAssignScreenshotToSlide={assignScreenshotToSlide}
          onRemoveScreenshotAsset={handleRemoveScreenshotAsset}
          onSlideScreenshotChange={setSlideScreenshot}
            onScreenshotLibraryUpload={handleLibraryUpload}
            onAddSlideImageBlock={addSlideImageBlock}
            onRemoveSlideImageBlock={removeSlideImageBlock}
            onDeleteSelectedCanvasItem={() => {
              if (!selectedCanvasItem) return;
              if (selectedCanvasItem.kind === "text-block") {
                setSlides((current) =>
                  current.map((slide, slideIndex) =>
                    slideIndex === selectedCanvasItem.slideIndex
                      ? {
                          ...slide,
                          extraTextBlocks: slide.extraTextBlocks.filter(
                            (block) => block.id !== selectedCanvasItem.id,
                          ),
                        }
                      : slide,
                  ),
                );
              }
              if (selectedCanvasItem.kind === "image-block") {
                removeSlideImageBlock(
                  selectedCanvasItem.slideIndex,
                  selectedCanvasItem.id,
                );
              }
              if (selectedCanvasItem.kind === "phone-block") {
                updateSlide(
                  selectedCanvasItem.slideIndex,
                  "phoneBlocks",
                  (slides[selectedCanvasItem.slideIndex].phoneBlocks ?? []).filter(
                    (p) => p.id !== selectedCanvasItem.id
                  )
                );
              }
              setSelectedCanvasItem(null);
            }}
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
          screenshotLookup={screenshotLookup}
        />
      )}
    </div>
  );
}
