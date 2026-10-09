"use client";

import { redirect } from "next/navigation";

import type { Follower, User } from "@/generated/prisma/client";
import { findOrCreateConversation } from "@/lib/chat";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Card, CardContent, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";

type FollowerUserProps = Follower & {
  follower: User;
};

type ChatListsPorps = {
  followingUser: FollowerUserProps[];
  senderId: string;
};

const ChatLists = ({ followingUser, senderId }: ChatListsPorps) => {
  const handleConversation = async (senderId: string, receiverId: string) => {
    const conversation = await findOrCreateConversation(senderId, receiverId);

    redirect(`/chat/direct/${conversation.id}`);
  };

  return followingUser.map((following) => (
    <Button
      key={following.id}
      variant="outline"
      onClick={() => handleConversation(senderId, following.follower.id)}
      className="w-full h-fit p-0 rounded-xl"
    >
      <Card className="w-full hover:bg-primary hover:text-card cursor-pointer bg-card">
        <CardContent className="flex items-center gap-4">
          <Avatar>
            <AvatarImage
              src={following.follower.image || ""}
              alt={following.follower.username}
            />
            <AvatarFallback className="uppercase">
              {following.follower.username.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <CardTitle>{following.follower.username}</CardTitle>
        </CardContent>
      </Card>
    </Button>
  ));
};

export default ChatLists;
