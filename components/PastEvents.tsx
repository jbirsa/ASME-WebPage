"use client"

import Image from "next/image"
import { MapPin } from "lucide-react"
import type { Evento } from "@/types/db_types"
import { formatEventDate } from "@/lib/date"
import { useEffect } from "react"
import AOS from "aos"
import "aos/dist/aos.css"

export default function PastEvents({ events }: { events: Evento[] }) {
  useEffect(() => {
    AOS.refresh()
  }, [events])

  // Validación para array vacío
  if (!events || events.length === 0) {
    return (
      <section className="relative z-10 py-20 px-6 bg-slate-800/30" data-aos="fade-up">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#5f87ab]" data-aos="fade-up" data-aos-delay="100">
            Eventos Pasados
          </h2>
          <p className="text-xl text-gray-300" data-aos="fade-up" data-aos-delay="200">
            No hay eventos disponibles
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="relative z-10 py-20 px-6 bg-gradient-to-b from-slate-800/20 to-slate-700/40">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#5f87ab]" data-aos="fade-up" data-aos-delay="100">
            Eventos Pasados
          </h2>
          <p className="text-xl text-gray-300" data-aos="fade-up" data-aos-delay="200">
            Revive los momentos más destacados de nuestros eventos anteriores
          </p>
        </div>

        {/* Timeline Layout */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#e3a72f] via-[#5f87ab] to-transparent transform md:-translate-x-px"></div>

          <div className="space-y-12">
            {events.map((event, index) => {
              const isEven = index % 2 === 0
              const delay = 150 * index
              const animation = isEven ? "fade-right" : "fade-left"

              return (
                <div
                  key={index}
                  className={`relative flex items-center ${isEven ? "md:flex-row" : "md:flex-row-reverse"}`}
                  data-aos={animation}
                  data-aos-delay={delay}
                >
                {/* Timeline dot */}
                <div className="absolute left-6 md:left-1/2 w-4 h-4 bg-[#e3a72f] rounded-full border-4 border-slate-800 transform md:-translate-x-1/2 z-10"></div>

                {/* Event card */}
                <div
                  className={`w-full md:w-5/12 ml-16 md:ml-0 ${isEven ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8"}`}
                >
                  <div className="bg-slate-700/60 border border-slate-500/30 rounded-xl overflow-hidden backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 group">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      {event.imagen_url && (
                        <Image
                          src={event.imagen_url || "/placeholder.svg"}
                          alt={event.nombre}
                          fill
                          className="object-cover grayscale-[50%] group-hover:grayscale-[20%] transition-all duration-300"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>

                      {/* Date badge */}
                      <div className="absolute top-4 left-4 bg-[#e3a72f]/90 text-slate-900 px-3 py-1 rounded-full text-sm font-semibold">
                        {formatEventDate(event.fecha, "es-ES", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-3 text-white group-hover:text-[#e3a72f] transition-colors">
                        {event.nombre}
                      </h3>

                      <p className="text-gray-300 text-sm mb-4 leading-relaxed">{event.descripcion}</p>

                      {/* Location and time info */}
                      <div className="flex flex-wrap items-center gap-4 text-[#e3a72f] text-xs">
                        <div className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {event.direccion}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
