"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Clock, Target, Zap, Download, CheckCircle, ArrowLeft } from "lucide-react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import Link from "next/link"
import Image from "next/image"

export default function EquilibristaMecanicoPage() {
  const [formData, setFormData] = useState({
    teamName: "",
    leaderName: "",
    leaderEmail: "",
    leaderCareer: "",
    member2Name: "",
    member2Email: "",
    member2Career: "",
    member3Name: "",
    member3Email: "",
    member3Career: "",
    member4Name: "",
    member4Email: "",
    member4Career: "",
    additionalInfo: "",
  })

  const [isSubmitted, setIsSubmitted] = useState(false)

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

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <Card className="bg-slate-800/70 border-slate-600 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-[#e3a72f] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-slate-900" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-[#e3a72f]">Objetivo</h3>
                <p className="text-gray-300 text-sm">Recorrer 2 metros de cuerda sin usar ruedas para tracción</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/70 border-slate-600 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-[#e3a72f] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-slate-900" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-[#e3a72f]">Equipos</h3>
                <p className="text-gray-300 text-sm">Hasta 4 integrantes por equipo</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/70 border-slate-600 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-[#e3a72f] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-slate-900" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-[#e3a72f]">Velocidad</h3>
                <p className="text-gray-300 text-sm">Meta recomendada: 2m/min</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/70 border-slate-600 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-[#e3a72f] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-slate-900" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-[#e3a72f]">Motor</h3>
                <p className="text-gray-300 text-sm">Motor CC 12V - 1.5W incluido</p>
              </CardContent>
            </Card>
          </div>

          {/* Scoring Criteria */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold mb-8 text-center text-[#5f87ab]">Criterios de Evaluación</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-slate-800/70 border-slate-600">
                <CardContent className="p-4">
                  <h4 className="text-xl font-bold mb-3 text-[#e3a72f]">Tiempo de Recorrido</h4>
                  <p className="text-3xl font-bold text-white mb-2">3 pts</p>
                  <p className="text-gray-300 text-sm">El factor más importante</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/70 border-slate-600">
                <CardContent className="p-4">
                  <h4 className="text-xl font-bold mb-3 text-[#e3a72f]">Diseño Mecánico</h4>
                  <p className="text-3xl font-bold text-white mb-2">2 pts</p>
                  <p className="text-gray-300 text-sm">Originalidad del diseño.</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/70 border-slate-600">
                <CardContent className="p-4">
                  <h4 className="text-xl font-bold mb-3 text-[#e3a72f]">Eficiencia</h4>
                  <p className="text-3xl font-bold text-white mb-2">2 pts</p>
                  <p className="text-gray-300 text-sm">Relación velocidad-peso</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/70 border-slate-600">
                <CardContent className="p-4">
                  <h4 className="text-xl font-bold mb-3 text-[#e3a72f]">Estética</h4>
                  <p className="text-3xl font-bold text-white mb-2">1.5 pts</p>
                  <p className="text-gray-300 text-sm">Diseño visual y temática</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/70 border-slate-600">
                <CardContent className="p-4">
                  <h4 className="text-xl font-bold mb-3 text-[#e3a72f]">Estabilidad</h4>
                  <p className="text-3xl font-bold text-white mb-2">1.5 pts</p>
                  <p className="text-gray-300 text-sm">Reducción de vibraciones</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/70 border-slate-600">
                <CardContent className="p-4">
                  <h4 className="text-xl font-bold mb-3 text-[#e3a72f]">Memoria Técnica</h4>
                  <p className="text-3xl font-bold text-white mb-2">+1 pt</p>
                  <p className="text-gray-300 text-sm">Documentación del diseño</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Download Regulation */}
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-6 text-[#5f87ab]">Reglamento Completo</h3>
            <p className="text-gray-300 mb-8">
              Descargá el reglamento completo con todas las especificaciones técnicas y requisitos
            </p>
            <a href="/reglamento-equilibrista-mecanico.pdf" download>
              <Button size="lg" className="bg-[#5f87ab] hover:bg-[#4a6b87] text-white px-8 py-3">
                <Download className="w-5 h-5 mr-2" />
                Descargar Reglamento PDF
              </Button>
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
