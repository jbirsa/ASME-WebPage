"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Stats() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const value1Ref = useRef<HTMLSpanElement>(null);
  const value2Ref = useRef<HTMLSpanElement>(null);
  const value3Ref = useRef<HTMLSpanElement>(null);
  const glow1Ref = useRef<HTMLDivElement>(null);
  const glow2Ref = useRef<HTMLDivElement>(null);
  const glow3Ref = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        gsap.set([value1Ref.current, value2Ref.current, value3Ref.current], {
          scale: 0.9,
          filter: "blur(12px)",
          opacity: 0.3,
        });
        gsap.set([glow1Ref.current, glow2Ref.current, glow3Ref.current], {
          scale: 0.5,
          opacity: 0,
        });
        gsap.set(value1Ref.current, {
          scale: 1,
          filter: "blur(0px)",
          opacity: 1,
        });
        gsap.set(glow1Ref.current, { scale: 1, opacity: 1 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=500%",
            pin: true,
            scrub: 1,
            onUpdate: (self) => {
              const progress = self.progress;
              if (progress < 0.33) setActiveIndex(0);
              else if (progress < 0.66) setActiveIndex(1);
              else setActiveIndex(2);
            },
          },
        });

        tl.to(
          progressRef.current,
          { scaleX: 1, duration: 1, ease: "none" },
          0
        );
        tl.to(
          trackRef.current,
          { xPercent: -66.66, duration: 1, ease: "none" },
          0
        );

        // STAT 1: 1.5m wingspan
        tl.fromTo(
          value1Ref.current,
          { innerText: 0 },
          {
            innerText: 1.5,
            duration: 0.15,
            snap: { innerText: 0.1 },
            ease: "none",
          },
          0
        );
        tl.to(
          value1Ref.current,
          { scale: 1.05, filter: "blur(8px)", opacity: 0.2, duration: 0.05 },
          0.28
        );
        tl.to(
          glow1Ref.current,
          { scale: 1.5, opacity: 0, duration: 0.05 },
          0.28
        );

        // STAT 2: 15 (team members)
        tl.to(
          value2Ref.current,
          { scale: 1, filter: "blur(0px)", opacity: 1, duration: 0.05 },
          0.3
        );
        tl.to(
          glow2Ref.current,
          { scale: 1, opacity: 1, duration: 0.05 },
          0.3
        );
        tl.fromTo(
          value2Ref.current,
          { innerText: 0 },
          {
            innerText: 15,
            duration: 0.2,
            snap: { innerText: 1 },
            ease: "none",
          },
          0.35
        );
        tl.to(
          value2Ref.current,
          { scale: 1.05, filter: "blur(8px)", opacity: 0.2, duration: 0.05 },
          0.61
        );
        tl.to(
          glow2Ref.current,
          { scale: 1.5, opacity: 0, duration: 0.05 },
          0.61
        );

        // STAT 3: 3x (passenger capacity)
        tl.to(
          value3Ref.current,
          { scale: 1, filter: "blur(0px)", opacity: 1, duration: 0.05 },
          0.64
        );
        tl.to(
          glow3Ref.current,
          { scale: 1, opacity: 1, duration: 0.05 },
          0.64
        );
        tl.fromTo(
          value3Ref.current,
          { innerText: 0 },
          {
            innerText: 3,
            duration: 0.22,
            snap: { innerText: 1 },
            ease: "none",
          },
          0.68
        );
      });

      // Mobile: vertical stacked
      mm.add("(max-width: 767px)", () => {
        gsap.set(trackRef.current, { xPercent: 0 });
        gsap.set(
          [value1Ref.current, value2Ref.current, value3Ref.current],
          { scale: 1, filter: "blur(0px)", opacity: 1 }
        );
        gsap.set(
          [glow1Ref.current, glow2Ref.current, glow3Ref.current],
          { scale: 1, opacity: 0.5 }
        );

        [
          { ref: value1Ref.current, from: 0, value: 1.5, snap: 0.1 },
          { ref: value2Ref.current, from: 0, value: 15, snap: 1 },
          { ref: value3Ref.current, from: 0, value: 3, snap: 1 },
        ].forEach(({ ref, from, value, snap: snapVal }) => {
          if (ref) {
            gsap.fromTo(
              ref,
              { innerText: from },
              {
                innerText: value,
                duration: 2,
                snap: { innerText: snapVal },
                ease: "power2.out",
                scrollTrigger: {
                  trigger: ref,
                  start: "top 80%",
                  toggleActions: "play none none reverse",
                },
              }
            );
          }
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="md:h-screen relative overflow-hidden bg-[#050505]"
    >
      {/* Atmospheric background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(43,108,176,0.04)_0%,transparent_70%)]" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/10 to-transparent -translate-y-1/2" />
      </div>

      {/* Navigation dots */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="relative">
            <div
              className={`w-2 h-2 rounded-full transition-all duration-500 ${
                activeIndex === i ? "bg-accent scale-125" : "bg-white/20"
              }`}
            />
            {activeIndex === i && (
              <div className="absolute inset-0 bg-accent rounded-full animate-ping opacity-30" />
            )}
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5 z-20">
        <div
          ref={progressRef}
          className="h-full bg-gradient-to-r from-accent/80 to-accent origin-left"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      {/* Side label */}
      <div className="hidden md:block absolute left-6 top-1/2 -translate-y-1/2 z-20">
        <span
          className="text-[10px] font-mono tracking-[0.3em] text-white/15 uppercase"
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
          }}
        >
          AERO ITBA en números
        </span>
      </div>

      {/* Horizontal track */}
      <div className="md:h-screen flex items-center py-16 md:py-0">
        <div
          ref={trackRef}
          className="flex md:flex-nowrap flex-col md:flex-row w-full md:min-w-[300vw] gap-12 md:gap-0"
        >
          {/* STAT 1: 1.5m wingspan */}
          <div className="w-full md:w-screen flex-shrink-0 flex items-center justify-center min-h-0 px-6">
            <div className="relative text-center">
              <div
                ref={glow1Ref}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-accent/20 rounded-full blur-[100px] pointer-events-none"
              />
              <div className="relative">
                <div className="flex items-baseline justify-center gap-3">
                  <span
                    ref={value1Ref}
                    className="font-montserrat font-black text-[clamp(4rem,15vw,16rem)] text-white leading-none tracking-tighter"
                    style={{
                      textShadow:
                        "0 0 60px rgba(43,108,176,0.4), 0 0 100px rgba(43,108,176,0.2)",
                    }}
                  >
                    0
                  </span>
                  <span className="font-montserrat font-bold text-[clamp(2rem,5vw,4rem)] text-accent">
                    m
                  </span>
                </div>
                <div className="mt-6 md:mt-8">
                  <p className="font-raleway text-lg md:text-xl text-white/70 tracking-wide">
                    de envergadura
                  </p>
                  <p className="font-raleway text-sm text-white/40 mt-2">
                    ala volante de fibra de carbono y balsa
                  </p>
                </div>
                <div className="hidden md:flex items-center justify-center gap-3 mt-12 text-white/15">
                  <div className="w-12 h-px bg-current" />
                  <span className="text-xs font-mono tracking-widest">01</span>
                  <div className="w-12 h-px bg-current" />
                </div>
              </div>
            </div>
          </div>

          {/* STAT 2: 15 integrantes */}
          <div className="w-full md:w-screen flex-shrink-0 flex items-center justify-center min-h-0 px-6">
            <div className="relative text-center">
              <div
                ref={glow2Ref}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-accent/20 rounded-full blur-[100px] pointer-events-none"
              />
              <div className="relative">
                <div className="flex items-baseline justify-center gap-3">
                  <span
                    ref={value2Ref}
                    className="font-montserrat font-black text-[clamp(4rem,15vw,16rem)] text-white leading-none tracking-tighter"
                    style={{
                      textShadow:
                        "0 0 60px rgba(43,108,176,0.4), 0 0 100px rgba(43,108,176,0.2)",
                    }}
                  >
                    0
                  </span>
                </div>
                <div className="mt-6 md:mt-8">
                  <p className="font-raleway text-lg md:text-xl text-white/70 tracking-wide">
                    estudiantes de ingeniería
                  </p>
                  <p className="font-raleway text-sm text-white/40 mt-2">
                    del Instituto Tecnológico de Buenos Aires
                  </p>
                </div>
                <div className="hidden md:flex items-center justify-center gap-3 mt-12 text-white/15">
                  <div className="w-12 h-px bg-current" />
                  <span className="text-xs font-mono tracking-widest">02</span>
                  <div className="w-12 h-px bg-current" />
                </div>
              </div>
            </div>
          </div>

          {/* STAT 3: 3x pasajeros */}
          <div className="w-full md:w-screen flex-shrink-0 flex items-center justify-center min-h-0 px-6">
            <div className="relative text-center">
              <div
                ref={glow3Ref}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-accent/20 rounded-full blur-[100px] pointer-events-none"
              />
              <div className="relative">
                <div className="flex items-baseline justify-center gap-3">
                  <span
                    ref={value3Ref}
                    className="font-montserrat font-black text-[clamp(4rem,15vw,16rem)] text-white leading-none tracking-tighter"
                    style={{
                      textShadow:
                        "0 0 60px rgba(43,108,176,0.4), 0 0 100px rgba(43,108,176,0.2)",
                    }}
                  >
                    0
                  </span>
                  <span className="font-montserrat font-bold text-[clamp(2rem,5vw,4rem)] text-accent">
                    x
                  </span>
                </div>
                <div className="mt-6 md:mt-8">
                  <p className="font-raleway text-lg md:text-xl text-white/70 tracking-wide">
                    más capacidad de carga
                  </p>
                  <p className="font-raleway text-sm text-white/40 mt-2">
                    gracias al diseño de ala volante &quot;dorito&quot;
                  </p>
                </div>
                <div className="hidden md:flex items-center justify-center gap-3 mt-12 text-white/15">
                  <div className="w-12 h-px bg-current" />
                  <span className="text-xs font-mono tracking-widest">03</span>
                  <div className="w-12 h-px bg-current" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
