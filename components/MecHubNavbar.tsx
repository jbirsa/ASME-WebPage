"use client"

import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export default function MecHubNavbar() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50" : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between p-4 md:p-6 max-w-7xl mx-auto">
        <div className="flex flex-col items-start space-y-2">
          <div className="w-16 h-16 rounded-full relative flex items-center justify-center">
            <Link href="/" className="hover:opacity-80 transition-opacity duration-200">
              <Image src="/asme_logo_blanco.png" alt="ASME Logo" fill style={{ objectFit: "contain" }} />
            </Link>
          </div>
        </div>

        <Button className="bg-[#e3a72f] hover:bg-[#d4961a] text-slate-900 font-semibold transition-colors duration-200">
          <Link href="#cotizar">Cotizar</Link>
        </Button>
      </div>
    </nav>
  )
}
