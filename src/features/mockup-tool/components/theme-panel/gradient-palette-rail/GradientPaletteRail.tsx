import { useState } from "react";

import { customThemePalettes } from "@/features/mockup-tool/data/custom-theme-palettes";

import styles from "./GradientPaletteRail.module.css";

type GradientPaletteRailProps = {
  selectedPaletteId: string;
  onSelectPalette: (paletteId: string) => void;
};

export function GradientPaletteRail({
  selectedPaletteId,
  onSelectPalette,
}: GradientPaletteRailProps) {
  const [showMore, setShowMore] = useState(false);
  const visiblePalettes = showMore
    ? customThemePalettes
    : customThemePalettes.slice(0, 3);
  const hiddenCount = Math.max(
    customThemePalettes.length - visiblePalettes.length,
    0,
  );

  return (
    <div className={styles.root}>
      <div className={styles.rail}>
        {visiblePalettes.map((palette) => {
          const isActive = palette.id === selectedPaletteId;
          const gradient = `linear-gradient(${palette.backgroundAngle}deg, ${palette.backgroundStart}, ${palette.backgroundEnd})`;

          return (
            <button
              key={palette.id}
              type="button"
              className={styles.card}
              data-active={isActive}
              onClick={() => onSelectPalette(palette.id)}
              aria-label={`${palette.name} gradient palette`}
            >
              <span
                className={styles.swatch}
                style={{ background: gradient }}
              />
              <span className={styles.activeRing} aria-hidden="true" />
            </button>
          );
        })}
      </div>

      {hiddenCount > 0 || showMore ? (
        <button
          type="button"
          className={styles.moreButton}
          onClick={() => setShowMore((current) => !current)}
        >
          {showMore ? "Show less" : `See more (${hiddenCount})`}
        </button>
      ) : null}
    </div>
  );
}
