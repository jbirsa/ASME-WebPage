"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ProductShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(imageRef.current, { opacity: 0 });
      gsap.set(textRef.current, { y: 60, opacity: 0 });
      gsap.set(lineRef.current, { scaleX: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
          once: true,
        },
      });

      tl.to(imageRef.current, {
        opacity: 1,
        duration: 1.2,
        ease: "power2.out",
      })
        .to(
          lineRef.current,
          {
            scaleX: 1,
            duration: 0.8,
            ease: "power2.inOut",
          },
          "-=0.6"
        )
        .to(
          textRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
          },
          "-=0.5"
        );

      gsap.to(imageRef.current, {
        y: -20,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="avion"
      ref={containerRef}
      className="section-dark min-h-screen flex items-center justify-center relative overflow-hidden py-24"
    >
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <div ref={imageRef} className="absolute inset-0">
          <img
            src="/team2"
            alt="Equipo AERO ITBA con el avión"
            className="w-full h-full object-cover object-top"
          />
        </div>
        <div className="absolute inset-0 bg-black/60" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 20%, rgba(0,0,0,0.6) 100%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <div
          ref={lineRef}
          className="w-16 h-[2px] bg-accent mx-auto mb-10 origin-center"
        />

        <div ref={textRef}>
          <h2
            className="font-montserrat font-black text-white leading-[1.1] tracking-tight mb-6"
            style={{ fontSize: "clamp(2rem, 6vw, 4.5rem)" }}
          >
            El avión con forma de
            <br />
            <span className="text-accent">&quot;dorito&quot;.</span>
          </h2>

          <p
            className="font-raleway text-white/60 max-w-lg mx-auto"
            style={{ fontSize: "clamp(0.9rem, 1.5vw, 1.1rem)" }}
          >
            Su diseño de ala volante permite cargar el doble y hasta el triple
            de pasajeros que un avión convencional del mismo tamaño.
          </p>
        </div>
      </div>
    </section>
  );
}
