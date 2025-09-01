"use client"

import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50' 
        : 'bg-transparent'
    }`}>
      <div className="flex items-center justify-between p-4 md:p-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <div className="w-16 h-16 rounded-full relative flex items-center justify-center">
            <Link href="#inicio" className="hover:opacity-80 transition-opacity duration-200">
              <Image
                src="/asme_logo_blanco.png"
                alt="ASME Logo"
                fill
                style={{ objectFit: "contain" }}
              />
            </Link>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <a 
            href="#inicio" 
            className="hover:text-[#e3a72f] transition-colors duration-200 font-medium"
          >
            Inicio
          </a>
          <a 
            href="#eventos" 
            className="hover:text-[#e3a72f] transition-colors duration-200 font-medium"
          >
            Eventos
          </a>
          <a href="#equipo" className="hover:text-[#e3a72f] transition-colors">
            Equipo
          </a>
          <a 
            href="#contacto" 
            className="hover:text-[#e3a72f] transition-colors duration-200 font-medium"
          >
            Contacto
          </a>
        </div>

        <Button className="bg-[#e3a72f] hover:bg-[#d4961a] text-slate-900 font-semibold transition-colors duration-200">
          Únete
        </Button>
      </div>
    </nav>
  )
}
