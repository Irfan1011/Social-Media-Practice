"use client";

import Link from "next/link";
import { useState } from "react";

import { type FollowProps } from "@components/ui/followDialog";
import { Avatar, AvatarImage, AvatarFallback } from "@components/ui/avatar";
import { Card, CardHeader, CardContent } from "@components/ui/card";
import { Button } from "@components/ui/button";
import Search from "@components/ui/search";

function Follower({ username, title, follows }: FollowProps) {
  const [search, setSearch] = useState("");

  return (
    <Card className="my-4">
      <CardHeader>
        <Search onSearch={setSearch} />
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <h2 className="uppercase font-bold">
          {username} {title}
        </h2>

        {follows.length > 0 ? (
          follows.map((follow) =>
            follow.username.toLowerCase().includes(search.toLowerCase()) ? (
              <Link
                key={follow.id}
                href={`/${follow.username}`}
                style={{
                  display: follow.username
                    .toLowerCase()
                    .includes(search.toLowerCase())
                    ? "block"
                    : "none",
                }}
              >
                <Button
                  variant="outline"
                  className="justify-start py-8 gap-4 w-full cursor-pointer"
                >
                  <Avatar>
                    <AvatarImage
                      src={follow.image as string}
                      alt={follow.username}
                      className="w-full"
                    />
                    <AvatarFallback>{follow.username.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {follow.username}
                </Button>
              </Link>
            ) : (
              "User Not Found"
            ),
          )
        ) : (
          <p>No Follower Yet</p>
        )}
      </CardContent>
    </Card>
  );
}

export default Follower;
