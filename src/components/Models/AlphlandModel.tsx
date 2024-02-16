import { useGLTF } from "@react-three/drei";

const AlphlandModel = () => {
  const { nodes, materials } = useGLTF("/alphland.gltf");
  return (
    <group dispose={null}>
      <mesh
        position={[-300, -20, 100]}
        rotation={[0, 1.6, 0]}
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

useGLTF.preload("/alphland.gltf");

export default AlphlandModel;
