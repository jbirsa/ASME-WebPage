"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Play } from "lucide-react";
import { MILESTONES } from "./constants";
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
