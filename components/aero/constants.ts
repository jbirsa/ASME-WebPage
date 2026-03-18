// Competition target date — used by MissionBriefing countdown and ProgressTimeline
export const COMPETITION_DATE = new Date("2026-04-15T08:00:00-05:00"); // Wichita, Kansas CDT

export const LINKS = {
  competition: "https://www.dbfuw.com/the-competition",
  rules: "https://www.dbfuw.com/the-competition", // Update with actual rules URL
  instagram: "https://www.instagram.com/aero.itba/",
} as const;

export const MILESTONES = [
  { id: "design", date: "ENE 2025", title: "Diseño inicial", description: "Primeros bocetos y análisis aerodinámico", type: "image" as const },
  { id: "machining", date: "MAR 2025", title: "Mecanizado", description: "CNC del prototipo", type: "video" as const },
  { id: "build", date: "JUN 2025", title: "Construcción", description: "Ensamblaje de la estructura", type: "image" as const },
  { id: "testing", date: "AGO 2025", title: "Pruebas", description: "Testing y ajustes", type: "image" as const },
  { id: "flight", date: "SEP 2025", title: "Primer vuelo", description: "El avión vuela por primera vez", type: "video" as const, featured: true },
  { id: "competition", date: "ABR 2026", title: "Wichita 2026", description: "La competencia", type: "future" as const },
] as const;
