# MockUpGo

MockUpGo is a browser-based, high-fidelity app screenshot mockup generator designed to create premium-looking App Store and Play Store marketing assets. It runs entirely in the browser, providing high performance, live drag-and-drop customization, dynamic animations, and multiple export formats.

---

## 🚀 Key Features Implemented

### 1. Premium Visual Redesign & Design System
- **Dark Premium Aesthetic**: Features a cohesive, state-of-the-art dark-mode interface (`#07090f` background) utilizing CSS glassmorphism, radial glow spheres, harmonized accent borders, and glowing active states.
- **Custom Branding**: Fully integrated the custom branding logo (`public/logo.png`) across the homepage and editor workspace topbars.
- **15 Premium Themes**: Included hand-crafted preset layouts (e.g., *Midnight Aurora*, *Solar Flare*, *Neon City*, *Rose Luxe*, *Cobalt Storm*, *Emerald Depth*, *Sakura*, *Mono Edge*, *Arctic Slate*) with predefined gradient overlays, phone scales, tilt angles, and suggested typography.
- **10 Google Fonts**: Visual typography picker loaded directly in the visual styles panel preloading fonts (Inter, Outfit, Space Grotesk, DM Sans, Syne, Plus Jakarta Sans, Manrope, Playfair Display, Poppins, Sora).

### 2. Multi-Slide Workspace & Management
- **Slide Addition & Removal**: Support for adding and managing up to 10 mockup slides simultaneously.
- **Batch Upload**: Drop or select multiple screenshots at once to populate successive slides automatically.

### 3. Drag-to-Position Canvas Editor
- Clicking on any slide opens the **Canvas Mode**.
- **Interactive Dragging**: Mouse/pointer actions allow users to drag the text block (badge, headline, and subtext) and the phone frame independently across the canvas.
- **Visual Drag Handles**: On-hover drag headers display current handle zones. Drag controls are automatically excluded from the final exports.
- **Position Reset**: Restore original template layouts with a single click.

### 4. Animated Slide Preview & Video Exporter
- **Cinematic Previews**: Plays back your slide deck inside an animated viewer with coordinated entry transitions (slides roll in, header texts rise up, and device frames pop into view).
- **Video Generator**: Synthesizes and captures high-definition slide playback with **Ken Burns zoom animations** and **crossfade transitions**.
- **Local Download**: Packages the motion design as a WebM (or MP4 fallback) video file directly from the browser.

### 5. Multi-Format High-Res Exports
- **Strip Export**: Export the entire carousel merged side-by-side as a single wide PNG.
- **Single Slide PNG**: Download individual slides in high-resolution (3× density) directly from the Canvas Editor.
- **ZIP Package Exporter**: Built a ZIP bundling pipeline using `jszip` that renders all slides, compresses them, and downloads them in one organized `.zip` file archive.

---

## 🛠 Tech Stack

- **React 19**
- **TypeScript**
- **Vite**
- **JSZip** (Zip packaging)
- **html-to-image** (High-res canvas snapshots)
- **CSS Modules & Variables** (Dynamic theme tokens)

---

## 🏃 Running Locally

### Prerequisites
- `Node.js 24+`
- `npm 11+`

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

---

## 📂 Project Structure

```text
src/
  app/
    App.tsx
    styles/
      global.css       # Design tokens & color system
  features/
    home/              # Landing page component module
    mockup-tool/
      components/
        AnimatedPreview.tsx # Motion simulation & video recorder
        CanvasEditor.tsx    # Drag-and-drop workspace panel
        InspectorPanel.tsx  # Control properties bar
        PhoneMockup.tsx     # Device frame wraps
        PreviewStage.tsx    # Overview dashboard
      data/
        fonts.ts            # Typeface configurations
        mockup-templates.ts # Theme preset profiles
      utils/
        export-mockup.ts    # Snapshots, Zip, and image builders
      types.ts
  main.tsx
```
