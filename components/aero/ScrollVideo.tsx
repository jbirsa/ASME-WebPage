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
