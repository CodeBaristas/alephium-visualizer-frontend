"use client";

/* eslint-disable react/no-unknown-property */
import { Mesh, Vector3 } from "three";
import {
  Dispatch,
  SetStateAction,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  Line,
  Html,
  MeshReflectorMaterial,
  Text,
  BakeShadows,
  ContactShadows,
} from "@react-three/drei";
import { calcCubePosition, calculateSection } from "@/utils/calcPositions";
import AlephiumModel from "@/components/Models/AlephiumModel";
import * as THREE from "three";
import AlphlandModel from "@/components/Models/AlphlandModel";

import { circleRadius, totalChains, totalGroups } from "@/consts";
import { Bloom, EffectComposer } from "@react-three/postprocessing";

import MenuePopver from "@/components/MenuePopover";
import Link from "next/link";
import { IconBrandGithub } from "@tabler/icons-react";
import BlockflowInfoModal from "@/components/Modals/BlockflowInfoModal";
import { Button } from "@nextui-org/button";
import Logbox from "@/components/Logbox";

interface IBlockMessage {
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

interface IBlockProps {
  blockData: IBlockMessage;
  onHover: Dispatch<SetStateAction<IBlockMessage | null>>;
}

interface ILineProps {
  blockData: IBlockMessage[];
}

// CONSTANTS
const groupColors = [
  "#FF5733", // Orange
  "#33FF57", // Green
  "#3357FF", // Blue
  "#FF33FF", // Pink
  "#FFC300", // Yellow
  "#DAF7A6", // Light Green
  "#C70039", // Dark Red
  "#581845", // Dark Purple
  "#FFFFFF", // White
  "#808000", // Olive
  "#00FFFF", // Aqua
  "#FFC0CB", // Pink
  "#800080", // Purple
  "#FFFF00", // Yellow
  "#808080", // Grey
  "#00FF00", // Lime
];

// INDIVIDUAL BLOCK
const Block = (props: IBlockProps) => {
  return (
    <mesh
      position={props.blockData.position}
      onPointerOver={(e) => {
        document.body.style.cursor = "pointer";
        e.stopPropagation();
        props.onHover(props.blockData);
      }}
      onClick={() =>
        window.open(
          `${process.env.NEXT_PUBLIC_ALEPHIUM_EXPLORER_BASE_PATH}blocks/${props.blockData.hash}`,
        )
      }
      onPointerOut={() => {
        document.body.style.cursor = "default";
        props.onHover(null);
      }}
    >
      {/*<meshPhysicalMaterial*/}
      {/*  attach="material"*/}
      {/*  transparent={true}*/}
      {/*  transmission={0.8} // Controls how much light passes through the material*/}
      {/*  roughness={0} // Smooth surface for glass*/}
      {/*  reflectivity={0.6} // Adjust based on how reflective your glass should be*/}
      {/*  clearcoat={1.0} // Adds an additional reflective layer, useful for glass surfaces*/}
      {/*  ior={1.5} // Index of Refraction, typical for glass*/}
      {/*  flatShading={true}*/}
      {/*  color={*/}
      {/*    groupColors[*/}
      {/*      calculateSection(props.blockData.chainFrom, props.blockData.chainTo)*/}
      {/*    ]*/}
      {/*  }*/}
      {/*/>*/}
      <meshStandardMaterial
        attach="material"
        color={
          groupColors[
            calculateSection(props.blockData.chainFrom, props.blockData.chainTo)
          ]
        }
      />
      {props.blockData.isLeading ? (
        <boxGeometry args={[2, 2, 2]} attach="geometry" />
      ) : (
        <boxGeometry args={[1, 1, 1]} attach="geometry" />
      )}
    </mesh>
  );
};

// LINES old
// const lines = useMemo(() => {
//   let allLines: [Vector3, Vector3][] = [];
//   blocks.blockData.forEach((block, index) => {
//     for (let i = 0; i < index; i++) {
//       const previousBlock = blocks.blockData[i];
//       if (!isNaN(block.position.x) && !isNaN(previousBlock.position.x)) {
//         allLines.push([block.position, previousBlock.position]);
//       } else {
//         console.warn(
//           "Invalid position encountered",
//           block.position,
//           previousBlock.position,
//         );
//       }
//     }
//   });
//   return allLines;
// }, [blocks]);

const GlowingRing = () => {
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
};

const BlockchainVisualizer = () => {
  const [hoveredBlock, setHoveredBlock] = useState<IBlockMessage | null>(null);
  const [blocks, setBlocks] = useState<IBlockMessage[]>([]); // State to store block data
  const [lines, setLines] = useState<[Vector3, Vector3][]>([]);
  const [latestBlock, setLatestBlock] = useState<IBlockMessage | null>(null);
  const [refToLatestMinedBlock, setRefToLatestMinedBlock] = useState();
  const connectorBlocks2 = useRef<IBlockMessage[][]>([]);
  const blockCounter = useRef<number>(1);
  const firstBlockTimestamp = useRef<number>(0);

  const [messages, setMessages] = useState<string[]>([]);
  const [displayLogBox, setDisplayLogBox] = useState<boolean>(true);
  const [displayHoverBlockInfoBox, setDisplayHoverBlockInfoBox] =
    useState<boolean>(true);
  const [postProcessing, setPostProcessing] = useState<boolean>(false);

  // Function to log messages both to the console and the state
  const logMessage = useCallback((message: string) => {
    console.log(message); // Log to the console
    setMessages((prevMessages) => [...prevMessages, message]); // Add to the messages state
  }, []);
  useEffect(() => {
    // Assuming blocks[0] is the new block you want to update connectorBlocks2 with.
    // You might need a way to store this block from the WebSocket event handler to here.
    // For example, using another state to temporarily hold the new block.
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

  //socketIO
  // const socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_BASE_PATH);
  // useEffect(() => {
  //   // Listen for incoming messages
  //   socket.on("message", (message) => {
  //     console.log(message);
  //   });
  // }, []);

  useEffect(() => {
    document.body.style.cursor = hoveredBlock ? "pointer" : "auto";
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_BASE_PATH);

    ws.onopen = (event) => {
      logMessage(`Connected.`);
      logMessage(`Retrieving blocks...`);

      const payload = {
        request: { method: "subscribe", arguments: { topics: ["block_data"] } },
      };
      console.log(JSON.stringify(payload));
      ws.send(JSON.stringify(payload));
    };

    // ws.onmessage = (event) => {
    //   console.log("lol");
    //   try {
    //     const request = JSON.parse(event.data);
    //     const body = JSON.parse(request?.request?.arguments?.data);
    //     const call_id = request?.request?.call_id;
    //     console.log(`request: ${JSON.stringify(request)}`);
    //     console.log(`body: ${JSON.stringify(body)}`);
    //     if (body) {
    //       console.log(JSON.stringify(body));
    //       const topic = body?.topic?.toString() ?? undefined;
    //
    //       console.log(
    //         `Webhook Challenged Date: ${JSON.stringify(new Date().toISOString())} | topic: ${topic} | Body: ${JSON.stringify(body)}`,
    //       );
    //
    //       try {
    //         const notify = {
    //           response: {
    //             result: "None",
    //             result_type: "None",
    //             call_id: call_id,
    //           },
    //         };
    //
    //         console.log(`NOTIFYING ${JSON.stringify(notify)}`);
    //         ws?.send(JSON.stringify(notify));
    //       } catch (ex) {
    //         console.log(JSON.stringify(ex));
    //       }
    //       //send heartbeat
    //       //this.socketClient.send("heartbeat");
    //       // }
    //     }
    //   } catch (ex) {
    //     console.log(JSON.stringify(ex));
    //   }

    ws.onmessage = async (event) => {
      const response = JSON.parse(event.data);
      console.log("res", response);

      if (response?.request !== null) {
        if (response.request.arguments?.data) {
          const block: IBlockMessage = response.request.arguments.data;
          console.log(response);

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
          console.log(
            "height offset ",
            (block.timestamp - firstBlockTimestamp.current) / 1000,
          );
          blockCounter.current += 1;
          console.log("timestamp", block.timestamp % 10000);
          block.position = calcCubePosition(
            block.chainFrom,
            block.chainTo,
            totalChains,
            circleRadius,
            (block.timestamp - firstBlockTimestamp.current) / 1000,
          );
          // answer the rpc
          const call_id = response?.request?.call_id;
          console.log("call_id", call_id);
          console.log(`request: ${JSON.stringify(response)}`);

          try {
            const notify = {
              response: {
                result: "None",
                result_type: "None",
                call_id: call_id,
              },
            };

            console.log(`NOTIFYING ${JSON.stringify(notify)}`);
            ws?.send(JSON.stringify(notify));
          } catch (ex) {
            console.log(JSON.stringify(ex));
          }

          setLines((prevLines) => {
            const newLines = computeLinesForNewBlock(
              block,
              connectorBlocks2.current,
            );
            return [...prevLines, ...newLines];
          });
          // connectorBlocks2.current = updateConnectorBlocks(blocks[0]);
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
        dpr={[1, 2]}
        camera={{ fov: 90, position: [30, 30, 30], near: 0.001 }}
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
          {/*<Frames images={images} />*/}
          {/*<TutorialTooltip />*/}
          {/*<MessageLogBox messages={["test"]} />*/}

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

          {/*<Environment background files={"./test.hdr"} blur={0} />*/}
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
        <MenuePopver
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
        <Link
          href={"https://github.com/CodeBaristas/alephium-visualizer-frontend"}
          target={"_blank"}
        >
          <Button
            size={"lg"}
            className={"button"}
            startContent={<IconBrandGithub />}
          >
            Code
          </Button>
        </Link>
        <BlockflowInfoModal />
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
};

export default BlockchainVisualizer;
