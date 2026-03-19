"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PlaneViewerDynamic from "./PlaneViewerDynamic";
import { HOTSPOTS } from "./planeData";

gsap.registerPlugin(ScrollTrigger);

const SPECS = [
  { value: "1.5", unit: "m", label: "Envergadura" },
  { value: "BWB", unit: "", label: "Blended Wing Body" },
  { value: "C/F", unit: "", label: "Fibra de carbono + Balsa" },
  { value: "4", unit: "ch", label: "Servos elevones" },
  { value: "LiPo", unit: "", label: "Bateria alta descarga" },
  { value: "3", unit: "x", label: "Capacidad vs. convencional" },
];

const PROCESS = [
  {
    step: "01",
    title: "Diseno",
    desc: "Simulacion aerodinamica CFD y optimizacion estructural FEA. Iteraciones en XFLR5 y SolidWorks.",
    image: "/aeroContent2.jpg",
  },
  {
    step: "02",
    title: "Laminado",
    desc: "Layup de fibra de carbono sobre nucleo de balsa. Curado bajo vacio para union estructural optima.",
    image: "/aeroContent3.jpg",
  },
  {
    step: "03",
    title: "Ensamblaje",
    desc: "Corte CNC de costillas y largueros. Ensamblaje manual con precision en el taller.",
    image: "/aeroContent4.jpg",
  },
  {
    step: "04",
    title: "Vuelo",
    desc: "Pruebas de vuelo iterativas. Ajuste de CG, trimado y calibracion de controles.",
    image: "/aeroContent1.jpg",
  },
];

