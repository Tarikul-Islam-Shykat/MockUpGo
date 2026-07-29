import type { EditorDraft, FontOption, MockupTheme, SlideDraft } from "@/features/mockup-tool/types";

function makeSlides(
  values: Array<[string, string, string]>,
): SlideDraft[] {
  return values.map(([title, subtitle, badge], index) => ({
    id: `slide-${index + 1}`,
    title,
    subtitle,
    badge,
    framePreset: "svg-classic",
    extraTextBlocks: [],
    imageBlocks: [],
    textOffsetX: 0,
    textOffsetY: 0,
    phoneOffsetX: 0,
    phoneOffsetY: 0,
  }));
}

export const mockupThemes: MockupTheme[] = [
  /* ─── 1. Violet Burst ──────────────────────────────────────────── */
  {
    id: "violet-burst",
    name: "Violet Burst",
    summary: "Bright learning app style",
    suggestedFont: "space-grotesk",
    canvasTone: "#0d0e1a",
    canvasGrid: "linear-gradient(180deg, rgba(126,88,255,0.06), rgba(126,88,255,0.02))",
    slideBackground: "linear-gradient(180deg, #eee9ff 0%, #e9e2ff 100%)",
    slideText: "#2b2460",
    slideMuted: "rgba(43,36,96,0.72)",
    accent: "#7356ff",
    overlay: "radial-gradient(circle at 80% 14%, rgba(118,86,255,0.18), transparent 18%)",
    phoneTilt: -2,
    phoneScale: 94,
    decorations: [
      { size: 240, color: "rgba(115,86,255,0.15)", blur: 0,  opacity: 1, top: "52px",   right: "-60px" },
      { size: 180, color: "rgba(255,255,255,0.42)", blur: 6, opacity: 1, bottom: "120px", left: "-40px" },
    ],
    starterSlides: makeSlides([
      ["Learn languages in minutes",     "Quick daily lessons for busy people",       "App Screens"],
      ["Track progress with rewards",    "Earn streaks and celebrate milestones",      "App Screens"],
      ["Practice for free every day",    "Short sessions that build momentum",         "App Screens"],
      ["Challenge yourself in game mode","Friendly difficulty curves keep it fun",     "App Screens"],
      ["Build confident speaking habits","Daily repetition made lightweight",          "App Screens"],
    ]),
  },

  /* ─── 2. Charcoal Store ────────────────────────────────────────── */
  {
    id: "charcoal-store",
    name: "Charcoal Store",
    summary: "Clean dark store layout",
    suggestedFont: "manrope",
    canvasTone: "#08090d",
    canvasGrid: "linear-gradient(180deg, rgba(15,23,42,0.05), rgba(15,23,42,0.02))",
    slideBackground: "#23272e",
    slideText: "#f7f8fb",
    slideMuted: "rgba(247,248,251,0.72)",
    accent: "#ffffff",
    overlay: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
    phoneTilt: 0,
    phoneScale: 96,
    decorations: [
      { size: 180, color: "rgba(255,255,255,0.08)", blur: 0, opacity: 1, top: "24px",    left: "24px" },
      { size: 220, color: "rgba(255,255,255,0.04)", blur: 0, opacity: 1, bottom: "-60px", right: "-40px" },
    ],
    starterSlides: makeSlides([
      ["Send and spend money worldwide",        "Instant accounts and global transfers",               "Feature"],
      ["Manage rewards in one place",           "Cards, perks, and cashback from one dashboard",       "Feature"],
      ["Keep team spending stress-free",        "Approve and monitor cards with clarity",              "Feature"],
      ["Track account details faster",          "Move between currencies and recipients smoothly",     "Feature"],
      ["Run business banking without clutter",  "Everything organized inside one clean flow",          "Feature"],
    ]),
  },

  /* ─── 3. Sherbet Mint ──────────────────────────────────────────── */
  {
    id: "sherbet-mint",
    name: "Sherbet Mint",
    summary: "Soft playful vertical set",
    suggestedFont: "plus-jakarta",
    canvasTone: "#0b0e12",
    canvasGrid: "linear-gradient(180deg, rgba(53,208,172,0.05), rgba(53,208,172,0.02))",
    slideBackground: "linear-gradient(180deg, #fff6ee 0%, #fff0f7 100%)",
    slideText: "#30264f",
    slideMuted: "rgba(48,38,79,0.7)",
    accent: "#34c8b0",
    overlay: "radial-gradient(circle at 16% 74%, rgba(52,200,176,0.12), transparent 22%)",
    phoneTilt: -4,
    phoneScale: 93,
    decorations: [
      { size: 300, color: "rgba(52,200,176,0.08)",  blur: 14, opacity: 1, top: "40px",    left: "-120px" },
      { size: 220, color: "rgba(255,163,184,0.12)", blur: 18, opacity: 1, bottom: "60px", right: "-40px" },
    ],
    starterSlides: makeSlides([
      ["Build better routines",        "Gentle nudges that help habits stick",         "Story"],
      ["Keep goals visible",           "Daily tasks, streaks, and focus moments",      "Story"],
      ["Celebrate small wins",         "Reward loops that feel encouraging",           "Story"],
      ["Review your progress weekly",  "See trends without opening a spreadsheet",     "Story"],
      ["Stay calm, stay consistent",   "A softer visual tone for wellness products",   "Story"],
    ]),
  },

  /* ─── 4. Midnight Aurora ───────────────────────────────────────── */
  {
    id: "midnight-aurora",
    name: "Midnight Aurora",
    summary: "Dark with aurora glow",
    suggestedFont: "syne",
    canvasTone: "#050810",
    canvasGrid: "radial-gradient(ellipse at 50% 0%, rgba(0,200,180,0.04), transparent 60%)",
    slideBackground: "linear-gradient(160deg, #0d1b2a 0%, #1a0a2e 50%, #051a18 100%)",
    slideText: "#e0f8ff",
    slideMuted: "rgba(180,240,255,0.6)",
    accent: "#00d9ff",
    overlay: "radial-gradient(circle at 20% 20%, rgba(0,217,255,0.12), transparent 40%), radial-gradient(circle at 80% 80%, rgba(140,80,255,0.1), transparent 40%)",
    phoneTilt: 2,
    phoneScale: 95,
    decorations: [
      { size: 320, color: "rgba(0,217,255,0.08)",  blur: 60, opacity: 1, top: "-80px",   left: "-80px" },
      { size: 260, color: "rgba(140,80,255,0.1)",  blur: 50, opacity: 1, bottom: "-40px", right: "-60px" },
      { size: 180, color: "rgba(0,200,160,0.06)",  blur: 30, opacity: 1, top: "50%",     left: "60%" },
    ],
    starterSlides: makeSlides([
      ["Experience the future",          "Seamlessly powerful — designed for what's next", "Premium"],
      ["Always one step ahead",          "Intelligent tools that learn your workflow",      "Premium"],
      ["Performance redefined",          "Built for speed, precision, and reliability",     "Premium"],
      ["Your data, your control",        "End-to-end encrypted and always private",         "Premium"],
      ["Join the next generation",       "Thousands already making the switch",             "Premium"],
    ]),
  },

  /* ─── 5. Solar Flare ───────────────────────────────────────────── */
  {
    id: "solar-flare",
    name: "Solar Flare",
    summary: "Fiery dark energy theme",
    suggestedFont: "outfit",
    canvasTone: "#080500",
    canvasGrid: "radial-gradient(ellipse at 50% 100%, rgba(255,100,0,0.05), transparent 60%)",
    slideBackground: "linear-gradient(180deg, #120700 0%, #1f0e00 50%, #2d1200 100%)",
    slideText: "#fff0d0",
    slideMuted: "rgba(255,240,200,0.6)",
    accent: "#ff6b35",
    overlay: "radial-gradient(circle at 70% 15%, rgba(255,120,0,0.2), transparent 35%), radial-gradient(circle at 30% 85%, rgba(255,60,0,0.1), transparent 30%)",
    phoneTilt: 3,
    phoneScale: 97,
    decorations: [
      { size: 280, color: "rgba(255,100,20,0.12)", blur: 60, opacity: 1, top: "-60px",   right: "-40px" },
      { size: 200, color: "rgba(255,200,0,0.06)",  blur: 40, opacity: 1, bottom: "-30px", left: "-50px" },
    ],
    starterSlides: makeSlides([
      ["Fuel your training",          "High-intensity workouts built for winners",       "Fitness"],
      ["Track every rep",             "Smart logging that adapts to your goals",          "Fitness"],
      ["Push your limits daily",      "Personalized challenges that keep you going",      "Fitness"],
      ["Recover smarter",             "Rest cycles optimized for peak performance",       "Fitness"],
      ["Community of champions",      "Train alongside thousands of athletes worldwide",  "Fitness"],
    ]),
  },

  /* ─── 6. Neon City ─────────────────────────────────────────────── */
  {
    id: "neon-city",
    name: "Neon City",
    summary: "Electric dark gaming theme",
    suggestedFont: "syne",
    canvasTone: "#040508",
    canvasGrid: "repeating-linear-gradient(0deg, rgba(0,255,136,0.02) 0px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, rgba(0,255,136,0.02) 0px, transparent 1px, transparent 40px)",
    slideBackground: "linear-gradient(180deg, #060812 0%, #080a16 100%)",
    slideText: "#b8ffe8",
    slideMuted: "rgba(180,255,220,0.55)",
    accent: "#00ff87",
    overlay: "radial-gradient(circle at 80% 20%, rgba(0,255,135,0.12), transparent 30%), radial-gradient(circle at 20% 80%, rgba(0,180,255,0.08), transparent 30%)",
    phoneTilt: -3,
    phoneScale: 96,
    decorations: [
      { size: 200, color: "rgba(0,255,135,0.1)",  blur: 50, opacity: 1, top: "30px",     right: "-30px" },
      { size: 160, color: "rgba(0,160,255,0.08)", blur: 40, opacity: 1, bottom: "80px",  left: "-40px" },
    ],
    starterSlides: makeSlides([
      ["Level up your gameplay",     "AI coaching that adapts to every match",          "Gaming"],
      ["Compete in real-time",       "Lag-free matchmaking across all regions",         "Gaming"],
      ["Unlock exclusive rewards",   "Daily drops and seasonal ranked prizes",          "Gaming"],
      ["Track your stats live",      "Kill/death, wins, and rank — all in one dash",   "Gaming"],
      ["Built for the serious gamer","No casual mode — just pure performance",          "Gaming"],
    ]),
  },

  /* ─── 7. Rose Luxe ─────────────────────────────────────────────── */
  {
    id: "rose-luxe",
    name: "Rose Luxe",
    summary: "Dark mauve & gold glamour",
    suggestedFont: "playfair",
    canvasTone: "#080409",
    canvasGrid: "radial-gradient(ellipse at 50% 0%, rgba(220,60,120,0.04), transparent 60%)",
    slideBackground: "linear-gradient(160deg, #16050e 0%, #0f000f 50%, #1a0815 100%)",
    slideText: "#ffe8f4",
    slideMuted: "rgba(255,200,230,0.6)",
    accent: "#ff69b4",
    overlay: "radial-gradient(circle at 75% 10%, rgba(255,105,180,0.18), transparent 30%), radial-gradient(circle at 25% 90%, rgba(200,120,255,0.08), transparent 30%)",
    phoneTilt: -1,
    phoneScale: 95,
    decorations: [
      { size: 260, color: "rgba(255,100,180,0.1)", blur: 60, opacity: 1, top: "-50px",   right: "-50px" },
      { size: 200, color: "rgba(200,100,255,0.06)", blur: 50, opacity: 1, bottom: "-40px", left: "-40px" },
      { size: 120, color: "rgba(255,200,50,0.06)",  blur: 20, opacity: 1, top: "40%",    left: "60%" },
    ],
    starterSlides: makeSlides([
      ["Beauty, reimagined",         "Curated skincare routines for every skin type",  "Beauty"],
      ["Your daily ritual",          "Guided morning and evening care flows",           "Beauty"],
      ["Glow from within",           "Track hydration, sleep, and skin health daily",   "Beauty"],
      ["Premium ingredients only",   "Formulas backed by dermatologists worldwide",     "Beauty"],
      ["The luxury you deserve",     "Free delivery on all orders over $50",            "Beauty"],
    ]),
  },

  /* ─── 8. Cobalt Storm ──────────────────────────────────────────── */
  {
    id: "cobalt-storm",
    name: "Cobalt Storm",
    summary: "Electric navy blue SaaS",
    suggestedFont: "manrope",
    canvasTone: "#040810",
    canvasGrid: "radial-gradient(ellipse at 50% 0%, rgba(40,100,255,0.05), transparent 60%)",
    slideBackground: "linear-gradient(180deg, #02091a 0%, #040e2e 50%, #050a20 100%)",
    slideText: "#ddeeff",
    slideMuted: "rgba(180,210,255,0.6)",
    accent: "#4d9fff",
    overlay: "radial-gradient(circle at 80% 15%, rgba(77,159,255,0.18), transparent 35%), radial-gradient(circle at 20% 85%, rgba(40,80,255,0.1), transparent 30%)",
    phoneTilt: 1,
    phoneScale: 97,
    decorations: [
      { size: 300, color: "rgba(77,159,255,0.08)", blur: 70, opacity: 1, top: "-70px",   right: "-70px" },
      { size: 220, color: "rgba(40,80,255,0.06)",  blur: 50, opacity: 1, bottom: "-50px", left: "-60px" },
    ],
    starterSlides: makeSlides([
      ["Automate your workflow",     "No-code integrations for 200+ tools",            "SaaS"],
      ["Ship faster as a team",      "Built-in reviews, approvals, and deployment",    "SaaS"],
      ["Analytics in real-time",     "Monitor performance without leaving the app",    "SaaS"],
      ["Scale without limits",       "Infrastructure that grows with your product",    "SaaS"],
      ["Secure by default",          "SOC 2 compliant, end-to-end encrypted",         "SaaS"],
    ]),
  },

  /* ─── 9. Emerald Depth ─────────────────────────────────────────── */
  {
    id: "emerald-depth",
    name: "Emerald Depth",
    summary: "Dark forest green luxury",
    suggestedFont: "dm-sans",
    canvasTone: "#030c07",
    canvasGrid: "radial-gradient(ellipse at 50% 100%, rgba(0,180,80,0.04), transparent 60%)",
    slideBackground: "linear-gradient(180deg, #041208 0%, #0a1f10 60%, #061510 100%)",
    slideText: "#d4ffe0",
    slideMuted: "rgba(180,255,200,0.6)",
    accent: "#00c967",
    overlay: "radial-gradient(circle at 20% 20%, rgba(0,201,103,0.15), transparent 35%), radial-gradient(circle at 80% 80%, rgba(0,140,60,0.08), transparent 30%)",
    phoneTilt: -2,
    phoneScale: 94,
    decorations: [
      { size: 280, color: "rgba(0,200,100,0.08)", blur: 60, opacity: 1, top: "-40px",   left: "-60px" },
      { size: 200, color: "rgba(0,140,60,0.06)",  blur: 40, opacity: 1, bottom: "-50px", right: "-40px" },
    ],
    starterSlides: makeSlides([
      ["Invest with confidence",     "Diversified portfolios built for long-term growth", "Finance"],
      ["Track your net worth",       "Real-time sync across all your accounts",           "Finance"],
      ["Smart spending insights",    "See where your money goes before it's gone",        "Finance"],
      ["Goals that actually stick",  "Set targets, get alerts, celebrate wins",           "Finance"],
      ["Retire earlier",             "Compound interest calculators and planning tools",  "Finance"],
    ]),
  },

  /* ─── 10. Crimson Night ────────────────────────────────────────── */
  {
    id: "crimson-night",
    name: "Crimson Night",
    summary: "Deep dark red entertainment",
    suggestedFont: "syne",
    canvasTone: "#080203",
    canvasGrid: "radial-gradient(ellipse at 50% 0%, rgba(180,0,40,0.04), transparent 60%)",
    slideBackground: "linear-gradient(180deg, #140306 0%, #1f000d 50%, #180008 100%)",
    slideText: "#ffe8ec",
    slideMuted: "rgba(255,180,190,0.6)",
    accent: "#ff2255",
    overlay: "radial-gradient(circle at 75% 10%, rgba(255,34,85,0.18), transparent 35%), radial-gradient(circle at 25% 85%, rgba(200,0,60,0.08), transparent 30%)",
    phoneTilt: 0,
    phoneScale: 96,
    decorations: [
      { size: 260, color: "rgba(255,30,80,0.1)",  blur: 60, opacity: 1, top: "-50px",   right: "-50px" },
      { size: 200, color: "rgba(180,0,50,0.07)",  blur: 40, opacity: 1, bottom: "-40px", left: "-50px" },
    ],
    starterSlides: makeSlides([
      ["Stream without limits",      "4K content, zero buffering, every device",      "Streaming"],
      ["New drops every Friday",     "Originals you won't find anywhere else",         "Streaming"],
      ["Offline, always ready",      "Download and watch on the go",                   "Streaming"],
      ["Watch together, apart",      "Synchronized viewing with friends worldwide",    "Streaming"],
      ["Cancel anytime",             "No contracts. No hidden fees. Pure freedom.",    "Streaming"],
    ]),
  },

  /* ─── 11. Golden Hour ──────────────────────────────────────────── */
  {
    id: "golden-hour",
    name: "Golden Hour",
    summary: "Warm amber dark elegance",
    suggestedFont: "playfair",
    canvasTone: "#080500",
    canvasGrid: "radial-gradient(ellipse at 50% 100%, rgba(220,150,0,0.04), transparent 60%)",
    slideBackground: "linear-gradient(180deg, #13090000 0%, #1a1000 40%, #251600 100%)",
    slideText: "#fff8e0",
    slideMuted: "rgba(255,235,160,0.6)",
    accent: "#f5a623",
    overlay: "radial-gradient(circle at 60% 10%, rgba(245,166,35,0.2), transparent 40%), radial-gradient(circle at 30% 90%, rgba(200,100,0,0.08), transparent 30%)",
    phoneTilt: 2,
    phoneScale: 95,
    decorations: [
      { size: 280, color: "rgba(245,166,35,0.1)", blur: 60, opacity: 1, top: "-60px",   right: "-40px" },
      { size: 200, color: "rgba(200,80,0,0.06)",  blur: 40, opacity: 1, bottom: "-40px", left: "-60px" },
    ],
    starterSlides: makeSlides([
      ["Discover hidden restaurants", "Curated local gems with real reviews",          "Food"],
      ["Reserve in seconds",         "One tap to book — no waitlists",                 "Food"],
      ["Order, track, enjoy",        "Live delivery tracking down to the minute",      "Food"],
      ["Loyalty rewards that matter","Earn on every order. Redeem anywhere.",           "Food"],
      ["Taste the city",             "500+ restaurants. Unlimited cravings.",           "Food"],
    ]),
  },

  /* ─── 12. Deep Space ───────────────────────────────────────────── */
  {
    id: "deep-space",
    name: "Deep Space",
    summary: "Cosmic purple tech theme",
    suggestedFont: "poppins",
    canvasTone: "#040208",
    canvasGrid: "radial-gradient(circle at 50% 50%, rgba(100,60,220,0.03) 1px, transparent 1px) 0 0 / 28px 28px",
    slideBackground: "linear-gradient(180deg, #07000f 0%, #0a0020 50%, #050010 100%)",
    slideText: "#e0d4ff",
    slideMuted: "rgba(200,180,255,0.55)",
    accent: "#9d71ff",
    overlay: "radial-gradient(circle at 70% 15%, rgba(157,113,255,0.2), transparent 35%), radial-gradient(circle at 30% 80%, rgba(80,40,200,0.1), transparent 30%)",
    phoneTilt: -2,
    phoneScale: 94,
    decorations: [
      { size: 300, color: "rgba(157,113,255,0.1)", blur: 70, opacity: 1, top: "-80px",   right: "-60px" },
      { size: 220, color: "rgba(80,40,200,0.07)",  blur: 50, opacity: 1, bottom: "-60px", left: "-50px" },
      { size: 120, color: "rgba(200,160,255,0.08)", blur: 30, opacity: 1, top: "50%",    right: "30%" },
    ],
    starterSlides: makeSlides([
      ["Meet your AI assistant",     "Understands context, delivers results",           "AI"],
      ["Generate in seconds",        "Text, images, code — one unified interface",      "AI"],
      ["Train on your data",         "Private models that know your business",          "AI"],
      ["Collaborate with AI",        "Real-time suggestions across every workflow",     "AI"],
      ["The future is already here", "Join 100,000+ teams building with AI",           "AI"],
    ]),
  },

  /* ─── 13. Sakura ───────────────────────────────────────────────── */
  {
    id: "sakura",
    name: "Sakura",
    summary: "Soft cherry blossom social",
    suggestedFont: "plus-jakarta",
    canvasTone: "#0e080c",
    canvasGrid: "radial-gradient(ellipse at 50% 0%, rgba(240,100,160,0.04), transparent 60%)",
    slideBackground: "linear-gradient(180deg, #fff0f8 0%, #ffe8f5 50%, #ffddf0 100%)",
    slideText: "#3d1a2e",
    slideMuted: "rgba(100,40,80,0.6)",
    accent: "#e8478f",
    overlay: "radial-gradient(circle at 85% 10%, rgba(255,100,180,0.1), transparent 25%)",
    phoneTilt: -3,
    phoneScale: 93,
    decorations: [
      { size: 280, color: "rgba(255,150,200,0.12)", blur: 40, opacity: 1, top: "-40px",   right: "-60px" },
      { size: 200, color: "rgba(255,200,230,0.15)", blur: 30, opacity: 1, bottom: "-30px", left: "-50px" },
    ],
    starterSlides: makeSlides([
      ["Connect with your people",   "Share moments with those who matter most",       "Social"],
      ["Stories that disappear",     "24-hour content built for the moment",           "Social"],
      ["Discover your community",    "Find your tribe through shared interests",        "Social"],
      ["Go live in one tap",         "Stream to your followers instantly",             "Social"],
      ["Privacy you can trust",      "Your data is yours. Always.",                    "Social"],
    ]),
  },

  /* ─── 14. Mono Edge ────────────────────────────────────────────── */
  {
    id: "mono-edge",
    name: "Mono Edge",
    summary: "Ultra minimal black & white",
    suggestedFont: "inter",
    canvasTone: "#080808",
    canvasGrid: "none",
    slideBackground: "#000000",
    slideText: "#ffffff",
    slideMuted: "rgba(255,255,255,0.55)",
    accent: "#ffffff",
    overlay: "none",
    phoneTilt: 0,
    phoneScale: 97,
    decorations: [
      { size: 300, color: "rgba(255,255,255,0.03)", blur: 0, opacity: 1, top: "0",   left: "0" },
    ],
    starterSlides: makeSlides([
      ["Less is more",               "Stripped back. Pure. Intentional.",              ""],
      ["Focus on what matters",      "Distraction-free design for clearer thinking",  ""],
      ["Built to last",              "Quality over quantity. Every. Single. Time.",    ""],
      ["Simplicity is the goal",     "One app. One purpose. Zero clutter.",           ""],
      ["The minimal choice",         "For people who want less noise, more signal.",   ""],
    ]),
  },

  /* ─── 15. Arctic Slate ─────────────────────────────────────────── */
  {
    id: "arctic-slate",
    name: "Arctic Slate",
    summary: "Cool dark productivity blue",
    suggestedFont: "outfit",
    canvasTone: "#060810",
    canvasGrid: "radial-gradient(ellipse at 50% 0%, rgba(80,140,255,0.04), transparent 60%)",
    slideBackground: "linear-gradient(180deg, #080f1e 0%, #0a1228 50%, #06101e 100%)",
    slideText: "#cddeff",
    slideMuted: "rgba(180,210,255,0.55)",
    accent: "#60b0ff",
    overlay: "radial-gradient(circle at 20% 15%, rgba(96,176,255,0.15), transparent 35%), radial-gradient(circle at 80% 85%, rgba(40,100,220,0.08), transparent 30%)",
    phoneTilt: 1,
    phoneScale: 95,
    decorations: [
      { size: 260, color: "rgba(96,176,255,0.08)",  blur: 60, opacity: 1, top: "-50px",   left: "-50px" },
      { size: 200, color: "rgba(40,100,220,0.06)",  blur: 40, opacity: 1, bottom: "-40px", right: "-40px" },
    ],
    starterSlides: makeSlides([
      ["Plan your week in 5 min",    "Smart scheduling that respects your energy",    "Productivity"],
      ["Deep work mode",             "Block distractions and enter flow state",        "Productivity"],
      ["Capture ideas instantly",    "Voice-to-text notes that organize themselves",  "Productivity"],
      ["Review and improve",         "Weekly retrospectives that actually help",       "Productivity"],
      ["Sync across every device",   "Start on desktop, finish on mobile",            "Productivity"],
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
    font: theme.suggestedFont,
  };
}

export function createSlidesFromTheme(theme: MockupTheme): SlideDraft[] {
  return theme.starterSlides.map((slide) => ({
    ...slide,
    extraTextBlocks: slide.extraTextBlocks.map((block) => ({ ...block })),
    imageBlocks: slide.imageBlocks.map((block) => ({ ...block })),
  }));
}

export function createBlankSlide(index: number): SlideDraft {
  return {
    id: `slide-${Date.now()}-${index}`,
    title: "New slide",
    subtitle: "Tap to add your screenshot and edit this text",
    badge: "Screen",
    framePreset: "svg-classic",
    extraTextBlocks: [],
    imageBlocks: [],
    textOffsetX: 0,
    textOffsetY: 0,
    phoneOffsetX: 0,
    phoneOffsetY: 0,
  };
}
