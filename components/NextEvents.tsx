"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar, MapPin, Clock } from "lucide-react"
import type { Evento } from "@/types/db_types"

export default function NextEvents({ events }: { events: Evento[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Validación para array vacío
  if (!events || events.length === 0) {
    return (
      <section className="relative z-10 py-20 px-6 bg-slate-800/30">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#5f87ab]">Próximos Eventos</h2>
          <p className="text-xl text-gray-300">No hay eventos disponibles</p>
        </div>
      </section>
    )
  }

  const nextEvent = () => {
    setCurrentIndex((prevIndex) => (prevIndex === events.length - 1 ? 0 : prevIndex + 1))
  }

  const prevEvent = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? events.length - 1 : prevIndex - 1))
  }

  const goToEvent = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <section className="relative z-10 py-20 px-6 bg-gradient-to-br from-slate-900/40 to-slate-800/60">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#5f87ab]">Próximos Eventos</h2>
          <p className="text-xl text-gray-300">
            No te pierdas nuestras actividades y oportunidades de crecimiento profesional
          </p>
        </div>

        {/* Main Event Display */}
        <div className="relative mb-12">
          <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 border border-slate-500/50 rounded-2xl overflow-hidden backdrop-blur-sm shadow-2xl">
            <div className="grid md:grid-cols-2 gap-0 min-h-[500px]">
              {/* Image Section */}
              <div className="relative h-64 md:h-full">
                {events[currentIndex].imagen_url && (
                  <Image
                    src={events[currentIndex].imagen_url || "/placeholder.svg"}
                    alt={events[currentIndex].nombre}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={currentIndex === 0}
                  />
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>

              {/* Content Section */}
              <div className="p-8 md:p-12 flex flex-col justify-center bg-slate-800/90">
                <div className="mb-4">
                  <div className="flex flex-wrap items-center gap-4 text-[#e3a72f] text-sm font-medium mb-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(events[currentIndex].fecha).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {events[currentIndex].direccion}
                    </div>
                  </div>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">{events[currentIndex].nombre}</h3>

                <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-6">
                  {events[currentIndex].descripcion}
                </p>

                <div className="flex flex-wrap gap-3">
                  <a href={events[currentIndex].link} target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="bg-[#e3a72f] hover:bg-[#d4961a] text-black px-8 py-3">
                      Inscribirse
                    </Button>
                  </a>

                  {events[currentIndex].pagina_evento && (
                    <Link href={`/${events[currentIndex].pagina_evento}`}>
                      <Button size="lg" className="bg-[#f2f1e8] hover:bg-[#e8e7dc] text-black px-8 py-3">
                        Ver Detalles
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <Button
            onClick={prevEvent}
            className="hover:cursor-pointer absolute left-4 top-1/2 transform -translate-y-1/2 bg-[#e3a72f]/20 hover:bg-[#e3a72f]/40 text-white border border-[#e3a72f]/30 rounded-full w-12 h-12 p-0 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
            size="icon"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          <Button
            onClick={nextEvent}
            className="hover:cursor-pointer absolute right-4 top-1/2 transform -translate-y-1/2 bg-[#e3a72f]/20 hover:bg-[#e3a72f]/40 text-white border border-[#e3a72f]/30 rounded-full w-12 h-12 p-0 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
            size="icon"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>

        {/* Event Indicators */}
        <div className="flex justify-center space-x-2 mb-8">
          {events.map((_, index) => (
            <button
              key={index}
              onClick={() => goToEvent(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-[#e3a72f] scale-125" : "bg-slate-600 hover:bg-slate-500"
              }`}
            />
          ))}
        </div>

        {/* Event Counter */}
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            Evento {currentIndex + 1} de {events.length}
          </p>
        </div>
      </div>
    </section>
  )
}
