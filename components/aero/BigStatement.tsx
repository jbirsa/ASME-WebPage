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
