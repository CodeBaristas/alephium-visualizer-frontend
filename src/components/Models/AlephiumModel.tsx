import { useGLTF } from "@react-three/drei";

const AlephiumModel = () => {
  const { nodes, materials } = useGLTF("/alephium.gltf");
  return (
    <group dispose={null}>
      <mesh
        position={[-50, -150, -500]}
        rotation={[0, -0.2, 0]}
        castShadow
        receiveShadow
        // @ts-ignore
        geometry={nodes.OpenSCAD_Model.geometry}
        // @ts-ignore
        material={nodes.OpenSCAD_Model.material}
      >
        <meshPhysicalMaterial
          attach="material"
          emissive="white"
          emissiveIntensity={0.1}
        />
      </mesh>
    </group>
  );
};

useGLTF.preload("/alephium.gltf");

export default AlephiumModel;
