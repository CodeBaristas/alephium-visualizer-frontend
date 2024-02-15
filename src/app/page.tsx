"use client";

import BlockchainVisualizer from "@/components/Visualizer/BlockchainVisualizer";
import Intro from "@/components/Intro";
import { NextUIProvider } from "@nextui-org/react";

export default function Home() {
  return (
    <NextUIProvider>
      <Intro>
        <BlockchainVisualizer />
      </Intro>
    </NextUIProvider>
  );
}
