# Product Requirements

## Product Name

MockUpGo

## Product Summary

MockUpGo is a browser-based tool for generating premium app marketing mockups for App Store and Play Store screenshots. The primary product value is not just placing screenshots into a phone frame, but creating polished scene-based compositions that feel like real product marketing assets.

## Problem Statement

Many existing screenshot and mockup tools are expensive, subscription-heavy, or difficult to access in price-sensitive markets. Users often need:

- fast screenshot generation
- reusable templates
- attractive backgrounds
- premium visual quality
- lightweight export workflows

The biggest design challenge is usually not the phone frame itself. It is the environment around it:

- background quality
- composition
- lighting
- copy layout
- shadow and scene balance

MockUpGo solves this by treating each mockup as a reusable scene template instead of a one-off graphic.

## Target Users

Primary users:

- indie app developers
- startup founders
- agencies producing store assets
- designers making fast promotional visuals

Secondary users:

- marketers creating campaign graphics
- teams making product showcase slides
- creators who need quick mobile app presentation assets

## Product Goals

- make premium app mockups accessible in the browser
- reduce dependence on expensive third-party design tools
- create a reusable template system for mockup generation
- support both static screenshot exports and future motion exports
- keep the MVP client-side and inexpensive to host

## Non-Goals for the MVP

- full Canva-style freeform design editing
- user accounts and collaborative workspaces
- payments and subscriptions
- backend rendering pipelines
- advanced 3D motion rendering
- AI background generation inside the product

## Core Product Principles

- template-first, not blank-canvas-first
- premium-feel output over maximum design freedom
- browser-first rendering to control infrastructure cost
- modular architecture so future features do not require a rewrite

## MVP Functional Requirements

### 1. Template Selection

The system must allow the user to choose from predefined scene templates.

Each template should define:

- background style
- accent color
- copy layout
- phone position/orientation
- decorative shapes or atmosphere

### 2. Screenshot Upload

The system must allow the user to upload an image file and place it inside the phone frame.

Supported behavior:

- accept common image files
- show uploaded screenshot in the live preview
- allow replacing or removing the uploaded screenshot

### 3. Editable Copy

The user must be able to edit:

- eyebrow text
- headline
- description
- badge/label text

The preview must update immediately after edits.

### 4. Device Presentation Controls

The user must be able to control:

- device finish
- screenshot fit mode
- device tilt
- device scale

### 5. Live Preview

The system must render a live poster-style preview that updates in the browser without a page refresh.

### 6. PNG Export

The system must export the preview as a PNG image locally in the browser.

### 7. Feature-Based Code Organization

The project must maintain a feature-based structure so future additions remain maintainable.

## MVP Non-Functional Requirements

### Performance

- preview updates should feel immediate
- the app should run fully in the browser
- exporting should not require backend infrastructure

### Maintainability

- logic should be grouped by feature
- template data should be centralized
- reusable UI should be separated from page-level orchestration

### Responsiveness

- the editor must work on both desktop and smaller screens
- the preview should remain visible and usable across viewport sizes

### Cost Efficiency

- the MVP should be hostable as a frontend-only deployment
- no server rendering should be required for static image export

## Current MVP Status

Currently implemented:

- template selection
- screenshot upload
- editable copy
- frame controls
- live preview
- PNG export

Still planned:

- multiple device families
- saved templates
- multi-slide export
- richer asset libraries
- motion export
- 3D scenes

## Product Architecture Direction

Short-term:

- React frontend
- static hosting
- browser-based export
- JSON-style template definitions

Long-term:

- React Three Fiber for advanced device scenes
- motion/video export
- optional backend services for accounts, storage, or rendering jobs

## Success Criteria for the MVP

The MVP is successful if a user can:

1. open the app
2. upload a screenshot
3. choose a visual template
4. edit text and device settings
5. export a premium-looking mockup without needing design software

## Future Requirement Themes

Future features should build on the same template-first philosophy:

- multi-screen storytelling
- category-based template browsing
- App Store and Play Store dimension presets
- reusable brand kits
- animated exports
- more realistic 3D or hybrid-scene compositions
