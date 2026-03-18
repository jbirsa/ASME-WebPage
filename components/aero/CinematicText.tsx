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
