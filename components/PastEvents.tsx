"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Calendar, MapPin } from "lucide-react"

interface PastEvent {
  id: number
  title: string
  date: string
  location: string
  description: string
  image: string
}

const pastEvents: PastEvent[] = [
  {
    id: 1,
    title: "Charla: Energías Renovables",
    date: "10 de Diciembre, 2024",
    location: "Aula Magna ITBA",
    description: "Conferencia sobre el futuro de las energías renovables y su impacto en la ingeniería mecánica moderna.",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=600&fit=crop"
  },
  {
    id: 2,
    title: "Competencia de Robótica",
    date: "25 de Noviembre, 2024",
    location: "Laboratorios ITBA",
    description: "Desafío anual de diseño y programación de robots con participación de estudiantes de toda la universidad.",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop"
  },
  {
    id: 3,
    title: "Workshop: Impresión 3D",
    date: "15 de Noviembre, 2024",
    location: "FabLab ITBA",
    description: "Taller práctico sobre tecnologías de impresión 3D y sus aplicaciones en ingeniería mecánica.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop"
  },
  {
    id: 4,
    title: "Networking con Empresas",
    date: "5 de Noviembre, 2024",
    location: "Auditorio Principal",
    description: "Evento de networking con representantes de las principales empresas del sector industrial.",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=600&fit=crop"
  },
  {
    id: 5,
    title: "Charla: Industria 4.0",
    date: "20 de Octubre, 2024",
    location: "Aula Magna ITBA",
    description: "Presentación sobre la cuarta revolución industrial y sus implicaciones para los ingenieros mecánicos.",
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop"
  },
  {
    id: 6,
    title: "Visita Técnica a Planta",
    date: "10 de Octubre, 2024",
    location: "Planta Industrial",
    description: "Visita guiada a una planta industrial para conocer procesos de manufactura avanzada.",
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop"
  }
]

export default function PastEvents() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextEvent = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === pastEvents.length - 1 ? 0 : prevIndex + 1
    )
  }

  const prevEvent = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? pastEvents.length - 1 : prevIndex - 1
    )
  }

  const goToEvent = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <section className="relative z-10 py-20 px-6 bg-slate-800/30">
      <div className="max-w-6xl mx-auto">
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
              <div className="relative h-64 md:h-full">
                <Image
                  src={pastEvents[currentIndex].image}
                  alt={pastEvents[currentIndex].title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={currentIndex === 0}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>

              {/* Content Section */}
              <div className="p-8 md:p-12 flex flex-col justify-center bg-slate-800/90">
                <div className="mb-4">
                  <div className="flex items-center text-[#e3a72f] text-sm font-medium mb-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    {pastEvents[currentIndex].date}
                  </div>
                  <div className="flex items-center text-[#5f87ab] text-sm font-medium mb-4">
                    <MapPin className="w-4 h-4 mr-2" />
                    {pastEvents[currentIndex].location}
                  </div>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                  {pastEvents[currentIndex].title}
                </h3>

                <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                  {pastEvents[currentIndex].description}
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
          {pastEvents.map((_, index) => (
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
            Evento {currentIndex + 1} de {pastEvents.length}
          </p>
        </div>
      </div>
    </section>
  )
}
