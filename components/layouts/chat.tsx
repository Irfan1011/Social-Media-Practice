"use client";

import { usePathname } from "next/navigation";

import type { Follower, User } from "@/generated/prisma/client";
import { useIsMobile } from "@/hooks/use-mobile";
import SearchUsername from "@components/pages/searchUsername";
import ChatLists from "@components/chat/chatLists";

type FollowerProps = Follower & {
  follower: User;
};

type ChatProps = {
  followingUser: FollowerProps[];
  sessionId: string;
  children: React.ReactNode;
};

const Chat = ({ followingUser, sessionId, children }: ChatProps) => {
  const pathname = usePathname();
  const isMobile = useIsMobile();

  return (
    <section className="w-full h-full md:pt-17 pt-15 grid md:grid-cols-3 gap-4 relative">
      <section
        className={`flex flex-col gap-2 relative ${isMobile && pathname !== "/chat" ? "hidden" : "block"}`}
      >
        <SearchUsername
          users={followingUser.map((f) => f.follower)}
          sessionId={sessionId}
        ></SearchUsername>
        <ChatLists followingUser={followingUser} senderId={sessionId} />
      </section>

      <section
        className={`col-span-2 flex flex-col justify-between gap-2 ${isMobile && pathname === "/chat" ? "hidden" : "block"}`}
      >
        {children}
      </section>
    </section>
  );
};

export default Chat;
