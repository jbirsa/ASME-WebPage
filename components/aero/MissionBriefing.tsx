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
