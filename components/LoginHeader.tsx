"use client"

import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function LoginHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <Link href="/" className="relative w-14 h-14 md:w-16 md:h-16 hover:opacity-85 transition-opacity">
          <Image src="/asme_logo_blanco.png" alt="ASME Logo" fill style={{ objectFit: "contain" }} priority />
        </Link>

        <Button asChild className="bg-[#e3a72f] hover:bg-[#d4961a] text-slate-900 font-semibold rounded-lg">
          <Link href="/login">Login</Link>
        </Button>
      </div>
    </header>
  )
}
