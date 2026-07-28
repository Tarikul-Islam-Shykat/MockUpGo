import type { EditorDraft, MockupTheme, SlideDraft } from "@/features/mockup-tool/types";

function makeSlides(values: Array<[string, string, string]>): SlideDraft[] {
  return values.map(([title, subtitle, badge], index) => ({
    id: `slide-${index + 1}`,
    title,
    subtitle,
    badge,
  }));
}

export const mockupThemes: MockupTheme[] = [
  {
    id: "violet-burst",
    name: "Violet Burst",
    summary: "Bright learning app style",
    canvasTone: "#eef1f7",
    canvasGrid:
      "linear-gradient(180deg, rgba(126, 88, 255, 0.06), rgba(126, 88, 255, 0.02))",
    slideBackground:
      "linear-gradient(180deg, #eee9ff 0%, #e9e2ff 100%)",
    slideText: "#2b2460",
    slideMuted: "rgba(43, 36, 96, 0.72)",
    accent: "#7356ff",
    overlay:
      "radial-gradient(circle at 80% 14%, rgba(118, 86, 255, 0.18), transparent 18%)",
    phoneTilt: -2,
    phoneScale: 94,
    decorations: [
      {
        size: 240,
        color: "rgba(115, 86, 255, 0.15)",
        blur: 0,
        opacity: 1,
        top: "52px",
        right: "-60px",
      },
      {
        size: 180,
        color: "rgba(255, 255, 255, 0.42)",
        blur: 6,
        opacity: 1,
        bottom: "120px",
        left: "-40px",
      },
    ],
    starterSlides: makeSlides([
      ["Learn languages in minutes", "Quick daily lessons for busy people", "App Screens"],
      ["Track progress with rewards", "Earn streaks and celebrate milestones", "App Screens"],
      ["Practice for free every day", "Short sessions that build momentum", "App Screens"],
      ["Challenge yourself in game mode", "Friendly difficulty curves keep it fun", "App Screens"],
      ["Build confident speaking habits", "Daily repetition made lightweight", "App Screens"],
    ]),
  },
  {
    id: "charcoal-store",
    name: "Charcoal Store",
    summary: "Clean dark store layout",
    canvasTone: "#edf1f5",
    canvasGrid:
      "linear-gradient(180deg, rgba(15, 23, 42, 0.05), rgba(15, 23, 42, 0.02))",
    slideBackground: "#23272e",
    slideText: "#f7f8fb",
    slideMuted: "rgba(247, 248, 251, 0.72)",
    accent: "#ffffff",
    overlay:
      "linear-gradient(180deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.01))",
    phoneTilt: 0,
    phoneScale: 96,
    decorations: [
      {
        size: 180,
        color: "rgba(255, 255, 255, 0.08)",
        blur: 0,
        opacity: 1,
        top: "24px",
        left: "24px",
      },
      {
        size: 220,
        color: "rgba(255, 255, 255, 0.04)",
        blur: 0,
        opacity: 1,
        bottom: "-60px",
        right: "-40px",
      },
    ],
    starterSlides: makeSlides([
      ["Send and spend money worldwide", "Instant accounts and global transfers", "Feature"],
      ["Manage rewards in one place", "Cards, perks, and cashback from one dashboard", "Feature"],
      ["Keep team spending stress-free", "Approve and monitor cards with clarity", "Feature"],
      ["Track account details faster", "Move between currencies and recipients smoothly", "Feature"],
      ["Run business banking without clutter", "Everything organized inside one clean flow", "Feature"],
    ]),
  },
  {
    id: "sherbet-mint",
    name: "Sherbet Mint",
    summary: "Soft playful vertical set",
    canvasTone: "#eef2f8",
    canvasGrid:
      "linear-gradient(180deg, rgba(53, 208, 172, 0.05), rgba(53, 208, 172, 0.02))",
    slideBackground:
      "linear-gradient(180deg, #fff6ee 0%, #fff0f7 100%)",
    slideText: "#30264f",
    slideMuted: "rgba(48, 38, 79, 0.7)",
    accent: "#34c8b0",
    overlay:
      "radial-gradient(circle at 16% 74%, rgba(52, 200, 176, 0.12), transparent 22%)",
    phoneTilt: -4,
    phoneScale: 93,
    decorations: [
      {
        size: 300,
        color: "rgba(52, 200, 176, 0.08)",
        blur: 14,
        opacity: 1,
        top: "40px",
        left: "-120px",
      },
      {
        size: 220,
        color: "rgba(255, 163, 184, 0.12)",
        blur: 18,
        opacity: 1,
        bottom: "60px",
        right: "-40px",
      },
    ],
    starterSlides: makeSlides([
      ["Build better routines", "Gentle nudges that help habits stick", "Story"],
      ["Keep goals visible", "Daily tasks, streaks, and focus moments", "Story"],
      ["Celebrate small wins", "Reward loops that feel encouraging", "Story"],
      ["Review your progress weekly", "See trends without opening a spreadsheet", "Story"],
      ["Stay calm while staying consistent", "A softer visual tone for wellness products", "Story"],
    ]),
  },
];

export function createDraftFromTheme(theme: MockupTheme): EditorDraft {
  return {
    projectName: "Untitled Screenshot Set",
    themeId: theme.id,
    deviceFinish: "obsidian",
    screenshotFit: "cover",
    phoneTilt: theme.phoneTilt,
    phoneScale: theme.phoneScale,
    slideGap: 18,
  };
}

export function createSlidesFromTheme(theme: MockupTheme): SlideDraft[] {
  return theme.starterSlides.map((slide) => ({ ...slide }));
}
