"use client";

import { useEffect, useRef, useState } from "react";

export default function Navigation() {
  const navRef = useRef<HTMLElement>(null);
  const [isPastHero, setIsPastHero] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Mobile: single screen hero, Desktop: 180vh scroll hero
          const isMobile = window.innerWidth < 768;
          const heroHeight = isMobile ? window.innerHeight : window.innerHeight * 3;
          setIsPastHero(window.scrollY > heroHeight - 100);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isMobileMenuOpen]);

  const navLinks = [
    { label: "Nosotros", href: "#nosotros" },
    { label: "Competencia", href: "#competencia" },
    { label: "El Avión", href: "#avion" },
    { label: "Progreso", href: "#progreso" },
  ];

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-[3px] left-0 right-0 z-[9998] transition-all duration-300 ${
          isPastHero
            ? "bg-[#141414]/90 backdrop-blur-md border-b border-white/5"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3">
            <img
              src="/logo.jpeg"
              alt="AERO ITBA"
              className="h-8 w-auto rounded-sm"
            />
            <span className="font-montserrat font-bold text-white text-sm tracking-wide hidden sm:block">
              AERO ITBA
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-raleway text-sm text-white/60 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/"
              className="font-montserrat font-semibold text-sm text-white/60 hover:text-white transition-colors"
            >
              ASME
            </a>
            <a
              href="https://www.instagram.com/aero.itba/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-montserrat font-semibold text-sm bg-accent hover:bg-accent/80 text-white px-5 py-2 rounded-sm transition-all duration-300"
            >
              Instagram
            </a>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden w-8 h-8 flex flex-col justify-center items-center gap-1.5"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span
              className={`w-5 h-px bg-white transition-all duration-300 ${
                isMobileMenuOpen ? "rotate-45 translate-y-[7px]" : ""
              }`}
            />
            <span
              className={`w-5 h-px bg-white transition-all duration-300 ${
                isMobileMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`w-5 h-px bg-white transition-all duration-300 ${
                isMobileMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[9997] bg-[#141414] transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        style={{ top: "calc(3px + 64px)" }}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-montserrat text-2xl font-bold text-white tracking-wide"
              style={{
                opacity: isMobileMenuOpen ? 1 : 0,
                transform: isMobileMenuOpen
                  ? "translateY(0)"
                  : "translateY(20px)",
                transition: `all 0.4s ease ${i * 0.1}s`,
              }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="font-montserrat text-2xl font-bold text-white tracking-wide"
            style={{
              opacity: isMobileMenuOpen ? 1 : 0,
              transform: isMobileMenuOpen
                ? "translateY(0)"
                : "translateY(20px)",
              transition: `all 0.4s ease ${navLinks.length * 0.1}s`,
            }}
          >
            ASME
          </a>
          <a
            href="https://www.instagram.com/aero.itba/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsMobileMenuOpen(false)}
            className="font-montserrat font-semibold text-base bg-accent text-white px-8 py-3 rounded-sm mt-4"
            style={{
              opacity: isMobileMenuOpen ? 1 : 0,
              transform: isMobileMenuOpen
                ? "translateY(0)"
                : "translateY(20px)",
              transition: `all 0.4s ease ${(navLinks.length + 1) * 0.1}s`,
            }}
          >
            Instagram
          </a>
        </div>
      </div>
    </>
  );
}
