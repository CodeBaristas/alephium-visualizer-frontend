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
          transparent={true}
          transmission={0.8} // Controls how much light passes through the material
          roughness={0} // Smooth surface for glass
          reflectivity={0.6} // Adjust based on how reflective your glass should be
          clearcoat={1.0} // Adds an additional reflective layer, useful for glass surfaces
          ior={1.5} // Index of Refraction, typical for glass
        />
      </mesh>
    </group>
  );
};

useGLTF.preload("/alphland.gltf");

export default AlphlandModel;
