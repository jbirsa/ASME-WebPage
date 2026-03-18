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
