"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Footer from "@/components/Footer"
import React from "react"
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
  Medal,
  Award,
  Crown,
  ChevronRight,
} from "lucide-react"
import { useEffect, useState } from "react"
import MecHubNavbar from "@/components/MecHubNavbar"
import Link from "next/link"
import AOS from "aos"
import "aos/dist/aos.css"

const planKeys = ["silver", "gold", "platinum"] as const
type PlanKey = (typeof planKeys)[number]

const planConfig: Record<
  PlanKey,
  {
    title: string
    icon: React.ElementType
    ring: string
    cardBg: string
    tableBg: string
    tableText: string
    tableCellBg: string
  }
> = {
  silver: {
    title: "Silver",
    icon: Medal,
    ring: "from-slate-500 to-slate-300",
    cardBg: "from-slate-700/20 to-slate-500/10",
    tableBg: "bg-gradient-to-r from-slate-300/80 to-slate-500/80",
    tableText: "text-slate-900",
    tableCellBg: "bg-slate-500/15",
  },
  gold: {
    title: "Gold",
    icon: Award,
    ring: "from-amber-400 to-yellow-600",
    cardBg: "from-amber-700/20 to-yellow-500/10",
    tableBg: "bg-gradient-to-r from-amber-300/80 to-amber-500/80",
    tableText: "text-slate-900",
    tableCellBg: "bg-amber-400/15",
  },
  platinum: {
    title: "Platinum",
    icon: Crown,
    ring: "from-violet-400 to-fuchsia-500",
    cardBg: "from-fuchsia-700/20 to-violet-500/10",
    tableBg: "bg-gradient-to-r from-violet-400/80 to-fuchsia-500/80",
    tableText: "text-white",
    tableCellBg: "bg-fuchsia-500/15",
  },
}

const benefitMatrix: {
  label: string
  availability: Record<PlanKey, "yes" | "no" | "na">
}[] = [
  {
    label: "Entrega de folletería y merchandising a participantes del evento",
    availability: { silver: "yes", gold: "yes", platinum: "yes" },
  },
  {
    label: "Inclusión del logo en redes sociales y en el evento principal (MecHub)",
    availability: { silver: "yes", gold: "yes", platinum: "yes" },
  },
  {
    label: "Acceso a perfiles (CVs) de participantes del evento (con su consentimiento)",
    availability: { silver: "no", gold: "yes", platinum: "yes" },
  },
  {
    label: "Presentación y charla individual en la zona principal del evento",
    availability: { silver: "no", gold: "no", platinum: "yes" },
  },
  {
    label: "Publicación de un post dedicado a la empresa en las redes sociales de la asociación",
    availability: { silver: "no", gold: "no", platinum: "yes" },
  },
  {
    label: "Stand con capacidad para demostraciones y exhibición de objetos de gran escala",
    availability: { silver: "no", gold: "no", platinum: "yes" },
  },
  {
    label: "Stand pequeño en el área de exhibición",
    availability: { silver: "yes", gold: "yes", platinum: "na" },
  },
]

const highlightMap: Record<PlanKey, number[]> = {
  silver: [0, 1, 6],
  gold: [0, 1, 2],
  platinum: [3, 4, 5],
}

const planFeatures: Record<PlanKey, { features: string[]; highlights: string[] }> = planKeys.reduce(
  (acc, planKey) => {
    const features = benefitMatrix
      .filter((benefit) => benefit.availability[planKey] === "yes")
      .map((benefit) => benefit.label)

    const highlights = highlightMap[planKey].map((index) => benefitMatrix[index].label)

    acc[planKey] = { features, highlights }
    return acc
  },
  {} as Record<PlanKey, { features: string[]; highlights: string[] }>,
)

const cardAnimationDelays = [300, 600, 900] as const

