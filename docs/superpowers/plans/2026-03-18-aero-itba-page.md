# AERO ITBA Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an interactive `/aero` route showcasing the AERO ITBA team's DBF competition journey, with scroll-driven animations, a scroll-mapped video hero, and immersive UI.

**Architecture:** Next.js App Router page at `/aero` using Framer Motion for all scroll-driven animations. Each page section is its own component under `components/aero/`. Shared utility components (AnimatedCounter, NumberScramble, MagneticButton, VideoLightbox) are reused across sections. A dedicated `aero.css` holds custom keyframes. The main `Navbar.tsx` is modified to include a golden "AERO" link.

**Tech Stack:** Next.js 16 (App Router), React 19, Framer Motion, Tailwind CSS, lucide-react

**Spec:** `docs/superpowers/specs/2026-03-18-aero-itba-page-design.md`

---

## File Structure

```
app/aero/
  layout.tsx          — Server component, metadata only (title, description, OG)
  page.tsx            — "use client", imports Navbar + all section components, scroll-behavior override
  aero.css            — Custom keyframes: radar-sweep, flag-wave, globe-rotate, pulse-glow (shimmer lives in globals.css since Navbar renders on all pages)

components/aero/
  constants.ts        — Competition date, external links, milestone data
  hooks.ts            — Shared hooks: usePrefersReducedMotion, useIsDesktop
  ScrollVideo.tsx     — Section 1: scroll-mapped video hero
  CinematicText.tsx   — Section 2: scroll-triggered text reveal
  BlueprintPlane.tsx  — Section 3: interactive blueprint with SVG annotations
  AnimatedCounter.tsx — Reusable count-up number animation (used in Section 3)
  NumberScramble.tsx  — Reusable number scramble effect (used in Section 4)
  MissionBriefing.tsx — Section 4: countdown + radar sweep
  VideoLightbox.tsx   — Full-screen video modal (used in Section 5)
  ProgressTimeline.tsx — Section 5: horizontal scroll timeline
  BigStatement.tsx    — Section 6: parallax statement
  MagneticButton.tsx  — Reusable magnetic hover button (used in Section 7)
  InstagramCTA.tsx    — Section 7: Instagram CTA + particles

Modified:
  components/Navbar.tsx — Add golden "AERO" link (desktop + mobile)
  package.json          — Add framer-motion dependency
```

---

### Task 1: Project Setup — Install Framer Motion + Create Constants + CSS

**Files:**
- Modify: `package.json`
- Create: `components/aero/constants.ts`
- Create: `app/aero/aero.css`

- [ ] **Step 1: Install framer-motion**

```bash
npm install framer-motion
```

- [ ] **Step 2: Create shared constants file**

Create `components/aero/constants.ts`:

```typescript
// Competition target date — used by MissionBriefing countdown and ProgressTimeline
export const COMPETITION_DATE = new Date("2026-04-15T08:00:00-05:00"); // Wichita, Kansas CDT

export const LINKS = {
  competition: "https://www.dbfuw.com/the-competition",
  rules: "https://www.dbfuw.com/the-competition", // Update with actual rules URL
  instagram: "https://www.instagram.com/aero.itba/",
} as const;

export const MILESTONES = [
  { id: "design", date: "ENE 2025", title: "Diseño inicial", description: "Primeros bocetos y análisis aerodinámico", type: "image" as const },
  { id: "machining", date: "MAR 2025", title: "Mecanizado", description: "CNC del prototipo", type: "video" as const },
  { id: "build", date: "JUN 2025", title: "Construcción", description: "Ensamblaje de la estructura", type: "image" as const },
  { id: "testing", date: "AGO 2025", title: "Pruebas", description: "Testing y ajustes", type: "image" as const },
  { id: "flight", date: "SEP 2025", title: "Primer vuelo", description: "El avión vuela por primera vez", type: "video" as const, featured: true },
  { id: "competition", date: "ABR 2026", title: "Wichita 2026", description: "La competencia", type: "future" as const },
] as const;
```

- [ ] **Step 3: Add shimmer keyframe to globals.css**

The shimmer animation is used by `Navbar.tsx` which renders on ALL pages, so it must live in `globals.css`. Append to `app/globals.css`:

```css
/* Shimmer effect for navbar AERO link */
@keyframes shimmer {
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
}
```

- [ ] **Step 4: Create aero.css with page-specific keyframes**

Create `app/aero/aero.css`:

```css
/* Radar sweep for mission briefing */
@keyframes radar-sweep {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

/* Flag wave for big statement */
@keyframes flag-wave {
  0%, 100% {
    transform: scaleX(1);
  }
  50% {
    transform: scaleX(1.02);
  }
}

/* Globe rotation for big statement */
@keyframes globe-rotate {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

/* Pulse glow for featured timeline card */
@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(227, 167, 47, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(227, 167, 47, 0.6);
  }
}

/* Scroll indicator bounce */
@keyframes scroll-bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(6px);
  }
}

/* Propeller spin for logo */
@keyframes propeller-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
```

- [ ] **Step 5: Create shared hooks file**

Create `components/aero/hooks.ts`:

```typescript
"use client";

import { useEffect, useState } from "react";

/**
 * Returns true when the user has prefers-reduced-motion enabled.
 * All scroll-mapped animations should degrade when this is true.
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return prefersReduced;
}

/**
 * Returns true on desktop (min-width: 768px).
 */
export function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isDesktop;
}
```

- [ ] **Step 6: Verify setup**

```bash
npm run build 2>&1 | head -20
```

