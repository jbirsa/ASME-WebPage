"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface PlaneModelProps {
  wireframe: boolean;
}

export default function PlaneModel({ wireframe }: PlaneModelProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const solidMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const wireMatRef = useRef<THREE.MeshBasicMaterial>(null);

  // Target opacities for transition
  const transitionState = useRef({ solidOpacity: 1, wireOpacity: 0 });

  const geometry = useMemo(() => {
    // BWB planform outline (top-down, x = span, z = chord)
    const shape = new THREE.Shape();

    // Start at nose (center leading edge)
    shape.moveTo(0, -1.0); // nose tip

    // Right side: swept leading edge to wingtip
    shape.quadraticCurveTo(0.8, -0.9, 1.5, -0.3); // swept leading edge
    shape.lineTo(2.0, -0.1); // wingtip leading edge
    shape.lineTo(2.0, 0.1); // wingtip (narrow chord)
    shape.lineTo(1.5, 0.4); // trailing edge sweep back

    // Elevon cutout hint at trailing edge
    shape.lineTo(1.2, 0.5);
    shape.lineTo(0.3, 0.8); // center trailing edge

    // Mirror left side
    shape.lineTo(-0.3, 0.8);
    shape.lineTo(-1.2, 0.5);
    shape.lineTo(-1.5, 0.4);
    shape.lineTo(-2.0, 0.1);
    shape.lineTo(-2.0, -0.1);
    shape.lineTo(-1.5, -0.3);
    shape.quadraticCurveTo(-0.8, -0.9, 0, -1.0); // back to nose

    // Extrude with depth (y-axis becomes thickness)
    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 0.25,
      bevelEnabled: true,
      bevelThickness: 0.08,
      bevelSize: 0.08,
      bevelSegments: 4,
      curveSegments: 24,
    };

    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);

    // Rotate so the planform lies flat (XZ plane) with Y as up
    geo.rotateX(-Math.PI / 2);
    // Center vertically
    geo.translate(0, 0.125, 0);

    geo.computeVertexNormals();
    return geo;
  }, []);

  // Animate material transitions
  useFrame((_, delta) => {
    const target = transitionState.current;
    const speed = 5; // lerp speed

    if (wireframe) {
      target.solidOpacity = THREE.MathUtils.lerp(target.solidOpacity, 0.15, delta * speed);
      target.wireOpacity = THREE.MathUtils.lerp(target.wireOpacity, 1, delta * speed);
    } else {
      target.solidOpacity = THREE.MathUtils.lerp(target.solidOpacity, 1, delta * speed);
      target.wireOpacity = THREE.MathUtils.lerp(target.wireOpacity, 0, delta * speed);
    }

    if (solidMatRef.current) {
      solidMatRef.current.opacity = target.solidOpacity;
    }
    if (wireMatRef.current) {
      wireMatRef.current.opacity = target.wireOpacity;
    }
  });

  return (
    <group>
      {/* Solid mesh */}
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial
          ref={solidMatRef}
          color="#2a2a2a"
          metalness={0.3}
          roughness={0.7}
          transparent
          opacity={1}
        />
      </mesh>

      {/* Wireframe overlay */}
      <mesh geometry={geometry}>
        <meshBasicMaterial
          ref={wireMatRef}
          color="#5f87ab"
          wireframe
          transparent
          opacity={0}
        />
      </mesh>
    </group>
  );
}
