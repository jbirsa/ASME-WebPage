"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Images for the carousels - duplicate for seamless loop
const leftImages = [
  "/aeroContent1.jpg",
  "/aeroContent3.jpg",
  "/aeroContent7.JPG",
  "/aeroContent1.jpg",
  "/aeroContent3.jpg",
  "/aeroContent7.JPG",
];

const rightImages = [
  "/aeroContent2.jpg",
  "/aeroContent4.jpg",
  "/aeroContent8.JPG",
  "/aeroContent2.jpg",
  "/aeroContent4.jpg",
  "/aeroContent8.JPG",
];

export default function AeroIntro() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Text animations
      gsap.set(titleRef.current, { y: 50, opacity: 0 });
      gsap.set(subtitleRef.current, { y: 30, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
          once: true,
        },
      });

      tl.to(titleRef.current, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
      }).to(
        subtitleRef.current,
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.6"
      );

      // Scroll-linked carousel movement
      if (leftColRef.current && rightColRef.current) {
        gsap.to(leftColRef.current, {
          y: "-30%",
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });

        gsap.to(rightColRef.current, {
          y: "30%",
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="nosotros"
      ref={containerRef}
      className="section-dark min-h-screen flex items-center justify-center relative overflow-hidden z-10 rounded-t-3xl"
      style={{
        boxShadow: "0 -40px 80px -20px rgba(0,0,0,0.8)",
      }}
    >
      {/* Left carousel - moves up */}
      <div className="absolute left-0 top-0 bottom-0 w-[25%] overflow-hidden hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#141414] z-10" />
        <div
          ref={leftColRef}
          className="flex flex-col gap-4 py-4"
          style={{ transform: "translateY(10%)" }}
        >
          {leftImages.map((src, i) => (
            <div
              key={`left-${i}`}
              className="w-full aspect-[3/4] rounded-lg overflow-hidden mx-2 border border-white/10 shadow-lg"
              style={{
                transform: `rotate(${i % 2 === 0 ? -2 : 2}deg)`,
              }}
            >
              <img
                src={src}
                alt=""
                className="w-full h-full object-cover brightness-110"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Right carousel - moves down */}
      <div className="absolute right-0 top-0 bottom-0 w-[25%] overflow-hidden hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#141414] z-10" />
        <div
          ref={rightColRef}
          className="flex flex-col gap-4 py-4"
          style={{ transform: "translateY(-30%)" }}
        >
          {rightImages.map((src, i) => (
            <div
              key={`right-${i}`}
              className="w-full aspect-[3/4] rounded-lg overflow-hidden mx-2 border border-white/10 shadow-lg"
              style={{
                transform: `rotate(${i % 2 === 0 ? 2 : -2}deg)`,
              }}
            >
              <img
                src={src}
                alt=""
                className="w-full h-full object-cover brightness-110"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Center content */}
      <div className="relative z-20 max-w-3xl mx-auto px-6 py-24 text-center">
        <h2
          ref={titleRef}
          className="font-montserrat font-black text-white leading-[1.05] tracking-tight mb-10"
          style={{ fontSize: "clamp(2rem, 6vw, 4.5rem)" }}
        >
          Estudiantes de ingeniería.
          <br />
          Apasionados por volar.
        </h2>

        <p
          ref={subtitleRef}
          className="font-raleway text-white/60 max-w-xl mx-auto leading-relaxed"
          style={{ fontSize: "clamp(0.95rem, 1.8vw, 1.15rem)" }}
        >
          Somos un equipo de estudiantes de Ingeniería Mecánica del ITBA,
          comprometidos con un desafío que nos apasiona: diseñar, construir y
          volar un avión a control remoto.
        </p>
      </div>

      {/* Vignette overlay for depth */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 50%, transparent 0%, rgba(20,20,20,0.7) 100%)",
        }}
      />
    </section>
  );
}
