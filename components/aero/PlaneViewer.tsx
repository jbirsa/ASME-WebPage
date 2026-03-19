"use client";

import { useState, useCallback, useRef, useEffect, Suspense } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";
import PlaneModel from "./PlaneModel";
import Hotspot from "./Hotspot";
import { HOTSPOTS, type HotspotData } from "./planeData";

// Projects a 3D position to 2D screen coordinates
function useScreenPosition(
  position: [number, number, number] | null,
  canvasRef: React.RefObject<HTMLDivElement | null>
) {
  const [screenPos, setScreenPos] = useState<{ x: number; y: number } | null>(null);

  return { screenPos, setScreenPos };
}

interface SceneProps {
  onHotspotActivate: (data: HotspotData | null, screenPos: { x: number; y: number } | null) => void;
  canvasRef: React.RefObject<HTMLDivElement | null>;
}

function HotspotProjector({
  data,
  isActive,
  onProject,
}: {
  data: HotspotData;
  isActive: boolean;
  onProject: (pos: { x: number; y: number }) => void;
}) {
  const { camera, gl } = useThree();

  useEffect(() => {
    if (!isActive) return;
    const vec = new THREE.Vector3(...data.position);
    vec.project(camera);
    const rect = gl.domElement.getBoundingClientRect();
    const x = ((vec.x + 1) / 2) * rect.width;
    const y = ((-vec.y + 1) / 2) * rect.height;
    onProject({ x, y });
  });

  return null;
}

function Scene({ onHotspotActivate, canvasRef }: SceneProps) {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);

  const visibleHotspot = activeHotspot || hoveredHotspot;
  const isWireframe = visibleHotspot !== null;

  const handleHotspotClick = useCallback(
    (id: string) => {
      setActiveHotspot((prev) => (prev === id ? null : id));
    },
    []
  );

  const handleHotspotHover = useCallback((id: string | null) => {
    setHoveredHotspot(id);
  }, []);

  const handleCanvasClick = useCallback(() => {
    setActiveHotspot(null);
    onHotspotActivate(null, null);
  }, [onHotspotActivate]);

  // When active hotspot changes, notify parent
  useEffect(() => {
    if (!visibleHotspot) {
      onHotspotActivate(null, null);
    }
  }, [visibleHotspot, onHotspotActivate]);

  const activeData = visibleHotspot
    ? HOTSPOTS.find((h) => h.id === visibleHotspot) || null
    : null;

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 8, 5]} intensity={1.5} />
      <directionalLight position={[-5, 3, -3]} intensity={0.6} />
      <directionalLight position={[0, -2, 5]} intensity={0.3} />
      <hemisphereLight args={["#b1c5d8", "#1a1a2e", 0.6]} />

      {/* Plane model */}
      <group onClick={handleCanvasClick}>
        <PlaneModel wireframe={isWireframe} />
      </group>

      {/* Hotspots */}
      {HOTSPOTS.map((hotspot) => (
        <Hotspot
          key={hotspot.id}
          data={hotspot}
          isActive={visibleHotspot === hotspot.id}
          onClick={handleHotspotClick}
          onHover={handleHotspotHover}
        />
      ))}

      {/* Project active hotspot position to screen */}
      {activeData && (
        <HotspotProjector
          data={activeData}
          isActive
          onProject={(pos) => onHotspotActivate(activeData, pos)}
        />
      )}

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

interface TooltipInfo {
  data: HotspotData;
  dotPos: { x: number; y: number };
}

