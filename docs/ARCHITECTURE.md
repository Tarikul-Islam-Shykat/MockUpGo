# Architecture

## Overview

MockUpGo is currently a frontend-only React application organized around a single product feature: the mockup tool.

The architecture is intentionally simple:

- one main page for the editor
- one stateful feature container
- reusable editor and preview components
- centralized template definitions
- browser-side export utility

This structure supports fast MVP development while leaving room for future growth.

## Stack

- `React 19`
- `TypeScript`
- `Vite`
- `CSS Modules`
- `html-to-image`

## High-Level Flow

1. `App.tsx` renders the mockup tool page.
2. `MockupToolPage.tsx` owns the editing state.
3. The sidebar updates the current draft state.
4. The preview stage reads that state and renders the poster.
5. The phone component renders the uploaded screenshot inside the device shell.
6. The export utility captures the preview node and downloads a PNG.

## Folder Structure

```text
src/
  app/
    App.tsx
    styles/global.css
  features/
    mockup-tool/
      components/
        EditorSidebar.tsx
        PhoneMockup.tsx
        PreviewStage.tsx
        TemplateRail.tsx
      data/
        mockup-templates.ts
      pages/
        MockupToolPage.tsx
      utils/
        export-mockup.ts
      types.ts
  main.tsx
```

## Architectural Responsibilities

### `src/app`

Purpose:

- app-level shell
- global styles
- top-level composition

### `src/features/mockup-tool/pages/MockupToolPage.tsx`

Purpose:

- coordinates the mockup tool
- stores user-editable state
- handles template switching
- manages uploaded screenshot object URLs
- triggers export flow

This is the main stateful controller for the current product.

### `src/features/mockup-tool/components/EditorSidebar.tsx`

Purpose:

- renders editing controls
- forwards user interactions back to the page controller

Control groups include:

- template selection
- screenshot upload
- text editing
- frame controls
- export and reset actions

### `src/features/mockup-tool/components/PreviewStage.tsx`

Purpose:

- renders the main poster composition
- applies template layout and visual styling
- positions content and device preview

This component is the central visual composition layer.

### `src/features/mockup-tool/components/PhoneMockup.tsx`

Purpose:

- renders the device shell
- displays the uploaded screenshot inside the screen area
- supports finish, tilt, and scale variations

### `src/features/mockup-tool/components/TemplateRail.tsx`

Purpose:

- lists available templates
- handles template switching through a compact UI

### `src/features/mockup-tool/data/mockup-templates.ts`

Purpose:

- stores reusable template definitions
- acts as the seed for editor defaults

Each template contains:

- scene identity
- copy defaults
- colors and background gradients
- layout style
- phone defaults
- decorative elements

### `src/features/mockup-tool/utils/export-mockup.ts`

Purpose:

- converts the preview node into a PNG using `html-to-image`
- creates a filename from the draft title
- triggers the browser download

## State Model

The current state model is simple and local to the page.

### Draft State

The draft stores:

- selected template id
- copy fields
- device finish
- screenshot fit
- phone tilt
- phone scale

### Screenshot State

The screenshot is stored as:

- `screenshotUrl`
- `screenshotName`

An object URL is created with `URL.createObjectURL(file)` and revoked when replaced or on unmount.

## Data Model

The core types are defined in [`src/features/mockup-tool/types.ts`](../src/features/mockup-tool/types.ts).

Main types:

- `MockupTemplate`
- `EditorDraft`
- `DeviceFinish`
- `ScreenshotFit`
- `StageLayout`

This helps keep the template system explicit and scalable.

## Rendering Approach

The current renderer is DOM- and CSS-based rather than 3D.

Why this approach was chosen for the MVP:

- quick to ship
- easy to edit
- easy to export
- no backend required
- lower complexity than immediate Three.js integration

This is a deliberate first step, not the final rendering model.

## Export Approach

Current export is fully client-side.

Implementation:

- the preview poster is referenced with `previewRef`
- `html-to-image` converts the node into a PNG data URL
- a temporary anchor triggers the download

Advantages:

- no server cost
- fast for MVP
- easy Vercel deployment

Tradeoffs:

- limited compared to video or advanced high-resolution render pipelines
- DOM-based output instead of physically rendered 3D scenes

## Future Architectural Expansion

### Near-Term

- add multiple screenshots per project
- add dimension presets
- add reusable brand settings
- add richer template grouping

### Mid-Term

- introduce local project persistence
- add template metadata and categorization
- add export presets for App Store and Play Store

### Long-Term

- integrate `React Three Fiber`
- support animated exports
- support hybrid 2D + 3D scene templates
- optionally add backend services for rendering jobs or saved user work

## Why This Structure Works

This architecture supports the product direction because it:

- keeps the current implementation simple
- keeps mockup logic grouped in one feature
- makes template definitions easy to expand
- leaves room for future rendering upgrades
- avoids early backend or infrastructure complexity
