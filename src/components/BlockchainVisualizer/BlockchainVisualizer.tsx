"use client";

/* eslint-disable react/no-unknown-property */
import { Vector3 } from "three";
import {
  Dispatch,
  SetStateAction,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  Line,
  BakeShadows,
  ContactShadows,
} from "@react-three/drei";
import { calcCubePosition, calculateSection } from "@/utils/calcPositions";
import AlephiumModel from "@/components/Models/AlephiumModel";
import AlphlandModel from "@/components/Models/AlphlandModel";

import {
  circleRadius,
  heightOffsetDivisor,
  totalChains,
  totalGroups,
} from "@/utils/consts";

import { Bloom, EffectComposer } from "@react-three/postprocessing";

import CustomizePopover from "@/components/CustomizePopover/CustomizePopover";
import Link from "next/link";
import { Button } from "@nextui-org/button";
import { IconBrandGithub } from "@tabler/icons-react";
import Logbox from "@/components/Logbox/Logbox";
import GlowingRing from "@/components/GlowingRing/GlowingRing";
import BlockflowInfoModal from "@/components/Modals/BlockflowInfoModal";
import ControlsModal from "@/components/Modals/ControlsModal";
import Block from "@/components/Block/Block";
import GithubButton from "@/components/GithubButton/GithubButton";

export interface IBlockMessage {
  hash: string;
  timestamp: number;
  chainFrom: number;
  chainTo: number;
  height: number;
  txNumber: number;
  mainChain: boolean;
  hashRate: string;
  position: Vector3;
  isLeading: boolean;
}

