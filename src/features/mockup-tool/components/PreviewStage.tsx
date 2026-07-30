import { useEffect, useRef, useState } from "react";

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
  getRuntimeThemeColors,
} from "@/features/mockup-tool/utils/theme-background";
import { getSlidePageSize } from "@/features/mockup-tool/utils/page-size";

import styles from "./PreviewStage.module.css";

const MAX_SLIDE_PREVIEW_WIDTH = 320;
const MAX_SLIDE_PREVIEW_HEIGHT = 620;

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
  onTextBlockResize: (
    slideIndex: number,
    blockId: string,
    size: number,
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
  onRemoveSlide: (index: number) => void;
  previewRef: React.RefObject<HTMLDivElement | null>;
  screenshotLookup?: Map<string, { id: string; name: string; url: string }>;
  onSlideChange?: <Key extends keyof SlideDraft>(
    index: number,
    field: Key,
    value: SlideDraft[Key],
  ) => void;
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
  onTextBlockResize,
  onImageBlockMove,
  onImageBlockResize,
  onRemoveSlide,
  previewRef,
  screenshotLookup = new Map(),
  onSlideChange,
}: PreviewStageProps) {
  const fontFamily = getFontFamily(draft.font);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [zoom, setZoom] = useState(100);
  const hasCustomTheme =
    customThemeSettings.backgroundMode !== "preset" || Boolean(customBackgroundUrl);
  const themeColors = getRuntimeThemeColors(theme, customThemeSettings);
  const slideLayouts = slides.map((slide) => {
    const slideSize = getSlidePageSize(draft, slide);
    const slideScale = Math.min(
      1,
      MAX_SLIDE_PREVIEW_WIDTH / slideSize.width,
      MAX_SLIDE_PREVIEW_HEIGHT / slideSize.height,
    );

    return {
      slide,
      slideSize,
      slideScale,
      renderedWidth: Math.max(1, Math.round(slideSize.width * slideScale)),
      renderedHeight: Math.max(1, Math.round(slideSize.height * slideScale)),
    };
  });
  const trackWidth =
    slideLayouts.reduce((total, item) => total + item.renderedWidth, 0) +
    draft.slideGap * Math.max(slides.length - 1, 0);
  const trackHeight =
    slideLayouts.reduce((max, item) => Math.max(max, item.renderedHeight), 0);
  const zoomScale = Math.max(0.05, zoom / 100);
  const boardWidth = Math.max(1, Math.round(trackWidth * zoomScale + 40));
  const boardHeight = Math.max(1, Math.round(trackHeight * zoomScale + 40));
  const copyDragRef = useRef<{
    slideIndex: number;
    startX: number;
    startY: number;
    offsetX: number;
    offsetY: number;
    scale: number;
  } | null>(null);
  const dragRef = useRef<{
    slideIndex: number;
    blockId: string;
    startX: number;
    startY: number;
    blockX: number;
    blockY: number;
    scale: number;
  } | null>(null);
  const textResizeRef = useRef<{
    slideIndex: number;
    blockId: string;
    startX: number;
    startY: number;
    startSize: number;
    scale: number;
  } | null>(null);
  const phoneDragRef = useRef<{
    slideIndex: number;
    startX: number;
    startY: number;
    offsetX: number;
    offsetY: number;
    scale: number;
  } | null>(null);
  const imageDragRef = useRef<{
    slideIndex: number;
    blockId: string;
    startX: number;
    startY: number;
    blockX: number;
    blockY: number;
    scale: number;
  } | null>(null);
  const phoneBlockDragRef = useRef<{
    slideIndex: number;
    blockId: string;
    startX: number;
    startY: number;
    blockX: number;
    blockY: number;
    scale: number;
  } | null>(null);
  const imageResizeRef = useRef<{
    slideIndex: number;
    blockId: string;
    startX: number;
    startWidth: number;
    aspectRatio: number;
    scale: number;
  } | null>(null);

  useEffect(() => {
    const canvasElement = canvasRef.current;
    if (!canvasElement || trackWidth <= 0 || trackHeight <= 0) return;

    const availableWidth = Math.max(320, canvasElement.clientWidth - 48);
    const availableHeight = Math.max(320, canvasElement.clientHeight - 48);
    const fitScale = Math.min(
      1,
      availableWidth / (trackWidth + 40),
      availableHeight / (trackHeight + 40),
    );

    setZoom(Math.max(5, Math.round(fitScale * 100)));
  }, [trackHeight, trackWidth]);

  function clampZoom(value: number) {
    return Math.max(5, Math.min(300, Math.round(value)));
  }

  function handleFitZoom() {
    const canvasElement = canvasRef.current;
    if (!canvasElement || trackWidth <= 0 || trackHeight <= 0) return;

    const availableWidth = Math.max(320, canvasElement.clientWidth - 48);
    const availableHeight = Math.max(320, canvasElement.clientHeight - 48);
    const fitScale = Math.min(
      1,
      availableWidth / (trackWidth + 40),
      availableHeight / (trackHeight + 40),
    );

    setZoom(Math.max(5, Math.round(fitScale * 100)));
  }

  function handleTextBlockPointerDown(
    event: React.PointerEvent<HTMLDivElement>,
    slideIndex: number,
    blockId: string,
    x: number,
    y: number,
    scale: number,
  ) {
    event.stopPropagation();
    if (textResizeRef.current) return;
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
      scale,
    };
  }

  function handleMainCopyPointerDown(
    event: React.PointerEvent<HTMLDivElement>,
    slideIndex: number,
    offsetX: number,
    offsetY: number,
    scale: number,
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
      scale,
    };
  }

  function handleMainCopyPointerMove(
    event: React.PointerEvent<HTMLDivElement>,
  ) {
    if (!copyDragRef.current) return;
    const totalScale = Math.max(0.0001, copyDragRef.current.scale);
    const deltaX = (event.clientX - copyDragRef.current.startX) / totalScale;
    const deltaY = (event.clientY - copyDragRef.current.startY) / totalScale;
    const nextX = Math.round(
      copyDragRef.current.offsetX + deltaX,
    );
    const nextY = Math.round(
      copyDragRef.current.offsetY + deltaY,
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
    if (textResizeRef.current) return;
    if (!dragRef.current) return;
    const totalScale = Math.max(0.0001, dragRef.current.scale);
    const deltaX = (event.clientX - dragRef.current.startX) / totalScale;
    const deltaY = (event.clientY - dragRef.current.startY) / totalScale;
    const nextX = Math.round(
      dragRef.current.blockX + deltaX,
    );
    const nextY = Math.round(
      dragRef.current.blockY + deltaY,
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

  function handleTextResizePointerDown(
    event: React.PointerEvent<HTMLDivElement>,
    slideIndex: number,
    blockId: string,
    size: number,
    scale: number,
  ) {
    event.stopPropagation();
    onSelectSlide(slideIndex);
    onSelectCanvasItem({ kind: "text-block", slideIndex, id: blockId });
    event.currentTarget.setPointerCapture(event.pointerId);
    textResizeRef.current = {
      slideIndex,
      blockId,
      startX: event.clientX,
      startY: event.clientY,
      startSize: size,
      scale,
    };
  }

  function handleTextResizePointerMove(
    event: React.PointerEvent<HTMLDivElement>,
  ) {
    if (!textResizeRef.current) return;
    const totalScale = Math.max(0.0001, textResizeRef.current.scale);
    const delta =
      ((event.clientX - textResizeRef.current.startX) -
        (event.clientY - textResizeRef.current.startY)) /
      totalScale;
    const nextSize = Math.max(
      12,
      Math.round(textResizeRef.current.startSize + delta * 0.12),
    );
    onTextBlockResize(
      textResizeRef.current.slideIndex,
      textResizeRef.current.blockId,
      nextSize,
    );
  }

  function handleTextResizePointerUp(
    event: React.PointerEvent<HTMLDivElement>,
  ) {
    if (textResizeRef.current) {
      event.stopPropagation();
    }
    textResizeRef.current = null;
  }

  function handlePhonePointerDown(
    event: React.PointerEvent<HTMLDivElement>,
    slideIndex: number,
    offsetX: number,
    offsetY: number,
    scale: number,
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
      scale,
    };
  }

  function handlePhonePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!phoneDragRef.current) return;
    const totalScale = Math.max(0.0001, phoneDragRef.current.scale);
    const deltaX = (event.clientX - phoneDragRef.current.startX) / totalScale;
    const deltaY = (event.clientY - phoneDragRef.current.startY) / totalScale;
    const nextX = Math.round(
      phoneDragRef.current.offsetX + deltaX,
    );
    const nextY = Math.round(
      phoneDragRef.current.offsetY + deltaY,
    );
    onPhoneMove(phoneDragRef.current.slideIndex, nextX, nextY);
  }

  function handlePhonePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (phoneDragRef.current) {
      event.stopPropagation();
    }
    phoneDragRef.current = null;
  }

  function handlePhoneBlockPointerDown(
    event: React.PointerEvent<HTMLDivElement>,
    slideIndex: number,
    blockId: string,
    x: number,
    y: number,
    scale: number,
  ) {
    event.stopPropagation();
    onSelectSlide(slideIndex);
    onSelectCanvasItem({ kind: "phone-block", slideIndex, id: blockId });
    event.currentTarget.setPointerCapture(event.pointerId);
    phoneBlockDragRef.current = {
      slideIndex,
      blockId,
      startX: event.clientX,
      startY: event.clientY,
      blockX: x,
      blockY: y,
      scale,
    };
  }

  function handlePhoneBlockPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!phoneBlockDragRef.current || !onSlideChange) return;
    const totalScale = Math.max(0.0001, phoneBlockDragRef.current.scale);
    const deltaX = (event.clientX - phoneBlockDragRef.current.startX) / totalScale;
    const deltaY = (event.clientY - phoneBlockDragRef.current.startY) / totalScale;
    const nextX = Math.round(phoneBlockDragRef.current.blockX + deltaX);
    const nextY = Math.round(phoneBlockDragRef.current.blockY + deltaY);

    const slide = slides[phoneBlockDragRef.current.slideIndex];
    if (slide && slide.phoneBlocks) {
      const nextBlocks = slide.phoneBlocks.map((b) =>
        b.id === phoneBlockDragRef.current!.blockId
          ? { ...b, x: nextX, y: nextY }
          : b
      );
      onSlideChange(phoneBlockDragRef.current.slideIndex, "phoneBlocks", nextBlocks);
    }
  }

  function handlePhoneBlockPointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (phoneBlockDragRef.current) {
      event.stopPropagation();
    }
    phoneBlockDragRef.current = null;
  }

  function handleImagePointerDown(
    event: React.PointerEvent<HTMLDivElement>,
    slideIndex: number,
    blockId: string,
    x: number,
    y: number,
    scale: number,
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
      scale,
    };
  }

  function handleImagePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!imageDragRef.current) return;
    const totalScale = Math.max(0.0001, imageDragRef.current.scale);
    const deltaX = (event.clientX - imageDragRef.current.startX) / totalScale;
    const deltaY = (event.clientY - imageDragRef.current.startY) / totalScale;
    const nextX = Math.round(
      imageDragRef.current.blockX + deltaX,
    );
    const nextY = Math.round(
      imageDragRef.current.blockY + deltaY,
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
    scale: number,
  ) {
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    imageResizeRef.current = {
      slideIndex,
      blockId,
      startX: event.clientX,
      startWidth: width,
      aspectRatio,
      scale,
    };
  }

  function handleImageResizePointerMove(
    event: React.PointerEvent<HTMLDivElement>,
  ) {
    if (!imageResizeRef.current) return;
    const totalScale = Math.max(0.0001, imageResizeRef.current.scale);
    const nextWidth = Math.max(
      24,
      Math.round(
        imageResizeRef.current.startWidth +
          (event.clientX - imageResizeRef.current.startX) / totalScale,
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
        <div className={styles.workspaceInfo}>
          <strong>{draft.projectName}</strong>
          <span>{slides.length} slide{slides.length !== 1 ? "s" : ""}</span>
        </div>
        <div className={styles.zoomControls}>
          <input
            className={styles.zoomSlider}
            type="range"
            min={5}
            max={300}
            step={1}
            value={zoom}
            aria-label="Zoom level"
            onChange={(event) => setZoom(clampZoom(Number(event.target.value)))}
          />
          <div className={styles.zoomReadout}>{zoom}%</div>
          <button type="button" className={styles.fitButton} onClick={handleFitZoom}>
            Fit
          </button>
        </div>
      </div>

      <div ref={canvasRef} className={styles.canvas}>
        <div
          className={styles.board}
          style={{
            width: boardWidth,
            height: boardHeight,
          }}
        >
          <div
            ref={previewRef}
            className={styles.track}
            style={{
              gap: draft.slideGap,
              backgroundImage: theme.canvasGrid,
              transform: `scale(${zoomScale})`,
            }}
          >
            {slideLayouts.map(({ slide, slideSize, slideScale, renderedWidth, renderedHeight }, index) => {
              const interactionScale = zoomScale * slideScale;

              return (
                <div
                  key={slide.id}
                  className={styles.slideFrame}
                  style={{
                    width: renderedWidth,
                    height: renderedHeight,
                  }}
                >
                  {index === selectedSlideIndex && slides.length > 1 ? (
                    <button
                      type="button"
                      className={styles.slideDeleteButton}
                      data-no-export="true"
                      title="Delete slide"
                      aria-label="Delete slide"
                      onClick={(event) => {
                        event.stopPropagation();
                        onRemoveSlide(index);
                      }}
                    >
                      ×
                    </button>
                  ) : null}

                  <button
                    type="button"
                    className={styles.slideCard}
                    data-active={index === selectedSlideIndex}
                    onClick={() => {
                      onSelectSlide(index);
                      onSelectCanvasItem(null);
                    }}
                    style={{
                      width: slideSize.width,
                      height: slideSize.height,
                      color: themeColors.slideText,
                      fontFamily,
                      transform: `scale(${slideScale})`,
                      transformOrigin: "top left",
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
                        style={getOverlayLayerStyle(
                          theme.overlay,
                          customThemeSettings,
                        )}
                      />
                    ) : null}
                    {!hasCustomTheme &&
                      theme.decorations.map((item, decorationIndex) => (
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
                            color: themeColors.slideText,
                            borderColor: `${themeColors.accent}44`,
                            background: `${themeColors.accent}1a`,
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
                          interactionScale,
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
                      <p style={{ color: themeColors.slideMuted }}>
                        {slide.subtitle}
                      </p>
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
                            interactionScale,
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
                        <div
                          className={styles.textResizeHandle}
                          data-drag-handle="true"
                          title="Resize text"
                          onPointerDown={(event) =>
                            handleTextResizePointerDown(
                              event,
                              index,
                              block.id,
                              block.size,
                              interactionScale,
                            )
                          }
                          onPointerMove={handleTextResizePointerMove}
                          onPointerUp={handleTextResizePointerUp}
                          onPointerCancel={handleTextResizePointerUp}
                        >
                          ↘
                        </div>
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
                            interactionScale,
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
                              interactionScale,
                            )
                          }
                          onPointerMove={handleImageResizePointerMove}
                          onPointerUp={handleImageResizePointerUp}
                          onPointerCancel={handleImageResizePointerUp}
                        />
                      </div>
                    ))}

                    {slide.phoneBlocks && slide.phoneBlocks.length > 0 ? (
                      slide.phoneBlocks.map((block) => {
                        const blockScreenshot = block.screenshotAssetId
                          ? screenshotLookup.get(block.screenshotAssetId)?.url ?? null
                          : null;
                        const isSelected =
                          selectedCanvasItem?.kind === "phone-block" &&
                          selectedCanvasItem.slideIndex === index &&
                          selectedCanvasItem.id === block.id;

                        return (
                          <div
                            key={block.id}
                            className={styles.deviceWrap}
                            data-draggable={index === selectedSlideIndex}
                            data-selected={isSelected}
                            onPointerDown={(event) =>
                              handlePhoneBlockPointerDown(
                                event,
                                index,
                                block.id,
                                block.x,
                                block.y,
                                interactionScale,
                              )
                            }
                            onPointerMove={handlePhoneBlockPointerMove}
                            onPointerUp={handlePhoneBlockPointerUp}
                            onPointerCancel={handlePhoneBlockPointerUp}
                            style={{
                              transform: `translate(${block.x}px, ${block.y}px)`,
                              /* Reset standard layout scaling wrapper to rely on block scale */
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
                        className={styles.deviceWrap}
                        data-draggable={index === selectedSlideIndex}
                        onPointerDown={(event) =>
                          handlePhonePointerDown(
                            event,
                            index,
                            slide.phoneOffsetX,
                            slide.phoneOffsetY,
                            interactionScale,
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
                          poseId={slide.poseId ?? "flat"}
                        />
                      </div>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
