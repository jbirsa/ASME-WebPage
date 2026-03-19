"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

function FeatureCard({ icon, title, description, index }: FeatureCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: index * 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );
    }, cardRef);

    return () => ctx.revert();
  }, [index]);

  return (
    <div
      ref={cardRef}
      className="relative p-6 border border-white/10 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20 transition-all duration-300"
    >
      <span className="absolute top-4 right-4 font-mono text-white/20 text-sm">
        0{index + 1}
      </span>
      <div className="mb-5 text-accent">{icon}</div>
      <h3 className="font-montserrat font-bold text-lg text-white mb-3">
        {title}
      </h3>
      <p className="font-raleway text-white/60 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}

export default function Features() {
  const containerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(labelRef.current, { y: 20, opacity: 0 });
      gsap.set(headlineRef.current, { y: 40, opacity: 0 });
      gsap.set(lineRef.current, { scaleX: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
          once: true,
        },
      });

      tl.to(labelRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power3.out",
      })
        .to(
          lineRef.current,
          {
            scaleX: 1,
            duration: 0.6,
            ease: "power2.inOut",
          },
          "-=0.3"
        )
        .to(
          headlineRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.4"
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: (
        <svg
          className="w-10 h-10"
          fill="none"
          viewBox="0 0 48 48"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            d="M8 24h32M24 8v32M14 14l20 20M34 14L14 34"
            strokeLinecap="round"
          />
        </svg>
      ),
      title: "Design",
      description:
        "Análisis aerodinámico, simulaciones CFD y diseño mecánico de precisión. Cada decisión de diseño está respaldada por datos y pruebas.",
    },
    {
      icon: (
        <svg
          className="w-10 h-10"
          fill="none"
          viewBox="0 0 48 48"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <rect x="8" y="20" width="32" height="20" rx="2" />
          <path
            d="M16 20V12a8 8 0 0116 0v8"
            strokeLinecap="round"
          />
          <circle cx="24" cy="32" r="3" />
        </svg>
      ),
      title: "Build",
      description:
        "Manufactura de precisión con materiales compuestos, mecanizado CNC e impresión 3D. Del CAD al prototipo funcional.",
    },
    {
      icon: (
        <svg
          className="w-10 h-10"
          fill="none"
          viewBox="0 0 48 48"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            d="M6 36l12-12 8 8 16-20"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M30 12h12v12" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: "Fly",
      description:
        "Pruebas de vuelo iterativas para validar el diseño. Cada vuelo nos acerca más a Wichita, Kansas.",
    },
  ];

  return (
    <section id="competencia" ref={containerRef} className="section-dark py-24 md:py-32">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <div className="mb-16">
          <span
            ref={labelRef}
            className="font-mono text-accent text-xs tracking-widest uppercase block mb-4"
          >
            Nuestro Enfoque
          </span>
          <div
            ref={lineRef}
            className="w-12 h-px bg-accent mb-6 origin-left"
          />
          <h2
            ref={headlineRef}
            className="font-montserrat font-black text-white leading-tight"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
          >
            Design. Build. Fly.
          </h2>
        </div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} {...feature} index={i} />
          ))}
        </div>

        {/* Competition info */}
        <div className="mt-12 md:mt-16 p-5 md:p-8 border border-white/10 rounded-lg bg-white/[0.02]">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="font-mono text-accent text-xs tracking-widest uppercase block mb-3">
                La Competencia
              </span>
              <h3
                className="font-montserrat font-bold text-white mb-4"
                style={{ fontSize: "clamp(1.25rem, 3vw, 1.75rem)" }}
              >
                AIAA Design-Build-Fly
              </h3>
              <p className="font-raleway text-white/60 text-sm leading-relaxed mb-4">
                Organizada por el American Institute of Aeronautics and
                Astronautics (AIAA) y sponsoreada por referentes de la industria
                como Textron Aviation y Raytheon Technologies. Universidades de
                todo el mundo compiten desarrollando aeronaves diseñadas para
                cumplir misiones específicas.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://www.dbfuw.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-montserrat font-semibold text-sm bg-accent hover:bg-accent/80 text-white px-5 py-2 rounded-sm transition-all duration-300"
                >
                  Sitio de la competencia
                </a>
                <a
                  href="https://www.dbfuw.com/the-competition"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-montserrat font-semibold text-sm border border-white/30 hover:border-white/60 text-white px-5 py-2 rounded-sm transition-all duration-300"
                >
                  Reglamento
                </a>
              </div>
            </div>
            <div className="text-center">
              <div className="inline-block p-6 border border-white/10 rounded-lg">
                <p className="font-montserrat font-black text-accent text-4xl mb-1">
                  Abril 2026
                </p>
                <p className="font-raleway text-white/60 text-sm">
                  Wichita, Kansas, USA
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
