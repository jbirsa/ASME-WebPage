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
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Events from "@/components/Events";
import Sponsors from "@/components/Sponsors";
import PastEvents from "@/components/PastEvents";
import { Evento, Patrocinador } from "@/types/db_types";
import Link from "next/link";
import OurTeam from "@/components/OurTeam";
import NextEvents from "@/components/NextEvents";
import Image from "next/image";

const getPastEvents = async (): Promise<Evento[]> => {
  try {
    const res = await fetch("/api/events/past");
    if (!res.ok) {
      throw new Error("Failed to fetch events");
    }
    const data = await res.json();
    return data.events || [];
  } catch (error) {
    throw new Error("Failed to fetch events");
  }
};

const getNextEvents = async (): Promise<Evento[]> => {
  try {
    const res = await fetch("/api/events/future");
    if (!res.ok) {
      throw new Error("Failed to fetch events");
    }
    const data = await res.json();
    return data.events || [];
  } catch (error) {
    throw new Error("Failed to fetch events");
  }
};

const getSponsors = async (): Promise<Patrocinador[]> => {
  try {
    const res = await fetch("/api/sponsors");
    if (!res.ok) {
      throw new Error("Failed to fetch sponsors");
    }
    const data = await res.json();
    return data.sponsors || [];
  } catch (error) {
    throw new Error("Failed to fetch sponsors");
  }
};

export default function ASMEPage() {
  const [events, setEvents] = useState<Evento[]>([]);
  const [nextEvents, setNextEvents] = useState<Evento[]>([]);
  const [sponsors, setSponsors] = useState<Patrocinador[]>([]);

  useEffect(() => {
    getPastEvents().then((data) => setEvents(data));
    getNextEvents().then((data) => setNextEvents(data));
    getSponsors().then((data) => setSponsors(data));
  }, []);

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

          <Image className="mb-6 mx-auto"src="/asme_logo_blanco.png" alt="ASME Logo" width={220} height={220} />

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Promoviendo la excelencia en ingeniería mecánica a través de
            charlas, competiciones y networking profesional
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#about">
              <Button
                size="lg"
                className="bg-[#e3a72f] hover:bg-[#d4961a] text-slate-900 font-semibold px-8 py-3"
              >
                Conocer Más
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative z-10 py-20 px-6">
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

      <section id="eventos">
        {/* Events proximos */}
        <NextEvents id="eventos" events={nextEvents} />

        {/* Past Events Section */}
        <PastEvents events={events} />

      </section>

      {/* Sponsors Section */}
      <Sponsors />

      {/* Team Section */}
      <OurTeam/>

      {/* Contact Section */}
      <section id="contacto" className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#5f87ab]">
            Contacto
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            ¿Interesado en colaborar? ¡Contáctanos!
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="flex flex-col items-center">
              <a
              href="mailto:asme@itba.edu.ar?subject=&body="
              target="_blank"
              rel="noopener noreferrer">
                <div className="w-16 h-16 bg-[#e3a72f] rounded-full flex items-center justify-center mb-4">
                  <Mail className="w-8 h-8 text-slate-900" />
                </div>
              </a>
              <h3 className="text-lg font-semibold mb-2 text-[#e3a72f]">
                Email
              </h3>
              <p className="text-gray-300">asme@itba.edu.ar</p>
            </div>

            <div className="flex flex-col items-center">
               <a
              href="https://maps.app.goo.gl/WXMedwKRqSLbR8MS8/"
              target="_blank"
              rel="noopener noreferrer">
                <div className="w-16 h-16 bg-[#e3a72f] rounded-full flex items-center justify-center mb-4">
                  <MapPin className="w-8 h-8 text-slate-900" />
                </div>
              </a>
              <h3 className="text-lg font-semibold mb-2 text-[#e3a72f]">
                Ubicación
              </h3>
              <p className="text-gray-300">ITBA, Buenos Aires</p>
            </div>

            <div className="flex flex-col items-center">
              <a
              href="https://www.instagram.com/asme.itba/"
              target="_blank"
              rel="noopener noreferrer">
                <div className="w-16 h-16 bg-[#e3a72f] rounded-full flex items-center justify-center mb-4">
                  <Instagram className="w-8 h-8 text-slate-900" />
                </div>
              </a>
              <h3 className="text-lg font-semibold mb-2 text-[#e3a72f]">
                Síguenos
              </h3>
              <p className="text-gray-300">@asme_itba</p>
            </div>
          </div>

          <a
          href="mailto:asme@itba.edu.ar?subject=&body="
          target="_blank"
          rel="noopener noreferrer">
            <Button
              size="lg"
              className="bg-[#e3a72f] hover:bg-[#d4961a] text-slate-900 font-semibold px-12 py-4">
              Contáctanos
            </Button>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
