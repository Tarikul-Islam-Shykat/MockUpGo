import { TemplateRail } from "@/features/mockup-tool/components/TemplateRail";
import type {
  DeviceFinish,
  EditorDraft,
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
  isExporting: boolean;
};

const deviceFinishOptions: Array<{ value: DeviceFinish; label: string }> = [
  { value: "obsidian", label: "Obsidian" },
  { value: "silver", label: "Silver" },
  { value: "champagne", label: "Champagne" },
];

const fitOptions: Array<{ value: ScreenshotFit; label: string }> = [
  { value: "cover", label: "Cover" },
  { value: "contain", label: "Contain" },
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
  isExporting,
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

      {activeTab === "slides" ? (
        <section className={styles.section}>
          <label className={styles.uploadCard}>
            <input
              type="file"
              accept="image/*"
              multiple
              className={styles.hiddenInput}
              onChange={(event) => onBatchUpload(event.target.files)}
            />
            <strong>Upload multiple screenshots</strong>
            <span>Assign up to {slides.length} screens across the slide set</span>
          </label>

          <div className={styles.slideList}>
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                className={styles.slideRow}
                data-active={index === selectedSlideIndex}
                onClick={() => onSelectedSlideChange(index)}
              >
                <span>{index + 1}</span>
                <div>
                  <strong>{slide.title}</strong>
                  <small>{screenshotNames[index] ?? "No screenshot selected"}</small>
                </div>
              </button>
            ))}
          </div>

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
            <span>{selectedScreenshotName ?? "PNG or JPG"}</span>
          </label>
        </section>
      ) : null}

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

          <label className={styles.field}>
            <span>Badge</span>
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

      {activeTab === "style" ? (
        <section className={styles.section}>
          <div className={styles.grid}>
            <label className={styles.field}>
              <span>Device finish</span>
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

          <label className={styles.field}>
            <div className={styles.rangeHeader}>
              <span>Phone size</span>
              <b>{draft.phoneScale}%</b>
            </div>
            <input
              type="range"
              min={82}
              max={108}
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
              <b>{draft.phoneTilt}deg</b>
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
              min={8}
              max={28}
              step={1}
              value={draft.slideGap}
              onChange={(event) =>
                onDraftChange("slideGap", Number(event.target.value))
              }
            />
          </label>
        </section>
      ) : null}

      {activeTab === "export" ? (
        <section className={styles.section}>
          <div className={styles.exportCard}>
            <strong>Export screenshot set</strong>
            <span>
              Downloads the current horizontal slide canvas as one PNG.
            </span>
          </div>

          <button
            type="button"
            className={styles.primaryButton}
            onClick={onExport}
            disabled={isExporting}
          >
            {isExporting ? "Exporting..." : "Download PNG"}
          </button>
        </section>
      ) : null}
    </aside>
  );
}

function getTabTitle(tab: ToolTab) {
  switch (tab) {
    case "theme":
      return "Theme library";
    case "slides":
      return "Slide assets";
    case "text":
      return "Slide copy";
    case "style":
      return "Visual settings";
    case "export":
      return "Export";
  }
}

function getTabDescription(tab: ToolTab) {
  switch (tab) {
    case "theme":
      return "Choose the screenshot set direction.";
    case "slides":
      return "Upload and assign app screens.";
    case "text":
      return "Edit the selected screenshot card.";
    case "style":
      return "Tune phone presentation and spacing.";
    case "export":
      return "Download the current canvas.";
  }
}
