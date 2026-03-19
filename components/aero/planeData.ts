export interface HotspotData {
  id: string;
  position: [number, number, number];
  title: string;
  subtitle: string;
  description: string;
  badge: string;
}

export const HOTSPOTS: HotspotData[] = [
  {
    id: "aerodynamics",
    position: [0, 0.2, 0],
    title: "Ala volante",
    subtitle: "AERODINAMICA",
    description:
      "El fuselaje y las alas se fusionan en una unica superficie sustentadora. Mayor eficiencia aerodinamica, menor resistencia al avance, y un volumen interno tres veces superior para carga util.",
    badge: "Blended Wing Body",
  },
  {
    id: "structure",
    position: [1.0, 0.15, 0.3],
    title: "Fibra de carbono",
    subtitle: "ESTRUCTURA",
    description:
      "Layup manual de fibra de carbono sobre nucleo de madera balsa. El curado bajo vacio garantiza una union perfecta entre capas, logrando maxima rigidez estructural con el minimo peso posible.",
    badge: "Carbono + Balsa",
  },
  {
    id: "manufacturing",
    position: [0, 0.15, -0.8],
    title: "Precision CNC",
    subtitle: "MANUFACTURA",
    description:
      "Costillas y largueros cortados con router CNC del ITBA. Cada pieza se ensambla a mano con tolerancias de decimas de milimetro sobre moldes fabricados internamente.",
    badge: "Tolerancia < 0.5mm",
  },
  {
    id: "propulsion",
    position: [0, 0.15, 1.0],
    title: "Motor pusher",
    subtitle: "PROPULSION",
    description:
      "Motor brushless electrico en configuracion pusher trasera. Helice optimizada para empuje estatico en despegue y crucero eficiente. Alimentado por bateria LiPo de alta descarga.",
    badge: "Brushless electrico",
  },
  {
    id: "avionics",
    position: [-1.2, 0.1, 0.8],
    title: "Control por elevones",
    subtitle: "AVIONICA",
    description:
      "Sin alerones ni timon convencional. Las superficies de control mixtas — elevones — combinan alerones y elevador, permitiendo maniobras de pitch y roll con cuatro servos digitales.",
    badge: "4 servos digitales",
  },
];
