import { useRef, useState } from "react";

import { PhoneMockup } from "@/features/mockup-tool/components/PhoneMockup";
import { getFontFamily } from "@/features/mockup-tool/data/fonts";
import type {
  CustomThemeSettings,
  EditorDraft,
  MockupTheme,
  SlideDraft,
} from "@/features/mockup-tool/types";
import {
  getCustomBackgroundLayerStyle,
  getCustomVeilLayerStyle,
  getOverlayLayerStyle,
  getSlideCardBackgroundStyle,
  getRuntimeThemeColors,
} from "@/features/mockup-tool/utils/theme-background";
import { exportSlidePng } from "@/features/mockup-tool/utils/export-mockup";

import styles from "./CanvasEditor.module.css";

type DragRef = {
  active: boolean;
  startX: number;
  startY: number;
  startOffsetX: number;
  startOffsetY: number;
};

type CanvasEditorProps = {
  theme: MockupTheme;
  draft: EditorDraft;
  slide: SlideDraft;
  slideIndex: number;
  totalSlides: number;
  screenshotUrl: string | null;
  customBackgroundUrl?: string | null;
  customThemeSettings: CustomThemeSettings;
  onBack: () => void;
  onScreenshotChange: (index: number, file: File | null) => void;
  onSlideChange: <Key extends keyof SlideDraft>(
    index: number,
    field: Key,
    value: SlideDraft[Key],
  ) => void;
  onPrevSlide: () => void;
  onNextSlide: () => void;
};

