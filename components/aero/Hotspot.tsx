"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { HotspotData } from "./planeData";

interface HotspotProps {
  data: HotspotData;
  isActive: boolean;
  onClick: (id: string) => void;
  onHover: (id: string | null) => void;
}

export default function Hotspot({ data, isActive, onClick, onHover }: HotspotProps) {
  const sphereRef = useRef<THREE.Mesh>(null);

  // Pulse animation
  useFrame(({ clock }) => {
    if (sphereRef.current && !isActive) {
      const scale = 1 + Math.sin(clock.elapsedTime * 2) * 0.2;
      sphereRef.current.scale.setScalar(scale);
    } else if (sphereRef.current && isActive) {
      sphereRef.current.scale.setScalar(1.3);
    }
  });

  return (
    <group position={data.position}>
      {/* Glowing sphere */}
      <mesh
        ref={sphereRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick(data.id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(data.id);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          onHover(null);
          document.body.style.cursor = "auto";
        }}
      >
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial
          color="#5f87ab"
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Outer glow ring */}
      <mesh>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial
          color="#5f87ab"
          transparent
          opacity={0.2}
        />
      </mesh>

      {/* Tooltip */}
      {isActive && (
        <Html
          distanceFactor={8}
          style={{ pointerEvents: "none" }}
          center
          position={[0, 0.4, 0]}
        >
          <div
            style={{
              pointerEvents: "auto",
              background: "#1a1a1a",
              border: "1px solid rgba(95,135,171,0.3)",
              borderRadius: "8px",
              padding: "16px 20px",
              width: "280px",
              position: "relative",
              animation: "fadeIn 0.3s ease-out",
            }}
          >
            {/* Corner brackets */}
            <div style={{
              position: "absolute", top: -1, left: -1,
              width: 12, height: 12,
              borderTop: "2px solid #5f87ab",
              borderLeft: "2px solid #5f87ab",
              borderTopLeftRadius: 8,
            }} />
            <div style={{
              position: "absolute", top: -1, right: -1,
              width: 12, height: 12,
              borderTop: "2px solid #5f87ab",
              borderRight: "2px solid #5f87ab",
              borderTopRightRadius: 8,
            }} />
            <div style={{
              position: "absolute", bottom: -1, left: -1,
              width: 12, height: 12,
              borderBottom: "2px solid #5f87ab",
              borderLeft: "2px solid #5f87ab",
              borderBottomLeftRadius: 8,
            }} />
            <div style={{
              position: "absolute", bottom: -1, right: -1,
              width: 12, height: 12,
              borderBottom: "2px solid #5f87ab",
              borderRight: "2px solid #5f87ab",
              borderBottomRightRadius: 8,
            }} />

            <span style={{
              fontFamily: "var(--font-montserrat), sans-serif",
              fontSize: 10,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#5f87ab",
            }}>
              {data.subtitle}
            </span>

            <h4 style={{
              fontFamily: "var(--font-montserrat), sans-serif",
              fontWeight: 800,
              fontSize: 18,
              color: "#F5F5F7",
              margin: "6px 0 8px",
              lineHeight: 1.1,
            }}>
              {data.title}
            </h4>

            <p style={{
              fontFamily: "var(--font-raleway), sans-serif",
              fontSize: 13,
              color: "#a1a1a6",
              lineHeight: 1.5,
              margin: 0,
            }}>
              {data.description}
            </p>

            <div style={{ marginTop: 12 }}>
              <span style={{
                fontFamily: "monospace",
                fontSize: 11,
                color: "#5f87ab",
                border: "1px solid rgba(95,135,171,0.3)",
                borderRadius: 4,
                padding: "4px 10px",
                letterSpacing: "0.05em",
              }}>
                {data.badge}
              </span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
