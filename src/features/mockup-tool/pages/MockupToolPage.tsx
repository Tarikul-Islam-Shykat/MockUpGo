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

export function MockupToolPage() {
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
        <div className={styles.brand}>
          <span className={styles.brandMark}>M</span>
          <div>
            <strong>MockUpGo</strong>
            <span>{draft.projectName}</span>
          </div>
        </div>

        <div className={styles.toolbarChips}>
          <button type="button">Globals</button>
          <button type="button">Setup</button>
          <button type="button">Background</button>
          <button type="button">App Screens</button>
          <button type="button">Text</button>
        </div>

        <div className={styles.toolbarActions}>
          <span>iPhone 6.9"</span>
          <button type="button" onClick={handleExport}>
            {isExporting ? "Exporting..." : "Preview & Export"}
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
