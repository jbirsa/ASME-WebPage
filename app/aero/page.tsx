"use client";

import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import "./aero.css";

export default function AeroPage() {
  // Override smooth scroll so Framer Motion scroll-mapping works correctly
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

      {/* Section placeholders — will be replaced by components */}
      <section className="h-screen flex items-center justify-center">
        <h1 className="text-6xl font-bold">
          AERO <span className="text-[#e3a72f]">ITBA</span>
        </h1>
      </section>
    </div>
  );
}
