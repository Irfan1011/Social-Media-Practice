import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Feed from "@components/feed/feed";

export type FeedProps = {
  id: string;
  images: string[];
  videos: string[];
  description: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type FeedsProps = FeedProps & {
  _count: {
    like: number;
    comment: number;
  };
  user: {
    username: string;
    image: string | null;
  };
  like: {
    userId: string;
    postId: string;
    user: {
      username: string;
      image: string | null;
    };
  }[];
  comment: {
    id: string;
    createdAt: Date;
    comment: string;
    postId: string;
    parentId: string | null;
    user: {
      id: string;
      username: string;
      image: string | null;
    };
  }[];
};

async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });

  const followers = (
    await prisma.follower.findMany({ where: { followerId: session?.user.id } })
  ).map((f) => f.followingId);

  let userId = "";
  if (session) userId = session.user.id;

  const feeds = await prisma.post.findMany({
    where: { userId: { in: [userId, ...followers] } },
    take: 10,
    include: {
      user: { select: { username: true, image: true } },
      _count: { select: { like: true, comment: true } },
      like: {
        select: {
          userId: true,
          postId: true,
          user: true,
        },
      },
      comment: {
        select: {
          id: true,
          comment: true,
          parentId: true,
          postId: true,
          user: true,
          createdAt: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return <Feed initialFeeds={feeds} session={session} />;
}

export default Page;
