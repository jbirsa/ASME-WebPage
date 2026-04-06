import React, { useEffect, useMemo, useState } from "react";
import { Button } from "./ui/button";
import { TeamMember } from "@/types/db_types";
import { TeamMemberCard } from "./TeamMemberCard";

const DEPARTMENT_ORDER = [
  "directores",
  "competencias",
  "fundraising",
  "media y comunicacion",
  "formacion",
  "ti",
];

const normalizeText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const getDepartmentPriority = (department: string) => {
  const normalizedDepartment = normalizeText(department);
  const priority = DEPARTMENT_ORDER.indexOf(normalizedDepartment);
  return priority === -1 ? Number.MAX_SAFE_INTEGER : priority;
};

const getRolePriority = (member: TeamMember) => {
  const normalizedRole = normalizeText(member.role);
  const normalizedDepartment = normalizeText(member.departamento);

  if (normalizedDepartment === "directores") {
    if (normalizedRole.includes("vice") && normalizedRole.includes("chair")) {
      return 1;
    }

    if (normalizedRole.includes("chair")) {
      return 0;
    }

    if (normalizedRole.includes("secret")) {
      return 2;
    }

    if (normalizedRole.includes("tesor") || normalizedRole.includes("treasur")) {
      return 3;
    }

    return 4;
  }

  if (normalizedRole.includes("head") || normalizedRole.includes("lider")) {
    return 0;
  }

  if (normalizedRole.includes("miembro") || normalizedRole.includes("member")) {
    return 1;
  }

  return 2;
};

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

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(teamMembers.map((member) => member.departamento)),
    );

    return uniqueCategories.sort((a, b) => {
      const priorityDiff = getDepartmentPriority(a) - getDepartmentPriority(b);
      if (priorityDiff !== 0) {
        return priorityDiff;
      }

      return a.localeCompare(b, "es");
    });
  }, [teamMembers]);

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

    return members.sort((a, b) => {
      const departmentPriorityDiff =
        getDepartmentPriority(a.departamento) -
        getDepartmentPriority(b.departamento);
      if (departmentPriorityDiff !== 0) {
        return departmentPriorityDiff;
      }

      const rolePriorityDiff = getRolePriority(a) - getRolePriority(b);
      if (rolePriorityDiff !== 0) {
        return rolePriorityDiff;
      }

      return a.id - b.id;
    });
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
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="flex w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(20%-20px)]"
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
