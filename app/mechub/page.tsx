"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Footer from "@/components/Footer"
import {
  Building2,
  Users,
  Wifi,
  Coffee,
  Calendar,
  MapPin,
  Mail,
  Send,
  Instagram,
  X,
  Info,
  CheckCircle,
} from "lucide-react"
import { useEffect, useState } from "react"
import MecHubNavbar from "@/components/MecHubNavbar"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export default function MecHubPage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalPlan, setModalPlan] = useState<string>("")
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/send-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Error al enviar el mensaje")
      }

      setFormData({ name: "", email: "", message: "" })
      setShowSuccessModal(true)
    } catch (err: any) {
      console.error("Error enviando mensaje:", err)
      alert(err.message || "Error al enviar el mensaje")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const openModal = (plan: string) => {
    setModalPlan(plan)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setModalPlan("")
  }

  const planDetails = {
    individual: {
      title: "Escritorio Individual",
      features: [
        "Escritorio dedicado con silla ergonómica",
        "WiFi de alta velocidad (500 Mbps)",
        "Acceso a áreas comunes 24/7",
        "Café, té y snacks ilimitados",
        "Casillero personal con llave",
        "Acceso a impresora y escáner",
        "Sala de descanso con sofás",
        "Cocina completamente equipada",
      ],
    },
    privada: {
      title: "Oficina Privada",
      features: [
        "Oficina privada para hasta 4 personas",
        "Sala de reuniones incluida (2 horas/día)",
        "Acceso completo a laboratorios de ingeniería",
        "Soporte técnico especializado",
        "Pizarra inteligente y proyector",
        "Sistema de videoconferencia profesional",
        "Almacenamiento seguro para equipos",
        "Servicio de limpieza diario",
        "Acceso prioritario a eventos",
      ],
    },
    eventos: {
      title: "Espacio para Eventos",
      features: [
        "Auditorio moderno para hasta 50 personas",
        "Equipos audiovisuales de última generación",
        "Sistema de sonido profesional",
        "Catering disponible (costo adicional)",
        "Soporte técnico completo durante el evento",
        "Transmisión en vivo disponible",
        "Estacionamiento gratuito para asistentes",
        "Servicio de seguridad",
        "Decoración personalizable",
      ],
    },
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden">
      {/* Background particles/stars effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </div>

      <MecHubNavbar />

      {/* Breadcrumbs - debajo del navbar */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 mt-28">
        <div className="flex items-center space-x-2 text-sm text-gray-300">
          <Link href="/" className="hover:text-[#e3a72f] transition-colors duration-200">
            Inicio
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-500" />
          <span className="text-[#e3a72f] font-medium">MecHub</span>
        </div>
      </div>

      {/* Hero section */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[85vh] text-center px-6">
        <div className="max-w-5xl mx-auto">

          <div className="mb-8 mt-4">
            <h1 className="text-6xl md:text-8xl font-black mb-4 bg-gradient-to-br from-white via-[#5f87ab] to-[#e3a72f] bg-clip-text text-transparent">
              MecHub
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-[#5f87ab] to-[#e3a72f] mx-auto rounded-full"></div>
          </div>

          <p className="text-2xl md:text-3xl text-gray-200 mb-8 max-w-3xl mx-auto font-light leading-relaxed">
            El primer <span className="text-[#e3a72f] font-semibold">coworking especializado</span> en ingeniería
            mecánica donde las ideas cobran vida
          </p>

          <div className="flex flex-col items-center gap-6 mb-12">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#e3a72f] to-[#d4961a] hover:from-[#d4961a] hover:to-[#c8851a] text-slate-900 font-bold px-10 py-4 text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <a href="#cotizar">Reservar Espacio</a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-[#5f87ab] text-[#5f87ab] hover:bg-[#5f87ab] hover:text-white px-10 py-4 text-lg bg-transparent backdrop-blur-sm"
              >
                <a href="#que-es">Descubrir Más</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* What is MecHub Section */}
      <section id="que-es" className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#5f87ab]">¿Qué es MecHub?</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              MecHub es el primer espacio de coworking especializado en ingeniería mecánica del ITBA. Un lugar donde
              estudiantes, profesionales y empresas se conectan para desarrollar proyectos innovadores.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-[#5f87ab] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-[#e3a72f]">Espacios Flexibles</h3>
                <p className="text-gray-300">
                  Oficinas privadas, espacios compartidos y salas de reuniones equipadas con la última tecnología para
                  proyectos de ingeniería.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-[#5f87ab] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-[#e3a72f]">Comunidad Especializada</h3>
                <p className="text-gray-300">
                  Conecta con ingenieros mecánicos, startups tecnológicas y empresas del sector en un ambiente
                  colaborativo único.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-[#5f87ab] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-[#e3a72f]">Eventos y Workshops</h3>
                <p className="text-gray-300">
                  Participa en charlas técnicas, workshops de innovación y eventos de networking especializados en
                  ingeniería mecánica.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3 bg-slate-800/30 p-4 rounded-lg">
              <Wifi className="w-6 h-6 text-[#e3a72f]" />
              <span className="text-gray-300">WiFi de alta velocidad</span>
            </div>
            <div className="flex items-center space-x-3 bg-slate-800/30 p-4 rounded-lg">
              <Coffee className="w-6 h-6 text-[#e3a72f]" />
              <span className="text-gray-300">Café y snacks</span>
            </div>
            <div className="flex items-center space-x-3 bg-slate-800/30 p-4 rounded-lg">
              <Building2 className="w-6 h-6 text-[#e3a72f]" />
              <span className="text-gray-300">Laboratorios equipados</span>
            </div>
            <div className="flex items-center space-x-3 bg-slate-800/30 p-4 rounded-lg">
              <MapPin className="w-6 h-6 text-[#e3a72f]" />
              <span className="text-gray-300">Ubicación privilegiada</span>
            </div>
          </div>
        </div>
      </section>

      <section id="cotizar" className="relative z-10 py-20 px-6 bg-slate-800/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#5f87ab]">Cotiza tu Espacio</h2>
            <p className="text-xl text-gray-300">
              Encuentra el espacio perfecto para tu proyecto. Desde escritorios individuales hasta oficinas completas.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="bg-slate-800/70 border-slate-600 backdrop-blur-sm min-h-[400px] flex flex-col">
              <CardContent className="p-10 text-center flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-6 text-[#e3a72f]">Escritorio Individual</h3>
                  <p className="text-gray-300 mb-8 text-lg">Espacio personal dedicado</p>
                  <ul className="text-left text-gray-300 space-y-3 mb-12">
                    <li>• Escritorio dedicado</li>
                    <li>• WiFi de alta velocidad</li>
                    <li>• Acceso a áreas comunes</li>
                  </ul>
                </div>
                <Button
                  variant="outline"
                  className="w-full border-[#e3a72f] text-[#e3a72f] hover:bg-[#e3a72f] hover:text-slate-900 bg-transparent py-3"
                  onClick={() => openModal("individual")}
                >
                  <Info className="w-4 h-4 mr-2" />
                  Ver más información
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/70 border-slate-600 backdrop-blur-sm min-h-[400px] flex flex-col">
              <CardContent className="p-10 text-center flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-6 text-[#e3a72f]">Oficina Privada</h3>
                  <p className="text-gray-300 mb-8 text-lg">Para equipos pequeños</p>
                  <ul className="text-left text-gray-300 space-y-3 mb-12">
                    <li>• Oficina privada para 4 personas</li>
                    <li>• Sala de reuniones incluida</li>
                    <li>• Acceso a laboratorios</li>
                  </ul>
                </div>
                <Button
                  variant="outline"
                  className="w-full border-[#e3a72f] text-[#e3a72f] hover:bg-[#e3a72f] hover:text-slate-900 bg-transparent py-3"
                  onClick={() => openModal("privada")}
                >
                  <Info className="w-4 h-4 mr-2" />
                  Ver más información
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/70 border-slate-600 backdrop-blur-sm min-h-[400px] flex flex-col">
              <CardContent className="p-10 text-center flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-6 text-[#e3a72f]">Espacio para Eventos</h3>
                  <p className="text-gray-300 mb-8 text-lg">Auditorio completo</p>
                  <ul className="text-left text-gray-300 space-y-3 mb-12">
                    <li>• Auditorio para 50 personas</li>
                    <li>• Equipos audiovisuales</li>
                    <li>• Catering disponible</li>
                  </ul>
                </div>
                <Button
                  variant="outline"
                  className="w-full border-[#e3a72f] text-[#e3a72f] hover:bg-[#e3a72f] hover:text-slate-900 bg-transparent py-3"
                  onClick={() => openModal("eventos")}
                >
                  <Info className="w-4 h-4 mr-2" />
                  Ver más información
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative bg-slate-800 rounded-lg p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-slate-600">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-[#e3a72f]">
                {planDetails[modalPlan as keyof typeof planDetails]?.title}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeModal}
                className="text-gray-400 hover:text-slate-900 hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white mb-4">Incluye:</h4>
              <ul className="space-y-3">
                {planDetails[modalPlan as keyof typeof planDetails]?.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-300">
                    <div className="w-2 h-2 bg-[#e3a72f] rounded-full mt-2 flex-shrink-0"></div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-6 border-t border-slate-600">
                <p className="text-gray-400 text-sm mb-4">
                  ¿Interesado en este plan? Contáctanos para más información sobre precios y disponibilidad.
                </p>
                <Button
                  className="w-full bg-[#e3a72f] hover:bg-[#d4961a] text-slate-900 font-semibold"
                  onClick={() => {
                    closeModal()
                    document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" })
                  }}
                >
                  Contactar para Cotización
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowSuccessModal(false)}
          ></div>
          <div className="relative bg-slate-800 rounded-lg p-8 max-w-md w-full border border-slate-600">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">¡Mensaje Enviado!</h3>
              <p className="text-gray-300 mb-6">
                Tu mensaje ha sido enviado correctamente. Nos pondremos en contacto contigo pronto.
              </p>
              <Button
                className="w-full bg-[#e3a72f] hover:bg-[#d4961a] text-slate-900 font-semibold"
                onClick={() => setShowSuccessModal(false)}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Form Section */}
      <section id="contacto" className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#5f87ab]">Contactanos</h2>
            <p className="text-xl text-gray-300">
              ¿Tienes alguna pregunta o quieres colaborar con nosotros? ¡Nos encantaría escucharte!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h3 className="text-2xl font-bold mb-8 text-[#e3a72f]">Información de Contacto</h3>

              <div className="space-y-6">
                <a
                  href="mailto:asme@itba.edu.ar?subject=&body="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-4 group"
                >
                  <div className="w-12 h-12 bg-[#e3a72f] rounded-full flex items-center justify-center transition-transform group-hover:scale-105">
                    <Mail className="w-6 h-6 text-slate-900" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Email</h4>
                    <p className="text-gray-300 group-hover:text-[#d4961a] transition-colors">asme@itba.edu.ar</p>
                  </div>
                </a>

                <a
                  href="https://maps.app.goo.gl/WXMedwKRqSLbR8MS8/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-4 group"
                >
                  <div className="w-12 h-12 bg-[#e3a72f] rounded-full flex items-center justify-center transition-transform group-hover:scale-105">
                    <MapPin className="w-6 h-6 text-slate-900" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Ubicación</h4>
                    <p className="text-gray-300 group-hover:text-[#d4961a] transition-colors">ITBA, Buenos Aires</p>
                  </div>
                </a>

                <a
                  href="https://www.instagram.com/asme.itba/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 group"
                >
                  <div className="w-12 h-12 bg-[#e3a72f] rounded-full flex items-center justify-center transition-transform group-hover:scale-105">
                    <Instagram className="w-6 h-6 text-slate-900" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Instagram</h4>
                    <span className="text-gray-300 group-hover:text-[#d4961a] transition-colors">@asme.itba</span>
                  </div>
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Nombre Completo
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-slate-800/50 border-slate-600 text-white placeholder-gray-400 focus:border-[#e3a72f] focus:ring-[#e3a72f]"
                    placeholder="Tu nombre completo"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-slate-800/50 border-slate-600 text-white placeholder-gray-400 focus:border-[#e3a72f] focus:ring-[#e3a72f]"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Mensaje
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="bg-slate-800/50 border-slate-600 text-white placeholder-gray-400 focus:border-[#e3a72f] focus:ring-[#e3a72f]"
                    placeholder="Cuéntanos sobre tu proyecto o consulta..."
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-[#e3a72f] hover:bg-[#d4961a] text-slate-900 font-semibold"
                  disabled={isSubmitting}
                >
                  <Send className="w-5 h-5 mr-2" />
                  {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
