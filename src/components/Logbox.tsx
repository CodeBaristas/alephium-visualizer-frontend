import React from "react";
import { ScrollShadow } from "@nextui-org/react";

export default function Logbox({ children }) {
  return (
    <ScrollShadow hideScrollBar className="w-[300px] h-[400px]">
      {children}
    </ScrollShadow>
  );
}
