"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
 
  Users,
  Trophy,
  BookOpen,
  Mail,
  MapPin,
  Phone,
  Instagram,
  Linkedin
} from "lucide-react";
import { TeamMemberCard } from "@/components/TeamMemberCard";
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import Events from "@/components/Events"
import Sponsors from "@/components/Sponsors"
import PastEvents from "@/components/PastEvents"
import { Evento, Patrocinador } from "@/types/db_types";

// Definir tipos para los datos
type TeamMember = {
  name: string;
  role: string;
};

type TeamCategories = {
  [key: string]: TeamMember[];
};


const getEvents = async (): Promise<Evento[]> => {
  try {
    const res = await fetch("/api/events");
    if(!res.ok) {
      throw new Error("Failed to fetch events");
    }
    const data = await res.json();
    console.log("API response:", data);
    console.log("Events:", data.events); 

    return data.events || [];
  } catch (error) {
    throw new Error("Failed to fetch events");
  }
}


const getSponsors = async (): Promise<Patrocinador[]> => {
  try {
    const res = await fetch("/api/sponsors");
    if(!res.ok) {
      throw new Error("Failed to fetch sponsors");
    }
    const data = await res.json()
    return data.sponsors || [];
  } catch (error) {
    throw new Error("Failed to fetch sponsors");
  }
}




export default function ASMEPage() {
  const [activeCategory, setActiveCategory] = useState<string>("Directores");
  const [events, setEvents] = useState<Evento[]>([]);
  const [sponsors, setSponsors] = useState<Patrocinador[]>([]);

  useEffect(() => {
    getEvents().then((data) => setEvents(data));
    getSponsors().then((data) => setSponsors(data));
  }, []);

  // Datos de miembros organizados por categoría
  const teamMembers: TeamCategories = {
    Directores: [
      { name: "Juan Pérez", role: "Presidente" },
      { name: "María López", role: "Vicepresidenta" },
      { name: "Ana Gómez", role: "Secretaria" },
    ],
    Fundraising: [
      { name: "Carlos Rodríguez", role: "Tesorero" },
      { name: "Luis Martínez", role: "Coordinador Fundraising" },
      { name: "Sofia Castro", role: "Analista Financiero" },
    ],
    Formación: [
      { name: "Elena Díaz", role: "Directora de Formación" },
      { name: "Roberto Sánchez", role: "Capacitador Senior" },
      { name: "Marcos Silva", role: "Instructor Técnico" },
    ],
    Competencias: [
      { name: "Pablo Torres", role: "Director de Competencias" },
      { name: "Lucía Fernández", role: "Coordinadora de Eventos" },
      { name: "Diego Morales", role: "Especialista en Robótica" },
    ],
    IT: [
      { name: "Javier López", role: "Desarrollador Web" },
      { name: "Camila Ruiz", role: "Soporte Técnico" },
      { name: "Andrés Vega", role: "DevOps Engineer" },
      { name: "Andrés Vega", role: "DevOps Engineer" },
    ],
    "Media y Comunicación": [],
  };

  // Categorías disponibles
  const categories = Object.keys(teamMembers);

  return (
    <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden">
      {/* Background particles/stars effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </div>

      {/* Fixed Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section
        id="inicio"
        className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] text-center px-6 pt-24"
      >
        <div className="max-w-4xl mx-auto">
          <div className="inline-block bg-[#5f87ab] text-white px-4 py-2 rounded-full text-sm font-medium mb-8">
            ITBA • Buenos Aires
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-[#5f87ab] bg-clip-text text-transparent">
            ASME
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Promoviendo la excelencia en ingeniería mecánica a través de
            charlas, competiciones y networking profesional
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-[#e3a72f] hover:bg-[#d4961a] text-slate-900 font-semibold px-8 py-3"
            >
              Conocer Más
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-[#5f87ab] text-[#5f87ab] hover:bg-[#5f87ab] hover:text-white px-8 py-3 bg-transparent"
            >
              Explorar
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#5f87ab]">
              ¿Qué es ASME?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Somos la organización estudiantil líder en ingeniería mecánica del
              ITBA, dedicada a conectar estudiantes con la industria y fomentar
              el desarrollo profesional.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-[#5f87ab] rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-[#e3a72f]">
                  Charlas Técnicas
                </h3>
                <p className="text-gray-300">
                  Conferencias con profesionales de la industria sobre las
                  últimas tendencias en ingeniería mecánica y tecnologías
                  emergentes.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-[#5f87ab] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-[#e3a72f]">
                  Competiciones
                </h3>
                <p className="text-gray-300">
                  Participación en competencias nacionales e internacionales de
                  diseño, robótica y proyectos de ingeniería mecánica.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-[#5f87ab] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-[#e3a72f]">
                  Networking
                </h3>
                <p className="text-gray-300">
                  Conexiones con profesionales, alumni y empresas líderes del
                  sector para impulsar tu carrera profesional.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Events proximos */}
      <Events />

      {/* Past Events Section */}
      <PastEvents events={events} />

      {/* Sponsors Section */}
      <Sponsors />

      {/* Team Section */}
      <section id="equipo" className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-[#5f87ab]">
              Nuestro Equipo
            </h2>

            {/* Team Categories - Con funcionalidad de filtrado */}
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              {categories.map((category) => (
                <Button
                  key={category}
                  className={`${
                    activeCategory === category
                      ? "bg-[#5f87ab] text-white"
                      : "bg-[#e3a72f] hover:bg-[#d4961a] text-slate-900"
                  } font-semibold px-6 py-3 rounded-full transition-colors duration-200`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Team Members Grid - Filtrado por categoría */}
          <div className="flex flex-wrap justify-center gap-6">
            {teamMembers[activeCategory]?.map((member, index) => (
              <div
                key={`${activeCategory}-${index}`}
                className="w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(20%-20px)]"
              >
                <TeamMemberCard
                  name={member.name}
                  role={member.role}
                  socialIcons={
                    <>
                      <Instagram className="w-5 h-5 text-gray-700 hover:text-[#e3a72f] cursor-pointer transition-colors" />
                      <Linkedin className="w-5 h-5 text-gray-700 hover:text-[#e3a72f] cursor-pointer transition-colors" />
                    </>
                  }
                />
              </div>
            ))}
          </div>

          {/* Mensaje si no hay miembros en la categoría */}
          {(!teamMembers[activeCategory] ||
            teamMembers[activeCategory].length === 0) && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                No hay miembros disponibles para esta categoría.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#5f87ab]">
            Contacto
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            ¿Interesado en unirte o colaborar? ¡Contáctanos!
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#e3a72f] rounded-full flex items-center justify-center mb-4">
                <Mail className="w-8 h-8 text-slate-900" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-[#e3a72f]">
                Email
              </h3>
              <p className="text-gray-300">asme@itba.edu.ar</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#e3a72f] rounded-full flex items-center justify-center mb-4">
                <MapPin className="w-8 h-8 text-slate-900" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-[#e3a72f]">
                Ubicación
              </h3>
              <p className="text-gray-300">ITBA, Buenos Aires</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#e3a72f] rounded-full flex items-center justify-center mb-4">
                <Phone className="w-8 h-8 text-slate-900" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-[#e3a72f]">
                Síguenos
              </h3>
              <p className="text-gray-300">@asme_itba</p>
            </div>
          </div>

          <Button
            size="lg"
            className="bg-[#e3a72f] hover:bg-[#d4961a] text-slate-900 font-semibold px-12 py-4"
          >
            Únete a ASME
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
