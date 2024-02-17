import { useRef } from "react";
import { Mesh } from "three";
import { useFrame } from "@react-three/fiber";
import { circleRadius } from "@/utils/consts";
import * as THREE from "three";

export default function GlowingRing() {
  const meshRef = useRef<Mesh>(null);
  // Rotate the ring to make it vertical
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.PI / 2;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, -10, 0]}>
      {/* TorusGeometry args: [radius, tubeRadius, radialSegments, tubularSegments] */}
      <torusGeometry args={[circleRadius + 5, 0.4, 32, 128]} />
      <meshStandardMaterial
        emissive="white"
        emissiveIntensity={1}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
