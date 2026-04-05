# AERO ITBA — Page Design Spec

## Overview

A dedicated `/aero` route for the AERO ITBA team — a group of ITBA mechanical engineering students competing in the AIAA Design-Build-Fly (DBF) competition in Wichita, Kansas, April 2026. Their aircraft uses a Blended Wing Body ("dorito") configuration that enables 2-3x passenger capacity over conventional designs.

This is not a standard informational page. It is an **interactive experience** — every section earns its screen time through scroll-driven animation, interaction, or surprise. The design philosophy: **the user never reads, they discover.**

## Tech Stack

- **Framework**: Next.js App Router (existing)
- **Animation Engine**: Framer Motion (`useScroll`, `useTransform`, `motion` components)
  - Replaces AOS for this page only — other pages keep AOS
- **Styling**: Tailwind CSS (existing) + dedicated `app/aero/aero.css` for custom keyframe animations (radar sweep, flag wave, globe rotation, shimmer, particle trail)
- **Icons**: lucide-react (existing)
- **No other new dependencies**

## CSS Isolation

- Custom animations and keyframes live in `app/aero/aero.css`, imported by `app/aero/page.tsx`
- The `/aero` route overrides `scroll-behavior: auto` on `html` to prevent the global `scroll-behavior: smooth` (from `globals.css`) from interfering with Framer Motion's scroll-mapped animations. Applied via a `useEffect` that sets and restores the style on mount/unmount.

## Route & Navigation

