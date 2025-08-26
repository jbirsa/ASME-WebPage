"use client"

import { useEffect, useState } from "react"

interface Sponsor {
  id: number
  name: string
  logo: string
  website: string
}

const sponsors: Sponsor[] = [
  {
    id: 1,
    name: "Sponsor 1",
    logo: "/sponsors/sponsor1.png",
    website: "https://sponsor1.com"
  },
  {
    id: 2,
    name: "Sponsor 2", 
    logo: "/sponsors/sponsor2.png",
    website: "https://sponsor2.com"
  },
  {
    id: 3,
    name: "Sponsor 3",
    logo: "/sponsors/sponsor3.png", 
    website: "https://sponsor3.com"
  },
  {
    id: 4,
    name: "Sponsor 4",
    logo: "/sponsors/sponsor4.png",
    website: "https://sponsor4.com"
  },
  {
    id: 5,
    name: "Sponsor 5",
    logo: "/sponsors/sponsor5.png",
    website: "https://sponsor5.com"
  },
  {
    id: 6,
    name: "Sponsor 6",
    logo: "/sponsors/sponsor6.png",
    website: "https://sponsor6.com"
  }
]

export default function Sponsors() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const element = document.getElementById('sponsors-section')
    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [])

  return (
    <section id="sponsors-section" className="relative z-10 py-20 bg-slate-800/20">
      <div className="max-w-6xl mx-auto px-6 mb-16">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#5f87ab]">Nuestros Patrocinadores</h2>
          <p className="text-xl text-gray-300">
            Empresas líderes que apoyan la excelencia en ingeniería mecánica
          </p>
        </div>
      </div>

      <div className="relative overflow-hidden w-full">
        {/* First row of logos */}
        <div 
          className={`flex space-x-16 items-center justify-center mb-8 ${
            isVisible ? 'animate-scroll-left' : ''
          }`}
          style={{
            animation: isVisible ? 'scrollLeft 30s linear infinite' : 'none'
          }}
        >
          {/* Original sponsors */}
          {sponsors.map((sponsor) => (
            <a
              key={sponsor.id}
              href={sponsor.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 group"
            >
              <div className="w-32 h-20 bg-white rounded-lg flex items-center justify-center p-4 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:bg-gray-50">
                <img
                  src={sponsor.logo}
                  alt={sponsor.name}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    // Fallback to text if image fails to load
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    target.parentElement!.innerHTML = `<span class="text-slate-900 font-bold text-lg">${sponsor.name}</span>`
                  }}
                />
              </div>
            </a>
          ))}
          {/* First duplicate set for seamless loop */}
          {sponsors.map((sponsor) => (
            <a
              key={`duplicate-1-${sponsor.id}`}
              href={sponsor.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 group"
            >
              <div className="w-32 h-20 bg-white rounded-lg flex items-center justify-center p-4 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:bg-gray-50">
                <img
                  src={sponsor.logo}
                  alt={sponsor.name}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    target.parentElement!.innerHTML = `<span class="text-slate-900 font-bold text-lg">${sponsor.name}</span>`
                  }}
                />
              </div>
            </a>
          ))}
          {/* Second duplicate set to ensure full row coverage */}
          {sponsors.map((sponsor) => (
            <a
              key={`duplicate-2-${sponsor.id}`}
              href={sponsor.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 group"
            >
              <div className="w-32 h-20 bg-white rounded-lg flex items-center justify-center p-4 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:bg-gray-50">
                <img
                  src={sponsor.logo}
                  alt={sponsor.name}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    target.parentElement!.innerHTML = `<span class="text-slate-900 font-bold text-lg">${sponsor.name}</span>`
                  }}
                />
              </div>
            </a>
          ))}
          {/* Third duplicate set for extra coverage on large screens */}
          {sponsors.map((sponsor) => (
            <a
              key={`duplicate-3-${sponsor.id}`}
              href={sponsor.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 group"
            >
              <div className="w-32 h-20 bg-white rounded-lg flex items-center justify-center p-4 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:bg-gray-50">
                <img
                  src={sponsor.logo}
                  alt={sponsor.name}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    target.parentElement!.innerHTML = `<span class="text-slate-900 font-bold text-lg">${sponsor.name}</span>`
                  }}
                />
              </div>
            </a>
          ))}
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
          {/* Original sponsors in reverse order */}
          {sponsors.slice().reverse().map((sponsor) => (
            <a
              key={`reverse-${sponsor.id}`}
              href={sponsor.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 group"
            >
              <div className="w-32 h-20 bg-white rounded-lg flex items-center justify-center p-4 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:bg-gray-50">
                <img
                  src={sponsor.logo}
                  alt={sponsor.name}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    target.parentElement!.innerHTML = `<span class="text-slate-900 font-bold text-lg">${sponsor.name}</span>`
                  }}
                />
              </div>
            </a>
          ))}
          {/* First duplicate set for seamless loop */}
          {sponsors.slice().reverse().map((sponsor) => (
            <a
              key={`reverse-duplicate-1-${sponsor.id}`}
              href={sponsor.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 group"
            >
              <div className="w-32 h-20 bg-white rounded-lg flex items-center justify-center p-4 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:bg-gray-50">
                <img
                  src={sponsor.logo}
                  alt={sponsor.name}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    target.parentElement!.innerHTML = `<span class="text-slate-900 font-bold text-lg">${sponsor.name}</span>`
                  }}
                />
              </div>
            </a>
          ))}
          {/* Second duplicate set to ensure full row coverage */}
          {sponsors.slice().reverse().map((sponsor) => (
            <a
              key={`reverse-duplicate-2-${sponsor.id}`}
              href={sponsor.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 group"
            >
              <div className="w-32 h-20 bg-white rounded-lg flex items-center justify-center p-4 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:bg-gray-50">
                <img
                  src={sponsor.logo}
                  alt={sponsor.name}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    target.parentElement!.innerHTML = `<span class="text-slate-900 font-bold text-lg">${sponsor.name}</span>`
                  }}
                />
              </div>
            </a>
          ))}
          {/* Third duplicate set for extra coverage on large screens */}
          {sponsors.slice().reverse().map((sponsor) => (
            <a
              key={`reverse-duplicate-3-${sponsor.id}`}
              href={sponsor.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 group"
            >
              <div className="w-32 h-20 bg-white rounded-lg flex items-center justify-center p-4 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:bg-gray-50">
                <img
                  src={sponsor.logo}
                  alt={sponsor.name}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    target.parentElement!.innerHTML = `<span class="text-slate-900 font-bold text-lg">${sponsor.name}</span>`
                  }}
                />
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-12">
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            Haz clic en cualquier logo para visitar el sitio web del patrocinador
          </p>
        </div>
      </div>
    </section>
  )
}