export default function PlaneBlueprint() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const specCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const processCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoSectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // ═══════════ TITLE ENTRANCE ═══════════
      if (titleRef.current) {
        gsap.from(titleRef.current.children, {
          opacity: 0,
          y: 30,
          stagger: 0.15,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            once: true,
          },
        });
      }

      // ═══════════ SPEC CARDS (both) ═══════════
      specCardRefs.current.forEach((el, i) => {
        if (el) {
          gsap.from(el, {
            opacity: 0,
            y: 30,
            duration: 0.8,
            delay: i * 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              once: true,
            },
          });
        }
      });

      // ═══════════ PROCESS CARDS ═══════════
      processCardRefs.current.forEach((el, i) => {
        if (el) {
          gsap.from(el, {
            opacity: 0,
            y: 40,
            duration: 0.8,
            delay: i * 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              once: true,
            },
          });
        }
      });

      // ═══════════ VIDEO AUTOPLAY ═══════════
      if (videoSectionRef.current && videoRef.current) {
        const vid = videoRef.current;
        gsap.from(videoSectionRef.current, {
          opacity: 0,
          y: 40,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: videoSectionRef.current,
            start: "top 80%",
            once: true,
            onEnter: () => vid.play(),
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="blueprint" className="relative">
      {/* ─────────────────── TITLE ─────────────────── */}
      <div className="bg-[#050505] pt-32 pb-16 md:pb-24">
        <div ref={titleRef} className="max-w-[1200px] mx-auto px-6 text-center">
          <span className="font-mono text-accent text-xs tracking-[0.3em] uppercase block mb-5">
            Ingenieria de vuelo
          </span>
          <h2
            className="font-montserrat font-black text-white leading-[1.1] tracking-tight"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
          >
            Cada componente,{" "}
            <br className="hidden sm:block" />
            <span className="text-accent">disenado con precision.</span>
          </h2>
        </div>
      </div>

      {/* ─────────────────── 3D PLANE VIEWER (Desktop) ─────────────────── */}
      <div className="hidden md:block bg-[#050505] pb-24">
        <div className="max-w-[1200px] mx-auto px-12">
          <PlaneViewerDynamic
            fallback={
              <div className="w-full aspect-[4/3] rounded-lg overflow-hidden relative">
                <img
                  src="/aeroContent2.jpg"
                  alt="BWB Aircraft"
                  className="w-full h-full object-cover"
                />
              </div>
            }
          />
        </div>
      </div>

      {/* ─────────────────── MOBILE: Stacked Feature Cards ─────────────────── */}
      <div className="md:hidden bg-[#050505] px-6 pb-20 space-y-20">
        <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-8">
          <img
            src="/aeroContent2.jpg"
            alt="BWB Aircraft"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-accent/40 rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-accent/40 rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-accent/40 rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-accent/40 rounded-br-lg" />
        </div>
        {HOTSPOTS.map((h, i) => (
          <div key={h.id}>
            <span className="font-mono text-accent text-[11px] tracking-[0.3em] uppercase">
              {h.subtitle}
            </span>
            <h3 className="font-montserrat font-black text-white text-2xl mt-2 leading-[1.1]">
              {h.title}
            </h3>
            <p className="font-raleway text-white/50 mt-3 leading-relaxed text-sm">
              {h.description}
            </p>
            <div className="mt-4 inline-flex">
              <div className="px-3 py-1.5 rounded border border-accent/30 bg-accent/[0.06]">
                <span className="font-mono text-accent text-xs">
                  {h.badge}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ─────────────────── SPECS GRID ─────────────────── */}
      <div className="bg-[#050505] py-24 md:py-32 border-t border-white/5">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <span className="font-mono text-accent text-xs tracking-[0.3em] uppercase block mb-4">
              Especificaciones
            </span>
            <h2
              className="font-montserrat font-black text-white leading-[1.1]"
              style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
            >
              Los numeros.
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {SPECS.map((spec, i) => (
              <div
                key={i}
                ref={(el) => {
                  specCardRefs.current[i] = el;
                }}
                className="border border-white/[0.08] rounded-lg p-5 md:p-7 bg-white/[0.02] hover:bg-white/[0.04] hover:border-accent/20 transition-all duration-300 group"
              >
                <div className="flex items-baseline gap-1">
                  <span className="font-montserrat font-black text-3xl md:text-4xl text-white group-hover:text-accent transition-colors duration-300">
                    {spec.value}
                  </span>
                  {spec.unit && (
                    <span className="font-montserrat font-bold text-lg md:text-xl text-accent">
                      {spec.unit}
                    </span>
                  )}
                </div>
                <p className="font-raleway text-white/40 text-xs md:text-sm mt-2">
                  {spec.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─────────────────── BUILD PROCESS ─────────────────── */}
      <div className="bg-[#050505] py-24 md:py-32 border-t border-white/5">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="mb-12 md:mb-16">
            <span className="font-mono text-accent text-xs tracking-[0.3em] uppercase block mb-4">
              Proceso
            </span>
            <h2
              className="font-montserrat font-black text-white leading-[1.1]"
              style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
            >
              De la idea al vuelo.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {PROCESS.map((p, i) => (
              <div
                key={i}
                ref={(el) => {
                  processCardRefs.current[i] = el;
                }}
                className="rounded-xl overflow-hidden border border-white/[0.08] bg-white/[0.02] group hover:border-accent/20 transition-all duration-300"
              >
                <div className="relative aspect-[3/2] overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-4 font-mono text-accent text-[11px] tracking-[0.2em]">
                    PASO {p.step}
                  </span>
                </div>
                <div className="p-5">
                  <h4 className="font-montserrat font-bold text-white text-lg">
                    {p.title}
                  </h4>
                  <p className="font-raleway text-white/40 text-sm mt-2 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─────────────────── FLIGHT VIDEO ─────────────────── */}
      <div className="bg-[#050505] py-24 md:py-32 border-t border-white/5">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-12">
            <span className="font-mono text-accent text-xs tracking-[0.3em] uppercase block mb-4">
              Resultado
            </span>
            <h2
              className="font-montserrat font-black text-white leading-[1.1]"
              style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
            >
              Y despues... vuela.
            </h2>
          </div>

          <div
            ref={videoSectionRef}
            className="relative rounded-xl overflow-hidden aspect-video"
          >
            <video
              ref={videoRef}
              src="/aeroFly.mp4"
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-accent/50 rounded-tl-xl pointer-events-none" />
            <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-accent/50 rounded-tr-xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-accent/50 rounded-bl-xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-accent/50 rounded-br-xl pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
