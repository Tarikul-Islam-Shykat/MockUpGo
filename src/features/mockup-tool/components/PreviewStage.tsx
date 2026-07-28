import { PhoneMockup } from "@/features/mockup-tool/components/PhoneMockup";
import { getFontFamily } from "@/features/mockup-tool/data/fonts";
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
  const fontFamily = getFontFamily(draft.font);

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
        <p>Click any slide to open canvas editor.</p>
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
                  fontFamily,
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

                <div
                  className={styles.copy}
                  style={{
                    transform: `translate(${slide.textOffsetX}px, ${slide.textOffsetY}px)`,
                  }}
                >
                  <h3>{slide.title}</h3>
                  <p style={{ color: theme.slideMuted }}>{slide.subtitle}</p>
                </div>

                <div
                  className={styles.deviceWrap}
                  style={{
                    transform: `translate(${slide.phoneOffsetX}px, ${slide.phoneOffsetY}px)`,
                  }}
                >
                  <PhoneMockup
                    screenshotUrl={screenshotUrls[index]}
                    screenshotFit={draft.screenshotFit}
                    deviceFinish={draft.deviceFinish}
                    phoneTilt={draft.phoneTilt}
                    phoneScale={draft.phoneScale}
                  />
                </div>

                {/* Canvas mode indicator */}
                <div className={styles.canvasHint} data-no-export="true">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Edit
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
