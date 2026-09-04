"use client";

import { useOptimistic, startTransition, useState } from "react";
import { ThumbsUp } from "lucide-react";

import { type FeedsProps } from "@/app/(home)/@feed/page";
import { likeFeed, cancelLiked, getLikes } from "@actions/feed";
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

type LikesProps = {
  id: string;
  user: {
    username: string;
    image: string | null;
  };
};

type LikeFeedProps = {
  feed: FeedsProps;
};

function LikeFeed({ feed }: LikeFeedProps) {
  const [optimisticState, setOptimistic] = useOptimistic({
    count: feed._count.like,
    isLiked: feed.like?.length > 0,
  });
  const [likes, setLikes] = useState<LikesProps[]>([]);

  const handleAddLike = () => {
    const formData = new FormData();

    formData.set("feedId", feed.id);

    startTransition(async () => {
      setOptimistic((prev) => {
        return { ...prev, count: prev.count + 1, isLiked: true };
      });

      await likeFeed(formData);
    });
  };

  const handleCancelLike = () => {
    const formData = new FormData();

    formData.set("feedId", feed.id);

    startTransition(async () => {
      setOptimistic((prev) => {
        return { ...prev, count: prev.count - 1, isLiked: false };
      });

      await cancelLiked(formData);
    });
  };

  const handleGetLikes = async () => {
    const res = await getLikes(feed.id);

    setLikes(res);
  };

  return (
    <span className="flex items-center">
      <Dialog>
        <DialogTrigger
          render={
            <Button
              variant="ghost"
              className="p-0 cursor-pointer"
              onClick={handleGetLikes}
            >
              {optimisticState.count}
            </Button>
          }
        />

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Likes</DialogTitle>
            <DialogDescription>The Users Like This Post</DialogDescription>
            {likes.length > 0 ? (
              likes.map((like) => (
                <Link key={like.user.username} href={`/${like.user.username}`}>
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

      {optimisticState.isLiked ? (
        <Button
          variant="ghost"
          className="rounded-full cursor-pointer"
          onClick={handleCancelLike}
        >
          <ThumbsUp fill="white" />
        </Button>
      ) : (
        <Button
          variant="ghost"
          className="rounded-full cursor-pointer"
          onClick={handleAddLike}
        >
          <ThumbsUp />
        </Button>
      )}
    </span>
  );
}

export default LikeFeed;
