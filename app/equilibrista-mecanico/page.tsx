"use client"
import { Button } from "@/components/ui/button"
import { Users, Clock, Target, Zap, ArrowLeft, Download } from "lucide-react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import Link from "next/link"
import Image from "next/image"

export default function EquilibristaMecanicoPage() {
  const registrationLink = "https://docs.google.com/forms/d/e/1FAIpQLScYhdWtIKKIqRMDDSoT8d6w0HhZBWGIE4nip30WjdLyz3IxTg/viewform?usp=dialog"

  return (
    <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden">
      {/* Background particles/stars effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </div>

      <Navbar />

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center text-[#e3a72f] hover:text-[#d4961a] mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver al inicio
          </Link>

          <div className="text-center mb-16">
            <div className="inline-block bg-[#5f87ab] text-white px-4 py-2 rounded-full text-sm font-medium mb-8">
              Competencia ASME ITBA
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-[#e3a72f]">Equilibrista Mecánico</h1>

            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-8">
              Diseñá, prototipá y probá un "caminante invertido" capaz de cruzar rápidamente una cuerda suspendida
            </p>

            <div className="flex justify-center mb-12">
              <Image
                src="/equilibrista-mecanico.png"
                alt="Ejemplo de caminante invertido"
                width={500}
                height={300}
                className="rounded-lg border border-slate-600"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Competition Details */}
      <section className="relative z-10 py-20 px-6 bg-slate-800/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center text-[#5f87ab]">Detalles de la Competencia</h2>

          <div className="space-y-8 mb-16">
            {/* Primary info - hero style */}
            <div className="bg-gradient-to-r from-[#e3a72f]/20 via-[#5f87ab]/10 to-transparent p-8 rounded-2xl border-l-8 border-[#e3a72f]">
              <div className="flex items-start gap-6">
                <div className="bg-[#e3a72f] p-4 rounded-full">
                  <Target className="w-8 h-8 text-slate-900" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">Objetivo Principal</h3>
                  <p className="text-lg text-gray-200 leading-relaxed">
                    Diseñar un robot autónomo capaz de recorrer{" "}
                    <span className="text-[#e3a72f] font-semibold">2 metros de cuerda suspendida</span> sin usar ruedas
                    para tracción. El desafío combina ingeniería mecánica, creatividad y optimización.
                  </p>
                  <p className="text-gray-300 mt-4">
                    Los caminadores deben presentar una <strong className="text-[#e3a72f]">temática creativa</strong> -
                    desde personajes ficticios hasta inspiración en la naturaleza.
                  </p>
                </div>
              </div>
            </div>

            {/* Secondary info - asymmetric grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-slate-700/40 p-6 rounded-xl border border-slate-600/50">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-6 h-6 text-[#5f87ab]" />
                  <h3 className="text-xl font-semibold text-white">Formación de Equipos</h3>
                </div>
                <p className="text-gray-300 mb-3">
                  Hasta <strong className="text-[#e3a72f]">4 integrantes</strong> por equipo
                </p>
                <p className="text-sm text-gray-400">
                  Abierto a estudiantes de todas las carreras, sin importar el año de cursada
                </p>
              </div>

              <div className="bg-gradient-to-br from-[#5f872f]/20 to-slate-800/60 p-6 rounded-xl border border-[#5f872f]/30">
                <div className="text-center">
                  <Clock className="w-8 h-8 text-[#e3a72f] mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-2">Meta de Velocidad</h3>
                  <div className="text-3xl font-bold text-[#e3a72f]">2m/min</div>
                </div>
              </div>
            </div>

            {/* Technical specs - inline style */}
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="bg-slate-800/60 px-6 py-4 rounded-full border border-slate-600/40">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-[#e3a72f]" />
                  <span className="text-white font-medium">Motor CC 12V - 1.5W</span>
                  <span className="text-gray-400 text-sm">(incluido)</span>
                </div>
              </div>
              <div className="bg-slate-800/60 px-6 py-4 rounded-full border border-slate-600/40">
                <span className="text-white">
                  Tamaño máximo: <span className="text-[#e3a72f] font-semibold">12×18×30 cm³</span>
                </span>
              </div>
              <div className="bg-slate-800/60 px-6 py-4 rounded-full border border-slate-600/40">
                <span className="text-white">
                  Debe ser <span className="text-[#e3a72f] font-semibold">completamente autónomo</span>
                </span>
              </div>
            </div>
          </div>

          <div className="mb-16">
            <h3 className="text-3xl font-bold mb-8 text-center text-[#5f87ab]">Criterios de Evaluación</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-slate-800/40 p-6 rounded-xl border-l-4 border-[#e3a72f]">
                <h4 className="text-xl font-bold text-[#e3a72f] mb-2">Tiempo de Recorrido</h4>
                <div className="text-3xl font-bold text-white mb-2">3 pts</div>
                <p className="text-gray-400 text-sm">El factor más importante</p>
              </div>

              <div className="bg-slate-800/40 p-6 rounded-xl border-l-4 border-[#5f87ab]">
                <h4 className="text-xl font-bold text-[#5f87ab] mb-2">Diseño Mecánico</h4>
                <div className="text-3xl font-bold text-white mb-2">2 pts</div>
                <p className="text-gray-400 text-sm">Originalidad del diseño</p>
              </div>

              <div className="bg-slate-800/40 p-6 rounded-xl border-l-4 border-green-500">
                <h4 className="text-xl font-bold text-green-400 mb-2">Eficiencia</h4>
                <div className="text-3xl font-bold text-white mb-2">2 pts</div>
                <p className="text-gray-400 text-sm">Relación velocidad-peso</p>
              </div>

              <div className="bg-slate-800/40 p-6 rounded-xl border-l-4 border-purple-500">
                <h4 className="text-xl font-bold text-purple-400 mb-2">Estética</h4>
                <div className="text-3xl font-bold text-white mb-2">1.5 pts</div>
                <p className="text-gray-400 text-sm">Diseño visual y temática</p>
              </div>

              <div className="bg-slate-800/40 p-6 rounded-xl border-l-4 border-orange-500">
                <h4 className="text-xl font-bold text-orange-400 mb-2">Estabilidad</h4>
                <div className="text-3xl font-bold text-white mb-2">1.5 pts</div>
                <p className="text-gray-400 text-sm">Reducción de vibraciones</p>
              </div>

              <div className="bg-slate-800/40 p-6 rounded-xl border-l-4 border-yellow-500">
                <h4 className="text-xl font-bold text-yellow-400 mb-2">Memoria Técnica</h4>
                <div className="text-3xl font-bold text-white mb-2">+1 pt</div>
                <p className="text-gray-400 text-sm">Documentación del diseño</p>
              </div>
            </div>
          </div>

          <div className="text-center space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                className="bg-[#e3a72f] hover:bg-[#d4961a] text-slate-900 font-semibold px-8 py-3 text-lg"
              >
                <a href= {registrationLink} target="_blank" rel="noopener noreferrer">
                  Inscribirse Ahora
                </a>
              </Button>

              <Button
                asChild
                variant="outline"
                className="border-slate-600 text-white hover:bg-slate-800 px-8 py-3 text-lg bg-transparent"
              >
                <a href="/reglamento-equilibrista-mecanico.pdf" download>
                  <Download className="w-5 h-5 mr-2" />
                  Descargar Reglamento Completo
                </a>
              </Button>
            </div>

            <p className="text-gray-400 text-sm max-w-2xl mx-auto">
              Para información detallada sobre requisitos técnicos, materiales proporcionados y proceso de la
              competencia, descarga el reglamento completo.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
