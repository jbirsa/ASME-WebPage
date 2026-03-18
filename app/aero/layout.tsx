import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "AERO ITBA — Design Build Fly",
  description:
    "Equipo de estudiantes del ITBA compitiendo en la AIAA Design-Build-Fly en Wichita, Kansas 2026",
  icons: {
    icon: [{ url: "/asme_logo.png", type: "image/png" }],
  },
};

export default function AeroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
