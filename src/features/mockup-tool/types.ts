export type DeviceFinish = "obsidian" | "silver" | "champagne";

export type ScreenshotFit = "cover" | "contain";

export type ToolTab = "theme" | "slides" | "text" | "style" | "export";

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
};

export type EditorDraft = {
  projectName: string;
  themeId: string;
  deviceFinish: DeviceFinish;
  screenshotFit: ScreenshotFit;
  phoneTilt: number;
  phoneScale: number;
  slideGap: number;
};
