"use client";

import { useState, useEffect } from "react";
import { io as ClientIO } from "socket.io-client";

const ChatHeaders = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = ClientIO({
      path: "/api/socket/io",
      addTrailingSlash: false,
    });

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      {isConnected && <p>Live! Realtime Chat</p>}
      {!isConnected && <p>Connecting to Chat...</p>}
    </div>
  );
};

export default ChatHeaders;
