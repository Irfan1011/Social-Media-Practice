"use client";

import { useEffect, useRef, useState } from "react";
import { io as ClientIO } from "socket.io-client";

import type { Message, User } from "@/generated/prisma/client";
import { BubbleGroup } from "@components/ui/bubble";
import ChatBubble from "./chatBubble";

type ChatBodyProps = {
  messages: Message[];
  receiver: User;
  userSessionId: string;
  conversationId: string;
};

type MessageEventProps = {
  action: "POST" | "PATCH" | "DELETE";
  message: Message;
};

const ChatBody = ({
  messages,
  receiver,
  userSessionId,
  conversationId,
}: ChatBodyProps) => {
  const [openOption, setOpenOption] = useState("");
  const [chatHistory, setChatHistory] = useState(messages);
  const chatBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBodyRef.current?.scrollTo({
      top: chatBodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chatHistory]);

  const handleMessage = (event: MessageEventProps) => {
    setChatHistory((prev) => {
      if (event.action === "DELETE") {
        return prev.filter((item) => item.id !== event.message.id);
      }

      if (event.action === "PATCH") {
        const updatedChat = prev.find((item) => item.id === event.message.id);

        if (updatedChat) {
          return prev.map((item) =>
            item.id === event.message.id ? { ...item, ...event.message } : item,
          );
        }
      }

      return [...prev, event.message];
    });
  };

  useEffect(() => {
    const socket = ClientIO({
      path: "/api/socket/io",
      addTrailingSlash: false,
    });

    const eventName = `chat:${conversationId}:messages`;

    socket.on(eventName, handleMessage);

    return () => {
      socket.off(eventName, handleMessage);
      socket.disconnect();
    };
  }, [conversationId]);

  return (
    <div className="h-full overflow-y-scroll px-2" ref={chatBodyRef}>
      <BubbleGroup className="max-h-100">
        {chatHistory.length <= 0 && (
          <p className="w-full h-full flex justify-center items-center">
            <span className="px-4 py-1 bg-secondary text-sm rounded-full">
              Say Hi to {receiver.username}
            </span>
          </p>
        )}
        {chatHistory.map((message) => (
          <ChatBubble
            key={message.id}
            message={message}
            userSessionId={userSessionId}
            conversationId={conversationId}
            openOption={openOption}
            setOpenOption={setOpenOption}
          />
        ))}
      </BubbleGroup>
    </div>
  );
};

export default ChatBody;
