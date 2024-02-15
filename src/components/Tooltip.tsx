import { Html } from "@react-three/drei";

function TutorialTooltip() {
  return (
    <Html center position={[-1, 1, -1]}>
      <p>Click and drag on the white part to move the camera</p>
    </Html>
  );
}
export default TutorialTooltip;
