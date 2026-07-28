import { useEffect, useRef, useState } from "react";

import { InspectorPanel } from "@/features/mockup-tool/components/InspectorPanel";
import { PreviewStage } from "@/features/mockup-tool/components/PreviewStage";
import { ToolRail } from "@/features/mockup-tool/components/ToolRail";
import {
  createDraftFromTheme,
  createSlidesFromTheme,
  mockupThemes,
} from "@/features/mockup-tool/data/mockup-templates";
import type { EditorDraft, SlideDraft, ToolTab } from "@/features/mockup-tool/types";
import { exportMockupAsPng } from "@/features/mockup-tool/utils/export-mockup";

import styles from "./MockupToolPage.module.css";

const initialTheme = mockupThemes[0];
const maxSlides = 5;

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
  const [screenshotUrls, setScreenshotUrls] = useState<Array<string | null>>(
    Array.from({ length: maxSlides }, () => null),
  );
  const [screenshotNames, setScreenshotNames] = useState<Array<string | null>>(
    Array.from({ length: maxSlides }, () => null),
  );
  const [isExporting, setIsExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const objectUrlRef = useRef<Array<string | null>>(
    Array.from({ length: maxSlides }, () => null),
  );

  const selectedTheme =
    mockupThemes.find((theme) => theme.id === draft.themeId) ?? initialTheme;

  useEffect(() => {
    return () => {
      objectUrlRef.current.forEach((url) => {
        if (url) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, []);

  function updateDraft<Key extends keyof EditorDraft>(
    field: Key,
    value: EditorDraft[Key],
  ) {
    setDraft((current) => ({
      ...current,
      [field]: value,
    }));
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

    if (!theme) {
      return;
    }

    setDraft((current) => ({
      ...createDraftFromTheme(theme),
      projectName: current.projectName,
      deviceFinish: current.deviceFinish,
      screenshotFit: current.screenshotFit,
    }));
    setSlides(createSlidesFromTheme(theme));
  }

  function setSlideScreenshot(index: number, file: File | null) {
    const currentUrl = objectUrlRef.current[index];
    if (currentUrl) {
      URL.revokeObjectURL(currentUrl);
    }
    if (!file) {
      objectUrlRef.current[index] = null;
      setScreenshotUrls((current) =>
        current.map((item, itemIndex) => (itemIndex === index ? null : item)),
      );
      setScreenshotNames((current) =>
        current.map((item, itemIndex) => (itemIndex === index ? null : item)),
      );
      return;
    }

    const nextObjectUrl = URL.createObjectURL(file);
    objectUrlRef.current[index] = nextObjectUrl;
    setScreenshotUrls((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? nextObjectUrl : item,
      ),
    );
    setScreenshotNames((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? file.name : item)),
    );
  }

  function handleBatchUpload(files: FileList | null) {
    if (!files?.length) {
      return;
    }

    Array.from(files)
      .slice(0, maxSlides)
      .forEach((file, index) => {
        setSlideScreenshot(index, file);
      });
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

  async function handleExport() {
    if (!previewRef.current) {
      return;
    }

    try {
      setIsExporting(true);
      await exportMockupAsPng(previewRef.current, draft.projectName);
    } finally {
      setIsExporting(false);
    }
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
            <span className={styles.brandMark}>M</span>
            <div>
              <strong>MockUpGo</strong>
              <span>Editor</span>
            </div>
          </div>
        </div>

        <div className={styles.projectName}>
          <span>{draft.projectName}</span>
        </div>

        <div className={styles.toolbarActions}>
          <span className={styles.deviceBadge}>iPhone 6.9"</span>
          <button type="button" className={styles.exportBtn} onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <><span className={styles.spinner} />Exporting…</>
            ) : (
              <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>Export PNG</>
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
          selectedSlideIndex={selectedSlideIndex}
          onSelectSlide={(index) => {
            setSelectedSlideIndex(index);
            setActiveTab("text");
          }}
          previewRef={previewRef}
        />

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
          onSelectedSlideChange={setSelectedSlideIndex}
          onSlideScreenshotChange={setSlideScreenshot}
          onBatchUpload={handleBatchUpload}
          onResetTheme={handleResetTheme}
          onExport={handleExport}
          isExporting={isExporting}
        />
      </main>
    </div>
  );
}
