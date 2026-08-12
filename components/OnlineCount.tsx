"use client";

import { useEffect, useRef, useState } from "react";

export default function OnlineCount() {
  const [count, setCount] = useState(0);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const protocol =
      window.location.protocol === "https:"
        ? "wss:"
        : "ws:";

    const url =
      `${protocol}//${window.location.host}/ws/presence`;

    console.log("Connecting:", url);

    const socket = new WebSocket(url);

    socketRef.current = socket;

    socket.onopen = () => {
      console.log("✅ Presence connected");
    };

    socket.onmessage = (event) => {
      console.log("📨 Server:", event.data);

      try {
        const data = JSON.parse(event.data);

        if (data.type === "online_count") {
          setCount(data.count);
        }
      } catch (error) {
        console.error(
          "Invalid server message:",
          event.data,
        );
      }
    };

    socket.onerror = (event) => {
      console.error(
        "❌ WebSocket error",
        event,
      );
    };

    socket.onclose = (event) => {
      console.log(
        "🔌 WebSocket closed",
        {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
        },
      );
    };

    return () => {
      console.log("Cleaning up WebSocket");

      if (
        socket.readyState === WebSocket.OPEN ||
        socket.readyState === WebSocket.CONNECTING
      ) {
        socket.close();
      }

      socketRef.current = null;
    };
  }, []);

  return (
    <div className="flex items-center gap-2">
      <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />

      <span className="text-white">
        {count} Online
      </span>
    </div>
  );
}