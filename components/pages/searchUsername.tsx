"use client";

import Link from "next/link";
import { useState } from "react";

import Search from "@components/ui/search";
import { Avatar, AvatarImage, AvatarFallback } from "@components/ui/avatar";
import { Button } from "@components/ui/button";

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
};

function SearchUsername({ users }: SearchUsernameProps) {
  const [search, setSearch] = useState("");

  return (
    <>
      <Search onSearch={setSearch} />

      {search && (
        <div className="w-full bg-secondary mt-4 p-4 flex flex-col gap-4 rounded-md absolute">
          {users
            .filter((user) => user.username.toLowerCase().includes(search))
            .map((user) => (
              <Button
                key={user.username}
                variant="outline"
                className="justify-start w-full py-8 cursor-pointer"
                onClick={() => setSearch("")}
              >
                {user.username.toLowerCase().includes(search.toLowerCase()) && (
                  <Link
                    href={`/${user.username}`}
                    className="flex items-center w-full gap-2"
                  >
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
                  </Link>
                )}
              </Button>
            ))}
        </div>
      )}
    </>
  );
}

export default SearchUsername;
