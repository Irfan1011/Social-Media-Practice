"use client";

import { redirect } from "next/navigation";
import { useOptimistic, startTransition, useState } from "react";
import { ThumbsUp } from "lucide-react";

import { type FeedsProps } from "@/app/(home)/@feed/page";
import { likeFeed } from "@actions/feed";
import {
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
} from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import Link from "next/link";

type LikeFeedProps = {
  feed: FeedsProps;
  session:
    | {
        id: string;
        username: string;
        image?: string | null;
      }
    | undefined;
};

function LikeFeed({ feed, session }: LikeFeedProps) {
  const [likeState, setLikeState] = useState({
    count: feed._count.like,
    userLikes: feed.like,
    isLiked: feed.like?.some((like) => like.userId === session?.id),
  });
  const [optimisticState, setOptimistic] = useOptimistic(
    likeState,
    (prev, action: "like" | "unlike") => {
      if (action === "like") {
        const newUserLike = {
          userId: session!.id,
          postId: feed.id,
          user: {
            username: session!.username,
            image: feed.user.image,
          },
        };

        return {
          ...prev,
          count: prev.count + 1,
          userLikes: [...prev.userLikes, newUserLike],
          isLiked: true,
        };
      } else if (action === "unlike") {
        return {
          ...prev,
          count: prev.count - 1,
          userLikes: prev.userLikes.filter(
            (like) => like.userId !== session!.id,
          ),
          isLiked: false,
        };
      }

      return {
        ...prev,
      };
    },
  );

  const handleLikeFeed = () => {
    if (!session) return redirect("/signin");
    const formData = new FormData();

    formData.set("feedId", feed.id);

    startTransition(async () => {
      setOptimistic(optimisticState.isLiked ? "unlike" : "like");

      setLikeState((prev) => {
        const newUserLike = {
          userId: session!.id,
          postId: feed.id,
          user: {
            username: session!.username,
            image: feed.user.image,
          },
        };
        return {
          ...prev,
          count: prev.isLiked ? prev.count - 1 : prev.count + 1,
          userLikes: prev.isLiked
            ? prev.userLikes.filter((like) => like.userId !== session!.id)
            : [...prev.userLikes, newUserLike],
          isLiked: !prev.isLiked,
        };
      });

      await likeFeed(formData);
    });
  };

  return (
    <span className="flex items-center">
      <Dialog>
        <DialogTrigger
          render={
            <Button variant="ghost" className="p-0 cursor-pointer">
              {optimisticState.count}
            </Button>
          }
        />

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Likes</DialogTitle>
            <DialogDescription>The Users Like This Post</DialogDescription>
            {optimisticState.userLikes.length > 0 ? (
              optimisticState.userLikes.map((like) => (
                <Link key={like.user.username} href={`/${encodeURIComponent(like.user.username)}`}>
                  <Button
                    variant="outline"
                    className="justify-start py-8 gap-4 w-full cursor-pointer"
                  >
                    <Avatar>
                      <AvatarImage
                        src={like.user.image as string}
                        alt={like.user.username}
                        className="w-full"
                      />
                      <AvatarFallback>
                        {like.user.username.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {like.user.username}
                  </Button>
                </Link>
              ))
            ) : (
              <p>No Likes Yet</p>
            )}
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Button
        variant="ghost"
        className="rounded-full cursor-pointer"
        onClick={handleLikeFeed}
      >
        <ThumbsUp
          className={
            optimisticState.isLiked
              ? "fill-black dark:fill-white stroke-1 stroke-white dark:stroke-black"
              : "fill-transparent"
          }
        />
      </Button>
    </span>
  );
}

export default LikeFeed;
