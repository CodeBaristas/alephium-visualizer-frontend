// INDIVIDUAL BLOCK
import { chainColors } from "@/utils/consts";
import { calculateSection } from "@/utils/calcPositions";
import { Dispatch, SetStateAction } from "react";
import { IBlockMessage } from "@/components/BlockchainVisualizer/BlockchainVisualizer";

interface IBlockProps {
  blockData: IBlockMessage;
  onHover: Dispatch<SetStateAction<IBlockMessage | null>>;
  enableHover: boolean;
}
export default function Block({
  blockData,
  onHover,
  enableHover,
}: IBlockProps) {
  return (
    <mesh
      position={blockData.position}
      onPointerOver={(e) => {
        document.body.style.cursor = "pointer";
        e.stopPropagation();
        if (enableHover) {
          onHover(blockData);
        }
      }}
      onClick={() =>
        window.open(
          `${process.env.NEXT_PUBLIC_ALEPHIUM_EXPLORER_BASE_PATH}blocks/${blockData.hash}`,
        )
      }
      onPointerOut={() => {
        document.body.style.cursor = "default";
      }}
    >
      <meshStandardMaterial
        attach="material"
        color={
          chainColors[calculateSection(blockData.chainFrom, blockData.chainTo)]
        }
      />
      {blockData.isLeading ? (
        <boxGeometry args={[2, 2, 2]} attach="geometry" />
      ) : (
        <boxGeometry args={[1.5, 1.5, 1.5]} attach="geometry" />
      )}
    </mesh>
  );
}
