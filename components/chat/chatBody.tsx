"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { io as ClientIO } from "socket.io-client";

import type { Message, User } from "@/generated/prisma/client";
import { shortDateTimeFormatter } from "@/lib/utils";
import { Bubble, BubbleContent, BubbleGroup } from "@components/ui/bubble";

type ChatBodyProps = {
  messages: Message[];
  receiver: User;
  userSessionId: string;
  conversationId: string;
};

const formatMessageDate = (value: Date | string) => {
  const date = new Date(value);
  return shortDateTimeFormatter.format(date);
};

const ChatBody = ({
  messages,
  receiver,
  userSessionId,
  conversationId,
}: ChatBodyProps) => {
  const [chatHistory, setChatHistory] = useState(messages);
  const chatBodyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatBodyRef.current?.scrollTo({
      top: chatBodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chatHistory]);

  const handleNewMessage = (message: Message) => {
    setChatHistory((prev) => {
      return [...prev, message];
    });
  };

  useEffect(() => {
    const socket = ClientIO({
      path: "/api/socket/io",
      addTrailingSlash: false,
    });

    const eventName = `chat:${conversationId}:messages`;

    socket.on(eventName, handleNewMessage);

    return () => {
      socket.off(eventName, handleNewMessage);
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
          <Bubble
            key={message.id}
            variant="secondary"
            align={`${userSessionId === message.senderId ? "end" : "start"}`}
          >
            {message.fileUrl.map((file) => (
              <BubbleContent key={file} className="min-w-50 min-h-50 relative">
                {file.includes("image/") ? (
                  <Image src={file} alt={file} fill />
                ) : (
                  <video controls>
                    <source src={file} />
                  </video>
                )}
                <p
                  className={`text-chart-2 text-xs absolute bottom-2 ${userSessionId === message.senderId ? "right-4" : "left-4"}`}
                >
                  {formatMessageDate(message.createdAt)}
                </p>
              </BubbleContent>
            ))}
            <BubbleContent>
              <p className="text-foreground">{message.content}</p>
              <span className="text-xs text-chart-2">
                {formatMessageDate(message.createdAt)}
              </span>
            </BubbleContent>
          </Bubble>
        ))}
      </BubbleGroup>
    </div>
  );
};

export default ChatBody;