Expected: Build succeeds (no new pages yet, just deps + static files).

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json components/aero/constants.ts components/aero/hooks.ts app/aero/aero.css app/globals.css
git commit -m "feat(aero): add framer-motion, constants, hooks, and custom CSS keyframes"
```

---

### Task 2: Navbar — Add Golden "AERO" Link

**Files:**
- Modify: `components/Navbar.tsx`

- [ ] **Step 1: Add Plane import and AERO link to desktop nav**

In `components/Navbar.tsx`, add `Plane` to the lucide-react import:

```typescript
import { Menu, X, Plane } from "lucide-react"
```

After the last desktop `<Link>` (Contacto, around line 77), add the AERO link:

```tsx
            <Link
              href="/aero"
              className="text-[#e3a72f] font-bold tracking-[1.5px] transition-all duration-300 hover:scale-105 flex items-center gap-1.5 relative group"
              style={{ textShadow: "0 0 12px rgba(227,167,47,0.4)" }}
            >
              <span className="relative">
                AERO
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:200%_100%] bg-[position:-200%_center] group-hover:animate-[shimmer_1.5s_ease-in-out] pointer-events-none" />
              </span>
              <Plane className="w-4 h-4" />
            </Link>
```

- [ ] **Step 2: Add AERO link to mobile nav**

After the last mobile `<Link>` (Contacto, around line 155), add:

```tsx
            <Link
              href="/aero"
              className="text-2xl font-bold text-[#e3a72f] tracking-[1.5px] flex items-center gap-2 hover:scale-105 transition-all duration-300"
              style={{ textShadow: "0 0 12px rgba(227,167,47,0.4)" }}
              onClick={handleLinkClick}
            >
              AERO
              <Plane className="w-5 h-5" />
            </Link>
```

- [ ] **Step 3: Verify navbar renders correctly**

```bash
npm run dev &
sleep 3
curl -s http://localhost:3000 | grep -o "AERO" | head -5
kill %1 2>/dev/null
```

Expected: "AERO" appears in the HTML output.

- [ ] **Step 4: Commit**

```bash
git add components/Navbar.tsx
git commit -m "feat(aero): add golden AERO link to navbar (desktop + mobile)"
```

---

### Task 3: Route Shell — Layout + Page + Scroll Behavior Override

**Files:**
- Create: `app/aero/layout.tsx`
- Create: `app/aero/page.tsx`

- [ ] **Step 1: Create layout.tsx (server component, metadata only)**

Create `app/aero/layout.tsx`:

```typescript
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "AERO ITBA — Design Build Fly",
  description:
    "Equipo de estudiantes del ITBA compitiendo en la AIAA Design-Build-Fly en Wichita, Kansas 2026",
  icons: {
    icon: [{ url: "/asme_logo.png", type: "image/png" }],
  },
};

export default function AeroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
```

- [ ] **Step 2: Create page.tsx shell with scroll-behavior override**

Create `app/aero/page.tsx`:

```tsx
"use client";

import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import "./aero.css";

export default function AeroPage() {
  // Override smooth scroll so Framer Motion scroll-mapping works correctly
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    return () => {
      html.style.scrollBehavior = prev;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white">
      <Navbar />

      {/* Section placeholders — will be replaced by components */}
      <section className="h-screen flex items-center justify-center">
        <h1 className="text-6xl font-bold">
          AERO <span className="text-[#e3a72f]">ITBA</span>
        </h1>
      </section>
    </div>
  );
}
```

- [ ] **Step 3: Verify route works**

```bash
npm run dev &
sleep 3
curl -s http://localhost:3000/aero | grep -o "AERO ITBA" | head -1
kill %1 2>/dev/null
```

Expected: "AERO ITBA" in the output.

- [ ] **Step 4: Commit**

```bash
git add app/aero/layout.tsx app/aero/page.tsx
git commit -m "feat(aero): add /aero route shell with layout, metadata, and scroll-behavior override"
```

---

### Task 4: ScrollVideo — Scroll-Mapped Video Hero (Section 1)

**Files:**
- Create: `components/aero/ScrollVideo.tsx`

- [ ] **Step 1: Create ScrollVideo component**

Create `components/aero/ScrollVideo.tsx`:

```tsx
"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useIsDesktop, usePrefersReducedMotion } from "./hooks";

