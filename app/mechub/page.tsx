"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Building2,
  Users,
  Wifi,
  Coffee,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Send,
  Instagram
} from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function MecHubPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/send-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al enviar el mensaje");
      }

      // éxito: limpiar formulario / mostrar feedback
      setFormData({ name: "", email: "", message: "" });
      alert("Mensaje enviado correctamente");
    } catch (err: any) {
      console.error("Error enviando mensaje:", err);
      alert(err.message || "Error al enviar el mensaje");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden">
      {/* Background particles/stars effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </div>

      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50"
            : "bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between p-4 md:p-6 max-w-7xl mx-auto">
          <div className="hidden md:flex flex-1 justify-center items-center space-x-8 mx-auto">
          <Link
            href="#que-es" 
            className="hover:text-[#e3a72f] transition-colors duration-200 font-medium"
          >
            ¿Qué es?
          </Link>
          <Link
            href="#cotizar" 
            className="hover:text-[#e3a72f] transition-colors duration-200 font-medium"
          >
            Cotizar
          </Link>
          <Link 
            href="#contacto" 
            className="hover:text-[#e3a72f] transition-colors duration-200 font-medium"
          >
            Contacto
          </Link>
        </div>

        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] text-center px-6">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block bg-[#5f87ab] text-white px-4 py-2 rounded-full text-sm font-medium mb-8">
            ITBA • Espacio de Innovación
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-[#5f87ab] bg-clip-text text-transparent">
            MecHub
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto">
            El espacio de coworking y eventos especializado en ingeniería
            mecánica donde las ideas cobran vida
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-[#e3a72f] hover:bg-[#d4961a] text-slate-900 font-semibold px-8 py-3"
            >
              <a href="#cotizar">Cotizar Espacio</a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-[#5f87ab] text-[#5f87ab] hover:bg-[#5f87ab] hover:text-white px-8 py-3 bg-transparent"
            >
              <a href="#que-es">Conocer Más</a>
            </Button>
          </div>
        </div>
      </section>

      {/* What is MecHub Section */}
      <section id="que-es" className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#5f87ab]">
              ¿Qué es MecHub?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              MecHub es el primer espacio de coworking especializado en
              ingeniería mecánica del ITBA. Un lugar donde estudiantes,
              profesionales y empresas se conectan para desarrollar proyectos
              innovadores.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-[#5f87ab] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-[#e3a72f]">
                  Espacios Flexibles
                </h3>
                <p className="text-gray-300">
                  Oficinas privadas, espacios compartidos y salas de reuniones
                  equipadas con la última tecnología para proyectos de
                  ingeniería.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-[#5f87ab] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-[#e3a72f]">
                  Comunidad Especializada
                </h3>
                <p className="text-gray-300">
                  Conecta con ingenieros mecánicos, startups tecnológicas y
                  empresas del sector en un ambiente colaborativo único.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-[#5f87ab] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-[#e3a72f]">
                  Eventos y Workshops
                </h3>
                <p className="text-gray-300">
                  Participa en charlas técnicas, workshops de innovación y
                  eventos de networking especializados en ingeniería mecánica.
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

      {/* Quote Your Space Section */}
      <section
        id="cotizar"
        className="relative z-10 py-20 px-6 bg-slate-800/30"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#5f87ab]">
              Cotiza tu Espacio
            </h2>
            <p className="text-xl text-gray-300">
              Encuentra el espacio perfecto para tu proyecto. Desde escritorios
              individuales hasta oficinas completas.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="bg-slate-800/70 border-slate-600 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4 text-[#e3a72f]">
                  Escritorio Individual
                </h3>
                <div className="text-4xl font-bold text-white mb-4">$50</div>
                <p className="text-gray-300 mb-6">por día</p>
                <ul className="text-left text-gray-300 space-y-2 mb-8">
                  <li>• Escritorio dedicado</li>
                  <li>• WiFi de alta velocidad</li>
                  <li>• Acceso a áreas comunes</li>
                  <li>• Café ilimitado</li>
                </ul>
                <Button className="w-full bg-[#5f87ab] hover:bg-[#145fa2] text-white">
                  Seleccionar
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/70 backdrop-blur-sm border-[#e3a72f]">
              <CardContent className="p-8 text-center">
                <div className="bg-[#e3a72f] text-slate-900 px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block">
                  Más Popular
                </div>
                <h3 className="text-2xl font-bold mb-4 text-[#e3a72f]">
                  Oficina Privada
                </h3>
                <div className="text-4xl font-bold text-white mb-4">$200</div>
                <p className="text-gray-300 mb-6">por día</p>
                <ul className="text-left text-gray-300 space-y-2 mb-8">
                  <li>• Oficina privada para 4 personas</li>
                  <li>• Sala de reuniones incluida</li>
                  <li>• Acceso a laboratorios</li>
                  <li>• Soporte técnico</li>
                </ul>
                <Button className="w-full bg-[#e3a72f] hover:bg-[#d4961a] text-slate-900">
                  Seleccionar
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/70 border-slate-600 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4 text-[#e3a72f]">
                  Espacio para Eventos
                </h3>
                <div className="text-4xl font-bold text-white mb-4">$500</div>
                <p className="text-gray-300 mb-6">por día</p>
                <ul className="text-left text-gray-300 space-y-2 mb-8">
                  <li>• Auditorio para 50 personas</li>
                  <li>• Equipos audiovisuales</li>
                  <li>• Catering disponible</li>
                  <li>• Soporte completo</li>
                </ul>
                <Button className="w-full bg-[#5f87ab] hover:bg-[#145fa2] text-white">
                  Seleccionar
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contacto" className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#5f87ab]">
              Contactanos
            </h2>
            <p className="text-xl text-gray-300">
              ¿Tienes alguna pregunta o quieres colaborar con nosotros? ¡Nos
              encantaría escucharte!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h3 className="text-2xl font-bold mb-8 text-[#e3a72f]">
                Información de Contacto
              </h3>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#e3a72f] rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-slate-900" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Email</h4>
                    <p className="text-gray-300">asme@itba.edu.ar</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#e3a72f] rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-slate-900" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Ubicación</h4>
                    <p className="text-gray-300">ITBA, Buenos Aires</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#e3a72f] rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-slate-900" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Horarios</h4>
                    <p className="text-gray-300">Lun - Vie: 8:00 - 20:00</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#e3a72f] rounded-full flex items-center justify-center">
                    <Instagram className="w-6 h-6 text-slate-900" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Instagram</h4>
                    <a
                      href="https://www.instagram.com/asme.itba/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-[#d4961a] transition-colors"
                    >
                      @asme.itba
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
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
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
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
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
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

      {/* Footer */}
      <footer className="relative z-10 py-8 px-6 border-t border-slate-700">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400">
            © 2024 MecHub by ASME ITBA. Impulsando la innovación en ingeniería
            mecánica.
          </p>
        </div>
      </footer>
    </div>
  );
}
