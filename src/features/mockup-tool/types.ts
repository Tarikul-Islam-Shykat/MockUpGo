export type DeviceFinish = "obsidian" | "silver" | "champagne";

export type ScreenshotFit = "cover" | "contain";

export type PhoneFramePreset = "svg-classic";

export type CustomThemeBackgroundMode = "preset" | "image" | "gradient";

export type PageSizePresetId =
  | "landscape-16-9"
  | "landscape-3-2"
  | "landscape-4-3"
  | "landscape-5-4"
  | "landscape-3-1"
  | "square-1-1"
  | "portrait-4-5"
  | "portrait-3-4"
  | "portrait-2-3"
  | "portrait-9-16"
  | "portrait-10-21";

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

export type SlideTextBlock = {
  id: string;
  text: string;
  x: number;
  y: number;
  size: number;
  width: number;
  weight: 500 | 700 | 900;
  font: FontOption;
};

export type SlideImageBlock = {
  id: string;
  name: string;
  url: string;
  x: number;
  y: number;
  width: number;
  height: number;
  aspectRatio: number;
};

export type SlideDraft = {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  framePreset: PhoneFramePreset;
  extraTextBlocks: SlideTextBlock[];
  imageBlocks: SlideImageBlock[];
  textOffsetX: number;
  textOffsetY: number;
  phoneOffsetX: number;
  phoneOffsetY: number;
  pageWidth?: number;
  pageHeight?: number;
};

export type CanvasSelection =
  | { kind: "main-text"; slideIndex: number }
  | { kind: "text-block"; slideIndex: number; id: string }
  | { kind: "image-block"; slideIndex: number; id: string };

export type ScreenshotAsset = {
  id: string;
  name: string;
  url: string;
};

export type CustomThemePalette = {
  id: string;
  name: string;
  description: string;
  backgroundStart: string;
  backgroundEnd: string;
  backgroundAngle: number;
  textColor: string;
  mutedColor: string;
  accentColor: string;
};

export type CustomThemeSettings = {
  backgroundMode: CustomThemeBackgroundMode;
  paletteId: string;
  backgroundStart: string;
  backgroundEnd: string;
  backgroundAngle: number;
  textColor: string;
  mutedColor: string;
  accentColor: string;
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
  pageSizePreset: PageSizePresetId;
  pageWidth: number;
  pageHeight: number;
  phoneTilt: number;
  phoneScale: number;
  slideGap: number;
  font: FontOption;
};