export default function ScrollVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isDesktop = useIsDesktop();
  const prefersReduced = usePrefersReducedMotion();
  const [videoReady, setVideoReady] = useState(false);

  // Disable scroll-mapping if reduced motion or mobile
  const scrollEnabled = isDesktop && !prefersReduced;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const overlayOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  // Map scroll to video currentTime
  useEffect(() => {
    if (!scrollEnabled || !videoRef.current) return;

    const unsubscribe = scrollYProgress.on("change", (v) => {
      const video = videoRef.current;
      if (video && video.duration) {
        video.currentTime = v * video.duration;
      }
    });

    return unsubscribe;
  }, [scrollYProgress, scrollEnabled, videoReady]);

  // Placeholder gradient for when no video is available
  const progressBarSegments = 5;
  const progressValues = Array.from({ length: progressBarSegments }, (_, i) => i / progressBarSegments);

  return (
    <section ref={containerRef} className="relative" style={{ height: scrollEnabled ? "400vh" : "auto" }}>
      <div
        className={`${scrollEnabled ? "sticky top-0" : "relative"} h-screen w-full overflow-hidden`}
      >
        {/* Video / Placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a1a] via-[#0f172a] to-[#1a1a3e]">
          {/* When real video is added, uncomment this:
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            src="/aero/hero-video.mp4"
            muted
            playsInline
            preload="auto"
            onLoadedMetadata={() => setVideoReady(true)}
          />
          */}
          {/* Placeholder plane silhouette */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.07]">
            <div
              className="w-[400px] h-[240px] border border-[#e3a72f]/30"
              style={{ clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)" }}
            />
          </div>
        </div>

        {/* Overlay: Logo + Tagline */}
        <motion.div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center"
          style={{ opacity: scrollEnabled ? overlayOpacity : 1 }}
        >
          {/* Logo placeholder */}
          <div className="w-24 h-24 rounded-full border-2 border-[#e3a72f]/30 flex items-center justify-center mb-6 backdrop-blur-sm bg-[#e3a72f]/5">
            <span className="text-[#e3a72f] text-xs font-bold text-center leading-tight">
              AERO
              <br />
              LOGO
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            AERO <span className="text-[#e3a72f]">ITBA</span>
          </h1>
          <p className="mt-3 text-gray-500 text-sm md:text-base tracking-[4px] uppercase">
            Design · Build · Fly
          </p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
          style={{ opacity: scrollEnabled ? scrollIndicatorOpacity : 1 }}
        >
          <span className="text-[#e3a72f]/50 text-[11px] tracking-[2px] uppercase">
            Scroll para explorar
          </span>
          <div className="w-6 h-9 rounded-full border-2 border-[#e3a72f]/30 flex justify-center pt-1.5">
            <div className="w-1 h-2 bg-[#e3a72f] rounded-full animate-[scroll-bounce_2s_ease-in-out_infinite]" />
          </div>
        </motion.div>

        {/* Scroll progress bar (right edge) */}
        {scrollEnabled && (
          <div className="absolute right-5 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-1.5 items-center" aria-label="Progreso de scroll" role="progressbar">
            {progressValues.map((threshold, i) => (
              <ProgressSegment key={i} scrollYProgress={scrollYProgress} threshold={threshold} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ProgressSegment({
  scrollYProgress,
  threshold,
}: {
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  threshold: number;
}) {
  const opacity = useTransform(
    scrollYProgress,
    [threshold, threshold + 0.1],
    [0.15, 1]
  );

  return (
    <motion.div
      className="w-[3px] h-10 rounded-full bg-[#e3a72f]"
      style={{ opacity }}
    />
  );
}
```

- [ ] **Step 2: Integrate into page.tsx**

Update `app/aero/page.tsx` — replace the placeholder section:

```tsx
"use client";

import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import ScrollVideo from "@/components/aero/ScrollVideo";
import "./aero.css";

export default function AeroPage() {
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    return () => {
      html.style.scrollBehavior = prev;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white">
      <Navbar />
      <ScrollVideo />
    </div>
  );
}
```

- [ ] **Step 3: Verify it builds**

```bash
npm run build 2>&1 | tail -5
```

Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add components/aero/ScrollVideo.tsx app/aero/page.tsx
git commit -m "feat(aero): add scroll-mapped video hero section with placeholder"
```

---

### Task 5: CinematicText — Scroll-Triggered Text Reveal (Section 2)

**Files:**
- Create: `components/aero/CinematicText.tsx`

- [ ] **Step 1: Create CinematicText component**

Create `components/aero/CinematicText.tsx`:

```tsx
"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const LINES = [
  {
    prefix: "Somos ",
    highlight: "ingenieros",
    suffix: ".",
    highlightColor: "text-white",
  },
  {
    prefix: "Somos ",
    highlight: "estudiantes",
    suffix: ".",
    highlightColor: "text-white",
  },
  {
    prefix: "Somos ",
    highlight: "pilotos de lo imposible",
    suffix: ".",
    highlightColor: "text-[#e3a72f]",
  },
];

export default function CinematicText() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Photo appears after all text
  const photoOpacity = useTransform(scrollYProgress, [0.7, 0.85], [0, 0.4]);
  const photoScale = useTransform(scrollYProgress, [0.7, 1], [1.1, 1.2]);

  return (
    <section ref={containerRef} className="relative" style={{ height: "250vh" }}>
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* Ambient background gradients */}
        <div className="absolute w-[300px] h-[300px] rounded-full bg-[#e3a72f]/5 blur-[100px] top-[20%] left-[10%]" />
        <div className="absolute w-[250px] h-[250px] rounded-full bg-[#5f87ab]/5 blur-[100px] bottom-[20%] right-[15%]" />

        {/* Team photo background (fades in last) */}
        <motion.div
          className="absolute inset-0 bg-gray-800/50"
          style={{ opacity: photoOpacity, scale: photoScale }}
        >
          {/* Placeholder for team photo */}
          <div className="w-full h-full bg-gradient-to-b from-transparent via-[#0a0a1a]/60 to-[#0a0a1a] flex items-center justify-center">
            <span className="text-gray-700 text-sm tracking-widest uppercase">
              Team Photo
            </span>
          </div>
        </motion.div>

        {/* Text lines */}
        <div className="relative z-10 text-center px-6 max-w-3xl">
          {LINES.map((line, i) => (
            <CinematicLine
              key={i}
              line={line}
              index={i}
              total={LINES.length}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function CinematicLine({
  line,
  index,
  total,
  scrollYProgress,
}: {
  line: (typeof LINES)[number];
  index: number;
  total: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  // Each line appears in its own scroll range
  const start = 0.1 + (index / total) * 0.5;
  const end = start + 0.12;

  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
  const y = useTransform(scrollYProgress, [start, end], [30, 0]);

  return (
    <motion.p
      className="text-2xl md:text-4xl font-light leading-relaxed mb-4"
      style={{ opacity, y }}
    >
      <span className="text-gray-600">{line.prefix}</span>
      <span className={`font-semibold ${line.highlightColor}`}>
        {line.highlight}
      </span>
      <span className="text-gray-600">{line.suffix}</span>
    </motion.p>
  );
}
```

- [ ] **Step 2: Add to page.tsx**

In `app/aero/page.tsx`, add the import and component after `<ScrollVideo />`:

```tsx
import CinematicText from "@/components/aero/CinematicText";
```

```tsx
      <ScrollVideo />
      <CinematicText />
```

- [ ] **Step 3: Verify build**

```bash
npm run build 2>&1 | tail -5
```

- [ ] **Step 4: Commit**

```bash
git add components/aero/CinematicText.tsx app/aero/page.tsx
git commit -m "feat(aero): add cinematic text reveal section with scroll-triggered lines"
```

---

### Task 6: AnimatedCounter + NumberScramble — Utility Components

**Files:**
- Create: `components/aero/AnimatedCounter.tsx`
- Create: `components/aero/NumberScramble.tsx`

- [ ] **Step 1: Create AnimatedCounter**

Create `components/aero/AnimatedCounter.tsx`:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

export default function AnimatedCounter({
  target,
  suffix = "",
  duration = 1500,
  className = "",
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const steps = 60;
    const increment = target / steps;
    const interval = duration / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, interval);

    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {count}
      {suffix}
    </span>
  );
}
```

- [ ] **Step 2: Create NumberScramble**

Create `components/aero/NumberScramble.tsx`:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface NumberScrambleProps {
  value: number;
  scrambleDuration?: number;
  className?: string;
  pad?: number;
}

export default function NumberScramble({
  value,
  scrambleDuration = 1000,
  className = "",
  pad = 0,
}: NumberScrambleProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(pad > 0 ? "0".repeat(pad) : "0");
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    if (!isInView) return;

    const steps = 20;
    const interval = scrambleDuration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      if (step >= steps) {
        const str = value.toString();
        setDisplay(pad > 0 ? str.padStart(pad, "0") : str);
        setSettled(true);
        clearInterval(timer);
      } else {
        // Random digits
        const len = Math.max(value.toString().length, pad);
        const random = Array.from({ length: len }, () =>
          Math.floor(Math.random() * 10).toString()
        ).join("");
        setDisplay(random);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [isInView, value, scrambleDuration, pad]);

  // After settling, show the live value (important for countdown timer updates)
  const liveDisplay = pad > 0 ? value.toString().padStart(pad, "0") : value.toString();

  return (
    <span
      ref={ref}
      className={className}
      style={{ fontVariantNumeric: "tabular-nums" }}
    >
      {settled ? liveDisplay : display}
    </span>
  );
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build 2>&1 | tail -5
```

- [ ] **Step 4: Commit**

```bash
git add components/aero/AnimatedCounter.tsx components/aero/NumberScramble.tsx
git commit -m "feat(aero): add AnimatedCounter and NumberScramble utility components"
```

---

### Task 7: BlueprintPlane — Interactive Blueprint (Section 3)

**Files:**
- Create: `components/aero/BlueprintPlane.tsx`

- [ ] **Step 1: Create BlueprintPlane component**

Create `components/aero/BlueprintPlane.tsx`:

```tsx
"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import AnimatedCounter from "./AnimatedCounter";

// Coordinates in viewBox units (0-100)
const ANNOTATIONS = [
  {
    id: "lift",
    label: "Sustentación distribuida",
    x1: 15,
    y1: 35,
    x2: 38,
    y2: 40,
    scrollRange: [0.15, 0.35] as [number, number],
    color: "#e3a72f",
  },
  {
    id: "capacity",
    label: "3x capacidad de carga",
    x1: 85,
    y1: 55,
    x2: 62,
    y2: 55,
    scrollRange: [0.35, 0.55] as [number, number],
    color: "#5f87ab",
  },
  {
    id: "bwb",
    label: "Blended Wing Body",
    x1: 50,
    y1: 85,
    x2: 50,
    y2: 70,
    scrollRange: [0.5, 0.7] as [number, number],
    color: "#e3a72f",
  },
];

const STATS = [
  { value: 3, suffix: "x", label: "Capacidad" },
  { value: 0, suffix: "", label: "Configuración", display: "BWB" },
  { value: 0, suffix: "", label: "Control Remoto", display: "RC" },
];

export default function BlueprintPlane() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const planeRotation = useTransform(scrollYProgress, [0, 1], [0, 3]);

  return (
    <section ref={containerRef} className="relative" style={{ height: "300vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Blueprint grid background */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(95,135,171,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(95,135,171,0.05) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />

        {/* SVG overlay for annotation lines — viewBox 0-100 maps to full section */}
        <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          {ANNOTATIONS.map((ann) => (
            <AnnotationLine
              key={ann.id}
              annotation={ann}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </svg>

        {/* Plane silhouette (BWB / dorito shape) */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ rotate: planeRotation }}
        >
          <div
            className="w-[300px] md:w-[400px] h-[180px] md:h-[240px] border border-[#e3a72f]/30 bg-gradient-to-b from-[#e3a72f]/10 to-[#e3a72f]/3 flex items-end justify-center pb-6"
            style={{ clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)" }}
          >
            <span className="text-[#e3a72f]/30 text-[10px] tracking-[3px] uppercase">
              BWB Profile
            </span>
          </div>
        </motion.div>

        {/* Annotation labels */}
        {ANNOTATIONS.map((ann) => (
          <AnnotationLabel
            key={ann.id}
            annotation={ann}
            scrollYProgress={scrollYProgress}
          />
        ))}

        {/* Stats bar at bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-[#0a0a1a] to-transparent py-8">
          <div className="flex justify-center gap-12 md:gap-20">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-[#e3a72f] text-3xl md:text-4xl font-extrabold">
                  {stat.display ? (
                    stat.display
                  ) : (
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  )}
                </div>
                <div className="text-gray-600 text-[10px] md:text-xs uppercase tracking-[1px] mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AnnotationLine({
  annotation,
  scrollYProgress,
}: {
  annotation: (typeof ANNOTATIONS)[number];
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const pathLength = useTransform(
    scrollYProgress,
    annotation.scrollRange,
    [0, 1]
  );
  const opacity = useTransform(
    scrollYProgress,
    [annotation.scrollRange[0], annotation.scrollRange[0] + 0.05],
    [0, 1]
  );

  return (
    <motion.line
      x1={annotation.x1}
      y1={annotation.y1}
      x2={annotation.x2}
      y2={annotation.y2}
      stroke={annotation.color}
      strokeWidth="1.5"
      pathLength="1"
      style={{ pathLength, opacity }}
      strokeDasharray="1"
      strokeDashoffset="0"
    />
  );
}

function AnnotationLabel({
  annotation,
  scrollYProgress,
}: {
  annotation: (typeof ANNOTATIONS)[number];
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const opacity = useTransform(
    scrollYProgress,
    [annotation.scrollRange[1] - 0.05, annotation.scrollRange[1]],
    [0, 1]
  );
  const y = useTransform(
    scrollYProgress,
    [annotation.scrollRange[1] - 0.05, annotation.scrollRange[1]],
    [10, 0]
  );

  return (
    <motion.div
      className="absolute z-20 flex items-center gap-2"
      style={{
        left: `${annotation.x1}%`,
        top: `${annotation.y1}%`,
        opacity,
        y,
      }}
    >
      <div
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: annotation.color }}
      />
      <span
        className="text-[11px] font-semibold whitespace-nowrap"
        style={{ color: annotation.color }}
      >
        {annotation.label}
      </span>
    </motion.div>
  );
}
```

- [ ] **Step 2: Add to page.tsx**

In `app/aero/page.tsx`, add the import and component:

```tsx
import BlueprintPlane from "@/components/aero/BlueprintPlane";
```

```tsx
      <CinematicText />
      <BlueprintPlane />
```

- [ ] **Step 3: Verify build**

```bash
npm run build 2>&1 | tail -5
```

- [ ] **Step 4: Commit**

```bash
git add components/aero/BlueprintPlane.tsx app/aero/page.tsx
git commit -m "feat(aero): add interactive blueprint plane section with SVG annotations"
```

---

### Task 8: MissionBriefing — Countdown + Radar Sweep (Section 4)

**Files:**
- Create: `components/aero/MissionBriefing.tsx`

- [ ] **Step 1: Create MissionBriefing component**

Create `components/aero/MissionBriefing.tsx`:

```tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";
import { MapPin } from "lucide-react";
import { COMPETITION_DATE, LINKS } from "./constants";
import NumberScramble from "./NumberScramble";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(): TimeLeft | null {
  const diff = COMPETITION_DATE.getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function MissionBriefing() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(getTimeLeft());
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    if (isInView && !hasEntered) setHasEntered(true);
  }, [isInView, hasEntered]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const isComplete = timeLeft === null;

  return (
    <section ref={ref} className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Radar sweep background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="absolute w-[500px] h-[500px] rounded-full border border-[#5f87ab]/10" />
        <div className="absolute w-[340px] h-[340px] rounded-full border border-[#5f87ab]/10" />
        <div
          className="absolute w-[500px] h-[500px] rounded-full animate-[radar-sweep_4s_linear_infinite]"
          style={{
            background: "conic-gradient(from 0deg, transparent 0deg, rgba(95,135,171,0.08) 40deg, transparent 80deg)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        {/* Location */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <MapPin className="w-4 h-4 text-[#5f87ab]" />
          <span className="text-[#5f87ab] text-[11px] uppercase tracking-[3px]">
            Wichita, Kansas — USA
          </span>
        </div>

        {/* Countdown or completed badge */}
        {isComplete ? (
          <div className="mb-8 inline-block px-6 py-3 border border-[#e3a72f]/50 rounded-lg">
            <span className="text-[#e3a72f] text-lg font-semibold tracking-wide">
              Competencia finalizada
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-4 md:gap-6 mb-8">
            {[
              { value: timeLeft.days, label: "Días" },
              { value: timeLeft.hours, label: "Horas" },
              { value: timeLeft.minutes, label: "Min" },
              { value: timeLeft.seconds, label: "Seg" },
            ].map((unit, i) => (
              <div key={unit.label} className="flex items-center gap-4 md:gap-6">
                <div className="text-center">
                  <div className="text-white text-4xl md:text-5xl font-extrabold" style={{ fontVariantNumeric: "tabular-nums" }}>
                    {hasEntered ? (
                      <NumberScramble
                        value={unit.value}
                        pad={unit.label === "Días" ? 0 : 2}
                        scrambleDuration={800 + i * 200}
                      />
                    ) : (
                      "--"
                    )}
                  </div>
                  <div className="text-[#5f87ab] text-[10px] uppercase tracking-[1px] mt-1">
                    {unit.label}
                  </div>
                </div>
                {i < 3 && (
                  <span className="text-[#e3a72f]/20 text-4xl md:text-5xl font-extralight">:</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Title */}
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-2">
          AIAA Design-Build-Fly <span className="text-[#e3a72f]">2026</span>
        </h2>
        <p className="text-gray-600 text-xs md:text-sm mb-8">
          Organizado por AIAA · Sponsoreado por Textron Aviation & Raytheon Technologies
        </p>

        {/* CTA buttons */}
        <div className="flex items-center justify-center gap-4">
          <a
            href={LINKS.competition}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 border border-[#e3a72f] rounded-lg text-[#e3a72f] text-sm font-semibold hover:bg-[#e3a72f]/10 transition-colors"
          >
            Ver competencia →
          </a>
          <a
            href={LINKS.rules}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 border border-[#5f87ab]/30 rounded-lg text-[#5f87ab] text-sm hover:bg-[#5f87ab]/10 transition-colors"
          >
            Reglamento
          </a>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add to page.tsx**

In `app/aero/page.tsx`, add the import and component:

```tsx
import MissionBriefing from "@/components/aero/MissionBriefing";
```

```tsx
      <BlueprintPlane />
      <MissionBriefing />
```

- [ ] **Step 3: Verify build**

```bash
npm run build 2>&1 | tail -5
```

- [ ] **Step 4: Commit**

```bash
git add components/aero/MissionBriefing.tsx app/aero/page.tsx
git commit -m "feat(aero): add mission briefing section with live countdown and radar sweep"
```

---

### Task 9: VideoLightbox — Full-Screen Video Modal

**Files:**
- Create: `components/aero/VideoLightbox.tsx`

- [ ] **Step 1: Create VideoLightbox component**

Create `components/aero/VideoLightbox.tsx`:

```tsx
"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface VideoLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  src?: string;
  title?: string;
}

export default function VideoLightbox({ isOpen, onClose, src, title }: VideoLightboxProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      // Focus trap: keep Tab cycling within the lightbox
      if (e.key === "Tab") {
        // Only the close button is focusable — keep focus on it
        e.preventDefault();
        closeButtonRef.current?.focus();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      // Auto-focus close button on open
      setTimeout(() => closeButtonRef.current?.focus(), 50);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === overlayRef.current) onClose();
          }}
        >
          {/* Close button */}
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors z-10"
            aria-label="Cerrar video"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Video container */}
          <motion.div
            className="relative w-[90vw] max-w-4xl aspect-video rounded-lg overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {src ? (
              <video
                className="w-full h-full object-contain bg-black"
                src={src}
                controls
                autoPlay
                playsInline
              />
            ) : (
              <div className="w-full h-full bg-[#16213e] flex items-center justify-center">
                <p className="text-gray-500 text-sm">
                  {title || "Video no disponible"}
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build 2>&1 | tail -5
```

- [ ] **Step 3: Commit**

```bash
git add components/aero/VideoLightbox.tsx
git commit -m "feat(aero): add VideoLightbox component for full-screen video modal"
```

---

### Task 10: ProgressTimeline — Horizontal Scroll Timeline (Section 5)

**Files:**
- Create: `components/aero/ProgressTimeline.tsx`

- [ ] **Step 1: Create ProgressTimeline component**

Create `components/aero/ProgressTimeline.tsx`:

```tsx
"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Play } from "lucide-react";
import { MILESTONES, COMPETITION_DATE } from "./constants";
import VideoLightbox from "./VideoLightbox";

export default function ProgressTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = useState(0);
  const [lightbox, setLightbox] = useState<{ open: boolean; title: string }>({
    open: false,
    title: "",
  });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Measure track width dynamically
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => {
      setTrackWidth(track.scrollWidth - track.clientWidth);
    };
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  const x = useTransform(scrollYProgress, [0, 1], [0, -trackWidth]);

  // Timeline line draw progress
  const lineWidth = useTransform(scrollYProgress, [0, 0.9], ["0%", "100%"]);

  return (
    <>
      <section ref={containerRef} className="relative" style={{ height: "300vh" }}>
        <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
          {/* Section title */}
          <h2 className="text-center text-[#5f87ab] text-sm uppercase tracking-[4px] mb-8 px-6">
            Progreso
          </h2>

          {/* Timeline line */}
          <div className="relative mx-8 mb-8">
            <div className="h-[2px] bg-[#e3a72f]/10 w-full rounded-full" />
            <motion.div
              className="absolute top-0 left-0 h-[2px] bg-[#e3a72f] rounded-full"
              style={{ width: lineWidth }}
            />
          </div>

          {/* Horizontal scrolling track */}
          <motion.div
            ref={trackRef}
            className="flex gap-6 md:gap-8 px-8"
            style={{ x }}
          >
            {MILESTONES.map((milestone) => {
              const isMilestoneFuture = milestone.type === "future";
              const isFeatured = "featured" in milestone && milestone.featured;

              return (
                <div
                  key={milestone.id}
                  className={`flex-shrink-0 w-[260px] md:w-[300px] ${isMilestoneFuture ? "opacity-40" : ""}`}
                >
                  {/* Card */}
                  <div
                    className={`
                      relative w-full h-[180px] md:h-[200px] rounded-lg overflow-hidden mb-3 flex items-center justify-center
                      ${isFeatured
                        ? "border-2 border-[#e3a72f] animate-[pulse-glow_3s_ease-in-out_infinite]"
                        : isMilestoneFuture
                          ? "border border-dashed border-[#e3a72f]/20"
                          : "border border-[#e3a72f]/20"
                      }
                      bg-[#16213e] transition-transform hover:scale-[1.02]
                    `}
                    onClick={() => {
                      if (milestone.type === "video") {
                        setLightbox({ open: true, title: milestone.title });
                      }
                    }}
                    role={milestone.type === "video" ? "button" : undefined}
                    tabIndex={milestone.type === "video" ? 0 : undefined}
                  >
                    {/* Placeholder content */}
                    <span className="text-gray-600 text-xs tracking-wider uppercase">
                      {milestone.type === "video" ? "🎥" : milestone.type === "future" ? "🏆" : "📸"}{" "}
                      {milestone.title}
                    </span>

                    {/* Play button for videos */}
                    {milestone.type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                        <div className="w-12 h-12 rounded-full bg-[#e3a72f]/90 flex items-center justify-center">
                          <Play className="w-5 h-5 text-[#0a0a1a] ml-0.5" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Date + description */}
                  <div className="text-[#e3a72f] text-[10px] tracking-[1px] uppercase">
                    {milestone.date}
                  </div>
                  <div className="text-gray-500 text-sm mt-0.5">
                    {milestone.description}
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Video lightbox */}
      <VideoLightbox
        isOpen={lightbox.open}
        onClose={() => setLightbox({ open: false, title: "" })}
        title={lightbox.title}
      />
    </>
  );
}
```

- [ ] **Step 2: Add to page.tsx**

In `app/aero/page.tsx`, add the import and component:

```tsx
import ProgressTimeline from "@/components/aero/ProgressTimeline";
```

```tsx
      <MissionBriefing />
      <ProgressTimeline />
```

- [ ] **Step 3: Verify build**

```bash
npm run build 2>&1 | tail -5
```

- [ ] **Step 4: Commit**

```bash
git add components/aero/ProgressTimeline.tsx app/aero/page.tsx
git commit -m "feat(aero): add horizontal scroll progress timeline with video lightbox"
```

---

### Task 11: BigStatement — Parallax Statement (Section 6)

**Files:**
- Create: `components/aero/BigStatement.tsx`

- [ ] **Step 1: Create BigStatement component**

Create `components/aero/BigStatement.tsx`:

```tsx
"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function BigStatement() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const y2 = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const globeRotate = useTransform(scrollYProgress, [0, 1], [0, 45]);

  return (
    <section
      ref={containerRef}
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Argentina flag accent lines */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] animate-[flag-wave_6s_ease-in-out_infinite]"
        style={{
          background: "linear-gradient(to right, #74ACDF, #fff, #74ACDF)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-[3px] animate-[flag-wave_6s_ease-in-out_infinite]"
        style={{
          background: "linear-gradient(to right, #74ACDF, #fff, #74ACDF)",
          animationDelay: "3s",
        }}
      />

      {/* Subtle globe SVG */}
      <motion.div
        className="absolute top-1/2 left-1/2 opacity-[0.03] pointer-events-none"
        style={{
          rotate: globeRotate,
          x: "-50%",
          y: "-50%",
        }}
      >
        <svg width="500" height="500" viewBox="0 0 500 500" fill="none">
          <circle cx="250" cy="250" r="240" stroke="#5f87ab" strokeWidth="1" />
          <ellipse cx="250" cy="250" rx="140" ry="240" stroke="#5f87ab" strokeWidth="0.5" />
          <ellipse cx="250" cy="250" rx="240" ry="140" stroke="#5f87ab" strokeWidth="0.5" />
          <line x1="10" y1="250" x2="490" y2="250" stroke="#5f87ab" strokeWidth="0.5" />
          <line x1="250" y1="10" x2="250" y2="490" stroke="#5f87ab" strokeWidth="0.5" />
        </svg>
      </motion.div>

      {/* Text content */}
      <div className="relative z-10 text-center px-6 max-w-3xl">
        <motion.p
          className="text-3xl md:text-5xl font-extrabold leading-tight"
          style={{ y: y1 }}
        >
          Representar a{" "}
          <span className="text-[#74ACDF]">Argentina</span>
          <br />
          en el mundo.
        </motion.p>
        <motion.p
          className="text-gray-600 text-sm md:text-base mt-6 leading-relaxed max-w-xl mx-auto"
          style={{ y: y2 }}
        >
          Llevar nuestra pasión por la ingeniería a Wichita, Kansas.
          <br />
          Competir contra las mejores universidades del planeta.
        </motion.p>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add to page.tsx**

In `app/aero/page.tsx`, add the import and component:

```tsx
import BigStatement from "@/components/aero/BigStatement";
```

```tsx
      <ProgressTimeline />
      <BigStatement />
```

- [ ] **Step 3: Verify build**

```bash
npm run build 2>&1 | tail -5
```

- [ ] **Step 4: Commit**

```bash
git add components/aero/BigStatement.tsx app/aero/page.tsx
git commit -m "feat(aero): add parallax big statement section with Argentina flag accents"
```

---

### Task 12: MagneticButton — Reusable Magnetic Hover Effect

**Files:**
- Create: `components/aero/MagneticButton.tsx`

- [ ] **Step 1: Create MagneticButton component**

Create `components/aero/MagneticButton.tsx`:

```tsx
"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

interface MagneticButtonProps {
  children: React.ReactNode;
  href: string;
  className?: string;
  strength?: number;
}

export default function MagneticButton({
  children,
  href,
  className = "",
  strength = 0.3,
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    setPosition({
      x: (e.clientX - centerX) * strength,
      y: (e.clientY - centerY) * strength,
    });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 300, damping: 15, mass: 0.2 }}
      aria-label={typeof children === "string" ? children : undefined}
    >
      {children}
    </motion.a>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build 2>&1 | tail -5
```

- [ ] **Step 3: Commit**

```bash
git add components/aero/MagneticButton.tsx
git commit -m "feat(aero): add MagneticButton component with spring-physics hover"
```

---

### Task 13: InstagramCTA — Final Section with Particles (Section 7)

**Files:**
- Create: `components/aero/InstagramCTA.tsx`

- [ ] **Step 1: Create InstagramCTA component**

Create `components/aero/InstagramCTA.tsx`:

```tsx
"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Instagram } from "lucide-react";
import { LINKS } from "./constants";
import MagneticButton from "./MagneticButton";

export default function InstagramCTA() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isInView = useInView(sectionRef, { once: true });
  const [isDesktop, setIsDesktop] = useState(false);

  // Desktop detection
  useEffect(() => {
    setIsDesktop(!("ontouchstart" in window));
  }, []);

  // Particle trail effect (desktop only)
  useEffect(() => {
    if (!isDesktop) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const particles: { x: number; y: number; alpha: number; size: number }[] = [];
    const MAX_PARTICLES = 25;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      particles.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        alpha: 0.6,
        size: Math.random() * 3 + 1,
      });
      if (particles.length > MAX_PARTICLES) particles.shift();
    };

    // Listen on the section parent (canvas has pointer-events-none)
    const section = sectionRef.current;
    section?.addEventListener("mousemove", handleMouseMove);

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.alpha -= 0.015;
        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(227, 167, 47, ${p.alpha})`;
        ctx.fill();
      }
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      section?.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", resize);
    };
  }, [isDesktop]);

  return (
    <section
      ref={sectionRef}
      className="relative flex flex-col items-center justify-center overflow-hidden"
      style={{ height: "60vh" }}
    >
      {/* Particle canvas (desktop only) — pointer-events-none so it doesn't block clicks */}
      {isDesktop && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />
      )}

      {/* Logo with propeller spin */}
      <motion.div
        className="w-16 h-16 rounded-full border-2 border-[#e3a72f]/30 flex items-center justify-center mb-6 z-10"
        animate={isInView ? { rotate: 360 } : {}}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        <span className="text-[#e3a72f] text-[10px] font-bold">AERO</span>
      </motion.div>

      {/* Text */}
      <motion.h2
        className="text-xl md:text-2xl font-bold text-white mb-2 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3 }}
      >
        Seguí nuestro camino
      </motion.h2>
      <motion.p
        className="text-gray-600 text-sm mb-8 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.5 }}
      >
        Cada día más cerca de Wichita
      </motion.p>

      {/* Instagram CTA */}
      <motion.div
        className="z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.7 }}
      >
        <MagneticButton
          href={LINKS.instagram}
          className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-gradient-to-r from-[#e3a72f] to-[#d4972a] rounded-lg text-[#0a0a1a] font-bold text-sm hover:shadow-[0_0_30px_rgba(227,167,47,0.4)] transition-shadow"
        >
          <Instagram className="w-5 h-5" />
          @aero.itba
        </MagneticButton>
      </motion.div>

      {/* Footer text */}
      <div className="absolute bottom-6 text-gray-800 text-[11px] tracking-widest z-10">
        AERO ITBA — Design · Build · Fly
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add to page.tsx**

In `app/aero/page.tsx`, add the import and component:

```tsx
import InstagramCTA from "@/components/aero/InstagramCTA";
```

```tsx
      <BigStatement />
      <InstagramCTA />
```

- [ ] **Step 3: Verify build**

```bash
npm run build 2>&1 | tail -5
```

- [ ] **Step 4: Commit**

```bash
git add components/aero/InstagramCTA.tsx app/aero/page.tsx
git commit -m "feat(aero): add Instagram CTA section with magnetic button and particle trail"
```

---

### Task 14: Final Integration — Complete page.tsx Assembly

**Files:**
- Modify: `app/aero/page.tsx`

- [ ] **Step 1: Write final page.tsx with all sections**

Replace `app/aero/page.tsx` with the complete assembly:

```tsx
"use client";

import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import ScrollVideo from "@/components/aero/ScrollVideo";
import CinematicText from "@/components/aero/CinematicText";
import BlueprintPlane from "@/components/aero/BlueprintPlane";
import MissionBriefing from "@/components/aero/MissionBriefing";
import ProgressTimeline from "@/components/aero/ProgressTimeline";
import BigStatement from "@/components/aero/BigStatement";
import InstagramCTA from "@/components/aero/InstagramCTA";
import "./aero.css";

export default function AeroPage() {
  // Override smooth scroll so Framer Motion scroll-mapping works correctly
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    return () => {
      html.style.scrollBehavior = prev;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white">
      <Navbar />
      <ScrollVideo />
      <CinematicText />
      <BlueprintPlane />
      <MissionBriefing />
      <ProgressTimeline />
      <BigStatement />
      <InstagramCTA />
    </div>
  );
}
```

- [ ] **Step 2: Full build verification**

```bash
npm run build 2>&1 | tail -10
```

Expected: Build succeeds with `/aero` route compiled.

- [ ] **Step 3: Visual smoke test**

```bash
npm run dev
```

Open `http://localhost:3000/aero` in browser. Verify:
- Golden "AERO" link in navbar
- Hero section with placeholder and scroll indicator
- Cinematic text reveals on scroll
- Blueprint plane with annotations appearing
- Countdown timer ticking
- Horizontal timeline scrolling
- Argentina statement with parallax
- Instagram CTA with magnetic button

- [ ] **Step 4: Commit**

```bash
git add app/aero/page.tsx
git commit -m "feat(aero): complete page assembly with all 7 sections integrated"
```

---

### Task 15: Polish — Add .gitignore entry for .superpowers

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Add .superpowers to .gitignore**

Append to `.gitignore`:

```
# Superpowers brainstorm sessions
.superpowers/
```

- [ ] **Step 2: Commit**

```bash
git add .gitignore
git commit -m "chore: add .superpowers to gitignore"
```