export default function PlaneViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipInfo | null>(null);

  const handleHotspotActivate = useCallback(
    (data: HotspotData | null, screenPos: { x: number; y: number } | null) => {
      if (data && screenPos) {
        setTooltip({ data, dotPos: screenPos });
      } else {
        setTooltip(null);
      }
    },
    []
  );

  // Calculate tooltip card position (to the right of the container)
  const getTooltipStyle = (): React.CSSProperties => {
    if (!tooltip || !containerRef.current) return { display: "none" };

    const rect = containerRef.current.getBoundingClientRect();
    const dotX = tooltip.dotPos.x;
    const dotY = tooltip.dotPos.y;

    // Place card to the right side of the canvas
    const cardX = rect.width - 20;
    const cardY = Math.max(20, Math.min(dotY - 60, rect.height - 220));

    return {
      position: "absolute" as const,
      right: 20,
      top: cardY,
      width: 260,
      zIndex: 20,
      animation: "fadeIn 0.3s ease-out",
    };
  };

  // SVG line from dot to card
  const getLinePath = () => {
    if (!tooltip || !containerRef.current) return null;

    const rect = containerRef.current.getBoundingClientRect();
    const dotX = tooltip.dotPos.x;
    const dotY = tooltip.dotPos.y;
    const cardX = rect.width - 280;
    const cardY = Math.max(20, Math.min(tooltip.dotPos.y - 60, rect.height - 220)) + 40;

    return (
      <svg
        className="absolute inset-0 pointer-events-none z-10"
        width="100%"
        height="100%"
      >
        <line
          x1={dotX}
          y1={dotY}
          x2={cardX}
          y2={cardY}
          stroke="#5f87ab"
          strokeWidth={1}
          strokeDasharray="4 3"
          opacity={0.5}
        />
        <circle cx={dotX} cy={dotY} r={4} fill="#5f87ab" opacity={0.6} />
      </svg>
    );
  };

  return (
    <div ref={containerRef} className="relative w-full aspect-[4/3] rounded-lg overflow-hidden">
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
          camera={{ position: [0, 3, 6], fov: 45 }}
          style={{ background: "#141414" }}
          gl={{ antialias: true, alpha: false }}
        >
          <Scene
            onHotspotActivate={handleHotspotActivate}
            canvasRef={containerRef}
          />
        </Canvas>
      </Suspense>

      {/* Connecting line from hotspot to card */}
      {tooltip && getLinePath()}

      {/* Side tooltip card */}
      {tooltip && (
        <div style={getTooltipStyle()}>
          <div
            style={{
              background: "rgba(26, 26, 26, 0.95)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(95,135,171,0.3)",
              borderRadius: 8,
              padding: "16px 20px",
            }}
          >
            {/* Corner brackets */}
            <div style={{ position: "absolute", top: -1, left: -1, width: 12, height: 12, borderTop: "2px solid #5f87ab", borderLeft: "2px solid #5f87ab", borderTopLeftRadius: 8 }} />
            <div style={{ position: "absolute", top: -1, right: -1, width: 12, height: 12, borderTop: "2px solid #5f87ab", borderRight: "2px solid #5f87ab", borderTopRightRadius: 8 }} />
            <div style={{ position: "absolute", bottom: -1, left: -1, width: 12, height: 12, borderBottom: "2px solid #5f87ab", borderLeft: "2px solid #5f87ab", borderBottomLeftRadius: 8 }} />
            <div style={{ position: "absolute", bottom: -1, right: -1, width: 12, height: 12, borderBottom: "2px solid #5f87ab", borderRight: "2px solid #5f87ab", borderBottomRightRadius: 8 }} />

            <span style={{
              fontFamily: "var(--font-montserrat), sans-serif",
              fontSize: 10,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#5f87ab",
              display: "block",
            }}>
              {tooltip.data.subtitle}
            </span>

            <h4 style={{
              fontFamily: "var(--font-montserrat), sans-serif",
              fontWeight: 800,
              fontSize: 16,
              color: "#F5F5F7",
              margin: "6px 0 8px",
              lineHeight: 1.1,
            }}>
              {tooltip.data.title}
            </h4>

            <p style={{
              fontFamily: "var(--font-raleway), sans-serif",
              fontSize: 12,
              color: "#a1a1a6",
              lineHeight: 1.5,
              margin: 0,
            }}>
              {tooltip.data.description}
            </p>

            <div style={{ marginTop: 10 }}>
              <span style={{
                fontFamily: "monospace",
                fontSize: 10,
                color: "#5f87ab",
                border: "1px solid rgba(95,135,171,0.3)",
                borderRadius: 4,
                padding: "3px 8px",
                letterSpacing: "0.05em",
              }}>
                {tooltip.data.badge}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Interaction hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <span className="font-mono text-white/20 text-[10px] tracking-wider">
          Arrastra para rotar · Click en los puntos para explorar
        </span>
      </div>
    </div>
  );
}
