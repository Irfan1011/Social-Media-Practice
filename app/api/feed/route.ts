import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const PAGE_SIZE = 10;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const page = Number(searchParams.get("page") ?? "1");

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const following = (
    await prisma.follower.findMany({ where: { followingId: session?.user.id } })
  ).map((f) => f.followerId);

  let userId = "";
  if (session) userId = session.user.id;

  const feeds = await prisma.post.findMany({
    where: { userId: { in: [userId, ...following] } },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
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
          createdAt: true,
          user: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(feeds);
}
