import React, { useState } from "react";
import { Button } from "./ui/button";
import { TeamCategories } from "@/types/db_types";
import { TeamMemberCard } from "./TeamMemberCard";
import { Instagram, Linkedin, MailIcon } from "lucide-react";

// Datos de miembros organizados por categoría
const teamMembers: TeamCategories = {
  Directores: [
    {
      nombre: "Martín Alejandro",
      apellido: "Alemañy",
      role: "Chair",
      mail: "maalemany@itba.edu.ar",
    },
    {
      nombre: "Lourdes",
      apellido: "Parisi Lera",
      role: "Vice-Chair",
      mail: "lparisilera@itba.edu.ar",
    },
    {
      nombre: "María del Pilar",
      apellido: "Scigliano",
      role: "Secretary",
      mail: "mscigliano@itba.edu.ar",
    },
    {
      nombre: "Fausto",
      apellido: "Calcagno Capuya",
      role: "Treasurer",
      mail: "fcalcagnocapuya@itba.edu.ar",
    },
  ],
  Fundraising: [
    {
      nombre: "Agustina Adriana",
      apellido: "Castro Farina",
      role: "Head de Fundraising y Logística",
      mail: "acastrofarina@itba.edu.ar",
    },
    {
      nombre: "Jana",
      apellido: "Yoo",
      role: "Miembro de Fundraising y Logística",
      mail: "jyoo@itba.edu.ar",
    },
    {
      nombre: "Thomas",
      apellido: "Augspach",
      role: "Miembro de Fundraising y Logística",
      mail: "taugspach@itba.edu.ar",
    },
    {
      nombre: "Valentin",
      apellido: "Neme Gabriel",
      role: "Miembro de Fundraising y Logística",
      mail: "vnemegabriel@itba.edu.ar",
    },
  ],
  Formación: [
    {
      nombre: "Matías",
      apellido: "Kaplan",
      role: "Head de Formación",
      mail: "matkaplan@itba.edu.ar",
    },
    {
      nombre: "Felipe",
      apellido: "Kohon",
      role: "Head de Formación",
      mail: "fkohon@itba.edu.ar",
    },
    {
      nombre: "Facundo",
      apellido: "Aguilera Van Cauwlaert",
      role: "Miembro de Formación",
      mail: "faguileravancauwlae@itba.edu.ar",
    },
    {
      nombre: "Juan Cruz",
      apellido: "Francesconi",
      role: "Miembro de Formación",
      mail: "jfrancesconi@itba.edu.ar",
    },
  ],
  Competencias: [
    {
      nombre: "Matteo",
      apellido: "Tezza",
      role: "Head de Competencias",
      mail: "matezza@itba.edu.ar",
    },
    {
      nombre: "Jose Ignacio",
      apellido: "Martinez",
      role: "Miembro de Competencias",
      mail: "josmartinez@itba.edu.ar",
    },
    {
      nombre: "Matias Hernan",
      apellido: "Felizia",
      role: "Miembro de Competencias",
      mail: "mfelizia@itba.edu.ar",
    },
    {
      nombre: "Casandra",
      apellido: "Nieto",
      role: "Miembro de Competencias",
      mail: "cnietoolmos@itba.edu.ar",
    },
    {
      nombre: "Lorenzo",
      apellido: "Colace",
      role: "Miembro de Competencias",
      mail: "lcolace@itba.edu.ar",
    },
    {
      nombre: "Francisco",
      apellido: "Vasquez",
      role: "Miembro de Competencias",
      mail: "fvasquez@itba.edu.ar",
    },
    {
      nombre: "Juan Cruz",
      apellido: "Vasquez",
      role: "Miembro de Competencias",
      mail: "jvasquez@itba.edu.ar",
    },
    {
      nombre: "Gabriel",
      apellido: "De Lio",
      role: "Miembro de Competencias",
      mail: "gdelio@itba.edu.ar",
    },
    {
      nombre: "Dante",
      apellido: "Pascuali",
      role: "Miembro de Competencias",
      mail: "dpascuali@itba.edu.ar",
    },
    {
      nombre: "Francisco",
      apellido: "Canova",
      role: "Miembro de Competencias",
      mail: "frcanova@itba.edu.ar",
    },
  ],
  TI: [
    {
      nombre: "Juan Pablo",
      apellido: "Birsa",
      role: "Head de TI",
      mail: "jbirsa@itba.edu.ar",
    },
    {
      nombre: "Florencia",
      apellido: "Cecotto",
      role: "Miembro de TI",
      mail: "fcecotto@itba.edu.ar",
    },
    {
      nombre: "Pascal",
      apellido: "Ordano",
      role: "Miembro de TI",
      mail: "pordano@itba.edu.ar",
    },
  ],
  "Media y Comunicación": [
    {
      nombre: "Agustina",
      apellido: "Perini",
      role: "Head de Media",
      mail: "aperini@itba.edu.ar",
    },
    {
      nombre: "Eloisa",
      apellido: "Aleman Monch",
      role: "Miembro de Media",
      mail: "ealemanmonch@itba.edu.ar",
    },
    {
      nombre: "Francesca",
      apellido: "Galan",
      role: "Miembro de Media",
      mail: "frgalan@itba.edu.ar",
    },
    {
      nombre: "Ignacio",
      apellido: "Oreja",
      role: "Miembro de Media",
      mail: "ioreja@itba.edu.ar",
    },
  ],
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
                mail={member.mail}
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
