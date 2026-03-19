"use client";

import { useState, useCallback, useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Grid } from "@react-three/drei";
import * as THREE from "three";
import PlaneModel from "./PlaneModel";
import Hotspot from "./Hotspot";
import { HOTSPOTS, type HotspotData } from "./planeData";

/** Animated 3D blueprint grid on the ground plane */
function BlueprintGrid({ visible }: { visible: boolean }) {
  const matRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((_, delta) => {
    if (!matRef.current) return;
    const target = visible ? 1 : 0;
    matRef.current.opacity = THREE.MathUtils.lerp(matRef.current.opacity, target, delta * 4);
  });

  return (
    <Grid
      position={[0, -0.5, 0]}
      args={[20, 20]}
      cellSize={0.5}
      cellThickness={0.6}
      cellColor="#4a90c4"
      sectionSize={2}
      sectionThickness={1.2}
      sectionColor="#4a90c4"
      fadeDistance={15}
      fadeStrength={2}
      infiniteGrid
    />
  );
}

function Scene({
  blueprintMode,
  activeHotspotId,
  onHotspotClick,
  compact,
}: {
  blueprintMode: boolean;
  activeHotspotId: string | null;
  onHotspotClick: (id: string) => void;
  compact: boolean;
}) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 8, 5]} intensity={1.5} />
      <directionalLight position={[-5, 3, -3]} intensity={0.6} />
      <directionalLight position={[0, -2, 5]} intensity={0.3} />
      <hemisphereLight args={["#8bb5d6", "#0f1a2e", 0.7]} />

      {/* 3D Blueprint grid */}
      <BlueprintGrid visible={blueprintMode} />

      {/* Plane model */}
      <PlaneModel wireframe={blueprintMode} />

      {/* Hotspots */}
      {HOTSPOTS.map((hotspot) => (
        <Hotspot
          key={hotspot.id}
          data={hotspot}
          isActive={activeHotspotId === hotspot.id}
          blueprintMode={blueprintMode}
          compact={compact}
          onClick={onHotspotClick}
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
        autoRotate={!blueprintMode}
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [blueprintMode, setBlueprintMode] = useState(false);
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const activeData = activeHotspotId
    ? HOTSPOTS.find((h) => h.id === activeHotspotId) || null
    : null;

  const hotspotClickedRef = useRef(false);

  const handleHotspotClick = useCallback((id: string) => {
    hotspotClickedRef.current = true;
    setBlueprintMode(true);
    setActiveHotspotId((prev) => (prev === id ? null : id));
  }, []);

  // Track drag vs click — only exit blueprint on real clicks, not drag-end
  const pointerDownPos = useRef<{ x: number; y: number } | null>(null);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerDownPos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!blueprintMode) { pointerDownPos.current = null; return; }
    const down = pointerDownPos.current;
    pointerDownPos.current = null;
    if (!down) return;
    const dx = e.clientX - down.x;
    const dy = e.clientY - down.y;
    // If mouse moved more than 5px, it was a drag — ignore
    if (dx * dx + dy * dy > 25) return;
    // If a hotspot was just clicked, don't exit
    if (hotspotClickedRef.current) {
      hotspotClickedRef.current = false;
      return;
    }
    // Real click — exit blueprint mode
    setBlueprintMode(false);
    setActiveHotspotId(null);
  }, [blueprintMode]);

  // Mobile: spec panel rendered below the viewer
  const specPanel = blueprintMode && activeData ? (
    <div
      className="mt-4 md:hidden"
      style={{ animation: "fadeIn 0.3s ease-out" }}
    >
      <div className="border border-[rgba(74,144,196,0.3)] rounded-lg bg-[rgba(8,16,24,0.94)] p-4">
        <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#4a90c4] block">
          {activeData.subtitle}
        </span>
        <h4 className="font-montserrat font-extrabold text-[#F5F5F7] text-base mt-1.5 leading-tight">
          {activeData.title}
        </h4>
        <p className="font-raleway text-[13px] text-[#a1a1a6] leading-relaxed mt-2">
          {activeData.description}
        </p>
        <div className="mt-3">
          <span className="font-mono text-[11px] text-[#4a90c4] border border-[rgba(74,144,196,0.3)] rounded px-2.5 py-1 tracking-wide">
            {activeData.badge}
          </span>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div>
    <div ref={containerRef} onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} className="relative w-full aspect-square md:aspect-[4/3] rounded-lg overflow-hidden">
      {/* Blueprint grid CSS background — visible behind transparent canvas */}
      <div
        className="absolute inset-0 z-0 transition-all duration-700"
        style={{
          backgroundColor: blueprintMode ? "#0a1520" : "#141414",
          backgroundImage: `
            linear-gradient(rgba(74,144,196,${blueprintMode ? 0.12 : 0.03}) 1px, transparent 1px),
            linear-gradient(90deg, rgba(74,144,196,${blueprintMode ? 0.12 : 0.03}) 1px, transparent 1px),
            linear-gradient(rgba(74,144,196,${blueprintMode ? 0.06 : 0}) 1px, transparent 1px),
            linear-gradient(90deg, rgba(74,144,196,${blueprintMode ? 0.06 : 0}) 1px, transparent 1px)
          `,
          backgroundSize: "120px 120px, 120px 120px, 24px 24px, 24px 24px",
        }}
      />

      {/* Corner brackets */}
      <div className="absolute top-0 left-0 w-6 h-6 md:w-10 md:h-10 border-t-2 border-l-2 border-accent/50 z-10 rounded-tl-lg pointer-events-none" />
      <div className="absolute top-0 right-0 w-6 h-6 md:w-10 md:h-10 border-t-2 border-r-2 border-accent/50 z-10 rounded-tr-lg pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-6 h-6 md:w-10 md:h-10 border-b-2 border-l-2 border-accent/50 z-10 rounded-bl-lg pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-6 h-6 md:w-10 md:h-10 border-b-2 border-r-2 border-accent/50 z-10 rounded-br-lg pointer-events-none" />

      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          camera={{ position: [0, 3, 6], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <Scene
            blueprintMode={blueprintMode}
            activeHotspotId={activeHotspotId}
            onHotspotClick={handleHotspotClick}
            compact={isMobile}
          />
        </Canvas>
      </Suspense>

      {/* Blueprint mode spec panel (desktop only — mobile panel is below viewer) */}
      {blueprintMode && activeData && (
        <div
          className="absolute top-4 right-4 z-20 w-72 hidden md:block"
          style={{ animation: "fadeIn 0.3s ease-out" }}
        >
          <div
            style={{
              background: "rgba(8, 16, 24, 0.94)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(74,144,196,0.4)",
              borderRadius: 8,
              padding: "18px 22px",
              position: "relative",
            }}
          >
            {/* Corner accents */}
            <div style={{ position: "absolute", top: -1, left: -1, width: 14, height: 14, borderTop: "2px solid #4a90c4", borderLeft: "2px solid #4a90c4", borderTopLeftRadius: 8 }} />
            <div style={{ position: "absolute", top: -1, right: -1, width: 14, height: 14, borderTop: "2px solid #4a90c4", borderRight: "2px solid #4a90c4", borderTopRightRadius: 8 }} />
            <div style={{ position: "absolute", bottom: -1, left: -1, width: 14, height: 14, borderBottom: "2px solid #4a90c4", borderLeft: "2px solid #4a90c4", borderBottomLeftRadius: 8 }} />
            <div style={{ position: "absolute", bottom: -1, right: -1, width: 14, height: 14, borderBottom: "2px solid #4a90c4", borderRight: "2px solid #4a90c4", borderBottomRightRadius: 8 }} />

            <span
              style={{
                fontFamily: "var(--font-montserrat), sans-serif",
                fontSize: 11,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#4a90c4",
                display: "block",
              }}
            >
              {activeData.subtitle}
            </span>

            <h4
              style={{
                fontFamily: "var(--font-montserrat), sans-serif",
                fontWeight: 800,
                fontSize: 18,
                color: "#F5F5F7",
                margin: "8px 0 10px",
                lineHeight: 1.15,
              }}
            >
              {activeData.title}
            </h4>

            <p
              style={{
                fontFamily: "var(--font-raleway), sans-serif",
                fontSize: 13,
                color: "#a1a1a6",
                lineHeight: 1.55,
                margin: 0,
              }}
            >
              {activeData.description}
            </p>

            <div style={{ marginTop: 12 }}>
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: 11,
                  color: "#4a90c4",
                  border: "1px solid rgba(74,144,196,0.3)",
                  borderRadius: 4,
                  padding: "4px 10px",
                  letterSpacing: "0.05em",
                }}
              >
                {activeData.badge}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Blueprint mode indicator (desktop only) */}
      {blueprintMode && (
        <div className="absolute top-4 left-4 z-20 pointer-events-none hidden md:block">
          <span className="font-mono text-accent text-xs tracking-[0.25em] uppercase opacity-70">
            Blueprint Mode
          </span>
        </div>
      )}

      {/* Exit hint in blueprint mode (desktop only) */}
      {blueprintMode && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none hidden md:block">
          <span className="font-mono text-accent/40 text-[11px] tracking-wider">
            Click afuera para salir
          </span>
        </div>
      )}

      {/* Normal mode hint */}
      {!blueprintMode && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <span className="font-mono text-white/25 text-[10px] md:text-[11px] tracking-wider text-center block">
            <span className="hidden md:inline">Arrastra para rotar · Click en los puntos para explorar</span>
            <span className="md:hidden">Toca los puntos para explorar</span>
          </span>
        </div>
      )}
    </div>
    {/* Mobile: spec panel below the viewer */}
    {specPanel}
    </div>
  );
}
