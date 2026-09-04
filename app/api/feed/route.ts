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

  const feeds = await prisma.post.findMany({
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    include: {
      user: { select: { username: true, image: true } },
      _count: { select: { like: true, comment: true } },
      like: session
        ? { where: { userId: session.user.id }, select: { id: true } }
        : false,
      comment: {
        select: {
          id: true,
          comment: true,
          parentId: true,
          postId: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              username: true,
              image: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(feeds);
}
