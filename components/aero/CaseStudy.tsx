"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SpecCardProps {
  value: string;
  label: string;
  index: number;
}

function SpecCard({ value, label, index }: SpecCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: index * 0.1,
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
      className="relative p-6 border border-white/10 rounded-lg bg-white/[0.02] text-center"
    >
      <span
        className="font-montserrat font-black text-accent block mb-1"
        style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}
      >
        {value}
      </span>
      <span className="font-raleway text-white/60 text-sm">{label}</span>
    </div>
  );
}

const galleryImages = [
  { src: "/aeroContent1.jpg", caption: "Prototipo en taller" },
  { src: "/aeroContent2.jpg", caption: "Proceso de construcción" },
  { src: "/aeroContent3.jpg", caption: "Detalle de estructura" },
  { src: "/aeroContent4.jpg", caption: "Pruebas de vuelo" },
];

export default function CaseStudy() {
  const containerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(labelRef.current, { y: 20, opacity: 0 });
      gsap.set(lineRef.current, { scaleX: 0 });
      gsap.set(headlineRef.current, { y: 40, opacity: 0 });
      gsap.set(descRef.current, { y: 30, opacity: 0 });

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
        )
        .to(
          descRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.5"
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="progreso" ref={containerRef} className="section-dark py-24 md:py-32">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <span
            ref={labelRef}
            className="font-mono text-accent text-xs tracking-widest uppercase block mb-4"
          >
            Nuestro Progreso
          </span>
          <div
            ref={lineRef}
            className="w-12 h-px bg-accent mb-6 origin-left"
          />
          <h2
            ref={headlineRef}
            className="font-montserrat font-black text-white leading-tight mb-4"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
          >
            Del diseño al vuelo
          </h2>
          <p
            ref={descRef}
            className="font-raleway text-white/60 max-w-xl"
            style={{ fontSize: "clamp(0.9rem, 1.5vw, 1rem)" }}
          >
            Análisis aerodinámico, diseño mecánico, manufactura de precisión y
            pruebas de vuelo. Cada etapa nos acerca más a la competencia.
          </p>
        </div>

        {/* Spec cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-12">
          <SpecCard value="Ala Volante" label="configuración aerodinámica" index={0} />
          <SpecCard value="CNC + 3D" label="manufactura de precisión" index={1} />
          <SpecCard value="Wichita" label="destino final" index={2} />
        </div>

        {/* Bento Grid Gallery */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {/* Large image - spans 2 cols and 2 rows */}
          <div className="col-span-2 row-span-2 relative group overflow-hidden border border-white/10 hover:border-accent/30 transition-colors duration-300">
            <div className="aspect-square md:aspect-auto md:h-full">
              <img
                src={galleryImages[0].src}
                alt={galleryImages[0].caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
              <span className="font-mono text-[10px] text-accent tracking-widest uppercase block mb-2">
                01
              </span>
              <p className="font-raleway text-white text-sm md:text-base">
                {galleryImages[0].caption}
              </p>
            </div>
          </div>

          {/* Top right */}
          <div className="relative group overflow-hidden border border-white/10 hover:border-accent/30 transition-colors duration-300">
            <div className="aspect-square">
              <img
                src={galleryImages[1].src}
                alt={galleryImages[1].caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
              <span className="font-mono text-[10px] text-accent tracking-widest uppercase block mb-1">
                02
              </span>
              <p className="font-raleway text-white text-xs md:text-sm">
                {galleryImages[1].caption}
              </p>
            </div>
          </div>

          {/* Middle right */}
          <div className="relative group overflow-hidden border border-white/10 hover:border-accent/30 transition-colors duration-300">
            <div className="aspect-square">
              <img
                src={galleryImages[2].src}
                alt={galleryImages[2].caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
              <span className="font-mono text-[10px] text-accent tracking-widest uppercase block mb-1">
                03
              </span>
              <p className="font-raleway text-white text-xs md:text-sm">
                {galleryImages[2].caption}
              </p>
            </div>
          </div>

          {/* Bottom row - video */}
          <div className="col-span-2 relative group overflow-hidden border border-white/10 hover:border-accent/30 transition-colors duration-300">
            <div className="aspect-[2/1]">
              <img
                src={galleryImages[3].src}
                alt={galleryImages[3].caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
              <span className="font-mono text-[10px] text-accent tracking-widest uppercase block mb-1">
                04
              </span>
              <p className="font-raleway text-white text-xs md:text-sm">
                {galleryImages[3].caption}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
