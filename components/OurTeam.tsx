import React, { useState } from "react";
import { Button } from "./ui/button";
import { TeamCategories } from "@/types/db_types";
import { TeamMemberCard } from "./TeamMemberCard";
import { Instagram, Linkedin } from "lucide-react";

// Datos de miembros organizados por categoría
const teamMembers: TeamCategories = {
    Directores: [
        { nombre: "Juan", apellido: "Pérez", role: "Presidente" },
        { nombre: "María", apellido: "López", role: "Vicepresidenta" },
        { nombre: "Ana", apellido: "Gómez", role: "Secretaria" },
    ],
    Fundraising: [
        { nombre: "Carlos", apellido: "Rodríguez", role: "Tesorero" },
        { nombre: "Luis", apellido: "Martínez", role: "Coordinador Fundraising" },
        { nombre: "Sofia", apellido: "Castro", role: "Analista Financiero" },
    ],
    Formación: [
        { nombre: "Elena", apellido: "Díaz", role: "Directora de Formación" },
        { nombre: "Roberto", apellido: "Sánchez", role: "Capacitador Senior" },
        { nombre: "Marcos", apellido: "Silva", role: "Instructor Técnico" },
    ],
    Competencias: [
        { nombre: "Pablo", apellido: "Torres", role: "Director de Competencias" },
        { nombre: "Lucía", apellido: "Fernández", role: "Coordinadora de Eventos" },
        { nombre: "Diego", apellido: "Morales", role: "Especialista en Robótica" },
    ],
    IT: [
        { nombre: "Juan", apellido: "Birsa", role: "Team Lead" },
        { nombre: "Pascal", apellido: "Ordano", role: "Team Member" },
        { nombre: "Florencia", apellido: "Cecotto", role: "Team Member" },
    ],
    "Media y Comunicación": [],
};

// Categorías disponibles
const categories = Object.keys(teamMembers);

export default function OurTeam() {
  const [activeCategory, setActiveCategory] = useState<string>("Directores");

  return (
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
                nombre={member.nombre}
                apellido={member.apellido}
                role={member.role}
                image={member.image}
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
  );
}
