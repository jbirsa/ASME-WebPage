"use client"

import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, X, Plane } from "lucide-react" // Importamos iconos
import { clearAuthToken, getAuthToken } from "@/lib/auth-token"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false) // Estado para el menú móvil
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const syncAuthState = () => {
      setIsAuthenticated(Boolean(getAuthToken()))
    }

    syncAuthState()
    window.addEventListener("storage", syncAuthState)

    return () => {
      window.removeEventListener("storage", syncAuthState)
    }
  }, [])

  // Cerrar menú al hacer clic en un enlace
  const handleLinkClick = () => {
    setIsMenuOpen(false)
  }

  const handleAuthAction = () => {
    setIsMenuOpen(false)

    if (isAuthenticated) {
      clearAuthToken()
      setIsAuthenticated(false)
      router.replace("/login")
      return
    }

    router.push("/login")
  }

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50' 
          : 'bg-transparent'
      }`}>
        <div className="flex items-center justify-between p-4 md:p-6 max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center">
              <Link
                href="/#inicio"
                className="relative block h-16 w-16 rounded-full transition-opacity duration-200 hover:opacity-80"
              >
                <Image
                  src="/asme_logo_blanco.png"
                  alt="ASME Logo"
                  fill
                  sizes="64px"
                  loading="eager"
                  style={{ objectFit: "contain" }}
                />
              </Link>
            </div>
          </div>

          {/* Enlaces para desktop (ocultos en móvil) */}
          <div className="hidden md:flex items-center space-x-8 mx-auto">
            <Link
              href="/#inicio" 
              className="hover:text-[#e3a72f] transition-colors duration-200 font-medium"
            >
              Inicio
            </Link>
            <Link
              href="/mechub" 
              className="hover:text-[#e3a72f] transition-colors duration-200 font-medium"
            >
              Mechub
            </Link>
            <Link
              href="/cursos"
              className="hover:text-[#e3a72f] transition-colors duration-200 font-medium"
            >
              Cursos
            </Link>
            <Link
              href="/#eventos" 
              className="hover:text-[#e3a72f] transition-colors duration-200 font-medium"
            >
              Eventos
            </Link>
            <Link 
              href="/#equipo" 
              className="hover:text-[#e3a72f] transition-colors"
            >
              Equipo
            </Link>
            <Link
              href="/#contacto"
              className="hover:text-[#e3a72f] transition-colors duration-200 font-medium"
            >
              Contacto
            </Link>
            <Link
              href="/aero"
              className="text-[#e3a72f] font-bold tracking-[1.5px] transition-all duration-300 hover:scale-105 flex items-center gap-1.5 relative group"
              style={{ textShadow: "0 0 12px rgba(227,167,47,0.4)" }}
            >
              <span className="relative">
                AERO
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:200%_100%] bg-[position:-200%_center] group-hover:animate-[shimmer_1.5s_ease-in-out] pointer-events-none" />
              </span>
              <Plane className="w-4 h-4" />
            </Link>
          </div>

          <div className="hidden md:flex items-center">
            <Button
              className="bg-[#e3a72f] hover:bg-[#d4961a] text-slate-900 font-semibold"
              onClick={handleAuthAction}
            >
              {isAuthenticated ? "Cerrar sesion" : "Login"}
            </Button>
          </div>

          {/* Botón de menú móvil (visible solo en móvil) */}
          <button 
            className="md:hidden text-white p-2 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
          >
              <Menu size={24} className="text-white" />
          </button>
        </div>
      </nav>

      {/* Menú desplegable para móvil */}
      <div 
        className={`fixed inset-0 z-100 md:hidden transition-opacity duration-200 ${
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div 
          className="absolute inset-0 bg-transparent"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />

        <div
          id="mobile-nav"
          className={`absolute right-0 top-0 bottom-0 w-[100vw] max-w-sm rounded-none rounded-l-2xl bg-transparent shadow-2xl backdrop-blur-md transition-transform duration-300 ease-out ${
            isMenuOpen ? "translate-x-0" : "translate-x-6"
          }`}
        >
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setIsMenuOpen(false)}
            className="absolute right-4 top-6 text-white transition-opacity hover:opacity-80 px-3 py-8"
          >
            <X size={24} />
          </button>
          <div className="flex h-full flex-col items-center justify-center space-y-6 text-center text-white">
            <Link
              href="/#inicio" 
              className="text-xl font-medium hover:text-[#e3a72f] transition-colors"
              onClick={handleLinkClick}
            >
              Inicio
            </Link>
            <Link
              href="/mechub" 
              className="text-xl font-medium hover:text-[#e3a72f] transition-colors"
              onClick={handleLinkClick}
            >
              Mechub
            </Link>
            <Link
              href="/cursos"
              className="text-xl font-medium hover:text-[#e3a72f] transition-colors"
              onClick={handleLinkClick}
            >
              Cursos
            </Link>
            <Link
              href="/#eventos" 
              className="text-xl font-medium hover:text-[#e3a72f] transition-colors"
              onClick={handleLinkClick}
            >
              Eventos
            </Link>
            <Link 
              href="/#equipo" 
              className="text-xl font-medium hover:text-[#e3a72f] transition-colors"
              onClick={handleLinkClick}
            >
              Equipo
            </Link>
            <Link
              href="/#contacto"
              className="text-xl font-medium hover:text-[#e3a72f] transition-colors"
              onClick={handleLinkClick}
            >
              Contacto
            </Link>
            <Button
              className="bg-[#e3a72f] hover:bg-[#d4961a] text-slate-900 font-semibold px-8 mt-2"
              onClick={handleAuthAction}
            >
              {isAuthenticated ? "Cerrar sesion" : "Login"}
            </Button>
            <Link
              href="/aero"
              className="text-2xl font-bold text-[#e3a72f] tracking-[1.5px] flex items-center gap-2 hover:scale-105 transition-all duration-300"
              style={{ textShadow: "0 0 12px rgba(227,167,47,0.4)" }}
              onClick={handleLinkClick}
            >
              AERO
              <Plane className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
