"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Line } from "@react-three/drei";
import * as THREE from "three";
import type { HotspotData } from "./planeData";

interface HotspotProps {
  data: HotspotData;
  isActive: boolean;
  blueprintMode: boolean;
  compact?: boolean;
  onClick: (id: string) => void;
}

export default function Hotspot({ data, isActive, blueprintMode, compact, onClick }: HotspotProps) {
  const innerRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);

  // Leader line points: from dot (0,0,0) to label offset
  const linePoints = useMemo<[number, number, number][]>(
    () => [[0, 0, 0], data.labelOffset],
    [data.labelOffset]
  );

  useFrame(({ clock }) => {
    if (!innerRef.current || !outerRef.current) return;

    if (isActive) {
      innerRef.current.scale.setScalar(1.6);
      outerRef.current.scale.setScalar(2.2);
      (outerRef.current.material as THREE.MeshBasicMaterial).opacity = 0.35;
    } else {
      const t = clock.elapsedTime * 1.5;
      const phase = data.position[0] * 2 + data.position[2];
      const pulse = 1 + Math.sin(t + phase) * 0.15;
      innerRef.current.scale.setScalar(pulse);
      outerRef.current.scale.setScalar(pulse * 1.4);
      (outerRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.12 + Math.sin(t + phase) * 0.06;
    }
  });

  return (
    <group position={data.position}>
      {/* Invisible larger click target — always on top */}
      <mesh
        renderOrder={999}
        onClick={(e) => {
          e.stopPropagation();
          onClick(data.id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
        }}
      >
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} depthTest={false} />
      </mesh>

      {/* Inner dot — always visible on top */}
      <mesh ref={innerRef} renderOrder={1000}>
        <sphereGeometry args={[0.06, 24, 24]} />
        <meshBasicMaterial
          color={isActive ? "#ffffff" : "#4a90c4"}
          transparent
          opacity={0.95}
          depthTest={false}
        />
      </mesh>

      {/* Outer glow — always visible on top */}
      <mesh ref={outerRef} renderOrder={999}>
        <sphereGeometry args={[0.1, 24, 24]} />
        <meshBasicMaterial color="#4a90c4" transparent opacity={0.12} depthTest={false} />
      </mesh>

      {/* Blueprint mode: leader line + label (hidden in compact/mobile) */}
      {blueprintMode && !compact && (
        <>
          {/* Leader line from dot to label */}
          <Line
            points={linePoints}
            color="#4a90c4"
            lineWidth={1}
            transparent
            opacity={isActive ? 0.8 : 0.4}
            dashed
            dashSize={0.05}
            gapSize={0.03}
          />

          {/* Small tick mark at label end */}
          <mesh position={data.labelOffset}>
            <circleGeometry args={[0.02, 16]} />
            <meshBasicMaterial
              color="#4a90c4"
              transparent
              opacity={isActive ? 0.8 : 0.4}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Label at the end of the leader line */}
          <Html
            position={data.labelOffset}
            center
            style={{ pointerEvents: "none", whiteSpace: "nowrap" }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                transform: "translateY(-16px)",
              }}
            >
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: isActive ? 13 : 11,
                  fontWeight: isActive ? 700 : 400,
                  color: isActive ? "#ffffff" : "rgba(74,144,196,0.8)",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  textShadow: "0 0 8px rgba(0,0,0,0.8)",
                }}
              >
                {data.subtitle}
              </span>
              {isActive && (
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: 10,
                    color: "rgba(74,144,196,0.6)",
                    letterSpacing: "0.1em",
                    textShadow: "0 0 8px rgba(0,0,0,0.8)",
                  }}
                >
                  {data.badge}
                </span>
              )}
            </div>
          </Html>
        </>
      )}
    </group>
  );
}
