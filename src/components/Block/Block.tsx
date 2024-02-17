// INDIVIDUAL BLOCK
import { groupColors } from "@/utils/consts";
import { calculateSection } from "@/utils/calcPositions";
import { Dispatch, SetStateAction } from "react";
import { IBlockMessage } from "@/components/BlockchainVisualizer/BlockchainVisualizer";

interface IBlockProps {
  blockData: IBlockMessage;
  onHover: Dispatch<SetStateAction<IBlockMessage | null>>;
}
export default function Block({ blockData, onHover }: IBlockProps) {
  return (
    <mesh
      position={blockData.position}
      onPointerOver={(e) => {
        document.body.style.cursor = "pointer";
        e.stopPropagation();
        onHover(blockData);
      }}
      onClick={() =>
        window.open(
          `${process.env.NEXT_PUBLIC_ALEPHIUM_EXPLORER_BASE_PATH}blocks/${blockData.hash}`,
        )
      }
      onPointerOut={() => {
        document.body.style.cursor = "default";
        onHover(null);
      }}
    >
      <meshStandardMaterial
        attach="material"
        color={
          groupColors[calculateSection(blockData.chainFrom, blockData.chainTo)]
        }
      />
      {blockData.isLeading ? (
        <boxGeometry args={[4, 4, 4]} attach="geometry" />
      ) : (
        <boxGeometry args={[2, 2, 2]} attach="geometry" />
      )}
    </mesh>
  );
}
