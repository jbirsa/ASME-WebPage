"use client"

import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X } from "lucide-react" // Importamos iconos

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false) // Estado para el menú móvil

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Cerrar menú al hacer clic en un enlace
  const handleLinkClick = () => {
    setIsMenuOpen(false)
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
            <div className="w-16 h-16 rounded-full relative flex items-center justify-center">
              <Link href="/#inicio" className="hover:opacity-80 transition-opacity duration-200">
                <Image
                  src="/asme_logo_blanco.png"
                  alt="ASME Logo"
                  fill
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
          </div>

          {/* Botón de menú móvil (visible solo en móvil) */}
          <button 
            className="md:hidden text-white p-2 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X size={24} className="text-white" />
            ) : (
              <Menu size={24} className="text-white" />
            )}
          </button>
        </div>
      </nav>

      {/* Menú desplegable para móvil */}
      <div 
        className={`fixed inset-0 bg-slate-900/95 backdrop-blur-md z-40 md:hidden transition-transform duration-300 ease-in-out transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } pt-24`}
      >
        <div className="flex flex-col items-center space-y-6 p-6">
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
        </div>
      </div>
    </>
  )
}