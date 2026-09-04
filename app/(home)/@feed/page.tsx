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
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    postId: string;
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

  const feeds = await prisma.post.findMany({
    take: 10,
    include: {
      user: { select: { username: true, image: true } },
      _count: { select: { like: true, comment: true } },
      like: session
        ? { where: { userId: session?.user.id }, select: { id: true } }
        : false,
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
