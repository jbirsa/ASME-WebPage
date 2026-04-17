export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="section-dark border-t border-white/10 py-16 relative">
      {/* Subtle top line accent */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(43, 108, 176, 0.3) 50%, transparent)",
        }}
      />

      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Logo + Tagline */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <img
                src="/logo.jpeg"
                alt="AERO ITBA"
                className="h-10 w-auto rounded-sm"
              />
              <span className="font-montserrat font-bold text-white text-lg">
                AERO ITBA
              </span>
            </div>
            <p className="font-raleway text-white/50 text-sm leading-relaxed">
              Equipo de estudiantes de Ingeniería Mecánica del{" "}
              <a href="https://www.itba.edu.ar/" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-accent transition-colors">ITBA</a>{" "}
              compitiendo en la AIAA Design-Build-Fly 2026.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <span className="font-mono text-accent text-xs tracking-widest uppercase block mb-4">
              Navegación
            </span>
            <ul className="space-y-3">
              <li>
                <a
                  href="#nosotros"
                  className="font-raleway text-white/60 hover:text-white text-sm transition-colors"
                >
                  Nosotros
                </a>
              </li>
              <li>
                <a
                  href="#competencia"
                  className="font-raleway text-white/60 hover:text-white text-sm transition-colors"
                >
                  La Competencia
                </a>
              </li>
              <li>
                <a
                  href="#avion"
                  className="font-raleway text-white/60 hover:text-white text-sm transition-colors"
                >
                  El Avión
                </a>
              </li>
              <li>
                <a
                  href="#progreso"
                  className="font-raleway text-white/60 hover:text-white text-sm transition-colors"
                >
                  Progreso
                </a>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <span className="font-mono text-accent text-xs tracking-widest uppercase block mb-4">
              Links
            </span>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://www.instagram.com/aero.itba/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-raleway text-white/60 hover:text-white text-sm transition-colors inline-flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                  @aero.itba
                </a>
              </li>
              <li>
                <a
                  href="https://www.aiaa.org/dbf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-raleway text-white/60 hover:text-white text-sm transition-colors"
                >
                  AIAA Design-Build-Fly
                </a>
              </li>
              <li>
                <a
                  href="https://7ffac911-d3fa-4a62-aebe-b0d26d4780f1.filesusr.com/ugd/9b69a1_2ea68d7933034cfca8536e5dd576b5eb.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-raleway text-white/60 hover:text-white text-sm transition-colors"
                >
                  Reglamento DBF
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-mono text-white/30 text-xs">
            &copy; {currentYear} AERO ITBA — ASME Student Chapter
          </p>
          <p className="font-mono text-accent/70 text-xs tracking-wider">
            Wichita, Kansas 2026
          </p>
        </div>
      </div>
    </footer>
  );
}
