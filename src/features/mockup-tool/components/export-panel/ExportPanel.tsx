import styles from "./ExportPanel.module.css";

type ExportPanelProps = {
  slideCount: number;
  isExporting: boolean;
  isZipping: boolean;
  zipProgress: number;
  onExport: () => void;
  onExportZip?: () => void;
};

export function ExportPanel({
  slideCount,
  isExporting,
  isZipping,
  zipProgress,
  onExport,
  onExportZip,
}: ExportPanelProps) {
  return (
    <div className={styles.panel}>
      <div className={styles.exportCard}>
        <strong>Export individual slides (ZIP)</strong>
        <span>
          Compresses and packages each slide as a standalone 3× high-res PNG
          inside a ZIP file.
        </span>
      </div>

      <button
        type="button"
        className={styles.primaryButton}
        onClick={onExportZip}
        disabled={isZipping}
      >
        {isZipping ? `Zipping… ${zipProgress}%` : "Download ZIP Package"}
      </button>

      <div className={styles.divider} />

      <div className={styles.exportCard}>
        <strong>Export single mockup strip</strong>
        <span>
          Downloads all {slideCount} slides combined side-by-side into a single
          wide PNG.
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
    </div>
  );
}
