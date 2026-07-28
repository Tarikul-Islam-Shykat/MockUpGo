import { TemplateRail } from "@/features/mockup-tool/components/TemplateRail";
import { fontOptions } from "@/features/mockup-tool/data/fonts";
import type {
  DeviceFinish,
  EditorDraft,
  FontOption,
  MockupTheme,
  ScreenshotFit,
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
  screenshotNames: Array<string | null>;
  onThemeSelect: (themeId: string) => void;
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
  onSlideScreenshotChange: (index: number, file: File | null) => void;
  onBatchUpload: (files: FileList | null) => void;
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

const deviceFinishOptions: Array<{ value: DeviceFinish; label: string }> = [
  { value: "obsidian",   label: "Obsidian" },
  { value: "silver",     label: "Silver" },
  { value: "champagne",  label: "Champagne" },
];

const fitOptions: Array<{ value: ScreenshotFit; label: string }> = [
  { value: "cover",   label: "Cover (fill)" },
  { value: "contain", label: "Contain (fit)" },
];

export function InspectorPanel({
  activeTab,
  draft,
  slides,
  selectedSlideIndex,
  themes,
  screenshotNames,
  onThemeSelect,
  onDraftChange,
  onSlideChange,
  onSelectedSlideChange,
  onSlideScreenshotChange,
  onBatchUpload,
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
  const selectedSlide = slides[selectedSlideIndex];
  const selectedScreenshotName = screenshotNames[selectedSlideIndex];

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
          <TemplateRail
            templates={themes}
            selectedTemplateId={draft.themeId}
            onSelect={onThemeSelect}
          />
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={onResetTheme}
          >
            Reset theme defaults
          </button>
        </section>
      ) : null}

      {/* ── SLIDES TAB ─────────────────────────────────────────────── */}
      {activeTab === "slides" ? (
        <section className={styles.section}>
          {/* Batch upload */}
          <label className={styles.uploadCard}>
            <input
              type="file"
              accept="image/*"
              multiple
              className={styles.hiddenInput}
              onChange={(event) => onBatchUpload(event.target.files)}
            />
            <strong>Upload all screenshots at once</strong>
            <span>Assigns up to {slides.length} images across your slides</span>
          </label>

          {/* Slide list */}
          <div className={styles.slideListHeader}>
            <span>Slides ({slides.length}/{maxSlides})</span>
            {slides.length < maxSlides && (
              <button
                type="button"
                className={styles.addSlideBtn}
                onClick={onAddSlide}
              >
                + Add slide
              </button>
            )}
          </div>

          <div className={styles.slideList}>
            {slides.map((slide, index) => (
              <div key={slide.id} className={styles.slideRowWrap}>
                <button
                  type="button"
                  className={styles.slideRow}
                  data-active={index === selectedSlideIndex}
                  onClick={() => onSelectedSlideChange(index)}
                >
                  <span>{index + 1}</span>
                  <div>
                    <strong>{slide.title}</strong>
                    <small>{screenshotNames[index] ?? "No screenshot"}</small>
                  </div>
                </button>
                {slides.length > 1 && (
                  <button
                    type="button"
                    className={styles.removeSlideBtn}
                    onClick={() => onRemoveSlide(index)}
                    title="Remove slide"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Single screenshot upload for selected slide */}
          <label className={styles.uploadCard}>
            <input
              type="file"
              accept="image/*"
              className={styles.hiddenInput}
              onChange={(event) =>
                onSlideScreenshotChange(
                  selectedSlideIndex,
                  event.target.files?.[0] ?? null,
                )
              }
            />
            <strong>
              {selectedScreenshotName
                ? `Replace slide ${selectedSlideIndex + 1} screenshot`
                : `Upload screenshot for slide ${selectedSlideIndex + 1}`}
            </strong>
            <span>{selectedScreenshotName ?? "PNG or JPG — click to browse"}</span>
          </label>
        </section>
      ) : null}

      {/* ── TEXT TAB ───────────────────────────────────────────────── */}
      {activeTab === "text" ? (
        <section className={styles.section}>
          <label className={styles.field}>
            <span>Project name</span>
            <input
              value={draft.projectName}
              onChange={(event) =>
                onDraftChange("projectName", event.target.value)
              }
            />
          </label>

          <div className={styles.fieldGroupLabel}>Slide {selectedSlideIndex + 1} content</div>

          <label className={styles.field}>
            <span>Badge label</span>
            <input
              value={selectedSlide.badge}
              onChange={(event) =>
                onSlideChange(selectedSlideIndex, "badge", event.target.value)
              }
            />
          </label>

          <label className={styles.field}>
            <span>Headline</span>
            <textarea
              rows={4}
              value={selectedSlide.title}
              onChange={(event) =>
                onSlideChange(selectedSlideIndex, "title", event.target.value)
              }
            />
          </label>

          <label className={styles.field}>
            <span>Support text</span>
            <textarea
              rows={3}
              value={selectedSlide.subtitle}
              onChange={(event) =>
                onSlideChange(selectedSlideIndex, "subtitle", event.target.value)
              }
            />
          </label>
        </section>
      ) : null}

      {/* ── STYLE TAB ──────────────────────────────────────────────── */}
      {activeTab === "style" ? (
        <section className={styles.section}>
          {/* Font picker */}
          <div className={styles.fieldGroupLabel}>Typography</div>
          <div className={styles.fontGrid}>
            {fontOptions.map((font) => (
              <button
                key={font.id}
                type="button"
                className={styles.fontCard}
                data-active={draft.font === font.id}
                onClick={() => onDraftChange("font", font.id as FontOption)}
                style={{ fontFamily: font.family }}
              >
                <span className={styles.fontPreview}>Ag</span>
                <b>{font.name}</b>
              </button>
            ))}
          </div>

          <div className={styles.divider} />

          <div className={styles.fieldGroupLabel}>Device</div>
          <div className={styles.grid}>
            <label className={styles.field}>
              <span>Finish</span>
              <select
                value={draft.deviceFinish}
                onChange={(event) =>
                  onDraftChange(
                    "deviceFinish",
                    event.target.value as DeviceFinish,
                  )
                }
              >
                {deviceFinishOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.field}>
              <span>Screenshot fit</span>
              <select
                value={draft.screenshotFit}
                onChange={(event) =>
                  onDraftChange(
                    "screenshotFit",
                    event.target.value as ScreenshotFit,
                  )
                }
              >
                {fitOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className={styles.divider} />

          <div className={styles.fieldGroupLabel}>Layout</div>

          <label className={styles.field}>
            <div className={styles.rangeHeader}>
              <span>Phone size</span>
              <b>{draft.phoneScale}%</b>
            </div>
            <input
              type="range"
              min={82}
              max={110}
              step={1}
              value={draft.phoneScale}
              onChange={(event) =>
                onDraftChange("phoneScale", Number(event.target.value))
              }
            />
          </label>

          <label className={styles.field}>
            <div className={styles.rangeHeader}>
              <span>Phone angle</span>
              <b>{draft.phoneTilt}°</b>
            </div>
            <input
              type="range"
              min={-10}
              max={10}
              step={1}
              value={draft.phoneTilt}
              onChange={(event) =>
                onDraftChange("phoneTilt", Number(event.target.value))
              }
            />
          </label>

          <label className={styles.field}>
            <div className={styles.rangeHeader}>
              <span>Slide gap</span>
              <b>{draft.slideGap}px</b>
            </div>
            <input
              type="range"
              min={6}
              max={32}
              step={1}
              value={draft.slideGap}
              onChange={(event) =>
                onDraftChange("slideGap", Number(event.target.value))
              }
            />
          </label>
        </section>
      ) : null}

      {/* ── EXPORT TAB ─────────────────────────────────────────────── */}
      {activeTab === "export" ? (
        <section className={styles.section}>
          <div className={styles.exportCard}>
            <strong>Export individual slides (ZIP)</strong>
            <span>
              Compresses and packages each slide as a standalone 3× high-res PNG inside a ZIP file.
            </span>
          </div>

          <button
            type="button"
            className={styles.primaryButton}
            onClick={onExportZip}
            disabled={isZipping}
            style={{
              background: "linear-gradient(135deg, #00d2ff 0%, #0072ff 100%)",
              boxShadow: "0 4px 14px rgba(0, 114, 255, 0.4)"
            }}
          >
            {isZipping ? `Zipping… ${zipProgress}%` : "Download ZIP Package"}
          </button>

          <div className={styles.divider} />

          <div className={styles.exportCard}>
            <strong>Export single mockup strip</strong>
            <span>
              Downloads all {slides.length} slides combined side-by-side into a single wide PNG.
            </span>
          </div>

          <button
            type="button"
            className={styles.secondaryButton}
            onClick={onExport}
            disabled={isExporting}
          >
            {isExporting ? "Exporting Strip…" : "Download Full Strip PNG"}
          </button>
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