export function CanvasEditor({
  theme,
  draft,
  slide,
  slideIndex,
  totalSlides,
  screenshotUrl,
  customBackgroundUrl = null,
  customThemeSettings,
  onBack,
  onScreenshotChange,
  onSlideChange,
  onPrevSlide,
  onNextSlide,
}: CanvasEditorProps) {
  const slideRef   = useRef<HTMLDivElement>(null);
  const fileInput  = useRef<HTMLInputElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const textDrag = useRef<DragRef>({ active:false, startX:0, startY:0, startOffsetX:0, startOffsetY:0 });
  const phoneDrag = useRef<DragRef>({ active:false, startX:0, startY:0, startOffsetX:0, startOffsetY:0 });

  /* ── Text drag ──────────────────────────────────────────────────── */
  function handleTextPointerDown(e: React.PointerEvent) {
    e.currentTarget.setPointerCapture(e.pointerId);
    textDrag.current = { active:true, startX:e.clientX, startY:e.clientY, startOffsetX:slide.textOffsetX, startOffsetY:slide.textOffsetY };
  }
  function handleTextPointerMove(e: React.PointerEvent) {
    if (!textDrag.current.active) return;
    onSlideChange(slideIndex, "textOffsetX", textDrag.current.startOffsetX + e.clientX - textDrag.current.startX);
    onSlideChange(slideIndex, "textOffsetY", textDrag.current.startOffsetY + e.clientY - textDrag.current.startY);
  }
  function handleTextPointerUp() { textDrag.current.active = false; }

  /* ── Phone drag ─────────────────────────────────────────────────── */
  function handlePhonePointerDown(e: React.PointerEvent) {
    // Don't start drag if click is on the upload overlay
    if ((e.target as HTMLElement).closest("[data-upload-zone]")) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    phoneDrag.current = { active:true, startX:e.clientX, startY:e.clientY, startOffsetX:slide.phoneOffsetX, startOffsetY:slide.phoneOffsetY };
  }
  function handlePhonePointerMove(e: React.PointerEvent) {
    if (!phoneDrag.current.active) return;
    onSlideChange(slideIndex, "phoneOffsetX", phoneDrag.current.startOffsetX + e.clientX - phoneDrag.current.startX);
    onSlideChange(slideIndex, "phoneOffsetY", phoneDrag.current.startOffsetY + e.clientY - phoneDrag.current.startY);
  }
  function handlePhonePointerUp() { phoneDrag.current.active = false; }

  /* ── Reset positions ────────────────────────────────────────────── */
  function handleReset() {
    onSlideChange(slideIndex, "textOffsetX", 0);
    onSlideChange(slideIndex, "textOffsetY", 0);
    onSlideChange(slideIndex, "phoneOffsetX", 0);
    onSlideChange(slideIndex, "phoneOffsetY", 0);
  }

  /* ── Screenshot upload ──────────────────────────────────────────── */
  function handleFileAccepted(file: File | null) {
    if (file && file.type.startsWith("image/")) {
      onScreenshotChange(slideIndex, file);
    }
  }
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    handleFileAccepted(e.target.files?.[0] ?? null);
    e.target.value = ""; // allow re-selecting same file
  }
  /* ── Export ─────────────────────────────────────────────────────── */
  async function handleExportSlide() {
    if (!slideRef.current) return;
    try {
      setIsExporting(true);
      await exportSlidePng(slideRef.current, draft.projectName, slideIndex);
    } finally {
      setIsExporting(false);
    }
  }

  const fontFamily = getFontFamily(draft.font);
  const hasDrift = slide.textOffsetX !== 0 || slide.textOffsetY !== 0 || slide.phoneOffsetX !== 0 || slide.phoneOffsetY !== 0;
  const hasScreenshot = Boolean(screenshotUrl);
  const hasCustomTheme =
    customThemeSettings.backgroundMode !== "preset" || Boolean(customBackgroundUrl);
  const themeColors = getRuntimeThemeColors(theme, customThemeSettings);

  return (
    <div className={styles.editor}>

      {/* ── Toolbar ─────────────────────────────────────────────────── */}
      <div className={styles.toolbar}>
        <button type="button" className={styles.backBtn} onClick={onBack}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Overview
        </button>

        <div className={styles.slideNav}>
          <button type="button" className={styles.navBtn} onClick={onPrevSlide} disabled={slideIndex === 0}>‹</button>
          <span>Slide {slideIndex + 1} / {totalSlides}</span>
          <button type="button" className={styles.navBtn} onClick={onNextSlide} disabled={slideIndex === totalSlides - 1}>›</button>
        </div>

        <div className={styles.toolbarRight}>
          {hasScreenshot ? (
            <>
              <span className={styles.hintBadge}>Drag text &amp; phone to reposition</span>
              {/* Replace screenshot button */}
              <label className={styles.replaceBtn} title="Replace screenshot">
                <input
                  ref={fileInput}
                  type="file"
                  accept="image/*"
                  className={styles.hiddenInput}
                  onChange={handleInputChange}
                />
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Replace screenshot
              </label>
            </>
          ) : (
            <span className={styles.hintBadgePulse}>
              📸 Upload a screenshot to get started
            </span>
          )}

          {hasDrift && (
            <button type="button" className={styles.resetBtn} onClick={handleReset}>
              Reset positions
            </button>
          )}

          <button
            type="button"
            className={styles.exportSlideBtn}
            onClick={handleExportSlide}
            disabled={isExporting}
          >
            {isExporting ? (
              <><span className={styles.spinner} />Exporting…</>
            ) : (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                Export Slide
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Canvas area ─────────────────────────────────────────────── */}
      <div className={styles.canvas}>
        <div
          ref={slideRef}
          className={styles.slideCard}
          style={{
            color: themeColors.slideText,
            fontFamily,
            ...getSlideCardBackgroundStyle(
              theme.slideBackground,
              hasCustomTheme,
            ),
          }}
        >
          {hasCustomTheme ? (
            <div
              className={styles.customBackgroundLayer}
              style={getCustomBackgroundLayerStyle(
                customBackgroundUrl,
                customThemeSettings,
              )}
            />
          ) : null}
          {hasCustomTheme ? (
            <div
              className={styles.overlayLayer}
              style={getCustomVeilLayerStyle(customThemeSettings)}
            />
          ) : theme.overlay !== "none" ? (
            <div
              className={styles.overlayLayer}
              style={getOverlayLayerStyle(theme.overlay, customThemeSettings)}
            />
          ) : null}
          {/* Decorations */}
          {!hasCustomTheme && theme.decorations.map((item, i) => (
            <div
              key={i}
              className={styles.decoration}
              style={{
                width: item.size, height: item.size,
                background: item.color,
                filter: `blur(${item.blur}px)`,
                opacity: item.opacity,
                top: item.top, right: item.right,
                bottom: item.bottom, left: item.left,
              }}
            />
          ))}

          <div className={styles.content}>
            {/* ── Draggable text block ─────────────────────────────── */}
            <div
              className={styles.textBlock}
              style={{ transform: `translate(${slide.textOffsetX}px, ${slide.textOffsetY}px)` }}
              onPointerDown={handleTextPointerDown}
              onPointerMove={handleTextPointerMove}
              onPointerUp={handleTextPointerUp}
            >
              <div className={styles.dragHandle} data-drag-handle="true">⠿ Text</div>
              <span
                className={styles.badge}
                style={{ color: themeColors.slideText, borderColor: `${themeColors.accent}55`, background: `${themeColors.accent}20` }}
              >
                {slide.badge}
              </span>
              <h3 className={styles.headline}>{slide.title}</h3>
              <p className={styles.subtitle} style={{ color: themeColors.slideMuted }}>{slide.subtitle}</p>
            </div>

            {/* ── Draggable phone block ────────────────────────────── */}
            <div
              className={styles.phoneBlock}
              style={{
                transform: `translate(${slide.phoneOffsetX}px, ${slide.phoneOffsetY}px)`,
                cursor: "grab",
              }}
              onPointerDown={handlePhonePointerDown}
              onPointerMove={handlePhonePointerMove}
              onPointerUp={handlePhonePointerUp}
            >
              <div className={styles.dragHandle} data-drag-handle="true">⠿ Phone</div>

              <PhoneMockup
                screenshotUrl={screenshotUrl}
                screenshotFit={draft.screenshotFit}
                deviceFinish={draft.deviceFinish}
                framePreset={slide.framePreset}
                phoneTilt={draft.phoneTilt}
                phoneScale={100}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
