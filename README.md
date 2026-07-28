# MockUpGo

MockUpGo is a browser-based app screenshot mockup tool focused on creating premium-looking App Store and Play Store visuals without relying on expensive design subscriptions or server-heavy rendering.

The current version is a frontend MVP that lets a user:

- choose from curated visual templates
- upload an app screenshot
- edit headline, eyebrow, description, and badge text
- adjust phone finish, screenshot fit, angle, and scale
- preview the composition live in the browser
- export the final mockup as a PNG

## Product Direction

MockUpGo is designed as a lightweight alternative to tools like Placeit, Rotato, and other app mockup generators. The product goal is to help users create polished store assets quickly using reusable templates instead of designing every scene from scratch.

The long-term direction includes:

- richer template libraries
- multi-slide screenshot sets
- animated video exports
- 3D phone scenes and more advanced device compositions
- browser-first rendering to keep hosting costs low

## Current MVP Scope

Implemented in the current build:

- preset-based mockup scenes
- live editing sidebar
- image upload into a phone frame
- live preview poster
- PNG export with `html-to-image`
- feature-based frontend structure

Not implemented yet:

- multiple device types
- drag-and-drop text positioning
- multi-screen carousel generation
- account system
- billing
- backend persistence
- 3D device rendering with React Three Fiber
- video export

## Tech Stack

- `React 19`
- `TypeScript`
- `Vite`
- `CSS Modules`
- `html-to-image`

## Running Locally

### Prerequisites

- `Node.js 24+`
- `npm 11+`

### Install

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## Project Structure

```text
src/
  app/
    App.tsx
    styles/
      global.css
  features/
    mockup-tool/
      components/
      data/
      pages/
      utils/
      types.ts
  main.tsx
  vite-env.d.ts
```

### Structure Notes

- `app/` contains the app shell and global styling.
- `features/mockup-tool/` contains all tool-specific UI, template data, types, and export logic.
- `components/` holds composable UI pieces for the editor and preview.
- `data/` holds the current template definitions.
- `utils/` contains export helpers and logic that should stay outside components.

## Main User Flow

1. User opens the mockup editor.
2. User selects a scene template.
3. User uploads an app screenshot.
4. User edits text content and visual controls.
5. User previews the layout in real time.
6. User exports the mockup as a PNG.

## Core Files

- [src/app/App.tsx](./src/app/App.tsx)
- [src/features/mockup-tool/pages/MockupToolPage.tsx](./src/features/mockup-tool/pages/MockupToolPage.tsx)
- [src/features/mockup-tool/components/EditorSidebar.tsx](./src/features/mockup-tool/components/EditorSidebar.tsx)
- [src/features/mockup-tool/components/PreviewStage.tsx](./src/features/mockup-tool/components/PreviewStage.tsx)
- [src/features/mockup-tool/components/PhoneMockup.tsx](./src/features/mockup-tool/components/PhoneMockup.tsx)
- [src/features/mockup-tool/data/mockup-templates.ts](./src/features/mockup-tool/data/mockup-templates.ts)
- [src/features/mockup-tool/utils/export-mockup.ts](./src/features/mockup-tool/utils/export-mockup.ts)

## Documentation

Additional documentation is available in [`docs/`](./docs):

- [Product Requirements](./docs/PRODUCT_REQUIREMENTS.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [Roadmap](./docs/ROADMAP.md)

## Deployment Direction

The intended hosting model is:

- frontend hosted on `Vercel`
- rendering handled in the browser for the MVP
- no required backend for the current version

This approach keeps the initial hosting model simple and low-cost while still allowing future expansion into server-side rendering or advanced export pipelines if needed.