- **Route**: `/aero` — new directory `app/aero/page.tsx` with its own `layout.tsx`
- **Layout pattern**: Follows the existing codebase convention — `layout.tsx` is a **server component** that only exports metadata. `page.tsx` is `"use client"` and imports `<Navbar />` directly (same pattern as `app/page.tsx`).
- **Navbar**: Modify the existing `Navbar.tsx` to add an "AERO" link as the last nav item
  - Always gold (#e3a72f), not just on hover
  - Bold weight (font-weight: 700) + letter-spacing (1.5px)
  - Subtle glow via text-shadow: `0 0 12px rgba(227,167,47,0.4)`
  - Hover: intensified glow + `transform: scale(1.05)` (transform-only, no layout shift on adjacent items) + shimmer animation
  - Shimmer: a `@keyframes shimmer` that translates a semi-transparent gradient overlay left-to-right across the text on hover (similar to a skeleton loading shimmer but gold-tinted)
  - Lucide `Plane` icon next to text
  - Also added to mobile menu with same golden treatment
- **Layout**: Uses the main Navbar (same as homepage), not MecHubNavbar
- **SEO Metadata** (in `layout.tsx`):
  - Title: "AERO ITBA — Design Build Fly"
  - Description: "Equipo de estudiantes del ITBA compitiendo en la AIAA Design-Build-Fly en Wichita, Kansas 2026"
  - OpenGraph image: placeholder, to be replaced with real hero image

## Color Palette

- Background: `#0a0a1a` (deeper than main site's slate-900, more cinematic)
- Gold accent: `#e3a72f` (consistent with site)
- Blue accent: `#5f87ab` (consistent with site)
- Argentina celeste: `#74ACDF` (used in Section 6 only)
- Text: white, gray-400, gray-600

## Page Sections

### Section 1: Hero — Scroll-Mapped Video

Full-viewport sticky video where frames advance as the user scrolls.

**Structure:**
- Outer container: height `400vh` (enough scroll runway for smooth scrubbing)
- Inner video element: `position: sticky; top: 0; height: 100vh`
- Framer Motion `useScroll` tracks progress (0→1) through the outer container
- `useTransform` maps scroll progress to `video.currentTime` (0 → video.duration)

**Overlay content:**
- AERO ITBA logo (placeholder, later replaced with real logo from `/public`)
- Tagline: "Design · Build · Fly"
- Scroll indicator at bottom (animated mouse icon with "Scroll para explorar")
- Scroll progress bar on right edge (vertical segments showing section progress)

**Overlay behavior:**
- Logo + tagline visible at scroll 0%, fade out by ~20% scroll progress
- Additional text overlays can appear at keyframe scroll points (future enhancement)

**Mobile fallback:** Static hero image with autoplay muted video below. Scroll-mapping is desktop-only, detected via `window.matchMedia('(min-width: 768px)')` at runtime (JS-based, since the scroll-mapping involves JS hooks).

**Media:** Placeholder div with gradient background until real video is added to `/public`.

### Section 2: Quiénes Somos — Cinematic Text Reveal

Words appear one line at a time as the user scrolls. Typography as cinema.

**Structure:**
- Container height: `250vh`
- Sticky inner container centered on viewport
- Three text lines, each with its own scroll-triggered opacity and y-transform:
  1. `Somos ingenieros.` (gray → white on "ingenieros")
  2. `Somos estudiantes.` (gray → white on "estudiantes")
  3. `Somos pilotos de lo imposible.` (gray → gold on "pilotos de lo imposible")

**Animation:**
- Each line starts at `opacity: 0, y: 30px`, transitions to `opacity: 1, y: 0` at its scroll threshold
- Framer Motion `useScroll` with offset thresholds for each line
- After all three lines visible, a team group photo fades in behind with slow parallax drift (lower z-index, slight blur)
- Ambient background: two soft radial gradients (gold and blue) for depth

**No cards, no icons, no grids.** Just text and timing.

### Section 3: El Avión — Interactive Blueprint

The BWB aircraft showcase with scroll-triggered annotation lines on a blueprint grid.

**Structure:**
- Container height: `300vh`
- Sticky inner with blueprint grid background (CSS linear-gradient grid pattern, `#5f87ab` at 5% opacity)
- Center: plane image placeholder (triangular clip-path representing BWB silhouette)
- 3-4 annotation lines radiating from the plane to text labels

**Annotations (scroll-triggered):**
- "Sustentación distribuida" — left side
- "3x capacidad de carga" — right side
- "Blended Wing Body" — bottom
- Each annotation: dot → line → text, animated with Framer Motion `pathLength` (0→1) synced to scroll offset
- Annotation lines are SVG `<path>` elements with `pathLength="1"` attribute, absolutely positioned over the blueprint grid. The SVG overlay covers the full section viewport.

**Stats bar at bottom:**
- Three stat counters: "3x Capacidad", "BWB Configuración", "RC Control Remoto"
- Numbers animate (count up) when entering viewport using Framer Motion `useInView` + `animate`

**Plane image:** Subtle 2-3 degree rotation on scroll for "examining a model" feel.

**Future:** Replace static image/placeholder with Three.js / React Three Fiber 3D model.

### Section 4: La Competencia — Countdown & Mission Briefing

Mission-control aesthetic with live countdown and scramble-to-reveal text.

**Structure:**
- Standard viewport height (100vh), not scroll-extended
- Center-aligned content with radar sweep background

**Background:**
- Two concentric circle outlines (CSS borders, `#5f87ab` at low opacity)
- Radar sweep: CSS `conic-gradient` with `animation: rotate 4s linear infinite`

**Content:**
- Location: "Wichita, Kansas — USA" with pin icon
- Live countdown timer to competition date (April 2026)
  - Client-side `useEffect` with `setInterval` updating every second
  - Displays: days, hours, minutes, seconds
  - Font: tabular-nums for stable width
- Title: "AIAA Design-Build-Fly 2026"
- Subtitle: organizers and sponsors
- Two CTA buttons:
  - "Ver competencia →" — links to https://www.dbfuw.com/the-competition
  - "Reglamento" — links to AAIA DBF rules page

**Entry animation:** Numbers scramble (random digits cycling) for ~1 second before settling on real values. Triggered on `useInView`.

**Post-competition state:** After the competition date passes, the countdown switches to display "Competencia finalizada" with a static badge. The section remains as a historical record.

### Section 5: Progreso — Horizontal Scroll Timeline

Vertical scroll drives horizontal movement through a build progress timeline.

**Structure:**
- Container height: `300vh`
- Sticky inner with `overflow: hidden`
- Inner flex row of milestone cards, translated horizontally via `useTransform(scrollYProgress, [0,1], [0, -totalWidth])`
- `totalWidth` is measured dynamically via `useRef` on the flex container (`scrollWidth - clientWidth`), recalculated on window resize via a `ResizeObserver`

**Timeline:**
- Horizontal line through the middle, drawing itself as user scrolls (SVG line with animated `strokeDashoffset`)
- Milestone cards above/below the line, alternating

**Cards:**
- Each card: image/video thumbnail placeholder + date label + short description
- As a card passes through viewport center: scales up (1 → 1.05), gains full opacity, border brightens
- Video cards show a play icon overlay — click opens a `VideoLightbox.tsx` modal (custom component, no external dependency — a full-screen overlay with the video element and a close button)
- The flight video card ("VIDEAZO VOLANDO") gets VIP treatment: golden border, slightly larger, pulsing glow animation
- Future milestone (Wichita 2026): dashed border, dimmed opacity, "coming soon"

**Milestone data (placeholder dates, to be confirmed):**
1. Diseño inicial — primeros bocetos
2. Mecanizado — CNC del prototipo (video)
3. Construcción — ensamblaje
4. Pruebas — testing
5. Primer vuelo — VIDEAZO (featured)
6. Wichita 2026 — la competencia (future, dashed)

### Section 6: Nuestro Objetivo — The Big Statement

Short, emotional, full-screen statement with parallax and Argentina flag colors.

**Structure:**
- Standard viewport height (100vh)
- Center-aligned bold text

**Content:**
- "Representar a Argentina en el mundo."
- Subtitle: "Llevar nuestra pasión por la ingeniería a Wichita, Kansas. Competir contra las mejores universidades del planeta."

**Visual treatment:**
- "Argentina" in celeste (#74ACDF)
- Flag accent lines at top and bottom: 3px linear-gradient (#74ACDF → white → #74ACDF) with gentle wave animation (CSS keyframes)
- Parallax: text layers move at different scroll speeds for depth
- Background: subtle SVG globe outline, slowly rotating (CSS animation), centered on South America

**This section is intentionally short** — a breath before the final CTA.

### Section 7: Seguinos — Instagram CTA

Clean, powerful closing section with Instagram link.

**Structure:**
- ~60vh height
- Centered column layout

**Content:**
- AERO logo placeholder (circular border, spins slowly on scroll entry — propeller callback)
- "Seguí nuestro camino"
- "Cada día más cerca de Wichita"
- Instagram CTA button: golden gradient background, "@aero.itba", links to https://www.instagram.com/aero.itba/
- Footer text: "AERO ITBA — Design · Build · Fly"

**Interactions:**
- Instagram button: magnetic hover effect (button follows cursor slightly within a radius before snapping back)
- Background: faint particle trail that follows mouse position — canvas-based with `requestAnimationFrame`, max 25 particles, fading opacity. Desktop-only (hidden on touch devices).

## Component Architecture

```
app/aero/
  layout.tsx          — metadata, wraps with main Navbar
  page.tsx            — assembles all sections

components/aero/
  ScrollVideo.tsx     — scroll-mapped video hero (useScroll + video.currentTime)
  CinematicText.tsx   — scroll-triggered text reveal (Section 2)
  BlueprintPlane.tsx  — interactive blueprint with annotations (Section 3)
  MissionBriefing.tsx — countdown timer + radar sweep (Section 4)
  ProgressTimeline.tsx — horizontal scroll timeline (Section 5)
  BigStatement.tsx    — parallax statement (Section 6)
  InstagramCTA.tsx    — closing CTA with magnetic button (Section 7)
  MagneticButton.tsx  — reusable magnetic hover effect button
  NumberScramble.tsx  — number scramble-to-reveal animation
  AnimatedCounter.tsx — count-up number animation
  VideoLightbox.tsx   — full-screen video modal overlay
  constants.ts        — shared constants (competition date, external links)
```

## File Changes Summary

**New files:**
- `app/aero/layout.tsx`
- `app/aero/page.tsx`
- `app/aero/aero.css`
- `components/aero/constants.ts`
- `components/aero/ScrollVideo.tsx`
- `components/aero/CinematicText.tsx`
- `components/aero/BlueprintPlane.tsx`
- `components/aero/MissionBriefing.tsx`
- `components/aero/ProgressTimeline.tsx`
- `components/aero/BigStatement.tsx`
- `components/aero/InstagramCTA.tsx`
- `components/aero/MagneticButton.tsx`
- `components/aero/NumberScramble.tsx`
- `components/aero/AnimatedCounter.tsx`
- `components/aero/VideoLightbox.tsx`

**Modified files:**
- `components/Navbar.tsx` — add golden "AERO" link to desktop and mobile nav
- `package.json` — add `framer-motion` dependency

**Media placeholders (to be replaced):**
- Hero video → placeholder gradient
- AERO logo → placeholder circle
- Team photo → placeholder div
- Plane image → CSS triangle (BWB silhouette)
- Progress gallery → placeholder cards with labels
- All placeholders use consistent styling so the page looks intentional even before real assets

## Performance Considerations

- Video preloading: `preload="auto"` with loading state indicator
- Framer Motion animations use `will-change: transform` for GPU acceleration
- Scroll-mapped sections use `position: sticky` (no JS layout recalculation)
- Images: Next.js `<Image>` with lazy loading for below-fold content
- Horizontal scroll timeline: only visible cards rendered (intersection observer)
- Mobile: disable scroll-mapped video (fallback to static), reduce animation complexity

## Accessibility

- **`prefers-reduced-motion`**: When enabled, all scroll-mapped animations degrade to simple fade-in-on-viewport-enter. The scroll-mapped video shows a static frame instead. Horizontal scroll timeline becomes a standard vertical list.
- Scroll progress indicator: `aria-label="Progreso de scroll"`
- All placeholder images: descriptive `alt` text
- Video lightbox: focus trap, Escape to close
- Instagram CTA button: proper `aria-label` and `rel="noopener noreferrer"` on external link

## Competition Date

April 2026 — exact date TBD. Stored in `components/aero/constants.ts` as a shared constant, used by both MissionBriefing (countdown) and ProgressTimeline (future milestone state).
