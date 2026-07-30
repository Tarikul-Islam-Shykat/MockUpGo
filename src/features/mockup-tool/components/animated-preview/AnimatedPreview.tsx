import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { toPng } from "html-to-image";

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
import { getSlidePageSize } from "@/features/mockup-tool/utils/page-size";

import { renderPreviewVideo } from "./renderPreviewVideo";
import styles from "./AnimatedPreview.module.css";

type AnimatedPreviewProps = {
  theme: MockupTheme;
  draft: EditorDraft;
  slides: SlideDraft[];
  screenshotUrls: Array<string | null>;
  customBackgroundUrl?: string | null;
  customThemeSettings: CustomThemeSettings;
  onClose: () => void;
  screenshotLookup?: Map<string, { id: string; name: string; url: string }>;
};

type SlideState = "entering" | "visible" | "exiting" | "hidden";

const SLIDE_DURATION = 3200;
const EXIT_DURATION = 220;
const ENTER_DURATION = 260;
const VIDEO_HOLD_DURATION = 1200;
const VIDEO_FADE_DURATION = 140;

export function AnimatedPreview({
  theme,
  draft,
  slides,
  screenshotUrls,
  customBackgroundUrl = null,
  customThemeSettings,
  onClose,
  screenshotLookup = new Map(),
}: AnimatedPreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideState, setSlideState] = useState<SlideState>("entering");
  const [isPlaying, setIsPlaying] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const slideCardRef = useRef<HTMLDivElement>(null);

  const fontFamily = getFontFamily(draft.font);
  const hasCustomTheme =
    customThemeSettings.backgroundMode !== "preset" || Boolean(customBackgroundUrl);
  const themeColors = getRuntimeThemeColors(theme, customThemeSettings);

  const goToSlide = useCallback(
    (index: number) => {
      if (!slides.length) {
        return;
      }

      const normalizedIndex =
        ((index % slides.length) + slides.length) % slides.length;

      setSlideState("exiting");
      timerRef.current = setTimeout(() => {
        setCurrentIndex(normalizedIndex);
        setAnimKey((value) => value + 1);
        setSlideState("entering");
        timerRef.current = setTimeout(() => {
          setSlideState("visible");
        }, ENTER_DURATION);
      }, EXIT_DURATION);
    },
    [slides.length],
  );

  const goNext = useCallback(() => {
    goToSlide(currentIndex + 1);
  }, [currentIndex, goToSlide]);

  const goPrev = useCallback(() => {
    goToSlide(currentIndex - 1);
  }, [currentIndex, goToSlide]);

  useEffect(() => {
    if (!isPlaying || slides.length <= 1) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      return;
    }

    timerRef.current = setTimeout(() => {
      goNext();
    }, SLIDE_DURATION);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [currentIndex, goNext, isPlaying, slides.length]);

  useEffect(() => {
    setSlideState("entering");
    const timeout = setTimeout(() => setSlideState("visible"), ENTER_DURATION);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key === "ArrowRight") {
        goNext();
      }

      if (event.key === "ArrowLeft") {
        goPrev();
      }

      if (event.key === " ") {
        event.preventDefault();
        setIsPlaying((value) => !value);
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev, onClose]);

  async function handleDownloadVideo() {
    if (isRecording || !slides.length) {
      return;
    }

    const previousIndex = currentIndex;
    const previousSlideState = slideState;
    const previousPlaying = isPlaying;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setIsRecording(true);
    setRecordingProgress(0);
    setIsPlaying(false);
    setExportMessage(null);

    try {
      const slideImages: HTMLImageElement[] = [];

      for (let index = 0; index < slides.length; index += 1) {
        setRecordingProgress(Math.round((index / slides.length) * 45));

        flushSync(() => {
          setCurrentIndex(index);
          setAnimKey((value) => value + 1);
          setSlideState("visible");
        });

        await waitForPaint();

        if (!slideCardRef.current) {
          throw new Error("Preview card is not available.");
        }

        const dataUrl = await toPng(slideCardRef.current, {
          cacheBust: true,
          pixelRatio: 1.5,
        });
        slideImages.push(await loadImage(dataUrl));
      }

      const exportKind = await renderPreviewVideo({
        slideImages,
        projectName: draft.projectName,
        slideHoldDuration: VIDEO_HOLD_DURATION,
        transitionDuration: VIDEO_FADE_DURATION,
        onProgress: setRecordingProgress,
      });

      setRecordingProgress(100);
      setExportMessage(
        exportKind === "webm"
          ? "WebM download is ready."
          : "WebM was not available, so a PNG fallback was downloaded instead.",
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Video export failed.";
      console.error("Video recording failed:", error);
      setExportMessage(message);
    } finally {
      flushSync(() => {
        setCurrentIndex(previousIndex);
        setSlideState(previousSlideState);
        setAnimKey((value) => value + 1);
        setIsPlaying(previousPlaying);
      });

      setTimeout(() => {
        setIsRecording(false);
        setRecordingProgress(0);
      }, 600);
    }
  }

  const slide = slides[currentIndex];

  if (!slide) {
    return null;
  }

  const slideSize = getSlidePageSize(draft, slide);

  return (
    <div className={styles.overlay}>
      <div className={styles.topBar}>
        <div className={styles.topBarCopy}>
          <div className={styles.topBarTitle}>
            <div className={styles.topBarDot} />
            {draft.projectName} - Animated Preview
          </div>
          <div className={styles.topBarNote}>
            Video export saves as WebM in the browser. MP4 would need a
            separate conversion step.
          </div>
          {exportMessage ? (
            <div className={styles.exportNotice}>{exportMessage}</div>
          ) : null}
        </div>

        <div className={styles.topBarActions}>
          <button
            type="button"
            className={styles.ghostBtn}
            onClick={() => setIsPlaying((value) => !value)}
            disabled={isRecording}
          >
            {isPlaying ? "Pause" : "Resume"}
          </button>

          {isRecording ? (
            <div className={styles.recordingBadge}>
              <div className={styles.recordDot} />
              Rendering WebM... {recordingProgress}%
            </div>
          ) : (
            <button
              type="button"
              className={styles.downloadBtn}
              onClick={handleDownloadVideo}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              Download WebM
            </button>
          )}

          <button type="button" className={styles.closeBtn} onClick={onClose}>
            x
          </button>
        </div>
      </div>

      <div className={styles.stage}>
        <div
          key={`${currentIndex}-${animKey}`}
          className={styles.slideWrap}
          data-state={slideState}
        >
          <div
            ref={slideCardRef}
            className={styles.slideCard}
            style={{
              width: slideSize.width,
              height: slideSize.height,
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

            {!hasCustomTheme &&
              theme.decorations.map((item, index) => (
                <div
                  key={index}
                  className={styles.decoration}
                  style={{
                    width: item.size,
                    height: item.size,
                    background: item.color,
                    filter: `blur(${item.blur}px)`,
                    opacity: item.opacity,
                    top: item.top,
                    right: item.right,
                    bottom: item.bottom,
                    left: item.left,
                  }}
                />
              ))}

            <div className={styles.content}>
              {slide.badge.trim() ? (
                <span
                  className={styles.badge}
                  data-anim={
                    slideState === "entering" || slideState === "visible"
                      ? "true"
                      : "false"
                  }
                  style={{
                    color: themeColors.slideText,
                    borderColor: `${themeColors.accent}55`,
                    background: `${themeColors.accent}20`,
                  }}
                >
                  {slide.badge}
                </span>
              ) : null}

              <h3
                className={styles.headline}
                data-anim={
                  slideState === "entering" || slideState === "visible"
                    ? "true"
                    : "false"
                }
                style={{
                  transform: `translate(${slide.textOffsetX}px, ${slide.textOffsetY}px)`,
                }}
              >
                {slide.title}
              </h3>

              <p
                className={styles.subtitle}
                data-anim={
                  slideState === "entering" || slideState === "visible"
                    ? "true"
                    : "false"
                }
                style={{
                  color: themeColors.slideMuted,
                  transform: `translate(${slide.textOffsetX}px, ${slide.textOffsetY}px)`,
                }}
              >
                {slide.subtitle}
              </p>

              {slide.imageBlocks.map((block) => (
                <div
                  key={block.id}
                  className={styles.imageBlock}
                  data-anim={
                    slideState === "entering" || slideState === "visible"
                      ? "true"
                      : "false"
                  }
                  style={{
                    width: block.width,
                    height: block.height,
                    transform: `translate(${block.x}px, ${block.y}px)`,
                  }}
                >
                  <img
                    src={block.url}
                    alt={block.name}
                    className={styles.imageBlockAsset}
                    draggable={false}
                  />
                </div>
              ))}

              {slide.extraTextBlocks.map((block) => (
                <div
                  key={block.id}
                  className={styles.floatingText}
                  data-anim={
                    slideState === "entering" || slideState === "visible"
                      ? "true"
                      : "false"
                  }
                  style={{
                    width: block.width,
                    transform: `translate(${block.x}px, ${block.y}px)`,
                    fontSize: block.size,
                    fontWeight: block.weight,
                    fontFamily: getFontFamily(block.font),
                  }}
                >
                  {block.text}
                </div>
              ))}

              {slide.phoneBlocks && slide.phoneBlocks.length > 0 ? (
                slide.phoneBlocks.map((block) => {
                  const blockScreenshot = block.screenshotAssetId
                    ? screenshotLookup.get(block.screenshotAssetId)?.url ?? null
                    : null;

                  return (
                    <div
                      key={block.id}
                      className={styles.phoneWrap}
                      data-anim={
                        slideState === "entering" || slideState === "visible"
                          ? "true"
                          : "false"
                      }
                      style={{
                        transform: `translate(${block.x}px, ${block.y}px)`,
                        width: "236px",
                        height: "487px",
                      }}
                    >
                      <PhoneMockup
                        screenshotUrl={blockScreenshot}
                        screenshotFit={draft.screenshotFit}
                        deviceFinish={block.deviceFinish}
                        framePreset={slide.framePreset}
                        phoneTilt={block.rotation}
                        phoneScale={block.scale}
                        poseId={block.poseId}
                      />
                    </div>
                  );
                })
              ) : (
                <div
                  className={styles.phoneWrap}
                  data-anim={
                    slideState === "entering" || slideState === "visible"
                      ? "true"
                      : "false"
                  }
                  style={{
                    transform: `translate(${slide.phoneOffsetX}px, ${slide.phoneOffsetY}px)`,
                  }}
                >
                  <PhoneMockup
                    screenshotUrl={screenshotUrls[currentIndex]}
                    screenshotFit={draft.screenshotFit}
                    deviceFinish={draft.deviceFinish}
                    framePreset={slide.framePreset}
                    phoneTilt={draft.phoneTilt}
                    phoneScale={100}
                    poseId={slide.poseId ?? "flat"}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Preview frame image could not load."));
    image.src = url;
  });
}

async function waitForPaint() {
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
}
