"use client";

import { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

interface PlaneModelProps {
  wireframe: boolean;
}

export default function PlaneModel({ wireframe }: PlaneModelProps) {
  const solidMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const wireMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const transitionState = useRef({ solidOpacity: 1, wireOpacity: 0 });

  const gltf = useLoader(GLTFLoader, "/aero-content/condor-opt.glb", (loader) => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/");
    loader.setDRACOLoader(dracoLoader);
  });

  const geometry = (gltf.scene.children[0] as THREE.Mesh).geometry;

  // Animate material transitions
  useFrame((_, delta) => {
    const target = transitionState.current;
    const speed = 5;

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
      <mesh geometry={geometry}>
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
