"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Calendar, MapPin } from "lucide-react"
import { Evento } from "@/types/db_types"


export default function PastEvents( {events} : {events: Evento[]} ) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Validación para array vacío
  if (!events || events.length === 0) {
    return (
      <section className="relative z-10 py-20 px-6 bg-slate-800/30">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#5f87ab]">Eventos Pasados</h2>
          <p className="text-xl text-gray-300">No hay eventos disponibles</p>
          <p className="text-sm text-gray-400 mt-2">Events length: {events?.length || 0}</p>
        </div>
      </section>
    );
  }

  const nextEvent = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === events.length - 1 ? 0 : prevIndex + 1
    )
  }

  const prevEvent = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? events.length - 1 : prevIndex - 1
    )
  }

  const goToEvent = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <section className="relative z-10 py-20 px-6 bg-slate-800/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#5f87ab]">Eventos Pasados</h2>
          <p className="text-xl text-gray-300">
            Revive los momentos más destacados de nuestros eventos anteriores
          </p>
        </div>

        {/* Main Event Display */}
        <div className="relative mb-12">
          <div className="bg-slate-800/70 border border-slate-600 rounded-2xl overflow-hidden backdrop-blur-sm">
            <div className="grid md:grid-cols-2 gap-0 min-h-[500px]">
              {/* Image Section */}
              <div className="relative h-64 md:h-full">{
                  events[currentIndex].imagen_url && 
                  <Image
                    src={events[currentIndex].imagen_url}
                    alt={events[currentIndex].nombre}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={currentIndex === 0}
                  />
                }

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>

              {/* Content Section */}
              <div className="p-8 md:p-12 flex flex-col justify-center bg-slate-800/90">
                <div className="mb-4">
                  <div className="flex items-center text-[#e3a72f] text-sm font-medium mb-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(events[currentIndex].fecha).toLocaleDateString()}  {/* se puede asi o que el tipo tenga isostring directo */}
                  </div>
                  <div className="flex items-center text-[#5f87ab] text-sm font-medium mb-4">
                    <MapPin className="w-4 h-4 mr-2" />
                    {events[currentIndex].direccion}
                  </div>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                  {events[currentIndex].nombre}
                </h3>

                <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                  {events[currentIndex].descripcion}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <Button
            onClick={prevEvent}
            className="hover:cursor-pointer absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white border-0 rounded-full w-12 h-12 p-0 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
            size="icon"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          <Button
            onClick={nextEvent}
            className="hover:cursor-pointer absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white border-0 rounded-full w-12 h-12 p-0 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
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
                index === currentIndex 
                  ? 'bg-[#e3a72f] scale-125' 
                  : 'bg-slate-600 hover:bg-slate-500'
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
