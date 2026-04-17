"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CTA() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(leftRef.current, { x: -50, opacity: 0 });
      gsap.set(rightRef.current, { x: 50, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
          once: true,
        },
      });

      tl.to(leftRef.current, {
        x: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
      }).to(
        rightRef.current,
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.6"
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={containerRef}
      className="section-dark py-24 relative overflow-hidden"
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Accent glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(43, 108, 176, 0.08) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Info */}
          <div ref={leftRef}>
            <span className="font-mono text-accent text-xs tracking-widest uppercase block mb-4">
              Nuestro Objetivo
            </span>
            <div className="w-12 h-px bg-accent mb-8" />

            <h2
              className="font-montserrat font-black text-white leading-tight mb-6"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
            >
              Representar a
              <br />
              <span className="text-accent">Argentina.</span>
            </h2>

            <p className="font-raleway text-white/60 mb-6 max-w-md leading-relaxed">
              Nuestro objetivo es representar a nuestra universidad y nuestro
              país en la AIAA Design-Build-Fly, una competencia internacional en
              Wichita, Kansas, en abril de 2026.
            </p>

            <p className="font-raleway text-white/60 mb-10 max-w-md leading-relaxed">
              Competiremos contra universidades de todo el mundo, desarrollando
              una aeronave diseñada para cumplir misiones específicas, mediante
              análisis aerodinámico, diseño mecánico, manufactura de precisión y
              pruebas de vuelo.
            </p>

            <p className="font-raleway text-white/50 text-sm italic">
              Para nosotros, es una oportunidad real de aprender, crecer y
              llevar nuestra pasión por la ingeniería a otro nivel.
            </p>
          </div>

          {/* Right side - Links & IG */}
          <div ref={rightRef}>
            <div className="relative">
              {/* Corner accents */}
              <div className="absolute -top-3 -left-3 w-6 h-6 border-l border-t border-accent/50" />
              <div className="absolute -bottom-3 -right-3 w-6 h-6 border-r border-b border-accent/50" />

              <div className="bg-[#0a0a0a]/80 backdrop-blur-sm border border-white/10 p-5 md:p-8 space-y-4 md:space-y-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                  <span className="font-mono text-[10px] text-accent tracking-widest uppercase">
                    Seguinos
                  </span>
                </div>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/aero.itba/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-4 bg-white/5 border border-white/10 hover:border-accent/30 transition-all duration-300"
                >
                  <div className="w-10 h-10 flex items-center justify-center border border-white/20 group-hover:border-accent/50 transition-colors">
                    <svg
                      className="w-5 h-5 text-accent"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-white/50 tracking-widest uppercase block">
                      Instagram
                    </span>
                    <span className="font-raleway text-white/80 text-sm group-hover:text-accent transition-colors">
                      @aero.itba
                    </span>
                  </div>
                </a>

                {/* Competition link */}
                <a
                  href="https://www.aiaa.org/dbf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-4 bg-white/5 border border-white/10 hover:border-accent/30 transition-all duration-300"
                >
                  <div className="w-10 h-10 flex items-center justify-center border border-white/20 group-hover:border-accent/50 transition-colors">
                    <svg
                      className="w-5 h-5 text-accent"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-white/50 tracking-widest uppercase block">
                      Competencia
                    </span>
                    <span className="font-raleway text-white/80 text-sm group-hover:text-accent transition-colors">
                      AIAA Design-Build-Fly
                    </span>
                  </div>
                </a>

                {/* Competitor reference */}
                <a
                  href="https://dbf.engineering.cornell.edu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-4 bg-white/5 border border-white/10 hover:border-accent/30 transition-all duration-300"
                >
                  <div className="w-10 h-10 flex items-center justify-center border border-white/20 group-hover:border-accent/50 transition-colors">
                    <svg
                      className="w-5 h-5 text-accent"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-white/50 tracking-widest uppercase block">
                      Referencia
                    </span>
                    <span className="font-raleway text-white/80 text-sm group-hover:text-accent transition-colors">
                      Cornell University DBF
                    </span>
                  </div>
                </a>

                {/* Location */}
                <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10">
                  <div className="w-10 h-10 flex items-center justify-center border border-white/20">
                    <svg
                      className="w-5 h-5 text-accent"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-white/50 tracking-widest uppercase block">
                      Universidad
                    </span>
                    <a href="https://www.itba.edu.ar/" target="_blank" rel="noopener noreferrer" className="font-raleway text-white/80 text-sm hover:text-accent transition-colors">
                      ITBA — Buenos Aires, Argentina
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
