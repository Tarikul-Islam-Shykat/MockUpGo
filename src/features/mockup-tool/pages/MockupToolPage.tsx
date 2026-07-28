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
  EditorDraft,
  SlideDraft,
  ToolTab,
} from "@/features/mockup-tool/types";
import { exportMockupAsPng, exportMockupAsZip } from "@/features/mockup-tool/utils/export-mockup";

import styles from "./MockupToolPage.module.css";

const initialTheme = mockupThemes[0];
const MAX_SLIDES = 10;

type MockupToolPageProps = {
  onGoHome?: () => void;
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
  const [screenshotUrls, setScreenshotUrls] = useState<Array<string | null>>(
    Array.from({ length: MAX_SLIDES }, () => null),
  );
  const [screenshotNames, setScreenshotNames] = useState<Array<string | null>>(
    Array.from({ length: MAX_SLIDES }, () => null),
  );
  const [isExporting, setIsExporting] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const objectUrlRef = useRef<Array<string | null>>(
    Array.from({ length: MAX_SLIDES }, () => null),
  );

  const selectedTheme =
    mockupThemes.find((theme) => theme.id === draft.themeId) ?? initialTheme;

  useEffect(() => {
    return () => {
      objectUrlRef.current.forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, []);

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
    setDraft((current) => ({
      ...createDraftFromTheme(theme),
      projectName: current.projectName,
      deviceFinish: current.deviceFinish,
      screenshotFit: current.screenshotFit,
    }));
    setSlides(createSlidesFromTheme(theme));
    setCanvasMode(false);
  }

  function setSlideScreenshot(index: number, file: File | null) {
    const currentUrl = objectUrlRef.current[index];
    if (currentUrl) URL.revokeObjectURL(currentUrl);

    if (!file) {
      objectUrlRef.current[index] = null;
      setScreenshotUrls((current) =>
        current.map((item, i) => (i === index ? null : item)),
      );
      setScreenshotNames((current) =>
        current.map((item, i) => (i === index ? null : item)),
      );
      return;
    }

    const nextObjectUrl = URL.createObjectURL(file);
    objectUrlRef.current[index] = nextObjectUrl;
    setScreenshotUrls((current) =>
      current.map((item, i) => (i === index ? nextObjectUrl : item)),
    );
    setScreenshotNames((current) =>
      current.map((item, i) => (i === index ? file.name : item)),
    );
  }

  function handleBatchUpload(files: FileList | null) {
    if (!files?.length) return;
    Array.from(files)
      .slice(0, MAX_SLIDES)
      .forEach((file, index) => setSlideScreenshot(index, file));
  }

  function handleResetTheme() {
    setDraft((current) => ({
      ...createDraftFromTheme(selectedTheme),
      projectName: current.projectName,
      deviceFinish: current.deviceFinish,
      screenshotFit: current.screenshotFit,
    }));
    setSlides(createSlidesFromTheme(selectedTheme));
  }

  function handleAddSlide() {
    if (slides.length >= MAX_SLIDES) return;
    setSlides((current) => [...current, createBlankSlide(current.length)]);
  }

  function handleRemoveSlide(index: number) {
    if (slides.length <= 1) return;
    setSlides((current) => current.filter((_, i) => i !== index));
    // Revoke screenshot if exists
    setSlideScreenshot(index, null);
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
            onBack={handleExitCanvas}
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
          screenshotNames={screenshotNames}
          onThemeSelect={handleThemeSelect}
          onDraftChange={updateDraft}
          onSlideChange={updateSlide}
          onSelectedSlideChange={(index) => {
            setSelectedSlideIndex(index);
          }}
          onSlideScreenshotChange={setSlideScreenshot}
          onBatchUpload={handleBatchUpload}
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
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}
