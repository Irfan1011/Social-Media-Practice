"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import type { FeedsProps } from "@/app/(home)/@feed/page";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import FeedCarousel from "./feedCarousel";
import FeedDescription from "./feedDescription";
import LikeFeed from "./likeFeed";
import CommentLists from "./comment/commentLists";

type FeedProps = {
  initialFeeds: FeedsProps[];
  session: {
    user: {
      id: string;
      username: string;
      image?: string | null;
    };
  } | null;
};

function Feed({ initialFeeds, session }: FeedProps) {
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [feeds, setFeeds] = useState(initialFeeds);
  const [hasMore, setHasMore] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFeeds(initialFeeds);
  }, [initialFeeds]);

  useEffect(() => {
    if (page === 1) return;

    const loadMore = async () => {
      setIsLoading(true);

      try {
        const response = await fetch(`/api/feed?page=${page}`);
        if (!response.ok) throw new Error("Failed to fetch feeds");

        const newFeeds = await response.json();
        if (newFeeds.length === 0) return setHasMore(false);

        const parsedFeeds = newFeeds.map((feed: FeedsProps) => ({
          ...feed,
          createdAt: new Date(feed.createdAt),
          updatedAt: new Date(feed.updatedAt),

          comment: feed.comment.map((comment) => ({
            ...comment,
            createdAt: new Date(comment.createdAt),
          })),
        }));

        setFeeds((prev) => [...prev, ...parsedFeeds]);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMore();
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isLoading && hasMore)
        setPage((prev) => prev + 1);
    });

    if (bottomRef.current) observer.observe(bottomRef.current);

    return () => observer.disconnect();
  }, [isLoading, hasMore]);

  return (
    <>
      {feeds.map((feed) => (
        <Card key={feed.id} className="gap-4">
          <CardHeader className="w-full">
            <Link
              href={`/${feed.user.username}`}
              className="flex items-center gap-2"
            >
              <Avatar>
                <AvatarImage
                  src={feed.user.image || ""}
                  alt={feed.user.username}
                />
                <AvatarFallback className="uppercase">
                  {feed.user.username.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <CardTitle>{feed.user.username}</CardTitle>
            </Link>
          </CardHeader>

          <CardContent>
            {(feed.images.length > 0 || feed.videos.length > 0) && (
              <FeedCarousel images={feed.images} videos={feed.videos} />
            )}

            <FeedDescription
              description={feed.description}
              createdAt={feed.createdAt}
            />
          </CardContent>

          <CardFooter className="flex items-center gap-2">
            {/* BUTTONS */}
            <LikeFeed feed={feed} session={session?.user} />
            <CommentLists feed={feed} username={session?.user.username} />
          </CardFooter>
        </Card>
      ))}

      <div ref={bottomRef} className="place-items-center">
        {isLoading && <p>Loading...</p>}{" "}
        {!isLoading && !hasMore && (
          <p className="capitalize">You Have Reached End Feeds</p>
        )}
      </div>
    </>
  );
}

export default Feed;
