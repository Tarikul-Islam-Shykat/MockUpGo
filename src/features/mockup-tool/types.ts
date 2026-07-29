export type DeviceFinish = "obsidian" | "silver" | "champagne";

export type ScreenshotFit = "cover" | "contain";

export type PhoneFramePreset = "svg-classic";

export type ToolTab = "theme" | "slides" | "text" | "style" | "export";

export type FontOption =
  | "inter"
  | "outfit"
  | "space-grotesk"
  | "dm-sans"
  | "syne"
  | "plus-jakarta"
  | "manrope"
  | "playfair"
  | "poppins"
  | "sora";

export type ThemeDecoration = {
  size: number;
  color: string;
  blur: number;
  opacity: number;
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
};

export type SlideDraft = {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  framePreset: PhoneFramePreset;
  textOffsetX: number;
  textOffsetY: number;
  phoneOffsetX: number;
  phoneOffsetY: number;
};

export type ScreenshotAsset = {
  id: string;
  name: string;
  url: string;
};

export type CustomThemeSettings = {
  scale: number;
  rotation: number;
  offsetX: number;
  offsetY: number;
  overlayOpacity: number;
};

export type MockupTheme = {
  id: string;
  name: string;
  summary: string;
  canvasTone: string;
  canvasGrid: string;
  slideBackground: string;
  slideText: string;
  slideMuted: string;
  accent: string;
  overlay: string;
  phoneTilt: number;
  phoneScale: number;
  decorations: ThemeDecoration[];
  starterSlides: SlideDraft[];
  suggestedFont: FontOption;
};

export type EditorDraft = {
  projectName: string;
  themeId: string;
  deviceFinish: DeviceFinish;
  screenshotFit: ScreenshotFit;
  phoneTilt: number;
  phoneScale: number;
  slideGap: number;
  font: FontOption;
};
