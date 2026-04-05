export interface HotspotData {
  id: string;
  position: [number, number, number];
  labelOffset: [number, number, number]; // offset from dot where the label sits
  title: string;
  subtitle: string;
  description: string;
  badge: string;
}

export const HOTSPOTS: HotspotData[] = [
  {
    id: "aerodynamics",
    position: [0, 0.45, 0],
    labelOffset: [0, 0.8, 0],
    title: "Ala volante",
    subtitle: "AERODINÁMICA",
    description:
      "El fuselaje y las alas se fusionan en una única superficie sustentadora. Mayor eficiencia aerodinámica, menor resistencia al avance, y un volumen interno tres veces superior para carga útil.",
    badge: "Blended Wing Body",
  },
  {
    id: "structure",
    position: [1.2, 0.4, 0.3],
    labelOffset: [0.6, 0.7, 0],
    title: "Fibra de carbono",
    subtitle: "ESTRUCTURA",
    description:
      "Layup manual de fibra de carbono sobre núcleo de madera balsa. El curado bajo vacío garantiza una unión perfecta entre capas, logrando máxima rigidez estructural con el mínimo peso posible.",
    badge: "Carbono + Balsa",
  },
  {
    id: "manufacturing",
    position: [0, 0.4, -1.0],
    labelOffset: [0, 0.7, -0.4],
    title: "Precisión CNC",
    subtitle: "MANUFACTURA",
    description:
      "Costillas y largueros cortados con router CNC del ITBA. Cada pieza se ensambla a mano con tolerancias de décimas de milímetro sobre moldes fabricados internamente.",
    badge: "Tolerancia < 0.5mm",
  },
  {
    id: "propulsion",
    position: [0, 0.4, 1.2],
    labelOffset: [0, 0.7, 0.4],
    title: "Motor pusher",
    subtitle: "PROPULSIÓN",
    description:
      "Motor brushless eléctrico en configuración pusher trasera. Hélice optimizada para empuje estático en despegue y crucero eficiente. Alimentado por batería LiPo de alta descarga.",
    badge: "Brushless eléctrico",
  },
  {
    id: "avionics",
    position: [-1.4, 0.4, 0.8],
    labelOffset: [-0.5, 0.7, 0],
    title: "Control por elevones",
    subtitle: "AVIÓNICA",
    description:
      "Sin alerones ni timón convencional. Las superficies de control mixtas — elevones — combinan alerones y elevador, permitiendo maniobras de pitch y roll con cuatro servos digitales.",
    badge: "4 servos digitales",
  },
];
