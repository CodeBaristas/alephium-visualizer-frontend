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
        geometry={nodes.OpenSCAD_Model.geometry}
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

useGLTF.preload("/alephium.gltf");

export default AlephiumModel;
