import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "ASME ITBA | MecHub",
  description: "Promoviendo la excelencia en ingeniería mecánica",
  icons: {
    icon: [
      {
        url: "/asme_logo.png", // ⚠️ no uses "@/public", solo la ruta pública
        type: "image/png",
      },
    ],
  },
};

export default function MecHubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>; // este layout solo envuelve a la página
}
