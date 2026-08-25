"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@components/ui/avatar";
import { Button } from "./button";
import Search from "@components/ui/search";

export type FollowProps = {
  username: string;
  title: string;
  follows: {
    image: string | null;
    id: string;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    username: string;
    email: string;
    emailVerified: boolean;
  }[];
};

function FollowDialog({ username, title, follows }: FollowProps) {
  const [search, setSearch] = useState("");
  const router = useRouter();

  return (
    <Dialog
      open={true}
      onOpenChange={(open) => {
        if (!open) {
          router.back();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="capitalize">
            {username} {title}
          </DialogTitle>
          <Search onSearch={setSearch} />
        </DialogHeader>

        <div className="flex flex-col gap-2">
          {follows.length > 0 ? (
            follows
              .filter((follow) =>
                follow.username.toLowerCase().includes(search.toLowerCase()),
              )
              .map(
                (follow) =>
                  follow.username
                    .toLowerCase()
                    .includes(search.toLowerCase()) && (
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
                          <AvatarFallback>
                            {follow.username.charAt(1)}
                          </AvatarFallback>
                        </Avatar>

                        {follow.username}
                      </Button>
                    </Link>
                  ),
              )
          ) : (
            <p>No Follower Yet</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default FollowDialog;
