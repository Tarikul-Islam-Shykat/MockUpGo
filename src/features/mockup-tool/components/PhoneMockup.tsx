import type {
  DeviceFinish,
  ScreenshotFit,
} from "@/features/mockup-tool/types";

import styles from "./PhoneMockup.module.css";

type PhoneMockupProps = {
  screenshotUrl: string | null;
  screenshotFit: ScreenshotFit;
  deviceFinish: DeviceFinish;
  phoneTilt: number;
  phoneScale: number;
};

const frameStyles: Record<DeviceFinish, React.CSSProperties> = {
  obsidian: {
    background:
      "linear-gradient(160deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.02)), linear-gradient(180deg, #3a404b 0%, #12161d 100%)",
    boxShadow:
      "0 28px 80px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.16)",
  },
  silver: {
    background:
      "linear-gradient(160deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.2)), linear-gradient(180deg, #eff4ff 0%, #8d98a8 100%)",
    boxShadow:
      "0 28px 80px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.7)",
  },
  champagne: {
    background:
      "linear-gradient(160deg, rgba(255, 240, 220, 0.8), rgba(255, 255, 255, 0.18)), linear-gradient(180deg, #f7d7b5 0%, #8d6f54 100%)",
    boxShadow:
      "0 28px 80px rgba(0, 0, 0, 0.34), inset 0 1px 0 rgba(255, 255, 255, 0.48)",
  },
};

export function PhoneMockup({
  screenshotUrl,
  screenshotFit,
  deviceFinish,
  phoneTilt,
  phoneScale,
}: PhoneMockupProps) {
  return (
    <div
      className={styles.shell}
      style={{
        transform: `rotate(${phoneTilt}deg) scale(${phoneScale / 100})`,
      }}
    >
      <div className={styles.phone} style={frameStyles[deviceFinish]}>
        <div className={styles.sideGlow} />
        <div className={styles.notch} />

        <div className={styles.screen}>
          {screenshotUrl ? (
            <img
              src={screenshotUrl}
              alt="Uploaded app screenshot"
              className={styles.screenshot}
              style={{ objectFit: screenshotFit }}
            />
          ) : (
            <div className={styles.placeholder}>
              <span>App screenshot</span>
              <strong>Selected slide preview</strong>
              <div className={styles.placeholderBars}>
                <span />
                <span />
                <span />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
