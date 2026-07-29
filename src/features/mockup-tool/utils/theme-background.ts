import type { CSSProperties } from "react";
import type {
  CustomThemeSettings,
  MockupTheme,
} from "@/features/mockup-tool/types";

export type ThemeColors = Pick<MockupTheme, "slideText" | "slideMuted" | "accent">;

export function getSlideCardBackgroundStyle(
  slideBackground: string,
  useNeutralBase = false,
): CSSProperties {
  return {
    background: useNeutralBase ? "#0b0d14" : slideBackground,
  };
}

export function getCustomBackgroundLayerStyle(
  customBackgroundUrl: string | null,
  settings: CustomThemeSettings,
): CSSProperties {
  const gradient = `linear-gradient(${settings.backgroundAngle}deg, ${settings.backgroundStart}, ${settings.backgroundEnd})`;

  return {
    background:
      settings.backgroundMode === "gradient"
        ? gradient
        : customBackgroundUrl
          ? `url("${customBackgroundUrl}") center center / cover no-repeat`
          : gradient,
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    transform: `translate(${settings.offsetX}px, ${settings.offsetY}px) scale(${settings.scale / 100}) rotate(${settings.rotation}deg)`,
  };
}

export function getOverlayLayerStyle(
  overlay: string,
  settings: CustomThemeSettings,
): CSSProperties {
  return {
    background: overlay,
    opacity: settings.overlayOpacity / 100,
  };
}

export function getCustomVeilLayerStyle(
  settings: CustomThemeSettings,
): CSSProperties {
  return {
    background:
      "linear-gradient(180deg, rgba(5, 8, 14, 0.12), rgba(5, 8, 14, 0.28))",
    opacity: settings.overlayOpacity / 100,
  };
}

export function getRuntimeThemeColors(
  theme: MockupTheme,
  settings: CustomThemeSettings,
): ThemeColors {
  if (settings.backgroundMode === "preset") {
    return theme;
  }

  return {
    slideText: settings.textColor,
    slideMuted: settings.mutedColor,
    accent: settings.accentColor,
  };
}
