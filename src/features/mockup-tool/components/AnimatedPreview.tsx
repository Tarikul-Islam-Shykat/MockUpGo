import { useCallback, useEffect, useRef, useState } from "react";
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
} from "@/features/mockup-tool/utils/theme-background";

import styles from "./AnimatedPreview.module.css";

type AnimatedPreviewProps = {
  theme: MockupTheme;
  draft: EditorDraft;
  slides: SlideDraft[];
  screenshotUrls: Array<string | null>;
  customBackgroundUrl?: string | null;
  customThemeSettings: CustomThemeSettings;
  onClose: () => void;
};

type SlideState = "entering" | "visible" | "exiting" | "hidden";

const SLIDE_DURATION = 3500; // ms per slide
const EXIT_DURATION = 500;
const ENTER_DURATION = 700;

export function AnimatedPreview({
  theme,
  draft,
  slides,
  screenshotUrls,
  customBackgroundUrl = null,
  customThemeSettings,
  onClose,
}: AnimatedPreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideState, setSlideState] = useState<SlideState>("entering");
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const slideCardRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const fontFamily = getFontFamily(draft.font);
  const hasCustomTheme = Boolean(customBackgroundUrl);

  /* ── Animation keys — reset on slide change ────────────────────── */
  const [animKey, setAnimKey] = useState(0);

  /* ── Advance to next slide ──────────────────────────────────────── */
  const goToSlide = useCallback(
    (index: number) => {
      if (index < 0 || index >= slides.length) return;
      setSlideState("exiting");
      timerRef.current = setTimeout(() => {
        setCurrentIndex(index);
        setAnimKey((k) => k + 1);
        setSlideState("entering");
        setProgress(0);
        startTimeRef.current = Date.now();
        timerRef.current = setTimeout(() => {
          setSlideState("visible");
        }, ENTER_DURATION);
      }, EXIT_DURATION);
    },
    [slides.length],
  );

  const goNext = useCallback(() => {
    const next = currentIndex + 1;
    if (next >= slides.length) {
      setIsPlaying(false);
      return;
    }
    goToSlide(next);
  }, [currentIndex, slides.length, goToSlide]);

  const goPrev = useCallback(() => {
    goToSlide(Math.max(0, currentIndex - 1));
  }, [currentIndex, goToSlide]);

  /* ── Auto-advance ───────────────────────────────────────────────── */
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
      return;
    }

    startTimeRef.current = Date.now();
    setProgress(0);

    // Progress tick
    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min(100, (elapsed / SLIDE_DURATION) * 100);
      setProgress(pct);
    }, 50);

    // Auto-advance
    timerRef.current = setTimeout(() => {
      const next = currentIndex + 1;
      if (next >= slides.length) {
        setIsPlaying(false);
        if (progressRef.current) clearInterval(progressRef.current);
        return;
      }
      goNext();
    }, SLIDE_DURATION);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [currentIndex, isPlaying, goNext, slides.length]);

  /* ── Enter on mount ─────────────────────────────────────────────── */
  useEffect(() => {
    setSlideState("entering");
    const t = setTimeout(() => setSlideState("visible"), ENTER_DURATION);
    return () => clearTimeout(t);
  }, []);

  /* ── Keyboard shortcuts ─────────────────────────────────────────── */
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === " ") setIsPlaying((p) => !p);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, goNext, goPrev]);

  /* ── Restart ────────────────────────────────────────────────────── */
  function handleRestart() {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (progressRef.current) clearInterval(progressRef.current);
    setCurrentIndex(0);
    setAnimKey((k) => k + 1);
    setSlideState("entering");
    setProgress(0);
    setIsPlaying(true);
    setTimeout(() => setSlideState("visible"), ENTER_DURATION);
  }

  /* ── Video recording via canvas + MediaRecorder ─────────────────── */
  async function handleDownloadVideo() {
    if (isRecording) return;

    setIsRecording(true);
    setRecordingProgress(0);

    try {
      // ── Step 1: Capture each slide as an image ────────────────────
      const slideImages: HTMLImageElement[] = [];
      for (let i = 0; i < slides.length; i++) {
        setRecordingProgress(Math.round((i / slides.length) * 40));
        // Temporarily show this slide's content in an off-screen element
        // We'll use the card ref after a brief forced-render
        // For now, pre-render using a temp DOM approach
        const img = new Image();
        // Create a temporary container to render the slide
        const container = document.createElement("div");
        container.style.cssText = `
          position: fixed;
          left: -9999px;
          top: 0;
          width: 320px;
          height: 680px;
          border-radius: 32px;
          overflow: hidden;
          background: ${hasCustomTheme ? "#0b0d14" : theme.slideBackground};
          color: ${theme.slideText};
          font-family: ${fontFamily};
          display: flex;
          flex-direction: column;
        `;
        const content = document.createElement("div");
        content.style.cssText = `
          position: relative;
          z-index: 1;
          padding: 28px 24px 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          height: 100%;
        `;

        if (hasCustomTheme) {
          const customLayer = document.createElement("div");
          customLayer.style.cssText = `
            position: absolute;
            inset: -24%;
            pointer-events: none;
            z-index: 0;
            transform-origin: center center;
          `;
          Object.assign(
            customLayer.style,
            getCustomBackgroundLayerStyle(customBackgroundUrl, customThemeSettings),
          );
          container.appendChild(customLayer);
        }

        if (hasCustomTheme) {
          const overlayLayer = document.createElement("div");
          overlayLayer.style.cssText = `
            position: absolute;
            inset: 0;
            pointer-events: none;
            z-index: 0;
          `;
          Object.assign(
            overlayLayer.style,
            getCustomVeilLayerStyle(customThemeSettings),
          );
          container.appendChild(overlayLayer);
        } else if (theme.overlay !== "none") {
          const overlayLayer = document.createElement("div");
          overlayLayer.style.cssText = `
            position: absolute;
            inset: 0;
            pointer-events: none;
            z-index: 0;
          `;
          Object.assign(
            overlayLayer.style,
            getOverlayLayerStyle(theme.overlay, customThemeSettings),
          );
          container.appendChild(overlayLayer);
        }

        const slide = slides[i];
        content.innerHTML = `
          <div style="display:inline-flex;align-items:center;padding:6px 14px;border-radius:999px;border:1px solid ${theme.accent}55;background:${theme.accent}20;font-size:0.7rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;width:fit-content;color:${theme.slideText}">
            ${slide.badge}
          </div>
          <h3 style="font-size:2.4rem;line-height:1.0;letter-spacing:-0.05em;font-weight:900;margin:0;color:${theme.slideText}">
            ${slide.title}
          </h3>
          <p style="font-size:0.95rem;line-height:1.55;margin:0;color:${theme.slideMuted}">
            ${slide.subtitle}
          </p>
          ${
            screenshotUrls[i]
              ? `<div style="margin-top:auto;display:flex;justify-content:center;">
                   <img src="${screenshotUrls[i]}" style="width:170px;height:310px;object-fit:cover;border-radius:28px;border:3px solid rgba(255,255,255,0.1);" />
                 </div>`
              : ""
          }
        `;
        container.appendChild(content);
        document.body.appendChild(container);

        try {
          const dataUrl = await toPng(container, {
            cacheBust: true,
            pixelRatio: 2,
          });
          await new Promise<void>((resolve) => {
            img.onload = () => resolve();
            img.src = dataUrl;
          });
          slideImages.push(img);
        } finally {
          document.body.removeChild(container);
        }
      }

      // ── Step 2: Animate on canvas + record ───────────────────────
      setRecordingProgress(50);

      const W = 320 * 2;
      const H = 680 * 2;
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d")!;

      const stream = canvas.captureStream(30);
      const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
        ? "video/webm;codecs=vp9"
        : MediaRecorder.isTypeSupported("video/webm")
        ? "video/webm"
        : "video/mp4";

      chunksRef.current = [];
      const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 6_000_000 });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.start(100);

      // Animate: each slide for 2.5s with 0.5s crossfade transitions
      const HOLD = 2500;
      const FADE = 500;
      const FPS = 30;

      for (let i = 0; i < slideImages.length; i++) {
        const img = slideImages[i];
        const nextImg = slideImages[i + 1] ?? null;

        // Hold phase
        const holdFrames = Math.floor((HOLD / 1000) * FPS);
        for (let f = 0; f < holdFrames; f++) {
          // Draw with Ken Burns subtle zoom effect
          const zoom = 1 + (f / holdFrames) * 0.03;
          const offset = (zoom - 1) / 2;
          ctx.clearRect(0, 0, W, H);
          ctx.save();
          ctx.translate(-offset * W, -offset * H);
          ctx.scale(zoom, zoom);
          ctx.drawImage(img, 0, 0, W, H);
          ctx.restore();
          await sleep(1000 / FPS);
          setRecordingProgress(50 + Math.round(((i * (HOLD + FADE) + (f * 1000) / FPS) / (slideImages.length * (HOLD + FADE))) * 45));
        }

        // Fade transition to next
        if (nextImg) {
          const fadeFrames = Math.floor((FADE / 1000) * FPS);
          for (let f = 0; f < fadeFrames; f++) {
            const alpha = f / fadeFrames;
            ctx.clearRect(0, 0, W, H);
            ctx.drawImage(img, 0, 0, W, H);
            ctx.globalAlpha = alpha;
            ctx.drawImage(nextImg, 0, 0, W, H);
            ctx.globalAlpha = 1;
            await sleep(1000 / FPS);
          }
        }
      }

      // Pause 1s at end
      for (let f = 0; f < 30; f++) {
        ctx.drawImage(slideImages[slideImages.length - 1], 0, 0, W, H);
        await sleep(1000 / 30);
      }

      setRecordingProgress(98);
      recorder.stop();

      await new Promise<void>((resolve) => {
        recorder.onstop = () => resolve();
      });

      const ext = mimeType.startsWith("video/webm") ? "webm" : "mp4";
      const blob = new Blob(chunksRef.current, { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${slugify(draft.projectName) || "mockup-preview"}.${ext}`;
      a.click();
      URL.revokeObjectURL(url);

      setRecordingProgress(100);
    } catch (err) {
      console.error("Video recording failed:", err);
    } finally {
      setTimeout(() => {
        setIsRecording(false);
        setRecordingProgress(0);
      }, 800);
    }
  }

  /* ── Helpers ────────────────────────────────────────────────────── */
  function sleep(ms: number) {
    return new Promise<void>((r) => setTimeout(r, ms));
  }

  function slugify(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48);
  }

  const slide = slides[currentIndex];

  return (
    <div className={styles.overlay}>
      {/* ── Top bar ─────────────────────────────────────────────────── */}
      <div className={styles.topBar}>
        <div className={styles.topBarTitle}>
          <div className={styles.topBarDot} />
          {draft.projectName} — Animated Preview
        </div>
        <div className={styles.topBarActions}>
          {isRecording ? (
            <div className={styles.recordingBadge}>
              <div className={styles.recordDot} />
              Recording… {recordingProgress}%
            </div>
          ) : (
            <button
              type="button"
              className={styles.downloadBtn}
              onClick={handleDownloadVideo}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              Download Video
            </button>
          )}
          <button type="button" className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>
      </div>

      {/* ── Slide stage ─────────────────────────────────────────────── */}
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
              color: theme.slideText,
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
              {/* Badge */}
              <span
                className={styles.badge}
                data-anim={slideState === "entering" || slideState === "visible" ? "true" : "false"}
                style={{
                  color: theme.slideText,
                  borderColor: `${theme.accent}55`,
                  background: `${theme.accent}20`,
                }}
              >
                {slide.badge}
              </span>

              {/* Headline */}
              <h3
                className={styles.headline}
                data-anim={slideState === "entering" || slideState === "visible" ? "true" : "false"}
              >
                {slide.title}
              </h3>

              {/* Subtitle */}
              <p
                className={styles.subtitle}
                data-anim={slideState === "entering" || slideState === "visible" ? "true" : "false"}
                style={{ color: theme.slideMuted }}
              >
                {slide.subtitle}
              </p>

              {/* Phone */}
              <div
                className={styles.phoneWrap}
                data-anim={slideState === "entering" || slideState === "visible" ? "true" : "false"}
              >
                <PhoneMockup
                  screenshotUrl={screenshotUrls[currentIndex]}
                  screenshotFit={draft.screenshotFit}
                  deviceFinish={draft.deviceFinish}
                  phoneTilt={draft.phoneTilt}
                  phoneScale={100}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Progress & controls ──────────────────────────────────────── */}
      <div className={styles.progressBar}>
        {/* Dots */}
        <div className={styles.dots}>
          {slides.map((_, i) => (
            <div
              key={i}
              className={styles.dot}
              data-active={i === currentIndex ? "true" : "false"}
              onClick={() => goToSlide(i)}
            />
          ))}
        </div>

        {/* Progress track */}
        <div className={styles.track}>
          <div
            className={styles.fill}
            style={{ width: isPlaying ? `${progress}%` : "100%" }}
          />
        </div>

        {/* Controls */}
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.ctrlBtn}
            onClick={goPrev}
            disabled={currentIndex === 0}
          >
            ‹
          </button>

          <button
            type="button"
            className={`${styles.ctrlBtn} ${styles.playBtn}`}
            onClick={() => {
              if (!isPlaying && currentIndex === slides.length - 1) {
                handleRestart();
              } else {
                setIsPlaying((p) => !p);
              }
            }}
          >
            {!isPlaying && currentIndex === slides.length - 1
              ? "↺"
              : isPlaying
              ? "⏸"
              : "▶"}
          </button>

          <button
            type="button"
            className={styles.ctrlBtn}
            onClick={goNext}
            disabled={currentIndex === slides.length - 1}
          >
            ›
          </button>

          <span className={styles.slideCounter}>
            {currentIndex + 1} / {slides.length}
          </span>
        </div>
      </div>
    </div>
  );
}
