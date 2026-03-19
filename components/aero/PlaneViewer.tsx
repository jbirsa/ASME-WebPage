"use client";

import { useState, useCallback, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import PlaneModel from "./PlaneModel";
import Hotspot from "./Hotspot";
import { HOTSPOTS } from "./planeData";

function Scene() {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);

  const isWireframe = activeHotspot !== null || hoveredHotspot !== null;

  const handleHotspotClick = useCallback((id: string) => {
    setActiveHotspot((prev) => (prev === id ? null : id));
  }, []);

  const handleHotspotHover = useCallback((id: string | null) => {
    setHoveredHotspot(id);
  }, []);

  const handleCanvasClick = useCallback(() => {
    setActiveHotspot(null);
  }, []);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 8, 5]} intensity={1.5} />
      <directionalLight position={[-5, 3, -3]} intensity={0.6} />
      <directionalLight position={[0, -2, 5]} intensity={0.3} />
      <hemisphereLight args={["#b1c5d8", "#1a1a2e", 0.6]} />

      {/* Plane model — click empty space to dismiss tooltip */}
      <group onClick={handleCanvasClick}>
        <PlaneModel wireframe={isWireframe} />
      </group>

      {/* Hotspots */}
      {HOTSPOTS.map((hotspot) => (
        <Hotspot
          key={hotspot.id}
          data={hotspot}
          isActive={activeHotspot === hotspot.id || (hoveredHotspot === hotspot.id && activeHotspot === null)}
          onClick={handleHotspotClick}
          onHover={handleHotspotHover}
        />
      ))}

      {/* Environment for reflections */}
      <Environment preset="city" environmentIntensity={0.3} />

      {/* Controls */}
      <OrbitControls
        minDistance={3}
        maxDistance={10}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2}
        autoRotate
        autoRotateSpeed={0.5}
        enablePan={false}
      />
    </>
  );
}

function LoadingFallback() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      <span className="font-mono text-accent/60 text-xs tracking-wider mt-4">
        Cargando modelo 3D...
      </span>
    </div>
  );
}

export default function PlaneViewer() {
  return (
    <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden">
      {/* Blueprint grid background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(95,135,171,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(95,135,171,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Corner brackets */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-accent/40 z-10 rounded-tl-lg pointer-events-none" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-accent/40 z-10 rounded-tr-lg pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-accent/40 z-10 rounded-bl-lg pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-accent/40 z-10 rounded-br-lg pointer-events-none" />

      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          camera={{ position: [4, 3, 4], fov: 45 }}
          style={{ background: "#141414" }}
          gl={{ antialias: true, alpha: false }}
        >
          <Scene />
        </Canvas>
      </Suspense>

      {/* Interaction hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <span className="font-mono text-white/20 text-[10px] tracking-wider">
          Arrastra para rotar · Click en los puntos para explorar
        </span>
      </div>
    </div>
  );
}
