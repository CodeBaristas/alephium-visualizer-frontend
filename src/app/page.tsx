"use client";

import BlockchainVisualizer from "@/components/BlockchainVisualizer/BlockchainVisualizer";
import IntroScreen from "@/components/IntroScreen/IntroScreen";
import { NextUIProvider } from "@nextui-org/react";

export default function Home() {
  return (
    <NextUIProvider>
      <IntroScreen>
        <BlockchainVisualizer />
      </IntroScreen>
    </NextUIProvider>
  );
}
