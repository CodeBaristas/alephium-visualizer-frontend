import React, { useEffect, useRef } from "react";

export default function Logbox({ messages }) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      className="log-box"
      style={{
        position: "absolute",
        bottom: 0,
        right: 0,
      }}
    >
      {messages.map((message: string, index: number) => (
        <div key={index}>{message}</div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
