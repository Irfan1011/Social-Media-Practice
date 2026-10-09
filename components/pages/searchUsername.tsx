"use client";

import { redirect } from "next/navigation";
import { useState } from "react";

import { findOrCreateConversation } from "@/lib/chat";
import { Avatar, AvatarImage, AvatarFallback } from "@components/ui/avatar";
import { Button } from "@components/ui/button";
import Search from "@components/ui/search";

type SearchUsernameProps = {
  users: {
    username: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image: string | null;
    description: string;
  }[];
  sessionId?: string;
};

function SearchUsername({ users, sessionId }: SearchUsernameProps) {
  const [search, setSearch] = useState("");

  const handleConversation = async (
    senderId: string | undefined,
    receiverId: string,
    username: string,
  ) => {
    setSearch("");

    if (senderId) {
      const conversation = await findOrCreateConversation(senderId, receiverId);
      redirect(`/chat/direct/${conversation.id}`);
    } else redirect(`/${username}`);
  };

  return (
    <>
      <Search onSearch={setSearch} />

      {search && (
        <div className="w-full bg-secondary top-12 p-4 flex flex-col gap-4 rounded-md absolute z-1">
          {users
            .filter((user) => user.username.toLowerCase().includes(search))
            .map((user) => (
              <Button
                key={user.id}
                variant="outline"
                className="justify-start w-full py-8 cursor-pointer"
                onClick={() =>
                  handleConversation(sessionId, user.id, user.username)
                }
              >
                {user.username.toLowerCase().includes(search.toLowerCase()) && (
                  <>
                    <Avatar>
                      <AvatarImage
                        src={user.image as string}
                        alt={user.username}
                        className="w-full"
                      />
                      <AvatarFallback>{user.username.charAt(1)}</AvatarFallback>
                    </Avatar>
                    <p
                      style={{
                        display: user.username
                          .toLowerCase()
                          .includes(search.toLowerCase())
                          ? "block"
                          : "none",
                      }}
                    >
                      {user.username}
                    </p>
                  </>
                )}
              </Button>
            ))}
        </div>
      )}
    </>
  );
}

export default SearchUsername;
