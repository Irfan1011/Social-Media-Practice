"use client";

import { useState, useEffect } from "react";
import { io as ClientIO } from "socket.io-client";

const ChatHeaders = () => {
  const [_, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketInstance = new (ClientIO as any)(
      process.env.NEXT_PUBLIC_SITE_URL!,
      {
        path: "/api/socket/io",
        addTrailingSlash: false,
      },
    );

    socketInstance.on("connect", () => {
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <div>
      {isConnected && <p>Live! Realtime Chat</p>}
      {!isConnected && <p>Fallback: Polling every 1s</p>}
    </div>
  );
};

export default ChatHeaders;