export default function BlockchainVisualizer() {
  const [hoveredBlock, setHoveredBlock] = useState<IBlockMessage | null>(null);
  const [blocks, setBlocks] = useState<IBlockMessage[]>([]); // State to store block data
  const [lines, setLines] = useState<[Vector3, Vector3][]>([]);
  const [latestBlock, setLatestBlock] = useState<IBlockMessage | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [displayLogBox, setDisplayLogBox] = useState<boolean>(true);
  const [displayHoverBlockInfoBox, setDisplayHoverBlockInfoBox] =
    useState<boolean>(true);
  const [postProcessing, setPostProcessing] = useState<boolean>(false);
  const connectorBlocks2 = useRef<IBlockMessage[][]>([]);
  const blockCounter = useRef<number>(1);
  const firstBlockTimestamp = useRef<number>(0);

  // Function to log messages both to the console and the state
  const logMessage = useCallback((message: string) => {
    console.log(message); // Log to the console
    setMessages((prevMessages) => [...prevMessages, message]); // Add to the messages state
  }, []);
  useEffect(() => {
    if (latestBlock) {
      // Ensure newBlock is defined and is the block you want to process.
      connectorBlocks2.current = updateConnectorBlocks(latestBlock);
    }
  }, [lines]); // This effect depends on `lines`, so it runs after `lines` are updated.
  const updateConnectorBlocks = (newBlock: IBlockMessage) => {
    console.log("nb", newBlock);
    console.log("cb", connectorBlocks2.current);

    // Create a deep copy of the currentBlocks to avoid direct state mutation
    let updatedBlocks = connectorBlocks2.current.map((innerArray) =>
      innerArray.slice(),
    );
    // Make sure a new block exists
    if (!newBlock) {
      return updatedBlocks;
    }
    // Ensure the 'fromGroup' array exists
    if (!updatedBlocks[newBlock.chainFrom]) {
      updatedBlocks[newBlock.chainFrom] = [];
    }

    // Directly modify the entry with the new block data
    updatedBlocks[newBlock.chainFrom][newBlock.chainTo] = newBlock;
    console.log(updatedBlocks);
    return updatedBlocks;
  };

  const computeLinesForNewBlock = (
    newBlock: IBlockMessage,
    connectorBlocks: IBlockMessage[][],
  ) => {
    let allLines: [Vector3, Vector3][] = [];

    if (newBlock && connectorBlocks) {
      if (connectorBlocks.at(newBlock.chainFrom)) {
        connectorBlocks.at(newBlock.chainFrom).forEach((connectorBlock) => {
          console.log(newBlock.hash);
          console.log(connectorBlock.hash);
          allLines.push([newBlock.position, connectorBlock.position]);
        });
      }
      for (let i = 0; i < totalGroups; i++) {
        try {
          allLines.push([
            newBlock.position,
            connectorBlocks.at(i).at(i).position,
          ]);
        } catch (e) {
          console.log(`No group block for ${i}${i}`);
        }
      }
    }
    return allLines;
  };

  useEffect(() => {
    document.body.style.cursor = hoveredBlock ? "pointer" : "auto";
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_BASE_PATH);

    ws.onopen = (event) => {
      logMessage(`Connected.`);
      logMessage(`Retrieving blocks...`);

      const payload = {
        request: { method: "subscribe", arguments: { topics: ["block_data"] } },
      };
      ws.send(JSON.stringify(payload));
    };

    ws.onmessage = async (event) => {
      const response = JSON.parse(event.data);

      if (response?.request !== null) {
        if (response.request.arguments?.data) {
          const block: IBlockMessage = response.request.arguments.data;
          // If the block group origin and destination are equal -> New "Lead" Block for that group detected
          if (block.chainFrom === block.chainTo) {
            block.isLeading = true;
          }

          // Calculate block position
          logMessage(
            `(${blockCounter.current}) New ${block.isLeading ? "leading" : ""} block found (${block.chainFrom} -> ${block.chainTo}): ${block.hash}`,
          );

          // To calculate the y-axis offsets (heightOffset)
          if (firstBlockTimestamp.current === 0) {
            firstBlockTimestamp.current = block.timestamp;
          }
          blockCounter.current += 1;
          block.position = calcCubePosition(
            block.chainFrom,
            block.chainTo,
            totalChains,
            circleRadius,
            (block.timestamp - firstBlockTimestamp.current) /
              heightOffsetDivisor,
          );

          setLines((prevLines) => {
            const newLines = computeLinesForNewBlock(
              block,
              connectorBlocks2.current,
            );
            return [...prevLines, ...newLines];
          });
          setLatestBlock(block);
          setBlocks((prevBlocks) => [...prevBlocks, block]); // Update state with new block data
        }
      }
    };
    return () => {
      ws.close();
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <Canvas
        shadows
        camera={{ fov: 90, position: [50, 50, 50], near: 0.001 }}
        style={{ width: "100vw", height: "100vh" }}
        onCreated={(state) => (state.gl.shadowMap.autoUpdate = false)}
      >
        <ambientLight intensity={4} />
        <spotLight
          position={[1, 5, 3]}
          angle={0.2}
          penumbra={1}
          intensity={3}
          castShadow
          shadow-mapSize={2048}
        />
        <spotLight
          position={[0, 10, -10]}
          intensity={2}
          angle={0.04}
          penumbra={2}
          castShadow
          shadow-mapSize={1024}
        />
        <Suspense fallback={null}>
          <GlowingRing />

          <AlephiumModel />
          <AlphlandModel />
          <ContactShadows
            frames={1}
            rotation-x={[Math.PI / 2]}
            position={[0, -0.4, 0]}
            far={1}
            width={1.5}
            height={1.5}
            blur={0.2}
          />
          <Environment preset="night" />
          <BakeShadows />
          <OrbitControls />
          {blocks.map((block) => (
            <Block
              key={block.hash}
              blockData={block}
              onHover={setHoveredBlock}
            />
          ))}
          {lines.map((line, index) => (
            <Line
              key={index}
              points={line} // Points array [start, end]
              color="white"
              transparent={true}
              opacity={0.3}
              lineWidth={2}
            />
          ))}
        </Suspense>
        {postProcessing && (
          <EffectComposer>
            <Bloom mipmapBlur luminanceThreshold={0.1} radius={0.1} />
          </EffectComposer>
        )}
      </Canvas>
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 20,
        }}
      >
        <CustomizePopover
          logBoxState={displayLogBox}
          blockOverInfoBoxState={displayHoverBlockInfoBox}
          postProcessingState={postProcessing}
          setLogBoxState={setDisplayLogBox}
          setBlockOverInfoBoxState={setDisplayHoverBlockInfoBox}
          setPostProcessingState={setPostProcessing}
        />
      </div>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          position: "absolute",
          top: 20,
          left: 20,
        }}
      >
        <GithubButton />
        <BlockflowInfoModal />
        <ControlsModal />
      </div>
      {displayLogBox && <Logbox messages={messages} />}
      {displayHoverBlockInfoBox && (
        <div
          style={{
            fontFamily: "monospace",
            position: "absolute",
            bottom: "20px",
            left: "20px",
            color: "#fff",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            padding: "10px",
            borderRadius: "10px",
            pointerEvents: "none",
            maxWidth: "100%",
          }}
          className={"hide-mobile"}
        >
          <p>Hash: {hoveredBlock && hoveredBlock.hash}</p>
          <p>Timestamp: {hoveredBlock && hoveredBlock.timestamp}</p>
          <p>ChainFrom: {hoveredBlock && hoveredBlock.chainFrom}</p>
          <p>ChainTo: {hoveredBlock && hoveredBlock.chainTo}</p>
          <p>Height: {hoveredBlock && hoveredBlock.height}</p>
          <p>Tx Number: {hoveredBlock && hoveredBlock.txNumber}</p>
          <p>
            Hashrate:{" "}
            {hoveredBlock && parseInt(hoveredBlock.hashRate) % 1000000} MH/s
          </p>
          <p>
            Main Chain: {hoveredBlock && hoveredBlock.mainChain ? "yes" : "no"}
          </p>
        </div>
      )}
    </div>
  );
}
