"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Instagram } from "lucide-react";
import { LINKS } from "./constants";
import MagneticButton from "./MagneticButton";

export default function InstagramCTA() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isInView = useInView(sectionRef, { once: true });
  const [isDesktop, setIsDesktop] = useState(false);

  // Desktop detection (touch-based)
  useEffect(() => {
    setIsDesktop(!("ontouchstart" in window));
  }, []);

  // Particle trail effect (desktop only)
  useEffect(() => {
    if (!isDesktop) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const particles: { x: number; y: number; alpha: number; size: number }[] = [];
    const MAX_PARTICLES = 25;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      particles.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        alpha: 0.6,
        size: Math.random() * 3 + 1,
      });
      if (particles.length > MAX_PARTICLES) particles.shift();
    };

    // Listen on the section parent (canvas has pointer-events-none)
    const section = sectionRef.current;
    section?.addEventListener("mousemove", handleMouseMove);

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.alpha -= 0.015;
        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(227, 167, 47, ${p.alpha})`;
        ctx.fill();
      }
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      section?.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", resize);
    };
  }, [isDesktop]);

  return (
    <section
      ref={sectionRef}
      className="relative flex flex-col items-center justify-center overflow-hidden"
      style={{ height: "60vh" }}
    >
      {/* Particle canvas (desktop only) — pointer-events-none so it doesn't block clicks */}
      {isDesktop && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />
      )}

      {/* Logo with propeller spin */}
      <motion.div
        className="w-16 h-16 rounded-full border-2 border-[#e3a72f]/30 flex items-center justify-center mb-6 z-10"
        animate={isInView ? { rotate: 360 } : {}}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        <span className="text-[#e3a72f] text-[10px] font-bold">AERO</span>
      </motion.div>

      {/* Text */}
      <motion.h2
        className="text-xl md:text-2xl font-bold text-white mb-2 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3 }}
      >
        Seguí nuestro camino
      </motion.h2>
      <motion.p
        className="text-gray-600 text-sm mb-8 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.5 }}
      >
        Cada día más cerca de Wichita
      </motion.p>

      {/* Instagram CTA */}
      <motion.div
        className="z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.7 }}
      >
        <MagneticButton
          href={LINKS.instagram}
          className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-gradient-to-r from-[#e3a72f] to-[#d4972a] rounded-lg text-[#0a0a1a] font-bold text-sm hover:shadow-[0_0_30px_rgba(227,167,47,0.4)] transition-shadow"
        >
          <Instagram className="w-5 h-5" />
          @aero.itba
        </MagneticButton>
      </motion.div>

      {/* Footer text */}
      <div className="absolute bottom-6 text-gray-800 text-[11px] tracking-widest z-10">
        AERO ITBA — Design · Build · Fly
      </div>
    </section>
  );
}
