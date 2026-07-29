import { useRef } from "react";

import { PhoneMockup } from "@/features/mockup-tool/components/PhoneMockup";
import { getFontFamily } from "@/features/mockup-tool/data/fonts";
import type {
  CanvasSelection,
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

import styles from "./PreviewStage.module.css";

type PreviewStageProps = {
  theme: MockupTheme;
  draft: EditorDraft;
  slides: SlideDraft[];
  screenshotUrls: Array<string | null>;
  customBackgroundUrl?: string | null;
  customThemeSettings: CustomThemeSettings;
  selectedSlideIndex: number;
  onSelectSlide: (index: number) => void;
  selectedCanvasItem: CanvasSelection | null;
  onSelectCanvasItem: (selection: CanvasSelection | null) => void;
  onMainTextMove: (
    slideIndex: number,
    x: number,
    y: number,
  ) => void;
  onPhoneMove: (
    slideIndex: number,
    x: number,
    y: number,
  ) => void;
  onTextBlockMove: (
    slideIndex: number,
    blockId: string,
    x: number,
    y: number,
  ) => void;
  onImageBlockMove: (
    slideIndex: number,
    blockId: string,
    x: number,
    y: number,
  ) => void;
  onImageBlockResize: (
    slideIndex: number,
    blockId: string,
    width: number,
    height: number,
  ) => void;
  previewRef: React.RefObject<HTMLDivElement | null>;
};

export function PreviewStage({
  theme,
  draft,
  slides,
  screenshotUrls,
  customBackgroundUrl = null,
  customThemeSettings,
  selectedSlideIndex,
  onSelectSlide,
  selectedCanvasItem,
  onSelectCanvasItem,
  onMainTextMove,
  onPhoneMove,
  onTextBlockMove,
  onImageBlockMove,
  onImageBlockResize,
  previewRef,
}: PreviewStageProps) {
  const fontFamily = getFontFamily(draft.font);
  const hasCustomTheme = Boolean(customBackgroundUrl);
  const copyDragRef = useRef<{
    slideIndex: number;
    startX: number;
    startY: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const dragRef = useRef<{
    slideIndex: number;
    blockId: string;
    startX: number;
    startY: number;
    blockX: number;
    blockY: number;
  } | null>(null);
  const phoneDragRef = useRef<{
    slideIndex: number;
    startX: number;
    startY: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const imageDragRef = useRef<{
    slideIndex: number;
    blockId: string;
    startX: number;
    startY: number;
    blockX: number;
    blockY: number;
  } | null>(null);
  const imageResizeRef = useRef<{
    slideIndex: number;
    blockId: string;
    startX: number;
    startWidth: number;
    aspectRatio: number;
  } | null>(null);

  function handleTextBlockPointerDown(
    event: React.PointerEvent<HTMLDivElement>,
    slideIndex: number,
    blockId: string,
    x: number,
    y: number,
  ) {
    event.stopPropagation();
    onSelectSlide(slideIndex);
    onSelectCanvasItem({ kind: "text-block", slideIndex, id: blockId });
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      slideIndex,
      blockId,
      startX: event.clientX,
      startY: event.clientY,
      blockX: x,
      blockY: y,
    };
  }

  function handleMainCopyPointerDown(
    event: React.PointerEvent<HTMLDivElement>,
    slideIndex: number,
    offsetX: number,
    offsetY: number,
  ) {
    event.stopPropagation();
    onSelectSlide(slideIndex);
    onSelectCanvasItem({ kind: "main-text", slideIndex });
    event.currentTarget.setPointerCapture(event.pointerId);
    copyDragRef.current = {
      slideIndex,
      startX: event.clientX,
      startY: event.clientY,
      offsetX,
      offsetY,
    };
  }

  function handleMainCopyPointerMove(
    event: React.PointerEvent<HTMLDivElement>,
  ) {
    if (!copyDragRef.current) return;
    const nextX = Math.round(
      copyDragRef.current.offsetX + event.clientX - copyDragRef.current.startX,
    );
    const nextY = Math.round(
      copyDragRef.current.offsetY + event.clientY - copyDragRef.current.startY,
    );
    onMainTextMove(copyDragRef.current.slideIndex, nextX, nextY);
  }

  function handleMainCopyPointerUp(
    event: React.PointerEvent<HTMLDivElement>,
  ) {
    if (copyDragRef.current) {
      event.stopPropagation();
    }
    copyDragRef.current = null;
  }

  function handleTextBlockPointerMove(
    event: React.PointerEvent<HTMLDivElement>,
  ) {
    if (!dragRef.current) return;
    const nextX = Math.round(
      dragRef.current.blockX + event.clientX - dragRef.current.startX,
    );
    const nextY = Math.round(
      dragRef.current.blockY + event.clientY - dragRef.current.startY,
    );
    onTextBlockMove(
      dragRef.current.slideIndex,
      dragRef.current.blockId,
      nextX,
      nextY,
    );
  }

  function handleTextBlockPointerUp(
    event: React.PointerEvent<HTMLDivElement>,
  ) {
    if (dragRef.current) {
      event.stopPropagation();
    }
    dragRef.current = null;
  }

  function handlePhonePointerDown(
    event: React.PointerEvent<HTMLDivElement>,
    slideIndex: number,
    offsetX: number,
    offsetY: number,
  ) {
    event.stopPropagation();
    onSelectSlide(slideIndex);
    onSelectCanvasItem(null);
    event.currentTarget.setPointerCapture(event.pointerId);
    phoneDragRef.current = {
      slideIndex,
      startX: event.clientX,
      startY: event.clientY,
      offsetX,
      offsetY,
    };
  }

  function handlePhonePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!phoneDragRef.current) return;
    const nextX = Math.round(
      phoneDragRef.current.offsetX + event.clientX - phoneDragRef.current.startX,
    );
    const nextY = Math.round(
      phoneDragRef.current.offsetY + event.clientY - phoneDragRef.current.startY,
    );
    onPhoneMove(phoneDragRef.current.slideIndex, nextX, nextY);
  }

  function handlePhonePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (phoneDragRef.current) {
      event.stopPropagation();
    }
    phoneDragRef.current = null;
  }

  function handleImagePointerDown(
    event: React.PointerEvent<HTMLDivElement>,
    slideIndex: number,
    blockId: string,
    x: number,
    y: number,
  ) {
    event.stopPropagation();
    onSelectSlide(slideIndex);
    onSelectCanvasItem({ kind: "image-block", slideIndex, id: blockId });
    event.currentTarget.setPointerCapture(event.pointerId);
    imageDragRef.current = {
      slideIndex,
      blockId,
      startX: event.clientX,
      startY: event.clientY,
      blockX: x,
      blockY: y,
    };
  }

  function handleImagePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!imageDragRef.current) return;
    const nextX = Math.round(
      imageDragRef.current.blockX + event.clientX - imageDragRef.current.startX,
    );
    const nextY = Math.round(
      imageDragRef.current.blockY + event.clientY - imageDragRef.current.startY,
    );
    onImageBlockMove(
      imageDragRef.current.slideIndex,
      imageDragRef.current.blockId,
      nextX,
      nextY,
    );
  }

  function handleImagePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (imageDragRef.current) {
      event.stopPropagation();
    }
    imageDragRef.current = null;
  }

  function handleImageResizePointerDown(
    event: React.PointerEvent<HTMLDivElement>,
    slideIndex: number,
    blockId: string,
    width: number,
    aspectRatio: number,
  ) {
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    imageResizeRef.current = {
      slideIndex,
      blockId,
      startX: event.clientX,
      startWidth: width,
      aspectRatio,
    };
  }

  function handleImageResizePointerMove(
    event: React.PointerEvent<HTMLDivElement>,
  ) {
    if (!imageResizeRef.current) return;
    const nextWidth = Math.max(
      24,
      Math.round(
        imageResizeRef.current.startWidth +
          event.clientX -
          imageResizeRef.current.startX,
      ),
    );
    const nextHeight = Math.max(
      24,
      Math.round(nextWidth / imageResizeRef.current.aspectRatio),
    );
    onImageBlockResize(
      imageResizeRef.current.slideIndex,
      imageResizeRef.current.blockId,
      nextWidth,
      nextHeight,
    );
  }

  function handleImageResizePointerUp(
    event: React.PointerEvent<HTMLDivElement>,
  ) {
    if (imageResizeRef.current) {
      event.stopPropagation();
    }
    imageResizeRef.current = null;
  }

  return (
    <section
      className={styles.workspace}
      style={{ background: theme.canvasTone }}
    >
      <div className={styles.workspaceTop}>
        <div>
          <strong>{draft.projectName}</strong>
          <span>{slides.length} slide{slides.length !== 1 ? "s" : ""}</span>
        </div>
        <p>Click a slide to select it, then drag text directly on the canvas.</p>
      </div>

      <div className={styles.canvas}>
        <div className={styles.board}>
          <div
            ref={previewRef}
            className={styles.track}
            style={{ gap: draft.slideGap, backgroundImage: theme.canvasGrid }}
          >
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                className={styles.slideCard}
                data-active={index === selectedSlideIndex}
                onClick={() => {
                  onSelectSlide(index);
                  onSelectCanvasItem(null);
                }}
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
                {!hasCustomTheme && theme.decorations.map((item, decorationIndex) => (
                  <div
                    key={`${slide.id}-${decorationIndex}`}
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

                {slide.badge.trim() ? (
                  <div className={styles.cardHeader}>
                    <span
                      className={styles.badge}
                      style={{
                        color: theme.slideText,
                        borderColor: `${theme.accent}44`,
                        background: `${theme.accent}1a`,
                      }}
                    >
                      {slide.badge}
                    </span>
                  </div>
                ) : null}

                <div
                  className={styles.copy}
                  data-draggable={index === selectedSlideIndex}
                  data-selected={
                    selectedCanvasItem?.kind === "main-text" &&
                    selectedCanvasItem.slideIndex === index
                  }
                  onPointerDown={(event) =>
                    handleMainCopyPointerDown(
                      event,
                      index,
                      slide.textOffsetX,
                      slide.textOffsetY,
                    )
                  }
                  onPointerMove={handleMainCopyPointerMove}
                  onPointerUp={handleMainCopyPointerUp}
                  onPointerCancel={handleMainCopyPointerUp}
                  style={{
                    transform: `translate(${slide.textOffsetX}px, ${slide.textOffsetY}px)`,
                  }}
                >
                  <h3>{slide.title}</h3>
                  <p style={{ color: theme.slideMuted }}>{slide.subtitle}</p>
                </div>

                {slide.extraTextBlocks.map((block) => (
                  <div
                    key={block.id}
                    className={styles.floatingText}
                    data-draggable={index === selectedSlideIndex}
                    data-selected={
                      selectedCanvasItem?.kind === "text-block" &&
                      selectedCanvasItem.slideIndex === index &&
                      selectedCanvasItem.id === block.id
                    }
                    onPointerDown={(event) =>
                      handleTextBlockPointerDown(
                        event,
                        index,
                        block.id,
                        block.x,
                        block.y,
                      )
                    }
                    onPointerMove={handleTextBlockPointerMove}
                    onPointerUp={handleTextBlockPointerUp}
                    onPointerCancel={handleTextBlockPointerUp}
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

                {slide.imageBlocks.map((block) => (
                  <div
                    key={block.id}
                    className={styles.imageBlock}
                    data-draggable={index === selectedSlideIndex}
                    data-selected={
                      selectedCanvasItem?.kind === "image-block" &&
                      selectedCanvasItem.slideIndex === index &&
                      selectedCanvasItem.id === block.id
                    }
                    onPointerDown={(event) =>
                      handleImagePointerDown(
                        event,
                        index,
                        block.id,
                        block.x,
                        block.y,
                      )
                    }
                    onPointerMove={handleImagePointerMove}
                    onPointerUp={handleImagePointerUp}
                    onPointerCancel={handleImagePointerUp}
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
                    <div
                      className={styles.resizeHandle}
                      onPointerDown={(event) =>
                        handleImageResizePointerDown(
                          event,
                          index,
                          block.id,
                          block.width,
                          block.aspectRatio,
                        )
                      }
                      onPointerMove={handleImageResizePointerMove}
                      onPointerUp={handleImageResizePointerUp}
                      onPointerCancel={handleImageResizePointerUp}
                    />
                  </div>
                ))}

                <div
                  className={styles.deviceWrap}
                  data-draggable={index === selectedSlideIndex}
                  onPointerDown={(event) =>
                    handlePhonePointerDown(
                      event,
                      index,
                      slide.phoneOffsetX,
                      slide.phoneOffsetY,
                    )
                  }
                  onPointerMove={handlePhonePointerMove}
                  onPointerUp={handlePhonePointerUp}
                  onPointerCancel={handlePhonePointerUp}
                  style={{
                    transform: `translate(${slide.phoneOffsetX}px, ${slide.phoneOffsetY}px)`,
                  }}
                >
                  <PhoneMockup
                    screenshotUrl={screenshotUrls[index]}
                    screenshotFit={draft.screenshotFit}
                    deviceFinish={draft.deviceFinish}
                    framePreset={slide.framePreset}
                    phoneTilt={draft.phoneTilt}
                    phoneScale={draft.phoneScale}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
