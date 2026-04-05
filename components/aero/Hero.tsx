"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 189;
const USABLE_FRAMES = 170; // skip last ~10% of the video

function getFramePath(index: number) {
  return `/frames/frame_${String(index + 1).padStart(4, "0")}.jpg`;
}

/** Draw image to canvas using cover (center-crop) logic */
function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cw: number,
  ch: number
) {
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  const scale = Math.max(cw / iw, ch / ih);
  const sw = cw / scale;
  const sh = ch / scale;
  const sx = (iw - sw) / 2;
  const sy = (ih - sh) / 2;
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
}

export default function Hero() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const [loadingProgress, setLoadingProgress] = useState(0);
  const [framesLoaded, setFramesLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [showCta, setShowCta] = useState(false);
  const [ctaExpanded, setCtaExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);

  // Detect mobile on client
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Preload frames (desktop only)
  useEffect(() => {
    if (isMobile) {
      // On mobile, skip frame loading — mark as loaded immediately
      setFramesLoaded(true);
      return;
    }

    let hasError = false;
    let loadedCount = 0;

    const frames: (HTMLImageElement | null)[] = new Array(TOTAL_FRAMES).fill(null);
    framesRef.current = frames as HTMLImageElement[];

    const loadFrame = (index: number): Promise<void> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          frames[index] = img;
          loadedCount++;
          setLoadingProgress(
            Math.round((loadedCount / TOTAL_FRAMES) * 100)
          );

          if (index === 0 && canvasRef.current) {
            canvasRef.current.width = window.innerWidth;
            canvasRef.current.height = window.innerHeight;
            const ctx = canvasRef.current.getContext("2d");
            if (ctx) {
              drawCover(ctx, img, canvasRef.current.width, canvasRef.current.height);
            }
            setFramesLoaded(true);
          }
          resolve();
        };
        img.onerror = () => {
          loadedCount++;
          setLoadingProgress(
            Math.round((loadedCount / TOTAL_FRAMES) * 100)
          );
          if (!hasError) {
            hasError = true;
            setLoadError(true);
          }
          resolve();
        };
        img.src = getFramePath(index);
      });
    };

    loadFrame(0).then(() => {
      const loadRemainingFrames = async () => {
        const batchSize = 15;
        for (let i = 1; i < TOTAL_FRAMES; i += batchSize) {
          const batch = [];
          for (
            let j = i;
            j < Math.min(i + batchSize, TOTAL_FRAMES);
            j++
          ) {
            batch.push(loadFrame(j));
          }
          await Promise.all(batch);
        }
      };
      loadRemainingFrames();
    });
  }, [isMobile]);

  // Render frame to canvas
  const renderFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    const frames = framesRef.current;

    if (!canvas || !frames.length) return;

    const clampedIndex = Math.max(
      0,
      Math.min(frameIndex, frames.length - 1)
    );

    let frame = frames[clampedIndex];
    let actualIndex = clampedIndex;

    if (!frame || !frame.complete || frame.naturalWidth === 0) {
      for (let i = clampedIndex - 1; i >= 0; i--) {
        if (frames[i] && frames[i].complete && frames[i].naturalWidth > 0) {
          frame = frames[i];
          actualIndex = i;
          break;
        }
      }
      if (!frame || !frame.complete || frame.naturalWidth === 0) {
        for (let i = clampedIndex + 1; i < frames.length; i++) {
          if (
            frames[i] &&
            frames[i].complete &&
            frames[i].naturalWidth > 0
          ) {
            frame = frames[i];
            actualIndex = i;
            break;
          }
        }
      }
    }

    if (!frame || !frame.complete || frame.naturalWidth === 0) return;

    if (currentFrameRef.current === actualIndex) return;
    currentFrameRef.current = actualIndex;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      drawCover(ctx, frame, canvas.width, canvas.height);
    }
  }, []);

  // GSAP animations (desktop scroll + shared entrance)
  useLayoutEffect(() => {
    if (!framesLoaded) return;

    const ctx = gsap.context(() => {
      // Initial states
      gsap.set(taglineRef.current, { y: 20, opacity: 0 });
      gsap.set(headlineRef.current, { y: 80, opacity: 0 });
      gsap.set(subtitleRef.current, { y: 50, opacity: 0 });
      gsap.set(ctaRef.current, { y: 40, opacity: 0 });
      if (scrollIndicatorRef.current) {
        gsap.set(scrollIndicatorRef.current, { opacity: 0 });
      }

      // Entrance timeline
      const entranceTl = gsap.timeline({ delay: 0.3 });

      entranceTl
        .to(
          taglineRef.current,
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
          0.2
        )
        .to(
          headlineRef.current,
          { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" },
          0.4
        )
        .to(
          subtitleRef.current,
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
          0.8
        )
        .to(
          ctaRef.current,
          { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
          1.0
        );

      if (scrollIndicatorRef.current) {
        entranceTl.to(scrollIndicatorRef.current, { opacity: 1, duration: 0.5 }, 1.2);
      }

      // Desktop-only scroll animations
      if (!isMobile) {
        // Frame sequence scroll control
        ScrollTrigger.create({
          trigger: wrapperRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5,
          onUpdate: (self) => {
            const frameIndex = Math.round(
              self.progress * (USABLE_FRAMES - 1)
            );
            renderFrame(frameIndex);

            if (progressRef.current) {
              progressRef.current.style.transform = `scaleX(${self.progress})`;
            }

            setShowCta(self.progress > 0.3);
            setCtaExpanded(self.progress > 0.6);
          },
        });

        // Fade out content as user scrolls
        gsap.to(contentRef.current, {
          opacity: 0,
          y: -80,
          ease: "none",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "5% top",
            end: "40% top",
            scrub: 1,
          },
        });

        // Fade out scroll indicator quickly
        if (scrollIndicatorRef.current) {
          gsap.to(scrollIndicatorRef.current, {
            opacity: 0,
            ease: "none",
            scrollTrigger: {
              trigger: wrapperRef.current,
              start: "top top",
              end: "10% top",
              scrub: 0.5,
            },
          });
        }

        // Subtle scale down effect as next section approaches
        gsap.to(heroRef.current, {
          scale: 0.96,
          ease: "none",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "60% top",
            end: "bottom bottom",
            scrub: 1,
          },
        });
      }
    }, wrapperRef);

    return () => ctx.revert();
  }, [framesLoaded, isMobile, renderFrame]);

  return (
    /* Mobile: h-screen (no scroll wrapper), Desktop: h-[180vh] scroll wrapper */
    <div ref={wrapperRef} className="relative h-screen md:h-[300vh]">
      <section
        ref={heroRef}
        className="sticky top-0 h-screen w-full overflow-hidden bg-black"
      >
        {/* ── Mobile: autoplay video background ── */}
        <video
          src="/aeroFly.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover md:hidden"
        />
        <div className="absolute inset-0 bg-black/50 md:hidden" />

        {/* ── Desktop: Frame Sequence Canvas ── */}
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 w-full h-full transition-opacity duration-500 hidden md:block ${
            framesLoaded ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Desktop Loading State */}
        {!framesLoaded && !isMobile && (
          <div className="absolute inset-0 flex-col items-center justify-center bg-[#080808] z-50 hidden md:flex">
            <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-accent transition-all duration-150 ease-out"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <span className="text-white/50 text-sm font-medium">
              {loadError ? "Loading..." : `Cargando ${loadingProgress}%`}
            </span>
          </div>
        )}

        {/* Desktop Fallback Background */}
        {loadError && framesLoaded && (
          <div className="absolute inset-0 hidden md:block">
            <div className="absolute inset-0 bg-[#080808]" />
            <div
              className="absolute inset-0"
              style={{
                background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(43, 108, 176, 0.1) 0%, transparent 50%)",
              }}
            />
          </div>
        )}

        {/* Subtle vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 120% 120% at 50% 50%, transparent 40%, rgba(0,0,0,0.3) 100%)",
          }}
        />

        {/* Hero Content */}
        <div
          ref={contentRef}
          className="absolute inset-0 flex flex-col items-center justify-center md:justify-center text-center px-6 z-10 -mt-32 md:mt-0"
        >
          <div
            ref={taglineRef}
            className="font-mono text-accent text-xs tracking-[0.3em] uppercase mb-6"
          >
            AIAA Design-Build-Fly 2026
          </div>

          <h1
            ref={headlineRef}
            className="font-montserrat font-black text-white leading-[1.05] tracking-tight mb-6"
            style={{ fontSize: "clamp(2.5rem, 8vw, 6rem)" }}
          >
            AERO ITBA
          </h1>

          <p
            ref={subtitleRef}
            className="font-raleway text-white/70 max-w-xl leading-relaxed"
            style={{ fontSize: "clamp(1rem, 2vw, 1.25rem)" }}
          >
            Diseñamos, construimos y volamos.
            <br />
            Representando a Argentina en Wichita, Kansas.
          </p>

          <div ref={ctaRef} className="mt-8 hidden sm:flex flex-col sm:flex-row gap-3 sm:gap-4">
            <a
              href="#nosotros"
              className="font-montserrat font-semibold text-sm bg-accent hover:bg-accent/80 text-white px-6 py-3 rounded-sm transition-all duration-300 text-center"
            >
              Conocenos
            </a>
            <a
              href="#competencia"
              className="font-montserrat font-semibold text-sm border border-white/30 hover:border-white/60 text-white px-6 py-3 rounded-sm transition-all duration-300 text-center"
            >
              La Competencia
            </a>
          </div>
        </div>

        {/* Scroll indicator (desktop only) */}
        <div
          ref={scrollIndicatorRef}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex-col items-center gap-2 hidden md:flex"
        >
          <span className="font-mono text-white/40 text-[10px] tracking-widest uppercase">
            Scroll
          </span>
          <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent" />
        </div>

        {/* Progress bar (desktop only) */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5 z-20 hidden md:block">
          <div
            ref={progressRef}
            className="h-full bg-gradient-to-r from-accent/80 to-accent origin-left"
            style={{ transform: "scaleX(0)" }}
          />
        </div>

        {/* Floating Corner CTA (desktop only) */}
        <a
          href="https://www.instagram.com/aero.itba/"
          target="_blank"
          rel="noopener noreferrer"
          className={`fixed bottom-8 right-8 z-[9999] group transition-all duration-500 hidden md:block ${
            showCta
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
          <div className="relative">
            <div
              className={`absolute -top-2 -left-2 w-3 h-3 border-l border-t border-accent/50 group-hover:border-accent transition-all duration-300 ${ctaExpanded ? "w-4 h-4 -top-3 -left-3" : ""}`}
            />
            <div
              className={`absolute -bottom-2 -right-2 w-3 h-3 border-r border-b border-accent/50 group-hover:border-accent transition-all duration-300 ${ctaExpanded ? "w-4 h-4 -bottom-3 -right-3" : ""}`}
            />

            <div
              className={`bg-[#0a0a0a]/90 backdrop-blur-sm border border-white/10 group-hover:border-accent/50 transition-all duration-500 overflow-hidden ${
                ctaExpanded ? "px-6 py-4" : "px-4 py-3"
              }`}
            >
              <div
                className={`flex items-center gap-2 transition-all duration-300 ${ctaExpanded ? "mb-2" : ""}`}
              >
                <div
                  className={`w-1.5 h-1.5 bg-accent rounded-full ${ctaExpanded ? "animate-pulse" : ""}`}
                />
                <span className="font-mono text-[10px] text-accent/80 tracking-widest uppercase">
                  Instagram
                </span>
              </div>

              <span
                className={`font-montserrat font-semibold text-white tracking-wide flex items-center gap-2 transition-all duration-300 ${
                  ctaExpanded ? "text-sm" : "text-xs"
                }`}
              >
                {ctaExpanded ? "@aero.itba" : "Seguinos"}
                <svg
                  className="w-3 h-3 text-accent group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </span>
            </div>
          </div>
        </a>
      </section>
    </div>
  );
}
