"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { HotspotData } from "./planeData";

interface HotspotProps {
  data: HotspotData;
  isActive: boolean;
  onClick: (id: string) => void;
  onHover: (id: string | null) => void;
}

export default function Hotspot({ data, isActive, onClick, onHover }: HotspotProps) {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!innerRef.current || !outerRef.current) return;

    if (isActive) {
      // Steady glow when active
      innerRef.current.scale.setScalar(1.2);
      outerRef.current.scale.setScalar(1.5);
      (outerRef.current.material as THREE.MeshBasicMaterial).opacity = 0.35;
    } else {
      // Smooth pulse
      const t = clock.elapsedTime * 1.5;
      const pulse = 1 + Math.sin(t + data.position[0] * 2) * 0.15;
      innerRef.current.scale.setScalar(pulse);
      outerRef.current.scale.setScalar(pulse * 1.3);
      (outerRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.12 + Math.sin(t + data.position[0] * 2) * 0.08;
    }
  });

  return (
    <group ref={groupRef} position={data.position}>
      {/* Inner dot */}
      <mesh
        ref={innerRef}
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
        <sphereGeometry args={[0.06, 24, 24]} />
        <meshBasicMaterial color="#5f87ab" transparent opacity={0.95} />
      </mesh>

      {/* Outer glow */}
      <mesh ref={outerRef}>
        <sphereGeometry args={[0.1, 24, 24]} />
        <meshBasicMaterial color="#5f87ab" transparent opacity={0.15} />
      </mesh>
    </group>
  );
}
