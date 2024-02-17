import React, { useEffect, useRef } from "react";

export default function Logbox({ messages }) {
  return (
    <div className="log-box">
      {messages.map((message: string, index: number) => (
        <div key={index}>{message}</div>
      ))}
    </div>
  );
}