export default function MecHubPage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalPlan, setModalPlan] = useState<PlanKey | "">("")
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const activePlanConfig = modalPlan ? planConfig[modalPlan] : null
  const modalHighlights = modalPlan ? planFeatures[modalPlan].highlights : []
  const modalFeatures = modalPlan ? planFeatures[modalPlan].features : []
  const orderedModalFeatures = modalPlan
    ? [...modalHighlights, ...modalFeatures.filter((feature) => !modalHighlights.includes(feature))]
    : []
  const modalHighlightsSet = new Set(modalHighlights)
  const ModalIcon = activePlanConfig?.icon

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

  const openModal = (plan: PlanKey) => {
    setModalPlan(plan)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setModalPlan("")
  }

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: true,
    })

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
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
        <div className="max-w-5xl mx-auto" data-aos="fade-up">

          <div className="mb-8 mt-4" data-aos="fade-up" data-aos-delay="100">
            <h1 className="text-6xl md:text-8xl font-black mb-4 bg-gradient-to-br from-white via-[#5f87ab] to-[#e3a72f] bg-clip-text text-transparent">
              MecHub
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-[#5f87ab] to-[#e3a72f] mx-auto rounded-full"></div>
          </div>

          <p
            className="text-2xl md:text-3xl text-gray-200 mb-8 max-w-3xl mx-auto font-light leading-relaxed"
            data-aos="fade-up"
            data-aos-delay="150"
          >
            La feria que conecta <span className="text-[#e3a72f] font-semibold">empresas y estudiantes</span> de
            ingeniería para mostrar tecnología, compartir experiencias y abrir oportunidades laborales.
          </p>

          <div className="flex flex-col items-center gap-6 mb-12" data-aos="fade-up" data-aos-delay="200">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#e3a72f] to-[#d4961a] hover:from-[#d4961a] hover:to-[#c8851a] text-slate-900 font-bold px-10 py-4 text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <a href="#planes">Planes de Sponsoreo</a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-[#5f87ab] text-[#5f87ab] hover:bg-[#5f87ab] hover:text-white px-10 py-4 text-lg bg-transparent backdrop-blur-sm"
              >
                <a href="#que-es">Descubrir MecHub</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* What is MecHub Section */}
      <section id="que-es" className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#5f87ab]">¿Qué es MecHub?</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              En el marco de fomentar el acercamiento entre empresas y estudiantes, organizamos el MecHub en la sede
              Tecnológico del ITBA: una feria que reúne a estudiantes de todas las carreras interesados en los sectores
              automotriz, aeroespacial, agropecuario, energías y materiales.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm" data-aos="zoom-in" data-aos-delay="0">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-[#5f87ab] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-[#e3a72f]">Experiencia Interactiva</h3>
                <p className="text-gray-300">Charlas, demos de producto y actividades para conocer cómo es trabajar en cada sector.</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm" data-aos="zoom-in" data-aos-delay="150">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-[#5f87ab] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-[#e3a72f]">Conexión Empresa–Alumno</h3>
                <p className="text-gray-300">Espacio para contar la historia de la empresa y su propuesta de valor a futuros talentos.</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm" data-aos="zoom-in" data-aos-delay="300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-[#5f87ab] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-[#e3a72f]">Sectores</h3>
                <p className="text-gray-300">Automotriz, aeroespacial, agro, energías (renovables y convencionales) y materiales.</p>
              </CardContent>
            </Card>
          </div>

          {/* Beneficios destacados para sponsors */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3 bg-slate-800/30 p-4 rounded-lg" data-aos="fade-up" data-aos-delay="0">
              <Wifi className="w-6 h-6 text-[#e3a72f]" />
              <span className="text-gray-300">Visibilidad en evento y redes</span>
            </div>
            <div className="flex items-center space-x-3 bg-slate-800/30 p-4 rounded-lg" data-aos="fade-up" data-aos-delay="100">
              <Coffee className="w-6 h-6 text-[#e3a72f]" />
              <span className="text-gray-300">Acceso a talento y networking</span>
            </div>
            <div className="flex items-center space-x-3 bg-slate-800/30 p-4 rounded-lg" data-aos="fade-up" data-aos-delay="200">
              <Building2 className="w-6 h-6 text-[#e3a72f]" />
              <span className="text-gray-300">Espacios de exhibición y demos</span>
            </div>
            <div className="flex items-center space-x-3 bg-slate-800/30 p-4 rounded-lg" data-aos="fade-up" data-aos-delay="300">
              <MapPin className="w-6 h-6 text-[#e3a72f]" />
              <span className="text-gray-300">Presencia de marca en el ITBA</span>
            </div>
          </div>
        </div>
      </section>
      {/* Planes de Sponsoreo */}
      <section id="planes" className="relative z-10 py-20 px-6 bg-slate-800/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#5f87ab]">Planes de Sponsoreo</h2>
            <p className="text-xl text-gray-300">Elegí el plan que mejor se adapte a tus objetivos</p>
          </div>

          <div className="md:hidden space-y-8 mb-16">
            {planKeys.map((planKey, idx) => {
              const config = planConfig[planKey]
              const Icon = config.icon
              const highlightFeatures = planFeatures[planKey].highlights
              const remainingBenefits = planFeatures[planKey].features.length - highlightFeatures.length

              return (
                <Card
                  key={planKey}
                  className="relative overflow-hidden bg-slate-800/70 border-slate-600 backdrop-blur-sm flex flex-col hover:border-[#e3a72f]/60 transition-all duration-200"
                  data-aos="fade-up"
                  data-aos-delay={cardAnimationDelays[idx]}
                >
                  <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${config.cardBg}`} />
                  <CardContent className="p-10 text-center flex-1 flex flex-col justify-between">
                    <div>
                      <div className={`mx-auto mb-5 w-16 h-16 rounded-full p-[2px] bg-gradient-to-br ${config.ring}`}>
                        <div className="w-full h-full rounded-full bg-slate-900/90 flex items-center justify-center">
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold mb-1 text-white">{config.title}</h3>
                      <ul className="grid gap-3 text-left text-gray-300 sm:grid-cols-2">
                        {highlightFeatures.map((feature) => (
                          <li key={feature} className="flex items-start gap-3 leading-relaxed">
                            <CheckCircle className="w-5 h-5 text-[#e3a72f] mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      {remainingBenefits > 0 && (
                        <p className="text-xs text-gray-400 mt-4">
                          + {remainingBenefits} beneficio{remainingBenefits > 1 ? "s" : ""} adicional{remainingBenefits > 1 ? "es" : ""}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      className="mt-8 w-full border-[#e3a72f] text-[#e3a72f] hover:bg-[#e3a72f] hover:text-slate-900 bg-transparent py-3"
                      onClick={() => openModal(planKey)}
                    >
                      <Info className="w-4 h-4 mr-2" />
                      Ver beneficios completos
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="hidden md:block mb-16" data-aos="fade-up">
            <div className="overflow-x-auto rounded-2xl border border-slate-700/60 bg-slate-900/60 backdrop-blur-sm">
              <div className="grid grid-cols-[1.15fr_repeat(3,0.85fr)] w-full">
                <div className="px-4 py-5 text-sm font-semibold uppercase tracking-wide text-gray-300 border-b border-slate-800/60">
                  Beneficio
                </div>
                {planKeys.map((planKey, idx) => (
                  <div
                    key={`header-${planKey}`}
                    className={`px-4 py-5 text-center text-sm font-semibold uppercase tracking-wide border-b border-l border-slate-800/60 ${planConfig[planKey].tableBg} ${planConfig[planKey].tableText}`}
                    data-aos="fade-up"
                    data-aos-delay={cardAnimationDelays[idx]}
                  >
                    <div className="text-lg">{planConfig[planKey].title}</div>

                  </div>
                ))}

                {benefitMatrix.map((benefit, rowIndex) => (
                  <React.Fragment key={benefit.label}>
                    <div
                      className={`px-4 py-4 text-sm text-gray-200 border-b border-slate-800/60 ${
                        rowIndex % 2 === 0 ? "bg-slate-900/70" : "bg-slate-900/50"
                      }`}
                    >
                      {benefit.label}
                    </div>

                    {planKeys.map((planKey, idx) => {
                      const status = benefit.availability[planKey]

                      return (
                        <div
                          key={`${benefit.label}-${planKey}`}
                          className={`px-4 py-4 border-b border-l border-slate-800/60 flex items-center justify-center ${planConfig[planKey].tableCellBg}`}
                          data-aos="fade-up"
                          data-aos-delay={cardAnimationDelays[idx]}
                        >
                          {status === "yes" && <CheckCircle className="w-5 h-5 text-emerald-400" />}
                          {status === "no" && <X className="w-5 h-5 text-rose-400" />}
                          {status === "na" && <span className="text-gray-500 text-lg leading-none">–</span>}
                        </div>
                      )
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Ideas y beneficios adicionales */}
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-[#e3a72f] text-center">Ideas y beneficios adicionales</h3>
            <ul className="grid md:grid-cols-2 gap-3 text-gray-300">
              <li>• Patrocinio de competencias y contacto con ganadores</li>
              <li>• Comentarios y difusión de lo que hacen las empresas en RRSS</li>
              <li>• Naming de salas</li>
              <li>• Acceso a LinkedIn de alumnos (a coordinar)</li>
              <li>• Charlas comerciales (posible exclusividad por rubro)</li>
              <li>• Mini stands en eventos</li>
              <li>• Merchandising</li>
              <li>• Presencia en banners de ASME</li>
            </ul>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" data-aos="fade-up">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl border border-slate-600 bg-slate-900/80 shadow-2xl">
            {activePlanConfig ? (
              <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${activePlanConfig.cardBg}`} />
            ) : null}

            <Button
              variant="ghost"
              size="icon"
              onClick={closeModal}
              aria-label="Cerrar modal"
              className="absolute right-4 top-4 h-10 w-10 rounded-full border border-white/10 bg-slate-900/60 text-gray-200 hover:text-slate-900 hover:bg-white/90"
            >
              <X className="w-5 h-5" />
            </Button>

            <div className="px-8 pb-10 pt-14 text-center">
              {activePlanConfig && ModalIcon ? (
                <div className={`mx-auto mb-6 w-16 h-16 rounded-full p-[2px] bg-gradient-to-br ${activePlanConfig.ring}`}>
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-900/85">
                    <ModalIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
              ) : null}

              <h3 className="text-3xl font-bold text-white">
                {activePlanConfig ? activePlanConfig.title : ""}
              </h3>

              <div className="mt-8 text-left">
                <h4 className="mb-4 text-center text-lg font-semibold text-white">Beneficios completos</h4>
                <ul className="space-y-4">
                  {orderedModalFeatures.map((feature) => {
                    const isHighlight = modalHighlightsSet.has(feature)
                    return (
                      <li key={feature} className={`flex items-start gap-3 ${isHighlight ? "text-white" : "text-gray-200"}`}>
                        <CheckCircle
                          className={`mt-1 h-5 w-5 flex-shrink-0 ${"text-[#e3a72f]"}`}
                        />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    )
                  })}
                </ul>
              </div>

              <div className="mt-10 border-t border-white/10 pt-6 text-center">
                <p className="mb-4 text-sm text-gray-200">
                  ¿Interesados en sponsorear el MecHub? Escribinos y coordinamos los próximos pasos.
                </p>
                <Button
                  className="w-full bg-[#e3a72f] hover:bg-[#d4961a] text-slate-900 font-semibold"
                  onClick={() => {
                    closeModal()
                    document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" })
                  }}
                >
                  Contactar al equipo
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" data-aos="fade-up">
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
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#5f87ab]">Contactanos</h2>
            <p className="text-xl text-gray-300">
              ¿Tienes alguna pregunta o quieres colaborar con nosotros? ¡Nos encantaría escucharte!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div data-aos="fade-right">
              <h3 className="text-2xl font-bold mb-8 text-[#e3a72f]">Información de Contacto</h3>

              <div className="space-y-6">
                <a
                  href="mailto:asme@itba.edu.ar?subject=&body="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-4 group"
                  data-aos="fade-up"
                  data-aos-delay="0"
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
                  data-aos="fade-up"
                  data-aos-delay="100"
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
                  data-aos="fade-up"
                  data-aos-delay="200"
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
            <div data-aos="fade-left">
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
