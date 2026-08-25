import Link from "next/link";
import { ThumbsUp, MessageCircle } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { Button } from "@components/ui/button";
import FeedCarousel from "@components/feed/feedCarousel";
import FeedDescription from "@components/feed/feedDescription";

async function Page() {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const feeds = await prisma.post.findMany({
    include: {
      user: { select: { username: true, image: true } },
      _count: { select: { like: true, comment: true } },
    },
  });

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
            {feed.images.length > 0 && <FeedCarousel images={feed.images} />}
            <FeedDescription description={feed.description} />
          </CardContent>

          <CardFooter className="flex items-center gap-2">
            {/* BUTTONS */}
            <Button variant="ghost" className="cursor-pointer">
              {feed._count.like}
              <ThumbsUp />
            </Button>
            <Button variant="ghost" className="cursor-pointer">
              {feed._count.comment}
              <MessageCircle />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </>
  );
}

export default Page;
