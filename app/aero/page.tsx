"use client";

import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import ScrollVideo from "@/components/aero/ScrollVideo";
import CinematicText from "@/components/aero/CinematicText";
import BlueprintPlane from "@/components/aero/BlueprintPlane";
import MissionBriefing from "@/components/aero/MissionBriefing";
import "./aero.css";

export default function AeroPage() {
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    return () => {
      html.style.scrollBehavior = prev;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white">
      <Navbar />
      <ScrollVideo />
      <CinematicText />
      <BlueprintPlane />
      <MissionBriefing />
    </div>
  );
}
