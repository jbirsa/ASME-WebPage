"use client"

import { useState, useEffect } from "react"
import { Patrocinador } from "@/types/db_types"

// Helper function to get sponsors from API
const getSponsors = async (): Promise<Patrocinador[]> => {
  try {
    const res = await fetch("/api/sponsors")
    if (!res.ok) {
      throw new Error("Failed to fetch sponsors")
    }
    const data = await res.json()
    return data.sponsors
  } catch (error) {
    console.error("Error fetching sponsors:", error)
    return []
  }
}

// Reusable Sponsor Card Component
const SponsorCard = ({ sponsor, keyPrefix }: { sponsor: Patrocinador; keyPrefix: string }) => (
  <a
    key={`${keyPrefix}-${sponsor.id}`}
    href={sponsor.link}
    target="_blank"
    rel="noopener noreferrer"
    className="flex-shrink-0 group"
  >
    <div className="w-32 h-20 bg-white rounded-lg flex items-center justify-center p-4 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:bg-gray-50">
      <img
        src={sponsor.imagen_url}
        alt={sponsor.nombre}
        className="max-w-full max-h-full object-contain"
        onError={(e) => {
          const target = e.target as HTMLImageElement
          target.style.display = 'none'
          target.parentElement!.innerHTML = `<span class="text-slate-900 font-bold text-lg">${sponsor.nombre}</span>`
        }}
      />
    </div>
  </a>
)

// Helper function to render multiple sets of sponsors
const renderSponsorSets = (sponsors: Patrocinador[], prefixes: string[]) => {
  return prefixes.flatMap((prefix, prefixIndex) => 
    sponsors.map((sponsor, sponsorIndex) => (
      <SponsorCard 
        key={`${prefix}-${sponsor.id || sponsorIndex}-${prefixIndex}`} 
        sponsor={sponsor} 
        keyPrefix={prefix} 
      />
    ))
  )
}

export default function Sponsors() {
  const [sponsors, setSponsors] = useState<Patrocinador[]>([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const loadSponsors = async () => {
      const sponsorsData = await getSponsors()
      setSponsors(sponsorsData)
    }
    loadSponsors()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )

    const element = document.getElementById('sponsors-section')
    if (element) {
      observer.observe(element)
    }

    return () => observer.disconnect()
  }, [])

  if (!sponsors || sponsors.length === 0) {
    return (
      <section id="sponsors-section" className="relative z-10 py-20 px-6 bg-slate-800/30">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#5f87ab]">Nuestros Patrocinadores</h2>
          <p className="text-xl text-gray-300">Cargando patrocinadores...</p>
        </div>
      </section>
    )
  }

  return (
    <section id="sponsors-section" className="relative z-10 py-20 px-6 bg-slate-800/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#5f87ab]">Nuestros Patrocinadores</h2>
          <p className="text-xl text-gray-300">
            Empresas que confían en nuestro proyecto y apoyan la excelencia en ingeniería
          </p>
        </div>

        {/* First row of logos */}
        <div 
          className={`flex space-x-16 items-center justify-center mb-8 ${
            isVisible ? 'animate-scroll-left' : ''
          }`}
          style={{
            animation: isVisible ? 'scrollLeft 30s linear infinite' : 'none'
          }}
        >
          {renderSponsorSets(sponsors, ['original', 'duplicate-1', 'duplicate-2', 'duplicate-3'])}
        </div>

        {/* Second row of logos (moving in opposite direction) */}
        <div 
          className={`flex space-x-16 items-center justify-center ${
            isVisible ? 'animate-scroll-right' : ''
          }`}
          style={{
            animation: isVisible ? 'scrollRight 25s linear infinite' : 'none'
          }}
        >
          {renderSponsorSets(sponsors.slice().reverse(), ['reverse', 'reverse-duplicate-1', 'reverse-duplicate-2', 'reverse-duplicate-3'])}
        </div>
      </div>

      <style jsx>{`
        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        @keyframes scrollRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        
        .animate-scroll-left {
          animation: scrollLeft 30s linear infinite;
        }
        
        .animate-scroll-right {
          animation: scrollRight 25s linear infinite;
        }
      `}</style>
    </section>
  )
}
