import React, { useEffect, useMemo, useState } from "react";
import { Button } from "./ui/button";
import { TeamMember } from "@/types/db_types";
import { TeamMemberCard } from "./TeamMemberCard";

const getTeamMembers = async (): Promise<TeamMember[]> => {
  try {
    const res = await fetch("/api/members");
    if (!res.ok) {
      throw new Error("Failed to fetch team members");
    }
    const data = await res.json();
    return (data.members as TeamMember[]) || [];
  } catch (error) {
    throw new Error("Failed to fetch team members");
  }
};

export default function OurTeam() {
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    getTeamMembers()
      .then((data) => setTeamMembers(data))
      .catch((error) => console.error(error));
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(teamMembers.map((member) => member.departamento))),
    [teamMembers],
  );

  useEffect(() => {
    if (categories.length === 0) {
      return;
    }

    if (!activeCategory || !categories.includes(activeCategory)) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  const filteredMembers = useMemo(() => {
    const members = activeCategory
      ? teamMembers.filter((member) => member.departamento === activeCategory)
      : teamMembers.slice();

    const getPriority = (member: TeamMember) => {
      const role = member.role?.toLowerCase() ?? "";
      return role.includes("head") ? 0 : 1;
    };

    return members.sort((a, b) => getPriority(a) - getPriority(b));
  }, [activeCategory, teamMembers]);

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
          {filteredMembers.map((member, index) => (
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
        {filteredMembers.length === 0 && (
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
