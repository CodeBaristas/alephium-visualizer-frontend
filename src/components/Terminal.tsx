import { Html } from "@react-three/drei";
import { useState } from "react";
import { useThree } from "@react-three/fiber";

function Terminal() {
  const [size, set] = useState(0.5);
  return (
    <mesh scale={size * 2}>
      <boxGeometry />
      <meshStandardMaterial />
      <Html occlude distanceFactor={1.5} position={[0, 0, 0.51]} transform>
        <span>Size</span>
      </Html>
    </mesh>
  );
}

export default Terminal;
