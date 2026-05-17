"use client"

import Image from "next/image"
import Link from "next/link"

export default function LoginPageHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--campus-secondary)] bg-[var(--campus-primary)] backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        <Link href="/" className="relative h-14 w-14 transition-opacity hover:opacity-85 md:h-16 md:w-16">
          <Image src="/asme_logo_blanco.png" alt="ASME Logo" fill style={{ objectFit: "contain" }} priority />
        </Link>
      </div>
    </header>
  )
}
