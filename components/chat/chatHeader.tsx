"use client";

import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeftCircle } from "lucide-react";
import { io as ClientIO } from "socket.io-client";

import { Button } from "@components/ui/button";

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
    <div className="flex gap-2 place-items-center">
      <Button
        variant="ghost"
        className="cursor-pointer rounded-full"
        onClick={() => redirect("/chat")}
      >
        <ArrowLeftCircle className="scale-150" />
      </Button>
      {isConnected && <p>Live! Realtime Chat</p>}
      {!isConnected && <p>Connecting to Chat...</p>}
    </div>
  );
};

export default ChatHeaders;
