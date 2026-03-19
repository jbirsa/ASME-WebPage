import { type Metadata } from "next";
import { Montserrat, Raleway } from "next/font/google";
import "./aero.css";
import SmoothScroll from "@/components/aero/SmoothScroll";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
  display: "swap",
});

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-raleway",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AERO ITBA — Design Build Fly",
  description:
    "Equipo de estudiantes del ITBA compitiendo en la AIAA Design-Build-Fly en Wichita, Kansas 2026",
  icons: {
    icon: [{ url: "/asme_logo.png", type: "image/png" }],
  },
  openGraph: {
    title: "AERO ITBA — Design Build Fly",
    description:
      "Equipo de estudiantes del ITBA compitiendo en la AIAA Design-Build-Fly en Wichita, Kansas 2026",
    type: "website",
  },
};

export default function AeroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${montserrat.variable} ${raleway.variable}`}>
      <div className="top-bar" />
      <SmoothScroll>{children}</SmoothScroll>
    </div>
  );
}
