import { PhoneMockup } from "@/features/mockup-tool/components/PhoneMockup";
import type {
  EditorDraft,
  MockupTheme,
  SlideDraft,
} from "@/features/mockup-tool/types";

import styles from "./PreviewStage.module.css";

type PreviewStageProps = {
  theme: MockupTheme;
  draft: EditorDraft;
  slides: SlideDraft[];
  screenshotUrls: Array<string | null>;
  selectedSlideIndex: number;
  onSelectSlide: (index: number) => void;
  previewRef: React.RefObject<HTMLDivElement | null>;
};

export function PreviewStage({
  theme,
  draft,
  slides,
  screenshotUrls,
  selectedSlideIndex,
  onSelectSlide,
  previewRef,
}: PreviewStageProps) {
  return (
    <section
      className={styles.workspace}
      style={{ background: theme.canvasTone }}
    >
      <div className={styles.workspaceTop}>
        <div>
          <strong>{draft.projectName}</strong>
          <span>{slides.length} vertical screenshots</span>
        </div>
        <p>Click any slide to edit its text or replace its screenshot.</p>
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
                onClick={() => onSelectSlide(index)}
                style={{
                  background: `${theme.overlay}, ${theme.slideBackground}`,
                  color: theme.slideText,
                }}
              >
                {theme.decorations.map((item, decorationIndex) => (
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

                <div className={styles.copy}>
                  <h3>{slide.title}</h3>
                  <p style={{ color: theme.slideMuted }}>{slide.subtitle}</p>
                </div>

                <div className={styles.deviceWrap}>
                  <PhoneMockup
                    screenshotUrl={screenshotUrls[index]}
                    screenshotFit={draft.screenshotFit}
                    deviceFinish={draft.deviceFinish}
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
