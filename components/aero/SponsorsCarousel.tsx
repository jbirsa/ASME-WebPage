"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SPONSORS = [
  {
    name: "Grupo Gaman",
    image: "/grupo_gaman.png",
  },
  {
    name: "Lloyd",
    image: "/lloyd.png",
  },
  {
    name: "Aeropuertos Argentina",
    image: "/aeropuertos_argentina.png",
  },
];

export default function SponsorsCarousel() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const trackWrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.from(headerRef.current.children, {
          opacity: 0,
          y: 28,
          stagger: 0.14,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 82%",
            once: true,
          },
        });
      }

      if (trackWrapperRef.current) {
        gsap.from(trackWrapperRef.current, {
          opacity: 0,
          y: 36,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: trackWrapperRef.current,
            start: "top 88%",
            once: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-[#050505] py-24 md:py-32 border-t border-white/5 overflow-hidden"
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <div ref={headerRef} className="text-center mb-12 md:mb-16">
          <span className="font-mono text-accent text-xs tracking-[0.3em] uppercase block mb-4">
            Patrocinadores
          </span>
          <h2
            className="font-montserrat font-black text-white leading-[1.1]"
            style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
          >
            Empresas que impulsan el proyecto.
          </h2>
          <p className="font-raleway text-white/55 max-w-2xl mx-auto mt-5 leading-relaxed text-sm md:text-base">
            El desarrollo del equipo se sostiene junto a aliados que apuestan por
            la ingeniería, la formación y la innovación aplicada.
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 w-12 md:w-24 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-12 md:w-24 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />

          <div
            ref={trackWrapperRef}
            className="overflow-hidden"
            onMouseEnter={() => {
              if (trackRef.current) {
                trackRef.current.style.animationPlayState = "paused";
              }
            }}
            onMouseLeave={() => {
              if (trackRef.current) {
                trackRef.current.style.animationPlayState = "running";
              }
            }}
          >
            <div ref={trackRef} className="sponsors-marquee-track flex w-max py-2">
              <div className="flex gap-6 pr-6">
                {SPONSORS.map((sponsor) => (
                  <article
                    key={sponsor.name}
                    className="min-w-[260px] sm:min-w-[320px] md:min-w-[360px] rounded-xl border border-white/[0.08] bg-white/[0.03] px-6 py-6 md:px-8 md:py-7 backdrop-blur-sm hover:border-accent/30 hover:bg-white/[0.05] transition-all duration-300"
                  >
                    <div className="flex flex-col items-center justify-center text-center min-h-[172px] md:min-h-[188px]">
                      <div className="w-full h-20 md:h-24 flex items-center justify-center mb-6">
                        <img
                          src={sponsor.image}
                          alt={sponsor.name}
                          className="max-w-full max-h-full object-contain"
                          loading="lazy"
                        />
                      </div>

                      <div className="w-10 h-px bg-accent/70 mb-4" />

                      <p className="font-montserrat font-semibold text-white tracking-wide text-sm md:text-base">
                        {sponsor.name}
                      </p>
                    </div>
                  </article>
                ))}
              </div>

              <div className="flex gap-6 pr-6" aria-hidden="true">
                {SPONSORS.map((sponsor) => (
                  <article
                    key={`${sponsor.name}-duplicate`}
                    className="min-w-[260px] sm:min-w-[320px] md:min-w-[360px] rounded-xl border border-white/[0.08] bg-white/[0.03] px-6 py-6 md:px-8 md:py-7 backdrop-blur-sm hover:border-accent/30 hover:bg-white/[0.05] transition-all duration-300"
                  >
                    <div className="flex flex-col items-center justify-center text-center min-h-[172px] md:min-h-[188px]">
                      <div className="w-full h-20 md:h-24 flex items-center justify-center mb-6">
                        <img
                          src={sponsor.image}
                          alt=""
                          className="max-w-full max-h-full object-contain"
                          loading="lazy"
                        />
                      </div>

                      <div className="w-10 h-px bg-accent/70 mb-4" />

                      <p className="font-montserrat font-semibold text-white tracking-wide text-sm md:text-base">
                        {sponsor.name}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes sponsorsMarquee {
          from {
            transform: translate3d(0, 0, 0);
          }

          to {
            transform: translate3d(-50%, 0, 0);
          }
        }

        .sponsors-marquee-track {
          animation: sponsorsMarquee 22s linear infinite;
          will-change: transform;
        }

        @media (max-width: 768px) {
          .sponsors-marquee-track {
            animation-duration: 18s;
          }
        }
      `}</style>
    </section>
  );
}
