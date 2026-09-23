"use client";

import { useState } from "react";

import type { Follower, User } from "@/generated/prisma/client";
import { useIsMobile } from "@/hooks/use-mobile";
import ChatLists from "@components/chat/chatLists";
import ChatDetail from "@components/chat/chatDetail";

type FollowerUserProps = Follower & {
  follower: User;
};

export type ChatProps = {
  followingUser: FollowerUserProps[];
};

const Chat = ({ followingUser }: ChatProps) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleOpenChat = () => {
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  return (
    <section className="w-full h-full md:pt-17 pt-25 grid md:grid-cols-3 gap-4 relative">
      {(!isChatOpen || !isMobile) && (
        <ChatLists
          followingUser={followingUser}
          onHandleOpenChat={handleOpenChat}
        />
      )}
      {isChatOpen && <ChatDetail onHandleCloseChat={handleCloseChat} />}
      {!isChatOpen && (
        <p className="w-full text-center absolute top-17 left-0  md:col-span-2 md:place-content-center md:static">
          Start New Chat
        </p>
      )}
    </section>
  );
};

export default Chat;
